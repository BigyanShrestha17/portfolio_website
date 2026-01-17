document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animation Logic
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once section is revealed, we can stop observing it
                // observer.unobserve(entry.target); 
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15 // Trigger when 15% of element is visible
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        // Save preference
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });

    // Special handling for Hero section to ensure it plays immediately
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .reveal');
        heroElements.forEach(el => el.classList.add('active'));
    }, 100);
});
