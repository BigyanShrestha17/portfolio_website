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

    // Only observe non-hero reveal elements (hero activates via setTimeout)
    const revealElements = document.querySelectorAll('.reveal:not(.hero .reveal)');
    revealElements.forEach(el => revealObserver.observe(el));


    // Typewriter Effect Logic
    const typingSpan = document.getElementById('typing-span');
    if (typingSpan) {
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
    }

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
        // Initialize EmailJS with your Public Key
        emailjs.init("60ZLajFqaVyMTTDxO");

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
