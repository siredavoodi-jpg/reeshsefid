// مدیریت منوی کشویی سطح ۱
document.querySelectorAll('.toggle-dropdown').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('open');
    });
});

// مدیریت منوی کشویی سطح ۲ (Sub-dropdown)
document.querySelectorAll('.toggle-sub-dropdown').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = toggle.parentElement;
        parent.classList.toggle('open');
    });
});

// مدیریت حالت تاریک
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon(true);
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
});

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    if (isDark) {
        icon.className = 'fas fa-sun';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> حالت روشن';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> حالت تاریک';
    }
}
