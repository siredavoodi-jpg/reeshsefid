/**
 * app.js — منطق کامل دوره «هوش مصنوعی برای وکلا»
 * ویژگی‌ها: نوار پیشرفت، نشان مطالعه، حالت تمرکز، آزمون واقعی،
 * کارت غیرفعال، جستجو، بوکمارک، یادداشت، دارک‌مود
 */

class CourseApp {
  constructor() {
    this.state = {
      currentChapter: null,
      currentLesson: null,
      viewedLessons: new Set(),
      bookmarks: new Set(),
      notes: {},
      quizResults: {}
    };
    this.loadState();
    this.init();
  }

  init() {
    this.renderSidebar();
    this.renderWelcome();
    this.attachGlobalListeners();
    this.updateProgressUI();
  }

  /* ---------- State ---------- */
  loadState() {
    try {
      const saved = localStorage.getItem('ai-course-state-v2');
      if (saved) {
        const p = JSON.parse(saved);
        this.state.viewedLessons = new Set(p.viewedLessons || []);
        this.state.bookmarks = new Set(p.bookmarks || []);
        this.state.notes = p.notes || {};
        this.state.quizResults = p.quizResults || {};
      }
    } catch (e) { console.warn(e); }
  }

  saveState() {
    try {
      localStorage.setItem('ai-course-state-v2', JSON.stringify({
        viewedLessons: [...this.state.viewedLessons],
        bookmarks: [...this.state.bookmarks],
        notes: this.state.notes,
        quizResults: this.state.quizResults
      }));
    } catch (e) { console.warn(e); }
  }

  /* ---------- Helpers ---------- */
  getIcon(name) {
    const map = {
      brain: 'fa-brain', layers: 'fa-layer-group', sparkles: 'fa-wand-magic-sparkles',
      'book-text': 'fa-book-open', 'graduation-cap': 'fa-graduation-cap', cpu: 'fa-microchip',
      search: 'fa-magnifying-glass', scale: 'fa-scale-balanced', list: 'fa-list', flag: 'fa-flag'
    };
    return map[name] || 'fa-book';
  }

  isChapterActive(chapter) {
    if (!chapter?.lessons?.length) return false;
    // فصل ۱ همیشه رایگان
    if (chapter.id === 1) return true;
    // فصل‌های ۲+ فقط برای عضو (اشتراک)
    const isMember = (typeof AFRA_AUTH !== 'undefined') && AFRA_AUTH.isMember();
    if (!isMember) return false;
    const first = chapter.lessons[0];
    if (first.sections || first.objectives || first.glossary) return true;
    if (first.content && first.content.length > 120) return true;
    // حتی اگر محتوا placeholder باشد، برای عضو باز است
    return isMember;
  }

  isLockedByMembership(chapter) {
    if (!chapter || chapter.id === 1) return false;
    const isMember = (typeof AFRA_AUTH !== 'undefined') && AFRA_AUTH.isMember();
    return !isMember;
  }

  getChapterProgress(chapterId) {
    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    if (!chapter) return 0;
    const total = chapter.lessons.length;
    const viewed = chapter.lessons.filter(l =>
      this.state.viewedLessons.has(`${chapterId}-${l.id}`)
    ).length;
    return total ? Math.round((viewed / total) * 100) : 0;
  }

  getOverallProgress() {
    let total = 0, viewed = 0;
    COURSE_DATA.chapters.forEach(ch => {
      if (!this.isChapterActive(ch)) return;
      total += ch.lessons.length;
      ch.lessons.forEach(l => {
        if (this.state.viewedLessons.has(`${ch.id}-${l.id}`)) viewed++;
      });
    });
    return total ? Math.round((viewed / total) * 100) : 0;
  }

