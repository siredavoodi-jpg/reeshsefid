// منطق برنامه دوره هوش مصنوعی برای وکلا
// سازگار با ساختار غنی فصل ۱ و ساختار ساده فصل‌های بعدی
// ظاهر گرافیکی سایت حفظ شده است

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
    this.attachEventListeners();
  }

  loadState() {
    try {
      const saved = localStorage.getItem('ai-course-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state.viewedLessons = new Set(parsed.viewedLessons || []);
        this.state.bookmarks = new Set(parsed.bookmarks || []);
        this.state.notes = parsed.notes || {};
        this.state.quizResults = parsed.quizResults || {};
      }
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('ai-course-state', JSON.stringify({
        viewedLessons: [...this.state.viewedLessons],
        bookmarks: [...this.state.bookmarks],
        notes: this.state.notes,
        quizResults: this.state.quizResults
      }));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }

  // نگاشت آیکون‌های درس
  getIcon(iconName) {
    const icons = {
      brain: 'fa-brain',
      layers: 'fa-layer-group',
      sparkles: 'fa-wand-magic-sparkles',
      'book-text': 'fa-book-open',
      'graduation-cap': 'fa-graduation-cap',
      cpu: 'fa-microchip',
      search: 'fa-magnifying-glass',
      scale: 'fa-scale-balanced',
      list: 'fa-list',
      flag: 'fa-flag'
    };
    return icons[iconName] || 'fa-book';
  }

  // تشخیص اینکه فصل محتوای واقعی دارد یا فقط placeholder
  isChapterActive(chapter) {
    if (!chapter || !chapter.lessons || chapter.lessons.length === 0) return false;
    // فصل ۱ کامل است
    if (chapter.id === 1) return true;
    // سایر فصل‌ها اگر content خیلی کوتاه یا placeholder باشند غیرفعال‌اند
    const first = chapter.lessons[0];
    if (first.sections || first.objectives || first.glossary) return true;
    if (first.content && first.content.length > 120) return true;
    return false;
  }

  renderSidebar() {
    const chapterList = document.getElementById('chapter-list');
    if (!chapterList) return;

    chapterList.innerHTML = COURSE_DATA.chapters.map(chapter => {
      const active = this.isChapterActive(chapter);
      return `
        <li>
          <a href="#" data-chapter="${chapter.id}" class="chapter-link ${active ? '' : 'locked'}">
            <span class="ch-num">${chapter.id}</span>
            <span>${chapter.title}</span>
            ${!active ? '<i class="fas fa-lock" style="margin-right:auto;font-size:0.7rem;opacity:0.6;"></i>' : ''}
          </a>
        </li>
      `;
    }).join('');
  }

  renderWelcome() {
    const main = document.getElementById('content-area') || document.getElementById('main-content');
    if (!main) return;

    main.innerHTML = `
      <header class="page-header">
        <div>
          <h1>🎓 ${COURSE_DATA.title}</h1>
          <p class="page-subtitle">دوره تخصصی کاربرد هوش مصنوعی در حرفه وکالت</p>
        </div>
      </header>
      <div class="card" style="margin-bottom: 1.5rem;">
        <h2 style="color: var(--primary); margin-bottom: 0.75rem;">به دوره خوش آمدید</h2>
        <p style="line-height: 1.8; color: var(--text-light);">
          این دوره شامل <strong>${COURSE_DATA.chapters.length} فصل</strong> است.
          فصل اول به‌طور کامل آماده و دارای محتوای غنی، تمرین و آزمون است.
          سایر فصل‌ها به‌تدریج فعال می‌شوند.
        </p>
        <p style="margin-top: 1rem; color: var(--text-light);">
          از منوی سمت راست، زیر عنوان «هوش مصنوعی برای وکلا» یکی از فصل‌ها را انتخاب کنید.
        </p>
      </div>
      <div class="inactive-card">
        <i class="fas fa-hand-point-left"></i>
        <h3 style="margin-bottom: 0.5rem;">برای شروع، فصل ۱ را از منوی سمت راست انتخاب کنید</h3>
        <p>فصل «آشنایی با هوش مصنوعی» آماده مطالعه است.</p>
      </div>
    `;
  }

  renderChapter(chapterId) {
    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    this.state.currentChapter = chapterId;
    this.state.currentLesson = null;

    // فعال کردن لینک فصل در سایدبار
    document.querySelectorAll('.chapter-link').forEach(link => {
      link.classList.toggle('active', parseInt(link.dataset.chapter) === chapterId);
    });

    const main = document.getElementById('content-area') || document.getElementById('main-content');
    if (!main) return;

    // اگر فصل هنوز فعال نیست
    if (!this.isChapterActive(chapter)) {
      main.innerHTML = `
        <div class="chapter-header">
          <h2>فصل ${chapter.id}: ${chapter.title}</h2>
        </div>
        <div class="inactive-card">
          <i class="fas fa-clock"></i>
          <h3 style="margin-bottom: 0.5rem;">این فصل هنوز فعال نشده است</h3>
          <p>محتوای این فصل به‌زودی تکمیل و در دسترس قرار می‌گیرد.</p>
          <p style="margin-top: 0.75rem; font-size: 0.9rem;">فعلاً می‌توانید فصل ۱ (آشنایی با هوش مصنوعی) را مطالعه کنید.</p>
        </div>
      `;
      return;
    }

    main.innerHTML = `
      <div class="chapter-header">
        <h2>فصل ${chapter.id}: ${chapter.title}</h2>
        <p>${chapter.lessons.length} درس</p>
      </div>
      <div class="cards-grid">
        ${chapter.lessons.map(lesson => this.renderLessonCard(lesson, chapterId)).join('')}
      </div>
      ${this.renderQuizSection(chapterId)}
    `;

    this.attachChapterEventListeners();
  }

  renderLessonCard(lesson, chapterId) {
    const key = `${chapterId}-${lesson.id}`;
    const isViewed = this.state.viewedLessons.has(key);
    const isBookmarked = this.state.bookmarks.has(key);
    const iconClass = this.getIcon(lesson.icon);

    return `
      <div class="lesson-card ${isViewed ? 'viewed' : ''}" data-lesson="${lesson.id}" data-chapter="${chapterId}">
        <div class="card-top">
          <div class="card-icon">
            <i class="fas ${iconClass}"></i>
          </div>
          <div>
            <div class="card-title">${lesson.title}</div>
            ${isBookmarked ? '<i class="fas fa-bookmark" style="color: var(--accent-color); margin-top: 4px;"></i>' : ''}
          </div>
        </div>
        <div class="card-meta">
          <span><i class="fas fa-clock"></i> ${lesson.readingTime || '—'}</span>
          <span class="badge ${lesson.difficulty || 'مقدماتی'}">${lesson.difficulty || 'مقدماتی'}</span>
          ${isViewed ? '<span style="color: #16a34a; font-size: 0.8rem;"><i class="fas fa-check"></i> مطالعه شده</span>' : ''}
        </div>
      </div>
    `;
  }

  renderQuizSection(chapterId) {
    // فقط برای فصل ۱ آزمون واقعی داریم
    if (chapterId !== 1 || !COURSE_DATA.quiz || COURSE_DATA.quiz.length === 0) {
      return '';
    }

    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    const allViewed = chapter.lessons.every(lesson => 
      this.state.viewedLessons.has(`${chapterId}-${lesson.id}`)
    );
    const quizResult = this.state.quizResults[chapterId];

    if (quizResult) {
      return `
        <div class="quiz-container" style="margin-top: 2rem;">
          <h3><i class="fas fa-trophy" style="color: #f59e0b;"></i> آزمون تکمیل شد</h3>
          <p style="margin-top: 0.5rem;">نمره شما: <strong>${quizResult.score}</strong> از ${quizResult.total}</p>
          <button class="back-to-list-btn" style="margin-top: 1rem;" data-action="retake-quiz">
            <i class="fas fa-redo"></i> شرکت مجدد در آزمون
          </button>
        </div>
      `;
    }

    return `
      <div class="quiz-container" style="margin-top: 2rem; ${allViewed ? '' : 'opacity: 0.7;'}">
        <h3><i class="fas fa-clipboard-check"></i> آزمون پایان فصل اول</h3>
        <p style="margin-top: 0.5rem;">
          ${allViewed 
            ? 'همه درس‌ها را مطالعه کرده‌اید. برای شروع آزمون کلیک کنید.' 
            : 'ابتدا همه درس‌های این فصل را مطالعه کنید تا آزمون باز شود.'}
        </p>
        ${allViewed 
          ? `<button class="back-to-list-btn" style="margin-top: 1rem; background: var(--primary-color); color: white; border: none;" data-action="start-quiz">
               <i class="fas fa-play"></i> شروع آزمون
             </button>` 
          : ''}
      </div>
    `;
  }

  renderLesson(chapterId, lessonId) {
    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    const lesson = chapter?.lessons.find(l => l.id === lessonId);
    if (!chapter || !lesson) return;

    this.state.currentChapter = chapterId;
    this.state.currentLesson = lessonId;

    const key = `${chapterId}-${lessonId}`;
    this.state.viewedLessons.add(key);
    this.saveState();

    const isBookmarked = this.state.bookmarks.has(key);
    const note = this.state.notes[key] || '';
    const isRich = !!(lesson.sections || lesson.objectives || lesson.glossary);

    const main = document.getElementById('content-area') || document.getElementById('main-content');
    if (!main) return;

    main.innerHTML = `
      <div class="lesson-detail">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
          <button class="back-to-list-btn" id="btn-back">
            <i class="fas fa-arrow-right"></i> بازگشت به فصل
          </button>
          <button class="back-to-list-btn ${isBookmarked ? 'bookmarked' : ''}" id="btn-bookmark" style="${isBookmarked ? 'background: #fef3c7; border-color: #f59e0b; color: #92400e;' : ''}">
            <i class="fas fa-bookmark"></i> ${isBookmarked ? 'نشان‌شده' : 'نشان‌گذاری'}
          </button>
        </div>
        
        <h2 style="color: var(--primary-color); margin-bottom: 0.5rem;">${lesson.title}</h2>
        <div class="card-meta" style="margin-bottom: 1.5rem;">
          <span><i class="fas fa-clock"></i> ${lesson.readingTime || '—'}</span>
          <span class="badge ${lesson.difficulty || 'مقدماتی'}">${lesson.difficulty || 'مقدماتی'}</span>
        </div>

        <div class="lesson-body">
          ${isRich ? this.renderRichContent(lesson) : this.renderSimpleContent(lesson)}
        </div>

        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
          <h3 style="font-size: 1rem; margin-bottom: 0.75rem;"><i class="fas fa-sticky-note"></i> یادداشت‌های شما</h3>
          <textarea id="lesson-notes" 
            style="width: 100%; min-height: 100px; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; font-size: 0.95rem; resize: vertical;"
            placeholder="یادداشت‌های خود را اینجا بنویسید...">${note}</textarea>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 2rem; gap: 1rem; flex-wrap: wrap;">
          ${lessonId > 1 
            ? `<button class="back-to-list-btn btn-prev" data-lesson="${lessonId - 1}">
                 <i class="fas fa-arrow-right"></i> درس قبلی
               </button>` 
            : '<span></span>'}
          ${lessonId < chapter.lessons.length 
            ? `<button class="back-to-list-btn btn-next" data-lesson="${lessonId + 1}" style="background: var(--primary-color); color: white; border: none;">
                 درس بعدی <i class="fas fa-arrow-left"></i>
               </button>` 
            : `<button class="back-to-list-btn btn-complete" data-action="complete" style="background: #16a34a; color: white; border: none;">
                 تکمیل فصل <i class="fas fa-check"></i>
               </button>`}
        </div>
      </div>
    `;

    this.attachLessonEventListeners();
  }

  renderRichContent(lesson) {
    let html = '';

    // اهداف یادگیری
    if (lesson.objectives && lesson.objectives.length) {
      html += `
        <div class="objectives-list">
          <strong style="display: block; margin-bottom: 0.5rem; color: var(--primary-color);">
            <i class="fas fa-bullseye"></i> اهداف این درس
          </strong>
          <ul style="padding-right: 1.25rem; margin: 0;">
            ${lesson.objectives.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // بخش‌های اصلی
    if (lesson.sections && lesson.sections.length) {
      lesson.sections.forEach(section => {
        html += `<h3>${section.heading}</h3>`;
        if (section.paragraphs) {
          section.paragraphs.forEach(p => {
            html += `<p>${p}</p>`;
          });
        }
      });
    }

    // واژه‌نامه (درس ۹)
    if (lesson.glossary && lesson.glossary.length) {
      html += `<h3>واژه‌نامه</h3>`;
      html += `<div style="display: grid; gap: 0.75rem;">`;
      lesson.glossary.forEach(item => {
        html += `
          <div style="background: #f8fafc; padding: 0.75rem 1rem; border-radius: 8px; border-right: 3px solid var(--secondary-color);">
            <strong style="color: var(--primary-color);">${item.term}</strong>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.95rem;">${item.definition}</p>
          </div>
        `;
      });
      html += `</div>`;
    }

    // مثال‌ها
    if (lesson.examples && lesson.examples.length) {
      html += `
        <h3><i class="fas fa-lightbulb" style="color: #f59e0b;"></i> مثال‌ها</h3>
        <ul style="background: #fffbeb; padding: 1rem 1.5rem; border-radius: 8px; border-right: 4px solid #f59e0b;">
          ${lesson.examples.map(e => `<li style="margin-bottom: 0.5rem;">${e}</li>`).join('')}
        </ul>
      `;
    }

    // نکات
    if (lesson.tips && lesson.tips.length) {
      html += `
        <h3><i class="fas fa-star" style="color: #3b82f6;"></i> نکات کاربردی</h3>
        <ul style="background: #eff6ff; padding: 1rem 1.5rem; border-radius: 8px; border-right: 4px solid #3b82f6;">
          ${lesson.tips.map(t => `<li style="margin-bottom: 0.5rem;">${t}</li>`).join('')}
        </ul>
      `;
    }

    // اشتباهات رایج
    if (lesson.commonMistakes && lesson.commonMistakes.length) {
      html += `
        <h3><i class="fas fa-exclamation-triangle" style="color: #dc2626;"></i> اشتباهات رایج</h3>
        <ul style="background: #fef2f2; padding: 1rem 1.5rem; border-radius: 8px; border-right: 4px solid #dc2626;">
          ${lesson.commonMistakes.map(m => `<li style="margin-bottom: 0.5rem;">${m}</li>`).join('')}
        </ul>
      `;
    }

    // تمرین
    if (lesson.exercise && lesson.exercise.length) {
      html += `
        <h3><i class="fas fa-pencil-alt" style="color: #7c3aed;"></i> تمرین</h3>
        <div style="background: #f5f3ff; padding: 1rem 1.5rem; border-radius: 8px; border-right: 4px solid #7c3aed;">
          ${lesson.exercise.map(e => `<p style="margin-bottom: 0.5rem;">${e}</p>`).join('')}
        </div>
      `;
    }

    // پاسخ نمونه
    if (lesson.answer && lesson.answer.length) {
      html += `
        <details style="margin-top: 1rem; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0; padding: 0.75rem 1rem;">
          <summary style="cursor: pointer; font-weight: 600; color: #166534;">
            <i class="fas fa-eye"></i> مشاهده پاسخ نمونه
          </summary>
          <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #bbf7d0;">
            ${lesson.answer.map(a => `<p>${a}</p>`).join('')}
          </div>
        </details>
      `;
    }

    // خلاصه
    if (lesson.summary && lesson.summary.length) {
      html += `
        <div class="summary-box" style="margin-top: 2rem;">
          <strong style="display: block; margin-bottom: 0.5rem; color: var(--primary-color);">
            <i class="fas fa-check-double"></i> خلاصه درس
          </strong>
          <ul style="padding-right: 1.25rem; margin: 0;">
            ${lesson.summary.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // کلمات کلیدی
    if (lesson.keywords && lesson.keywords.length) {
      html += `
        <div style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${lesson.keywords.map(k => `
            <span style="background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem;">
              ${k}
            </span>
          `).join('')}
        </div>
      `;
    }

    return html;
  }

  renderSimpleContent(lesson) {
    // برای فصل‌های ۲ به بعد که هنوز ساختار ساده دارند
    return lesson.content || '<p>محتوای این درس به‌زودی تکمیل می‌شود.</p>';
  }

  startQuiz() {
    const quiz = COURSE_DATA.quiz;
    if (!quiz || !quiz.length) return;

    const main = document.getElementById('content-area') || document.getElementById('main-content');
    if (!main) return;

    let currentQ = 0;
    const answers = [];

    const renderQuestion = () => {
      if (currentQ >= quiz.length) {
        // محاسبه نمره
        let score = 0;
        quiz.forEach((q, i) => {
          if (answers[i] === q.correct) score++;
        });

        this.state.quizResults[1] = { score, total: quiz.length };
        this.saveState();

        main.innerHTML = `
          <div class="lesson-detail" style="text-align: center;">
            <h2 style="color: var(--primary-color);">نتیجه آزمون فصل اول</h2>
            <div style="font-size: 3rem; margin: 1.5rem 0; color: ${score >= 7 ? '#16a34a' : '#dc2626'};">
              ${score} / ${quiz.length}
            </div>
            <p style="margin-bottom: 1.5rem;">
              ${score >= 8 ? 'عالی! مفاهیم فصل اول را خوب یاد گرفته‌اید.' :
                score >= 6 ? 'خوب است. بهتر است درس‌هایی که اشتباه پاسخ دادید را مرور کنید.' :
                'پیشنهاد می‌کنیم فصل اول را دوباره مرور کنید.'}
            </p>
            <button class="back-to-list-btn" id="btn-back-to-chapter" style="background: var(--primary-color); color: white; border: none;">
              بازگشت به فصل
            </button>
          </div>
        `;
        document.getElementById('btn-back-to-chapter').addEventListener('click', () => {
          this.renderChapter(1);
        });
        return;
      }

      const q = quiz[currentQ];
      main.innerHTML = `
        <div class="lesson-detail">
          <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
            <span style="color: var(--text-light);">سؤال ${currentQ + 1} از ${quiz.length}</span>
            <button class="back-to-list-btn" id="btn-cancel-quiz">انصراف</button>
          </div>
          <h3 style="margin-bottom: 1.5rem; line-height: 1.7;">${q.q}</h3>
          <div style="display: grid; gap: 0.75rem;">
            ${q.options.map((opt, i) => `
              <button class="quiz-option" data-index="${i}"
                style="text-align: right; padding: 1rem; border: 2px solid var(--border-color); border-radius: 10px; background: white; cursor: pointer; font-family: inherit; font-size: 0.95rem; transition: all 0.2s;">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      document.getElementById('btn-cancel-quiz').addEventListener('click', () => {
        this.renderChapter(1);
      });

      document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          answers[currentQ] = parseInt(btn.dataset.index);
          currentQ++;
          renderQuestion();
        });
        btn.addEventListener('mouseenter', () => {
          btn.style.borderColor = 'var(--primary-color)';
          btn.style.background = '#eff6ff';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.borderColor = 'var(--border-color)';
          btn.style.background = 'white';
        });
      });
    };

    renderQuestion();
  }

  attachEventListeners() {
    const chapterList = document.getElementById('chapter-list');
    if (chapterList) {
      chapterList.addEventListener('click', (e) => {
        const link = e.target.closest('.chapter-link');
        if (link) {
          e.preventDefault();
          const chapterId = parseInt(link.dataset.chapter);
          this.renderChapter(chapterId);
        }
      });
    }
  }

  attachChapterEventListeners() {
    document.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', () => {
        const lessonId = parseInt(card.dataset.lesson);
        const chapterId = parseInt(card.dataset.chapter);
        this.renderLesson(chapterId, lessonId);
      });
    });

    const startQuizBtn = document.querySelector('[data-action="start-quiz"]');
    if (startQuizBtn) {
      startQuizBtn.addEventListener('click', () => this.startQuiz());
    }

    const retakeBtn = document.querySelector('[data-action="retake-quiz"]');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        delete this.state.quizResults[1];
        this.saveState();
        this.startQuiz();
      });
    }
  }

  attachLessonEventListeners() {
    const backBtn = document.getElementById('btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.renderChapter(this.state.currentChapter);
      });
    }

    const bookmarkBtn = document.getElementById('btn-bookmark');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        const key = `${this.state.currentChapter}-${this.state.currentLesson}`;
        if (this.state.bookmarks.has(key)) {
          this.state.bookmarks.delete(key);
        } else {
          this.state.bookmarks.add(key);
        }
        this.saveState();
        this.renderLesson(this.state.currentChapter, this.state.currentLesson);
      });
    }

    const notesTextarea = document.getElementById('lesson-notes');
    if (notesTextarea) {
      let saveTimeout;
      notesTextarea.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          const key = `${this.state.currentChapter}-${this.state.currentLesson}`;
          this.state.notes[key] = notesTextarea.value;
          this.saveState();
        }, 500);
      });
    }

    document.querySelectorAll('.btn-prev, .btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const lessonId = parseInt(btn.dataset.lesson);
        this.renderLesson(this.state.currentChapter, lessonId);
      });
    });

    const completeBtn = document.querySelector('[data-action="complete"]');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        this.renderChapter(this.state.currentChapter);
      });
    }
  }
}

// راه‌اندازی برنامه
document.addEventListener('DOMContentLoaded', () => {
  new CourseApp();
});
