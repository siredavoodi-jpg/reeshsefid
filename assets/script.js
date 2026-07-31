/**
 * Reeshsefid Main Script
 * Handles theme toggling, mobile menu, and basic interactions safely.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Safe Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }

    function updateThemeIcon(isDark) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        const text = themeToggleBtn.querySelector('span');
        if (isDark) {
            icon.className = 'fas fa-sun';
            text.textContent = 'حالت روشن';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'حالت تاریک';
        }
    }

    // 2. Safe Dropdown Menu Toggle (for sidebar)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');
        
        if (link && dropdown) {
            link.addEventListener('click', (e) => {
                // Prevent default only if it's a dropdown toggle, not a real link
                if (link.getAttribute('href') === '#' || link.getAttribute('href') === 'javascript:void(0)') {
                    e.preventDefault();
                }
                item.classList.toggle('open');
            });
        }
    });

    // 3. Console greeting for developers
    console.log('%c باشگاه وکلای افرا ', 'background: #1976d2; color: white; padding: 4px 8px; border-radius: 4px;');
});
