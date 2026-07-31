// داده‌های درس‌های دوره هوش مصنوعی برای وکلا
const COURSE_DATA = {
  title: "هوش مصنوعی برای وکلا",
  chapters: [
    {
      id: 1,
      title: "آشنایی با هوش مصنوعی",
      lessons: [
        {
          id: 1,
          title: "هوش مصنوعی چیست؟",
          readingTime: "۷ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>تعریف هوش مصنوعی</h2>
            <p>هوش مصنوعی (AI) به سیستم‌هایی گفته می‌شود که قادر به انجام وظایفی هستند که معمولاً نیازمند هوش انسانی است. این وظایف شامل یادگیری، استدلال، حل مسئله، درک زبان و تصمیم‌گیری می‌شود.</p>
            
            <h2>چرا برای وکالت مهم است؟</h2>
            <p>وکلا می‌توانند از AI برای تحلیل پرونده، تنظیم لوایح، پژوهش حقوقی و مدیریت زمان استفاده کنند. اما تصمیم نهایی و مسئولیت حرفه‌ای همچنان بر عهده وکیل است.</p>
          `
        },
        {
          id: 2,
          title: "انواع هوش مصنوعی",
          readingTime: "۷ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>دسته‌بندی بر اساس توانایی</h2>
            <p><strong>هوش مصنوعی محدود (Narrow AI):</strong> سیستم‌هایی که فقط یک یا چند وظیفه مشخص را انجام می‌دهند.</p>
            <p><strong>هوش مصنوعی عمومی (General AI):</strong> سیستم‌هایی که هنوز وجود خارجی ندارد.</p>
            
            <h2>دسته‌بندی بر اساس کارکرد</h2>
            <p><strong>تشخیصی:</strong> طبقه‌بندی و تشخیص (مثل تشخیص اسپم).</p>
            <p><strong>مولد:</strong> تولید محتوای تازه (مثل ChatGPT و Claude).</p>
          `
        },
        {
          id: 3,
          title: "هوش مصنوعی مولد چیست؟",
          readingTime: "۸ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>«مولد» یعنی چه؟</h2>
            <p>هوش مصنوعی مولد محتوای تازه تولید می‌کند: متن، تصویر، صوت یا حتی کد نرم‌افزاری.</p>
            
            <h2>چرا هر بار پاسخ فرق می‌کند؟</h2>
            <p>این ابزارها در هر مرحله، محتمل‌ترین کلمه بعدی را انتخاب می‌کنند، اما این انتخاب کاملاً قطعی نیست و درجه‌ای از تنوع دارد.</p>
          `
        },
        {
          id: 4,
          title: "مدل زبانی بزرگ (LLM)",
          readingTime: "۸ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>تعریف ساده</h2>
            <p>مدل زبانی بزرگ (LLM) موتور اصلی پشت ابزارهایی مانند Claude و ChatGPT است. این مدل با خواندن حجم بسیار زیادی متن، یاد گرفته چگونه زبان را بفهمد و تولید کند.</p>
            
            <h2>چرا «بزرگ» می‌گویند؟</h2>
            <p>به حجم داده آموزشی (میلیاردها صفحه متن) و تعداد پارامترهای داخلی مدل اشاره دارد.</p>
          `
        },
        {
          id: 5,
          title: "آموزش مدل زبانی",
          readingTime: "۸ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>مراحل آموزش</h2>
            <p>۱. یادگیری زبان از حجم عظیم متن</p>
            <p>۲. تنظیم دقیق با راهنمایی انسانی</p>
            
            <h2>تاریخ برش دانش</h2>
            <p>دانش مدل به یک تاریخ مشخص محدود است. هر رویداد یا قانون جدید پس از این تاریخ، در دانش مدل وجود ندارد.</p>
          `
        },
        {
          id: 6,
          title: "نحوه تولید پاسخ",
          readingTime: "۸ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>پیش‌بینی کلمه بعدی</h2>
            <p>مدل زبانی پاسخ را کلمه‌به‌کلمه و بر اساس محتمل‌ترین انتخاب در هر لحظه می‌سازد.</p>
            
            <h2>توهم (Hallucination)</h2>
            <p>چون مدل صرفاً محتمل‌ترین کلمه را انتخاب می‌کند، ممکن است اطلاعات نادرست اما قانع‌کننده تولید کند.</p>
          `
        },
        {
          id: 7,
          title: "تفاوت موتور جستجو و LLM",
          readingTime: "۷ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>جستجو پیدا می‌کند؛ LLM می‌سازد</h2>
            <p>موتور جستجو فهرستی از صفحات موجود را نشان می‌دهد. LLM یک پاسخ یکپارچه و تازه می‌سازد.</p>
            
            <h2>بهترین رویکرد</h2>
            <p>ترکیب هوشمند هر دو: از LLM برای فهم اولیه و از موتور جستجو برای تأیید نهایی استناد استفاده کنید.</p>
          `
        },
        {
          id: 8,
          title: "نقاط قوت و ضعف LLM",
          readingTime: "۹ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>نقاط قوت</h2>
            <ul>
              <li>سرعت در سازمان‌دهی متن</li>
              <li>انعطاف در لحن و قالب</li>
              <li>کمک به شروع نوشتن</li>
            </ul>
            
            <h2>محدودیت‌ها</h2>
            <ul>
              <li>احتمال توهم</li>
              <li>دانش زمان‌دار</li>
              <li>بی‌اطلاعی از پرونده خاص شما</li>
            </ul>
          `
        },
        {
          id: 9,
          title: "اصطلاحات پایه AI",
          readingTime: "۶ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>واژه‌نامه کوتاه</h2>
            <ul>
              <li><strong>AI:</strong> توانایی رایانه در انجام کارهای هوشمندانه</li>
              <li><strong>LLM:</strong> مدل زبانی بزرگ</li>
              <li><strong>Prompt:</strong> متنی که به مدل می‌دهید</li>
              <li><strong>Hallucination:</strong> تولید اطلاعات نادرست</li>
            </ul>
          `
        },
        {
          id: 10,
          title: "جمع‌بندی فصل اول",
          readingTime: "۵ دقیقه",
          difficulty: "مقدماتی",
          content: `
            <h2>آنچه آموختید</h2>
            <p>در این فصل با مفاهیم پایه هوش مصنوعی، انواع آن، نحوه کار مدل‌های زبانی و محدودیت‌هایشان آشنا شدید.</p>
            <p>این پایه مفهومی برای فصل‌های بعدی حیاتی است.</p>
          `
        }
      ]
    },
    {
      id: 2,
      title: "آشنایی با ابزارها",
      lessons: [
        { id: 1, title: "معرفی ChatGPT", readingTime: "۷ دقیقه", difficulty: "مقدماتی", content: "<h2>ChatGPT</h2><p>محصول OpenAI و یکی از محبوب‌ترین ابزارهای AI.</p>" },
        { id: 2, title: "معرفی Claude", readingTime: "۷ دقیقه", difficulty: "مقدماتی", content: "<h2>Claude</h2><p>محصول Anthropic با دقت بالا در تحلیل متون طولانی.</p>" },
        { id: 3, title: "معرفی Gemini", readingTime: "۶ دقیقه", difficulty: "مقدماتی", content: "<h2>Gemini</h2><p>محصول گوگل با یکپارچگی با اکوسیستم گوگل.</p>" },
        { id: 4, title: "معرفی Copilot", readingTime: "۶ دقیقه", difficulty: "مقدماتی", content: "<h2>Copilot</h2><p>مایکروسافت با دسترسی به اینترنت از طریق Bing.</p>" },
        { id: 5, title: "معرفی Perplexity", readingTime: "۶ دقیقه", difficulty: "مقدماتی", content: "<h2>Perplexity</h2><p>موتور جستجوی هوشمند با استناد به منابع.</p>" },
        { id: 6, title: "مقایسه ابزارها", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>جدول مقایسه</h2><p>هر ابزار نقاط قوت و ضعف خاص خود را دارد.</p>" },
        { id: 7, title: "نحوه دسترسی", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>ثبت‌نام</h2><p>اکثر ابزارها نسخه رایگان دارند.</p>" },
        { id: 8, title: "نکات امنیتی", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>حفاظت از اطلاعات</h2><p>هرگز اطلاعات محرمانه موکل را وارد نکنید.</p>" },
        { id: 9, title: "ابزارهای تخصصی", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>ابزارهای ویژه</h2><p>برخی ابزارها برای کار حقوقی طراحی شده‌اند.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>آنچه آموختید</h2><p>با ابزارهای مختلف AI آشنا شدید.</p>" }
      ]
    },
    {
      id: 3,
      title: "شروع کار",
      lessons: [
        { id: 1, title: "ایجاد حساب کاربری", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>مراحل ثبت‌نام</h2><p>برای شروع، حساب کاربری ایجاد کنید.</p>" },
        { id: 2, title: "آشنایی با محیط", readingTime: "۶ دقیقه", difficulty: "مقدماتی", content: "<h2>رابط کاربری</h2><p>محیط کار بسیار ساده است.</p>" },
        { id: 3, title: "اولین مکالمه", readingTime: "۷ دقیقه", difficulty: "مقدماتی", content: "<h2>شروع گفتگو</h2><p>با یک سؤال ساده شروع کنید.</p>" },
        { id: 4, title: "تنظیمات اولیه", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>شخصی‌سازی</h2><p>تنظیمات را مطابق نیاز تنظیم کنید.</p>" },
        { id: 5, title: "ذخیره مکالمات", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>مدیریت تاریخچه</h2><p>مکالمات مهم را ذخیره کنید.</p>" },
        { id: 6, title: "اشتراک‌گذاری", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>همکاری</h2><p>مکالمات را با همکاران به اشتراک بگذارید.</p>" },
        { id: 7, title: "پشتیبانی", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>منابع کمکی</h2><p>از راهنمای رسمی استفاده کنید.</p>" },
        { id: 8, title: "رفع مشکلات", readingTime: "۶ دقیقه", difficulty: "مقدماتی", content: "<h2>عیب‌یابی</h2><p>راه‌حل مشکلات رایج.</p>" },
        { id: 9, title: "تمرین عملی", readingTime: "۸ دقیقه", difficulty: "مقدماتی", content: "<h2>تمرین</h2><p>یک مکالمه عملی انجام دهید.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>آنچه آموختید</h2><p>آماده شروع کار عملی هستید.</p>" }
      ]
    },
    {
      id: 4,
      title: "پرامپت‌نویسی",
      lessons: [
        { id: 1, title: "اصول پرامپت‌نویسی", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>چهار اصل کلیدی</h2><ul><li>شفافیت</li><li>زمینه</li><li>ساختار</li><li>محدودیت‌ها</li></ul>" },
        { id: 2, title: "نقش و زمینه", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>تعیین نقش</h2><p>به مدل بگویید در چه نقشی پاسخ دهد.</p>" },
        { id: 3, title: "ساختاردهی", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>ساختار مؤثر</h2><p>درخواست خود را ساختارمند کنید.</p>" },
        { id: 4, title: "مثال‌های عملی", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>پرامپت‌های نمونه</h2><p>نمونه‌هایی از پرامپت‌های مؤثر.</p>" },
        { id: 5, title: "اشتباهات رایج", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>نبایدها</h2><ul><li>درخواست مبهم</li><li>زمینه ناکافی</li></ul>" },
        { id: 6, title: "Chain-of-Thought", readingTime: "۸ دقیقه", difficulty: "پیشرفته", content: "<h2>استدلال مرحله‌ای</h2><p>از مدل بخواهید مرحله‌به‌مرحله فکر کند.</p>" },
        { id: 7, title: "Few-Shot", readingTime: "۷ دقیقه", difficulty: "پیشرفته", content: "<h2>ارائه نمونه</h2><p>چند نمونه از خروجی مورد نظر نشان دهید.</p>" },
        { id: 8, title: "System Prompt", readingTime: "۷ دقیقه", difficulty: "پیشرفته", content: "<h2>پرامپت سیستمی</h2><p>کنترل رفتار مدل با پرامپت سیستمی.</p>" },
        { id: 9, title: "بهینه‌سازی", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>بهبود تدریجی</h2><p>پرامپت‌ها را به‌تدریج بهبود دهید.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>آنچه آموختید</h2><p>می‌توانید پرامپت‌های مؤثر بنویسید.</p>" }
      ]
    },
    {
      id: 5,
      title: "تکنیک‌های حرفه‌ای",
      lessons: [
        { id: 1, title: "تحلیل اسناد طولانی", readingTime: "۸ دقیقه", difficulty: "پیشرفته", content: "<h2>اسناد بزرگ</h2><p>نحوه تحلیل اسناد طولانی با AI.</p>" },
        { id: 2, title: "استخراج اطلاعات", readingTime: "۷ دقیقه", difficulty: "پیشرفته", content: "<h2>Information Extraction</h2><p>استخراج خودکار اطلاعات از متون.</p>" },
        { id: 3, title: "مقایسه اسناد", readingTime: "۷ دقیقه", difficulty: "پیشرفته", content: "<h2>Document Comparison</h2><p>مقایسه خودکار دو نسخه قرارداد.</p>" },
        { id: 4, title: "ترجمه حقوقی", readingTime: "۶ دقیقه", difficulty: "پیشرفته", content: "<h2>Legal Translation</h2><p>ترجمه متون حقوقی با AI.</p>" },
        { id: 5, title: "خلاصه‌سازی", readingTime: "۷ دقیقه", difficulty: "پیشرفته", content: "<h2>Smart Summarization</h2><p>خلاصه‌سازی با حفظ نکات کلیدی.</p>" },
        { id: 6, title: "تولید لوایح", readingTime: "۸ دقیقه", difficulty: "پیشرفته", content: "<h2>Automated Drafting</h2><p>تولید پیش‌نویس لوایح.</p>" },
        { id: 7, title: "تحلیل ریسک", readingTime: "۸ دقیقه", difficulty: "پیشرفته", content: "<h2>Contract Risk Analysis</h2><p>شناسایی ریسک‌های قرارداد.</p>" },
        { id: 8, title: "پیش‌بینی نتایج", readingTime: "۷ دقیقه", difficulty: "پیشرفته", content: "<h2>Outcome Prediction</h2><p>پیش‌بینی نتایج پرونده.</p>" },
        { id: 9, title: "اتوماسیون", readingTime: "۷ دقیقه", difficulty: "پیشرفته", content: "<h2>Workflow Automation</h2><p>اتوماسیون فرآیندهای تکراری.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "پیشرفته", content: "<h2>آنچه آموختید</h2><p>تکنیک‌های حرفه‌ای را یاد گرفتید.</p>" }
      ]
    },
    {
      id: 6,
      title: "AI برای وکلا",
      lessons: [
        { id: 1, title: "تحلیل پرونده", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>Case Analysis</h2><p>تحلیل پرونده با AI.</p>" },
        { id: 2, title: "پژوهش حقوقی", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>Legal Research</h2><p>پژوهش حقوقی با AI.</p>" },
        { id: 3, title: "تنظیم دادخواست", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>Drafting Petitions</h2><p>کمک در تنظیم دادخواست.</p>" },
        { id: 4, title: "تنظیم لایحه", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>Drafting Briefs</h2><p>کمک در تنظیم لایحه.</p>" },
        { id: 5, title: "بررسی قرارداد", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>Contract Review</h2><p>بررسی خودکار قراردادها.</p>" },
        { id: 6, title: "مدیریت موکلین", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>Client Management</h2><p>مدیریت ارتباط با موکلین.</p>" },
        { id: 7, title: "مهلت‌ها", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>Deadline Management</h2><p>مدیریت مهلت‌های قانونی.</p>" },
        { id: 8, title: "گزارش‌دهی", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>Reporting</h2><p>تولید گزارش‌های حقوقی.</p>" },
        { id: 9, title: "آموزش مستمر", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>Continuous Learning</h2><p>یادگیری مستمر با AI.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>آنچه آموختید</h2><p>کاربردهای تخصصی را یاد گرفتید.</p>" }
      ]
    },
    {
      id: 7,
      title: "امنیت و اخلاق",
      lessons: [
        { id: 1, title: "حریم خصوصی", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>Data Privacy</h2><p>حفاظت از اطلاعات محرمانه.</p>" },
        { id: 2, title: "محرمانگی", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>Attorney-Client Privilege</h2><p>رعایت اصل محرمانگی.</p>" },
        { id: 3, title: "سوگیری", readingTime: "۷ دقیقه", difficulty: "پیشرفته", content: "<h2>Model Bias</h2><p>آگاهی از سوگیری مدل‌ها.</p>" },
        { id: 4, title: "مسئولیت", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>Professional Responsibility</h2><p>مسئولیت وکیل در قبال AI.</p>" },
        { id: 5, title: "راستی‌آزمایی", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>Verification</h2><p>ضرورت راستی‌آزمایی.</p>" },
        { id: 6, title: "شفافیت", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>Transparency</h2><p>اطلاع‌رسانی به موکل.</p>" },
        { id: 7, title: "قوانین", readingTime: "۷ دقیقه", difficulty: "پیشرفته", content: "<h2>Regulations</h2><p>قوانین مرتبط با AI.</p>" },
        { id: 8, title: "بهترین شیوه‌ها", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>Best Practices</h2><p>رعایت بهترین شیوه‌ها.</p>" },
        { id: 9, title: "احتیاط", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>Precautions</h2><p>موارد احتیاطی.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>آنچه آموختید</h2><p>ملاحظات امنیتی را یاد گرفتید.</p>" }
      ]
    },
    {
      id: 8,
      title: "کار عملی",
      lessons: [
        { id: 1, title: "پروژه ۱: تحلیل قرارداد", readingTime: "۱۰ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>یک قرارداد را تحلیل کنید.</p>" },
        { id: 2, title: "پروژه ۲: تنظیم لایحه", readingTime: "۱۰ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>یک لایحه تنظیم کنید.</p>" },
        { id: 3, title: "پروژه ۳: پژوهش", readingTime: "۱۰ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>یک پژوهش انجام دهید.</p>" },
        { id: 4, title: "پروژه ۴: خلاصه‌سازی", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>یک متن را خلاصه کنید.</p>" },
        { id: 5, title: "پروژه ۵: مقایسه", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>دو قرارداد را مقایسه کنید.</p>" },
        { id: 6, title: "پروژه ۶: ترجمه", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>یک متن را ترجمه کنید.</p>" },
        { id: 7, title: "پروژه ۷: ریسک", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>ریسک‌ها را بررسی کنید.</p>" },
        { id: 8, title: "پروژه ۸: گزارش", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>یک گزارش تولید کنید.</p>" },
        { id: 9, title: "پروژه ۹: اتوماسیون", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>یک فرآیند را اتوماتیک کنید.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>آنچه آموختید</h2><p>تمرین‌های عملی را انجام دادید.</p>" }
      ]
    },
    {
      id: 9,
      title: "اشتباهات رایج",
      lessons: [
        { id: 1, title: "اعتماد کورکورانه", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>اشتباه اول</h2><p>اعتماد کامل بدون راستی‌آزمایی.</p>" },
        { id: 2, title: "پرامپت‌های مبهم", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>اشتباه دوم</h2><p>نوشتن درخواست‌های مبهم.</p>" },
        { id: 3, title: "نادیده گرفتن توهم", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>اشتباه سوم</h2><p>عدم آگاهی از احتمال خطا.</p>" },
        { id: 4, title: "اطلاعات محرمانه", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>اشتباه چهارم</h2><p>وارد کردن اطلاعات محرمانه.</p>" },
        { id: 5, title: "ابزار نادرست", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>اشتباه پنجم</h2><p>استفاده از ابزار نامناسب.</p>" },
        { id: 6, title: "عدم به‌روزرسانی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>اشتباه ششم</h2><p>عدم پیگیری به‌روزرسانی‌ها.</p>" },
        { id: 7, title: "انتظارات غیرواقعی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>اشتباه هفتم</h2><p>انتظار عملکرد انسانی کامل.</p>" },
        { id: 8, title: "نادیده گرفتن محدودیت‌ها", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>اشتباه هشتم</h2><p>عدم درک محدودیت‌های مدل.</p>" },
        { id: 9, title: "عدم مستندسازی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>اشتباه نهم</h2><p>عدم ثبت استفاده از AI.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>آنچه آموختید</h2><p>از اشتباهات رایج اجتناب کنید.</p>" }
      ]
    },
    {
      id: 10,
      title: "کتابخانه پرامپت",
      lessons: [
        { id: 1, title: "پرامپت‌های تحلیل", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>پرامپت‌های آماده</h2><p>برای تحلیل پرونده‌های حقوقی.</p>" },
        { id: 2, title: "پرامپت‌های لایحه", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>پرامپت‌های آماده</h2><p>برای تنظیم لوایح.</p>" },
        { id: 3, title: "پرامپت‌های پژوهش", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>پرامپت‌های آماده</h2><p>برای پژوهش حقوقی.</p>" },
        { id: 4, title: "پرامپت‌های قرارداد", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>پرامپت‌های آماده</h2><p>برای بررسی قراردادها.</p>" },
        { id: 5, title: "پرامپت‌های ترجمه", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>پرامپت‌های آماده</h2><p>برای ترجمه متون حقوقی.</p>" },
        { id: 6, title: "پرامپت‌های خلاصه", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>پرامپت‌های آماده</h2><p>برای خلاصه‌سازی.</p>" },
        { id: 7, title: "پرامپت‌های گزارش", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>پرامپت‌های آماده</h2><p>برای تولید گزارش.</p>" },
        { id: 8, title: "پرامپت‌های مذاکره", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>پرامپت‌های آماده</h2><p>برای کمک به مذاکره.</p>" },
        { id: 9, title: "شخصی‌سازی", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>سفارشی‌سازی</h2><p>پرامپت‌ها را شخصی‌سازی کنید.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>آنچه آموختید</h2><p>به کتابخانه پرامپت دسترسی دارید.</p>" }
      ]
    },
    {
      id: 11,
      title: "تمرین",
      lessons: [
        { id: 1, title: "تمرین ۱", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>تمرین عملی برای تقویت مهارت‌ها.</p>" },
        { id: 2, title: "تمرین ۲", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>تمرین عملی برای تقویت مهارت‌ها.</p>" },
        { id: 3, title: "تمرین ۳", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>تمرین عملی برای تقویت مهارت‌ها.</p>" },
        { id: 4, title: "تمرین ۴", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>تمرین عملی برای تقویت مهارت‌ها.</p>" },
        { id: 5, title: "تمرین ۵", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>تمرین عملی برای تقویت مهارت‌ها.</p>" },
        { id: 6, title: "تمرین ۶", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>تمرین عملی برای تقویت مهارت‌ها.</p>" },
        { id: 7, title: "تمرین ۷", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>تمرین عملی برای تقویت مهارت‌ها.</p>" },
        { id: 8, title: "تمرین ۸", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>تمرین عملی برای تقویت مهارت‌ها.</p>" },
        { id: 9, title: "تمرین ۹", readingTime: "۸ دقیقه", difficulty: "متوسط", content: "<h2>تمرین</h2><p>تمرین عملی برای تقویت مهارت‌ها.</p>" },
        { id: 10, title: "جمع‌بندی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>آنچه آموختید</h2><p>تمرین‌ها را انجام دادید.</p>" }
      ]
    },
    {
      id: 12,
      title: "مسیر یادگیری",
      lessons: [
        { id: 1, title: "مرور دوره", readingTime: "۷ دقیقه", difficulty: "متوسط", content: "<h2>مرور</h2><p>مرور مطالب آموخته‌شده.</p>" },
        { id: 2, title: "منابع تکمیلی", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>منابع</h2><p>معرفی منابع برای یادگیری بیشتر.</p>" },
        { id: 3, title: "جامعه آنلاین", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>جامعه</h2><p>پیوستن به جامعه آنلاین.</p>" },
        { id: 4, title: "به‌روزرسانی", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>یادگیری مستمر</h2><p>اهمیت به‌روز ماندن.</p>" },
        { id: 5, title: "پروژه‌های شخصی", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>پروژه</h2><p>تعریف پروژه‌های شخصی.</p>" },
        { id: 6, title: "اشتراک دانش", readingTime: "۵ دقیقه", difficulty: "متوسط", content: "<h2>اشتراک</h2><p>اشتراک‌گذاری دانش.</p>" },
        { id: 7, title: "ابزارهای آینده", readingTime: "۶ دقیقه", difficulty: "پیشرفته", content: "<h2>آینده</h2><p>نگاهی به ابزارهای آینده.</p>" },
        { id: 8, title: "چشم‌انداز", readingTime: "۶ دقیقه", difficulty: "متوسط", content: "<h2>چشم‌انداز</h2><p>تأثیر AI بر وکالت.</p>" },
        { id: 9, title: "گواهی", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>گواهی</h2><p>دریافت گواهی پایان دوره.</p>" },
        { id: 10, title: "جمع‌بندی نهایی", readingTime: "۵ دقیقه", difficulty: "مقدماتی", content: "<h2>پایان</h2><p>تبریک! دوره را با موفقیت گذراندید.</p>" }
      ]
    }
  ]
};
