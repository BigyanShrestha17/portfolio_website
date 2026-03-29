document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animation Logic
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stop watching — animation fires once, no re-triggers on scroll-up
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.08
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Nav Link Highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const heroSection = document.querySelector('.hero');

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { 
        threshold: 0.2, // Lower threshold for better sensitivity
        rootMargin: "-20% 0px -70% 0px" // Focus on the top-middle part of the viewport
    });

    sections.forEach(section => activeLinkObserver.observe(section));

    // Clear active state when in hero section
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }, { threshold: 0.1 });

    if (heroSection) heroObserver.observe(heroSection);

    // Only observe non-hero reveal elements (hero activates via setTimeout)
    const revealElements = document.querySelectorAll('.reveal:not(.hero .reveal)');
    revealElements.forEach(el => revealObserver.observe(el));


    // Special handling for Hero section animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .reveal');
        heroElements.forEach(el => el.classList.add('active'));
    }, 100);

    // Scroll indicator fade-out — passive, removed once fully hidden
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
        const onScroll = () => {
            const opacity = Math.max(0, 1 - window.scrollY / 150);
            indicator.style.opacity = opacity;
            if (opacity === 0) {
                indicator.style.pointerEvents = 'none';
                indicator.style.visibility = 'hidden';
                // No need to keep listening once permanently hidden
                window.removeEventListener('scroll', onScroll);
            } else {
                indicator.style.pointerEvents = 'auto';
                indicator.style.visibility = 'visible';
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Smooth anchor scrolling (native)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // EmailJS Integration
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        // Consolidated EmailJS initialization
        emailjs.init("H2zGqK4dYpW5B7X9L");

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Send form using EmailJS
            emailjs.sendForm('service_435ha4l', 'template_62s2713', contactForm)
                .then(() => {
                    // Success
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                })
                .catch((error) => {
                    // Error
                    console.error('EmailJS Error:', error);
                    showNotification('Failed to send message. Please try again.', 'error');
                })
                .finally(() => {
                    // Restore button state
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                });
        });
    }

    // Modern Notification Helper
    function showNotification(message, type) {
        // Remove existing notification if any
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        notification.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
});
