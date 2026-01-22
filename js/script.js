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
        threshold: 0.05 // Trigger when 5% of element is visible
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

    // Typewriter Effect Logic
    const typingSpan = document.getElementById('typing-span');
    const textToType = "World!";
    let isDeleting = false;
    let textIndex = 0;
    let typeSpeed = 150;

    function type() {
        const currentText = textToType.substring(0, textIndex);
        typingSpan.textContent = currentText;

        if (!isDeleting && textIndex < textToType.length) {
            textIndex++;
            typeSpeed = 150;
        } else if (isDeleting && textIndex > 0) {
            textIndex--;
            typeSpeed = 100;
        } else if (!isDeleting && textIndex === textToType.length) {
            isDeleting = true;
            typeSpeed = 2000; // Wait before deleting
        } else if (isDeleting && textIndex === 0) {
            isDeleting = false;
            typeSpeed = 500; // Wait before starting again
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing after a short delay
    setTimeout(type, 1000);

    // Special handling for Hero section animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .reveal');
        heroElements.forEach(el => el.classList.add('active'));
    }, 100);
});
