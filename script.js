// ===== Auto-download resume on page load =====
window.addEventListener('load', () => {
    const link = document.createElement('a');
    link.href = 'resume.pdf';
    link.download = 'Arthur_Clack_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// ===== Resume Banner Control =====
const resumeBanner = document.getElementById('resumeBanner');
const closeBanner = document.getElementById('closeBanner');

if (closeBanner) {
    closeBanner.addEventListener('click', () => {
        resumeBanner.classList.add('hidden');
        localStorage.setItem('resumeBannerClosed', 'true');
    });
}

// Don't show banner if user already closed it
if (localStorage.getItem('resumeBannerClosed') === 'true') {
    resumeBanner.classList.add('hidden');
}

// ===== Mobile Navigation Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Navbar Background on Scroll =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});


// ===== Scroll Animation for Sections =====
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Apply fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(section);
});

// Don't animate hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.style.opacity = '1';
    heroSection.style.transform = 'translateY(0)';
}

// ===== Contact Form Handling =====
// Form is handled by Formspree service (https://formspree.io)
// Emails will be sent to arthurjamesclack@gmail.com
// Note: You need to set up a Formspree account and get your form ID

// ===== Typing Effect for Hero Section =====
const roles = ['Student', 'Problem-Solver', 'Quick Learner', 'Innovator'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const taglineElement = document.querySelector('.tagline');

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    // Update the text (preserve " | " parts)
    const parts = taglineElement.textContent.split(' | ');
    parts[0] = currentRole.substring(0, charIndex);
    taglineElement.textContent = parts.join(' | ');

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// ===== Parallax Effect for Hero Section =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== Dynamic Year in Footer =====
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-content p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Arthur Clack. All rights reserved.`;
}

// ===== Active Navigation Link on Scroll =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


// ===== Console Message =====
console.log('%c👋 Welcome to my Portfolio!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cFeel free to explore the code and reach out if you have any questions!', 'font-size: 14px; color: #8b5cf6;');