  updateProgressUI() {
    const pct = this.getOverallProgress();
    const fill = document.getElementById('overall-progress-fill');
    const label = document.getElementById('overall-progress-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = pct + '٪ تکمیل شده';

    document.querySelectorAll('.ch-progress-dot').forEach(dot => {
      const id = parseInt(dot.dataset.chapter);
      const p = this.getChapterProgress(id);
      dot.classList.toggle('done', p === 100);
      dot.title = p + '٪';
    });
  }

  /* ---------- Sidebar ---------- */
  renderSidebar() {
    const list = document.getElementById('chapter-list');
    if (!list) return;

    list.innerHTML = COURSE_DATA.chapters.map(ch => {
      const active = this.isChapterActive(ch);
      const prog = this.getChapterProgress(ch.id);
      return `
        <li>
          <button class="chapter-item-btn ${active ? '' : 'locked'}" data-chapter="${ch.id}">
            <span class="ch-num">${ch.id}</span>
            <span style="flex:1;text-align:right;">${ch.title}</span>
            ${!active ? '<i class="fas fa-lock" style="font-size:0.7rem;opacity:0.5;"></i>' : ''}
            <span class="ch-progress-dot ${prog === 100 ? 'done' : ''}" data-chapter="${ch.id}" title="${prog}٪"></span>
          </button>
        </li>
      `;
    }).join('');
  }

  /* ---------- Views ---------- */
  renderWelcome() {
    const main = document.getElementById('content-area');
    if (!main) return;

    const pct = this.getOverallProgress();
    const activeCount = COURSE_DATA.chapters.filter(c => this.isChapterActive(c)).length;

    main.innerHTML = `
      <div class="course-header">
        <div>
          <h1>🎓 ${COURSE_DATA.title}</h1>
          <p class="subtitle">دوره تخصصی کاربرد هوش مصنوعی در حرفه وکالت — ${COURSE_DATA.chapters.length} فصل</p>
        </div>
        <div class="progress-wrap">
          <div class="progress-label">
            <span>پیشرفت کلی</span>
            <span id="overall-progress-label">${pct}٪ تکمیل شده</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="overall-progress-fill" style="width:${pct}%"></div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.25rem;background:var(--card-bg);border:1px solid var(--border);border-radius:12px;padding:1.25rem;">
        <h2 style="color:var(--course-primary,#1e3a8a);margin-bottom:0.6rem;font-size:1.15rem;">به دوره خوش آمدید</h2>
        <p style="line-height:1.85;color:var(--text-light);font-size:0.95rem;">
          این دوره شامل <strong>${COURSE_DATA.chapters.length} فصل</strong> است.
          در حال حاضر <strong>${activeCount} فصل</strong> فعال و آماده مطالعه است.
          فصل اول کاملاً با محتوای غنی، تمرین و آزمون طراحی شده است.
        </p>
        <p style="margin-top:0.75rem;color:var(--text-light);font-size:0.9rem;">
          از منوی سمت راست یکی از فصل‌ها را انتخاب کنید.
        </p>
      </div>

      <div class="empty-state">
        <i class="fas fa-hand-point-left"></i>
        <h3 style="margin-bottom:0.4rem;">برای شروع، فصل ۱ را انتخاب کنید</h3>
        <p>فصل «آشنایی با هوش مصنوعی» آماده مطالعه است.</p>
      </div>
    `;
  }

  renderChapter(chapterId) {
    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    this.state.currentChapter = chapterId;
    this.state.currentLesson = null;

    document.querySelectorAll('.chapter-item-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.chapter) === chapterId);
    });

    document.getElementById('course-sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('open');

    const main = document.getElementById('content-area');
    if (!main) return;

    if (!this.isChapterActive(chapter)) {
      const byMembership = this.isLockedByMembership(chapter);
      main.innerHTML = byMembership ? `
        <div class="course-header">
          <div>
            <h1>فصل ${chapter.id}: ${chapter.title}</h1>
          </div>
        </div>
        <div class="empty-state">
          <i class="fas fa-lock"></i>
          <h3 style="margin-bottom:0.5rem;">این فصل مخصوص اعضای باشگاه است</h3>
          <p>فصل اول رایگان است. برای دسترسی به همه فصل‌ها، اشتراک تهیه کنید.</p>
          <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-top:1.25rem;">
            <a href="../../pricing/index.html" class="btn-tool primary" style="text-decoration:none;">
              <i class="fas fa-crown"></i> مشاهده پلن‌ها
            </a>
            <button class="btn-tool" data-goto-chapter="1">
              <i class="fas fa-play"></i> فصل ۱ (رایگان)
            </button>
          </div>
        </div>
      ` : `
        <div class="course-header">
          <div>
            <h1>فصل ${chapter.id}: ${chapter.title}</h1>
          </div>
        </div>
        <div class="empty-state">
          <i class="fas fa-clock"></i>
          <h3 style="margin-bottom:0.5rem;">این فصل هنوز فعال نشده است</h3>
          <p>محتوای این فصل به‌زودی تکمیل و در دسترس قرار می‌گیرد.</p>
          <p style="margin-top:0.75rem;font-size:0.9rem;">فعلاً می‌توانید فصل ۱ را مطالعه کنید.</p>
          <button class="btn-tool primary" style="margin-top:1.25rem;" data-goto-chapter="1">
            <i class="fas fa-play"></i> رفتن به فصل ۱
          </button>
        </div>
      `;
      main.querySelector('[data-goto-chapter]')?.addEventListener('click', () => this.renderChapter(1));
      return;
    }

    const prog = this.getChapterProgress(chapterId);

    main.innerHTML = `
      <div class="course-header">
        <div>
          <h1>فصل ${chapter.id}: ${chapter.title}</h1>
          <p class="subtitle">${chapter.lessons.length} درس — ${prog}٪ مطالعه شده</p>
        </div>
        <div class="progress-wrap">
          <div class="progress-label">
            <span>پیشرفت فصل</span>
            <span>${prog}٪</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${prog}%"></div>
          </div>
        </div>
      </div>

      <div class="cards-grid">
        ${chapter.lessons.map(l => this.renderLessonCard(l, chapterId)).join('')}
      </div>

      ${this.renderQuizSection(chapterId)}
    `;

    this.attachChapterListeners();
    this.updateProgressUI();
  }

  renderLessonCard(lesson, chapterId) {
    const key = `${chapterId}-${lesson.id}`;
    const viewed = this.state.viewedLessons.has(key);
    const bookmarked = this.state.bookmarks.has(key);
    const icon = this.getIcon(lesson.icon);

    return `
      <div class="lesson-card ${viewed ? 'viewed' : ''}" data-lesson="${lesson.id}" data-chapter="${chapterId}">
        <div class="card-top">
          <div class="card-icon"><i class="fas ${icon}"></i></div>
          <div>
            <div class="card-title">${lesson.title}</div>
            ${bookmarked ? '<i class="fas fa-bookmark" style="color:var(--course-accent,#f59e0b);font-size:0.85rem;margin-top:4px;"></i>' : ''}
          </div>
        </div>
        <div class="card-meta">
          <span><i class="fas fa-clock"></i> ${lesson.readingTime || '—'}</span>
          <span class="badge ${lesson.difficulty || 'مقدماتی'}">${lesson.difficulty || 'مقدماتی'}</span>
        </div>
      </div>
    `;
  }

  renderQuizSection(chapterId) {
    if (chapterId !== 1 || !COURSE_DATA.quiz?.length) return '';

    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    const allViewed = chapter.lessons.every(l =>
      this.state.viewedLessons.has(`${chapterId}-${l.id}`)
    );
    const result = this.state.quizResults[chapterId];

    if (result) {
      return `
        <div class="quiz-box">
          <h3 style="margin:0 0 0.5rem;"><i class="fas fa-trophy" style="color:#f59e0b;"></i> آزمون تکمیل شد</h3>
          <p>نمره شما: <strong>${result.score}</strong> از ${result.total}</p>
          <button class="btn-tool" style="margin-top:0.75rem;" data-action="retake-quiz">
            <i class="fas fa-redo"></i> شرکت مجدد
          </button>
        </div>
      `;
    }

    return `
      <div class="quiz-box" style="${allViewed ? '' : 'opacity:0.7;'}">
        <h3 style="margin:0 0 0.4rem;"><i class="fas fa-clipboard-check"></i> آزمون پایان فصل اول</h3>
        <p style="font-size:0.9rem;color:var(--text-light);">
          ${allViewed
            ? 'همه درس‌ها را مطالعه کرده‌اید. آماده آزمون هستید.'
            : 'ابتدا همه درس‌های این فصل را مطالعه کنید.'}
        </p>
        ${allViewed ? `
          <button class="btn-tool primary" style="margin-top:0.75rem;" data-action="start-quiz">
            <i class="fas fa-play"></i> شروع آزمون
          </button>` : ''}
      </div>
    `;
  }

  /* ---------- Lesson Detail ---------- */
  renderLesson(chapterId, lessonId) {
    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    const lesson = chapter?.lessons.find(l => l.id === lessonId);
    if (!chapter || !lesson) return;

    this.state.currentChapter = chapterId;
    this.state.currentLesson = lessonId;

    const key = `${chapterId}-${lessonId}`;
    this.state.viewedLessons.add(key);
    this.saveState();
    this.updateProgressUI();

    const bookmarked = this.state.bookmarks.has(key);
    const note = this.state.notes[key] || '';
    const isRich = !!(lesson.sections || lesson.objectives || lesson.glossary);

    const main = document.getElementById('content-area');
    if (!main) return;

    main.innerHTML = `
      <div class="lesson-detail">
        <div class="reading-progress"><div class="reading-progress-fill" id="reading-fill"></div></div>

        <div class="lesson-toolbar">
          <button class="btn-tool" id="btn-back">
            <i class="fas fa-arrow-right"></i> بازگشت به فصل
          </button>
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
            <button class="btn-tool ${bookmarked ? 'bookmarked' : ''}" id="btn-bookmark">
              <i class="fas fa-bookmark"></i> ${bookmarked ? 'نشان‌شده' : 'نشان‌گذاری'}
            </button>
          </div>
        </div>

        <h2 style="color:var(--course-primary,#1e3a8a);margin:0 0 0.4rem;font-size:1.35rem;">${lesson.title}</h2>
        <div class="card-meta" style="margin-bottom:1.25rem;">
          <span><i class="fas fa-clock"></i> ${lesson.readingTime || '—'}</span>
          <span class="badge ${lesson.difficulty || 'مقدماتی'}">${lesson.difficulty || 'مقدماتی'}</span>
        </div>

        <div class="lesson-body">
          ${isRich ? this.renderRichContent(lesson) : this.renderSimpleContent(lesson)}
        </div>

        <div class="notes-area">
          <h3 style="font-size:0.95rem;margin-bottom:0.5rem;"><i class="fas fa-sticky-note"></i> یادداشت‌های شما</h3>
          <textarea id="lesson-notes" placeholder="یادداشت‌های خود را اینجا بنویسید...">${note}</textarea>
        </div>

        <div class="lesson-nav">
          ${lessonId > 1
            ? `<button class="btn-tool btn-prev" data-lesson="${lessonId - 1}"><i class="fas fa-arrow-right"></i> درس قبلی</button>`
            : '<span></span>'}
          ${lessonId < chapter.lessons.length
            ? `<button class="btn-tool primary btn-next" data-lesson="${lessonId + 1}">درس بعدی <i class="fas fa-arrow-left"></i></button>`
            : `<button class="btn-tool success" data-action="complete">تکمیل فصل <i class="fas fa-check"></i></button>`}
        </div>
      </div>
    `;

    this.attachLessonListeners();
    this.initReadingProgress();
  }

  renderRichContent(lesson) {
    let html = '';

    if (lesson.objectives?.length) {
      html += `
        <div class="objectives-box">
          <strong><i class="fas fa-bullseye"></i> اهداف این درس</strong>
          <ul>${lesson.objectives.map(o => `<li>${o}</li>`).join('')}</ul>
        </div>`;
    }

    if (lesson.sections?.length) {
      lesson.sections.forEach(s => {
        html += `<h3 class="section-heading">${s.heading}</h3>`;
        s.paragraphs?.forEach(p => { html += `<p style="line-height:1.9;margin-bottom:0.85rem;">${p}</p>`; });
      });
    }

    if (lesson.glossary?.length) {
      html += `<h3 class="section-heading">واژه‌نامه</h3><div style="display:grid;gap:0.6rem;">`;
      lesson.glossary.forEach(g => {
        html += `
          <div style="background:var(--bg,#f8f9fa);padding:0.7rem 1rem;border-radius:8px;border-right:3px solid var(--course-primary-light,#3b82f6);">
            <strong style="color:var(--course-primary,#1e3a8a);">${g.term}</strong>
            <p style="margin:0.2rem 0 0;font-size:0.92rem;">${g.definition}</p>
          </div>`;
      });
      html += `</div>`;
    }

    if (lesson.examples?.length) {
      html += `
        <div class="example-box">
          <strong style="display:block;margin-bottom:0.4rem;"><i class="fas fa-lightbulb"></i> مثال‌ها</strong>
          <ul style="padding-right:1.2rem;margin:0;">${lesson.examples.map(e => `<li style="margin-bottom:0.35rem;">${e}</li>`).join('')}</ul>
        </div>`;
    }

    if (lesson.tips?.length) {
      html += `
        <div class="tips-box">
          <strong style="display:block;margin-bottom:0.4rem;"><i class="fas fa-star"></i> نکات کاربردی</strong>
          <ul style="padding-right:1.2rem;margin:0;">${lesson.tips.map(t => `<li style="margin-bottom:0.35rem;">${t}</li>`).join('')}</ul>
        </div>`;
    }

    if (lesson.commonMistakes?.length) {
      html += `
        <div class="mistakes-box">
          <strong style="display:block;margin-bottom:0.4rem;"><i class="fas fa-exclamation-triangle"></i> اشتباهات رایج</strong>
          <ul style="padding-right:1.2rem;margin:0;">${lesson.commonMistakes.map(m => `<li style="margin-bottom:0.35rem;">${m}</li>`).join('')}</ul>
        </div>`;
    }

    if (lesson.exercise?.length) {
      html += `
        <div class="exercise-box">
          <strong style="display:block;margin-bottom:0.4rem;"><i class="fas fa-pencil-alt"></i> تمرین</strong>
          ${lesson.exercise.map(e => `<p style="margin-bottom:0.4rem;">${e}</p>`).join('')}
        </div>`;
    }

    if (lesson.answer?.length) {
      html += `
        <details class="answer-details">
          <summary><i class="fas fa-eye"></i> مشاهده پاسخ نمونه</summary>
          <div style="margin-top:0.6rem;padding-top:0.6rem;border-top:1px solid #bbf7d0;">
            ${lesson.answer.map(a => `<p>${a}</p>`).join('')}
          </div>
        </details>`;
    }

    if (lesson.summary?.length) {
      html += `
        <div class="summary-box">
          <strong style="display:block;margin-bottom:0.4rem;"><i class="fas fa-check-double"></i> خلاصه درس</strong>
          <ul style="padding-right:1.2rem;margin:0;">${lesson.summary.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>`;
    }

    if (lesson.keywords?.length) {
      html += `<div class="keywords-wrap">${lesson.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}</div>`;
    }

    return html;
  }

  renderSimpleContent(lesson) {
    return lesson.content || '<p style="color:var(--text-light);">محتوای این درس به‌زودی تکمیل می‌شود.</p>';
  }

  /* ---------- Quiz ---------- */
  startQuiz() {
    const quiz = COURSE_DATA.quiz;
    if (!quiz?.length) return;

    const main = document.getElementById('content-area');
    let current = 0;
    const answers = [];

    const showQ = () => {
      if (current >= quiz.length) {
        let score = 0;
        quiz.forEach((q, i) => { if (answers[i] === q.correct) score++; });
        this.state.quizResults[1] = { score, total: quiz.length };
        this.saveState();

        main.innerHTML = `
          <div class="lesson-detail" style="text-align:center;">
            <h2 style="color:var(--course-primary,#1e3a8a);">نتیجه آزمون فصل اول</h2>
            <div style="font-size:3rem;margin:1.5rem 0;color:${score >= 7 ? '#16a34a' : '#dc2626'};">
              ${score} / ${quiz.length}
            </div>
            <p style="margin-bottom:1.5rem;color:var(--text-light);">
              ${score >= 8 ? 'عالی! مفاهیم فصل اول را خوب یاد گرفته‌اید.' :
                score >= 6 ? 'خوب است. درس‌هایی که اشتباه پاسخ دادید را مرور کنید.' :
                'پیشنهاد می‌کنیم فصل اول را دوباره مرور کنید.'}
            </p>
            <button class="btn-tool primary" id="btn-back-ch">بازگشت به فصل</button>
          </div>`;
        document.getElementById('btn-back-ch').addEventListener('click', () => this.renderChapter(1));
        return;
      }

      const q = quiz[current];
      main.innerHTML = `
        <div class="lesson-detail">
          <div style="display:flex;justify-content:space-between;margin-bottom:1.25rem;">
            <span style="color:var(--text-light);font-size:0.9rem;">سؤال ${current + 1} از ${quiz.length}</span>
            <button class="btn-tool" id="btn-cancel-quiz">انصراف</button>
          </div>
          <h3 style="margin-bottom:1.25rem;line-height:1.7;font-size:1.1rem;">${q.q}</h3>
          <div style="display:grid;gap:0.65rem;">
            ${q.options.map((opt, i) => `
              <button class="quiz-option-btn" data-index="${i}">${opt}</button>
            `).join('')}
          </div>
        </div>`;

      document.getElementById('btn-cancel-quiz').addEventListener('click', () => this.renderChapter(1));
      document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          answers[current] = parseInt(btn.dataset.index);
          current++;
          showQ();
        });
      });
    };

    showQ();
  }

  /* ---------- Reading Progress ---------- */
  initReadingProgress() {
    const fill = document.getElementById('reading-fill');
    const detail = document.querySelector('.lesson-detail');
    if (!fill || !detail) return;

    const onScroll = () => {
      const rect = detail.getBoundingClientRect();
      const total = detail.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      fill.style.width = pct + '%';
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this._scrollHandler = onScroll;
  }

  /* ---------- Event Listeners ---------- */
  attachGlobalListeners() {
    document.getElementById('chapter-list')?.addEventListener('click', e => {
      const btn = e.target.closest('.chapter-item-btn');
      if (btn) {
        e.preventDefault();
        this.renderChapter(parseInt(btn.dataset.chapter));
      }
    });
  }

  attachChapterListeners() {
    document.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', () => {
        this.renderLesson(
          parseInt(card.dataset.chapter),
          parseInt(card.dataset.lesson)
        );
      });
    });

    document.querySelector('[data-action="start-quiz"]')
      ?.addEventListener('click', () => this.startQuiz());

    document.querySelector('[data-action="retake-quiz"]')
      ?.addEventListener('click', () => {
        delete this.state.quizResults[1];
        this.saveState();
        this.startQuiz();
      });
  }

  attachLessonListeners() {
    document.getElementById('btn-back')?.addEventListener('click', () => {
      this.renderChapter(this.state.currentChapter);
    });

    document.getElementById('btn-bookmark')?.addEventListener('click', () => {
      const key = `${this.state.currentChapter}-${this.state.currentLesson}`;
      if (this.state.bookmarks.has(key)) this.state.bookmarks.delete(key);
      else this.state.bookmarks.add(key);
      this.saveState();
      this.renderLesson(this.state.currentChapter, this.state.currentLesson);
    });

    const notes = document.getElementById('lesson-notes');
    if (notes) {
      let t;
      notes.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          const key = `${this.state.currentChapter}-${this.state.currentLesson}`;
          this.state.notes[key] = notes.value;
          this.saveState();
        }, 400);
      });
    }

    document.querySelectorAll('.btn-prev, .btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        this.renderLesson(this.state.currentChapter, parseInt(btn.dataset.lesson));
      });
    });

    document.querySelector('[data-action="complete"]')
      ?.addEventListener('click', () => this.renderChapter(this.state.currentChapter));
  }
}

document.addEventListener('DOMContentLoaded', () => new CourseApp());
