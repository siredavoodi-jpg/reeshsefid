/**
 * auth.js — لایه احراز هویت
 * - اگر SUPABASE_URL و KEY تنظیم شده باشند → Supabase
 * - در غیر این صورت → localStorage (حالت دمو)
 */
(function () {
  const cfg = window.AFRA_CONFIG || {};
  const hasSupabase = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);

  let supabase = null;
  if (hasSupabase && window.supabase) {
    supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }

  const STORAGE_KEY = 'afra_user';
  const ENROLL_KEY = 'afra_enrollments';
  const USERS_DB = 'afra_users_db';

  function getLocalUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function setLocalUser(user) {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }

  function getEnrollments() {
    try { return JSON.parse(localStorage.getItem(ENROLL_KEY) || '[]'); }
    catch { return []; }
  }

  function setEnrollments(list) {
    localStorage.setItem(ENROLL_KEY, JSON.stringify(list));
  }

  /* ---------- Local (demo) backend ---------- */
  const localBackend = {
    async register({ name, email, password }) {
      if (!name || !email || !password) return { ok: false, error: 'همه فیلدها الزامی هستند.' };
      if (password.length < 6) return { ok: false, error: 'رمز عبور حداقل ۶ کاراکتر باشد.' };
      const db = JSON.parse(localStorage.getItem(USERS_DB) || '{}');
      if (db[email]) return { ok: false, error: 'این ایمیل قبلاً ثبت شده است.' };
      db[email] = { name, email, password, plan: 'free', createdAt: Date.now() };
      localStorage.setItem(USERS_DB, JSON.stringify(db));
      const user = { name, email, plan: 'free', id: email };
      setLocalUser(user);
      return { ok: true, user };
    },
    async login({ email, password }) {
      const db = JSON.parse(localStorage.getItem(USERS_DB) || '{}');
      const rec = db[email];
      if (!rec || rec.password !== password) return { ok: false, error: 'ایمیل یا رمز عبور نادرست است.' };
      const user = { name: rec.name, email: rec.email, plan: rec.plan || 'free', id: email };
      setLocalUser(user);
      return { ok: true, user };
    },
    async logout() { setLocalUser(null); },
    async activatePlan(plan) {
      const u = getLocalUser();
      if (!u) return { ok: false, error: 'ابتدا وارد شوید.' };
      u.plan = plan;
      setLocalUser(u);
      const db = JSON.parse(localStorage.getItem(USERS_DB) || '{}');
      if (db[u.email]) { db[u.email].plan = plan; localStorage.setItem(USERS_DB, JSON.stringify(db)); }
      const enroll = getEnrollments();
      if (plan === 'full' || plan === 'course') {
        if (!enroll.includes('ai-for-lawyers')) enroll.push('ai-for-lawyers');
        if (plan === 'full' && !enroll.includes('full')) enroll.push('full');
        setEnrollments(enroll);
      }
      return { ok: true, user: u };
    },
    getUser() { return getLocalUser(); },
    isMember() {
      const u = getLocalUser();
      if (!u) return false;
      if (u.plan === 'full' || u.plan === 'member' || u.plan === 'course') return true;
      const enroll = getEnrollments();
      return enroll.includes('ai-for-lawyers') || enroll.includes('full');
    }
  };

  /* ---------- Supabase backend ---------- */
  const supabaseBackend = {
    async register({ name, email, password }) {
      if (!name || !email || !password) return { ok: false, error: 'همه فیلدها الزامی هستند.' };
      if (password.length < 6) return { ok: false, error: 'رمز عبور حداقل ۶ کاراکتر باشد.' };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, plan: 'free' } }
      });
      if (error) return { ok: false, error: error.message };
      // پروفایل
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          name,
          plan: 'free'
        });
        const user = { id: data.user.id, name, email, plan: 'free' };
        setLocalUser(user);
        return { ok: true, user };
      }
      return { ok: true, user: null, message: 'ایمیل تأیید ارسال شد.' };
    },
    async login({ email, password }) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };
      let plan = 'free';
      let name = data.user.user_metadata?.name || email;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      if (profile) {
        plan = profile.plan || 'free';
        name = profile.name || name;
      }
      const user = { id: data.user.id, name, email: data.user.email, plan };
      setLocalUser(user);
      return { ok: true, user };
    },
    async logout() {
      await supabase.auth.signOut();
      setLocalUser(null);
    },
    async activatePlan(plan) {
      const u = getLocalUser();
      if (!u || !u.id) return { ok: false, error: 'ابتدا وارد شوید.' };
      const { error } = await supabase.from('profiles').update({ plan }).eq('id', u.id);
      if (error) return { ok: false, error: error.message };
      // enrollment
      await supabase.from('enrollments').upsert({
        user_id: u.id,
        course_id: cfg.COURSE_ID || 'ai-for-lawyers',
        plan
      });
      u.plan = plan;
      setLocalUser(u);
      return { ok: true, user: u };
    },
    getUser() { return getLocalUser(); },
    isMember() {
      const u = getLocalUser();
      if (!u) return false;
      return u.plan === 'full' || u.plan === 'member' || u.plan === 'course';
    },
    async restoreSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const uid = data.session.user.id;
        let plan = 'free';
        let name = data.session.user.user_metadata?.name || data.session.user.email;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', uid).single();
        if (profile) {
          plan = profile.plan || 'free';
          name = profile.name || name;
        }
        setLocalUser({ id: uid, name, email: data.session.user.email, plan });
      }
    }
  };

  const backend = (hasSupabase && supabase) ? supabaseBackend : localBackend;

  window.AFRA_AUTH = {
    mode: (hasSupabase && supabase) ? 'supabase' : 'local',
    getUser: () => backend.getUser(),
    isLoggedIn: () => !!backend.getUser(),
    isMember: () => backend.isMember(),
    register: (p) => backend.register(p),
    login: (p) => backend.login(p),
    logout: () => backend.logout(),
    activatePlan: (plan) => backend.activatePlan(plan),
    getEnrollments,
    async init() {
      if (backend.restoreSession) await backend.restoreSession();
      this.updateNav();
    },
    updateNav() {
      const user = this.getUser();
      document.querySelectorAll('[data-auth-guest]').forEach(el => {
        el.style.display = user ? 'none' : '';
      });
      document.querySelectorAll('[data-auth-member]').forEach(el => {
        el.style.display = user ? '' : 'none';
      });
      document.querySelectorAll('[data-user-name]').forEach(el => {
        if (user) el.textContent = user.name || user.email;
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.AFRA_AUTH.init();
  });
})();
