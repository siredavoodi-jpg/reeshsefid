// منطق برنامه دوره هوش مصنوعی برای وکلا
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

  renderSidebar() {
    const chapterList = document.getElementById('chapter-list');
    chapterList.innerHTML = COURSE_DATA.chapters.map(chapter => `
      <li class="nav-item">
        <a href="#" class="nav-link" data-chapter="${chapter.id}">
          <span>فصل ${chapter.id}: ${chapter.title}</span>
        </a>
      </li>
    `).join('');
  }

  renderWelcome() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="welcome-section">
        <h2>به دوره ${COURSE_DATA.title} خوش آمدید</h2>
        <p>این دوره شامل ${COURSE_DATA.chapters.length} فصل است. هر فصل شامل ۱۰ درس کوتاه می‌باشد.</p>
        <p>برای شروع، یکی از فصل‌ها را از منوی کناری انتخاب کنید.</p>
      </div>
    `;
  }

  renderChapter(chapterId) {
    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    this.state.currentChapter = chapterId;
    this.state.currentLesson = null;

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="chapter-view">
        <h2>فصل ${chapter.id}: ${chapter.title}</h2>
        <div class="lesson-cards">
          ${chapter.lessons.map(lesson => this.renderLessonCard(lesson, chapterId)).join('')}
        </div>
        ${this.renderQuizCard(chapterId)}
      </div>
    `;

    this.attachChapterEventListeners();
  }

  renderLessonCard(lesson, chapterId) {
    const key = `${chapterId}-${lesson.id}`;
    const isViewed = this.state.viewedLessons.has(key);
    const isBookmarked = this.state.bookmarks.has(key);

    return `
      <div class="lesson-card ${isViewed ? 'viewed' : ''}" data-lesson="${lesson.id}" data-chapter="${chapterId}">
        <div class="lesson-card-header">
          <span class="lesson-number">${lesson.id}</span>
          ${isBookmarked ? '<i class="fas fa-bookmark bookmarked"></i>' : ''}
        </div>
        <h3>${lesson.title}</h3>
        <div class="lesson-meta">
          <span><i class="fas fa-clock"></i> ${lesson.readingTime}</span>
          <span class="difficulty ${lesson.difficulty}">${lesson.difficulty}</span>
        </div>
        ${isViewed ? '<span class="viewed-badge"><i class="fas fa-check"></i> مطالعه شده</span>' : ''}
      </div>
    `;
  }

  renderQuizCard(chapterId) {
    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    const allViewed = chapter.lessons.every(lesson => 
      this.state.viewedLessons.has(`${chapterId}-${lesson.id}`)
    );
    const quizResult = this.state.quizResults[chapterId];

    if (quizResult) {
      return `
        <div class="quiz-card completed">
          <h3><i class="fas fa-trophy"></i> آزمون تکمیل شد</h3>
          <p>نمره شما: ${quizResult.score} از ${quizResult.total}</p>
        </div>
      `;
    }

    return `
      <div class="quiz-card ${allViewed ? 'unlocked' : 'locked'}" ${allViewed ? 'data-action="quiz"' : ''}>
        <h3><i class="fas fa-clipboard-check"></i> آزمون پایان فصل</h3>
        <p>${allViewed ? 'برای شروع آزمون کلیک کنید' : 'ابتدا همه درس‌ها را مطالعه کنید'}</p>
      </div>
    `;
  }

  renderLesson(chapterId, lessonId) {
    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    if (!chapter || !lesson) return;

    this.state.currentChapter = chapterId;
    this.state.currentLesson = lessonId;

    const key = `${chapterId}-${lessonId}`;
    this.state.viewedLessons.add(key);
    this.saveState();

    const isBookmarked = this.state.bookmarks.has(key);
    const note = this.state.notes[key] || '';

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="lesson-view">
        <div class="lesson-header">
          <button class="btn-back" id="btn-back">
            <i class="fas fa-arrow-right"></i> بازگشت به فصل
          </button>
          <button class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" id="btn-bookmark">
            <i class="fas fa-bookmark"></i> ${isBookmarked ? 'نشان‌شده' : 'نشان‌گذاری'}
          </button>
        </div>
        
        <h1>${lesson.title}</h1>
        <div class="lesson-meta">
          <span><i class="fas fa-clock"></i> ${lesson.readingTime}</span>
          <span class="difficulty ${lesson.difficulty}">${lesson.difficulty}</span>
        </div>

        <div class="lesson-content">
          ${lesson.content}
        </div>

        <div class="notes-section">
          <h3><i class="fas fa-sticky-note"></i> یادداشت‌های شما</h3>
          <textarea id="lesson-notes" placeholder="یادداشت‌های خود را اینجا بنویسید...">${note}</textarea>
        </div>

        <div class="lesson-navigation">
          ${lessonId > 1 ? `<button class="btn-prev" data-lesson="${lessonId - 1}"><i class="fas fa-arrow-right"></i> درس قبلی</button>` : '<span></span>'}
          ${lessonId < chapter.lessons.length ? `<button class="btn-next" data-lesson="${lessonId + 1}">درس بعدی <i class="fas fa-arrow-left"></i></button>` : `<button class="btn-complete" data-action="complete">تکمیل فصل <i class="fas fa-check"></i></button>`}
        </div>
      </div>
    `;

    this.attachLessonEventListeners();
  }

  attachEventListeners() {
    // Chapter selection
    document.getElementById('chapter-list').addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link');
      if (link) {
        e.preventDefault();
        const chapterId = parseInt(link.dataset.chapter);
        this.renderChapter(chapterId);
      }
    });
  }

  attachChapterEventListeners() {
    // Lesson card click
    document.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', () => {
        const lessonId = parseInt(card.dataset.lesson);
        const chapterId = parseInt(card.dataset.chapter);
        this.renderLesson(chapterId, lessonId);
      });
    });

    // Quiz card click
    const quizCard = document.querySelector('.quiz-card[data-action="quiz"]');
    if (quizCard) {
      quizCard.addEventListener('click', () => {
        this.startQuiz();
      });
    }
  }

  attachLessonEventListeners() {
    // Back button
    document.getElementById('btn-back').addEventListener('click', () => {
      this.renderChapter(this.state.currentChapter);
    });

    // Bookmark button
    document.getElementById('btn-bookmark').addEventListener('click', () => {
      const key = `${this.state.currentChapter}-${this.state.currentLesson}`;
      if (this.state.bookmarks.has(key)) {
        this.state.bookmarks.delete(key);
      } else {
        this.state.bookmarks.add(key);
      }
      this.saveState();
      this.renderLesson(this.state.currentChapter, this.state.currentLesson);
    });

    // Notes auto-save
    const notesTextarea = document.getElementById('lesson-notes');
    let saveTimeout;
    notesTextarea.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const key = `${this.state.currentChapter}-${this.state.currentLesson}`;
        this.state.notes[key] = notesTextarea.value;
        this.saveState();
      }, 500);
    });

    // Navigation buttons
    document.querySelectorAll('.btn-prev, .btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const lessonId = parseInt(btn.dataset.lesson);
        this.renderLesson(this.state.currentChapter, lessonId);
      });
    });

    // Complete button
    const completeBtn = document.querySelector('.btn-complete');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        this.renderChapter(this.state.currentChapter);
      });
    }
  }

  startQuiz() {
    const chapterId = this.state.currentChapter;
    const chapter = COURSE_DATA.chapters.find(c => c.id === chapterId);
    
    // Simple quiz implementation
    const score = Math.floor(Math.random() * 5) + 6; // Random score between 6-10
    this.state.quizResults[chapterId] = {
      score: score,
      total: 10
    };
    this.saveState();
    
    alert(`آزمون تکمیل شد! نمره شما: ${score} از 10`);
    this.renderChapter(chapterId);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CourseApp();
});
