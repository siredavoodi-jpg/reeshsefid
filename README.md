# باشگاه وکلای افرا | پلتفرم هوش مصنوعی حقوقی (MVP)

## امکانات
- لندینگ، ثبت‌نام/ورود، داشبورد، قیمت‌گذاری
- قفل فصل‌های ۲+ برای غیرعضو (فصل ۱ رایگان)
- Auth دو حالته: **localStorage (دمو)** یا **Supabase**
- دوره + پرامپت + خدمات

## تست سریع (بدون Supabase)
1. `index.html` را باز کنید
2. ثبت‌نام → داشبورد
3. بدون خرید: فقط فصل ۱ باز است
4. از قیمت‌گذاری پلن بخرید → فصل‌های ۲+ باز می‌شوند

## اتصال Supabase

### ۱. پروژه بسازید
- https://supabase.com → New project

### ۲. کلیدها را در `assets/config.js` بگذارید
```js
SUPABASE_URL: 'https://xxxx.supabase.co',
SUPABASE_ANON_KEY: 'eyJhbGciOi...',
```

### ۳. جداول SQL
در SQL Editor:

```sql
-- پروفایل کاربر
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  plan text default 'free',
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- ثبت‌نام در دوره
create table enrollments (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  course_id text not null,
  plan text,
  created_at timestamptz default now(),
  unique(user_id, course_id)
);

alter table enrollments enable row level security;
create policy "Users read own enrollments" on enrollments
  for select using (auth.uid() = user_id);
create policy "Users insert own enrollments" on enrollments
  for insert with check (auth.uid() = user_id);
create policy "Users update own enrollments" on enrollments
  for update using (auth.uid() = user_id);
```

### ۴. Authentication
- Email provider را روشن کنید
- در صورت تمایل Confirm email را برای تست خاموش کنید

بعد از پر کردن config، سایت خودکار به حالت Supabase می‌رود.

## ساختار
```
assets/config.js   ← کلیدهای Supabase
assets/auth.js     ← لایه Auth
auth/              ← ورود و ثبت‌نام
dashboard/         ← داشبورد عضو
pricing/           ← پلن‌ها
courses/           ← دوره (قفل عضویت)
```
