// Tells the CSS that JS is running, so scroll-reveal never hides content without it
document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Mobile Navigation Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function setMenu(open) {
    navLinks.classList.toggle('active', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
}

hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));

// Close the menu on link tap, Escape, or when the screen grows past the menu breakpoint
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
window.matchMedia('(min-width: 1101px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

// ===== Scroll progress bar =====
const progress = document.getElementById('scrollProgress');
let ticking = false;

function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
    }
}, { passive: true });
updateProgress();

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
    '.section-kicker, .section-title, .about-content, .education-item, .skills-description, ' +
    '.resume-content, .experience-card, .project-card, .contact-content'
);
revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
} else {
    revealTargets.forEach(el => el.classList.add('visible'));
}

// ===== Active nav link =====
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

// ===== Typing effect =====
const typed = document.getElementById('typed');
const roles = ['software developer', 'game developer', 'problem-solver', 'builder'];

if (typed && !reducedMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = true;

    const step = () => {
        const role = roles[roleIndex];
        charIndex += isDeleting ? -1 : 1;
        typed.textContent = role.substring(0, charIndex);

        let delay = isDeleting ? 45 : 90;
        if (!isDeleting && charIndex === role.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }
        setTimeout(step, delay);
    };
    setTimeout(step, 2200);
}

// ===== Footer year =====
const footerText = document.querySelector('.footer-content p');
if (footerText) {
    footerText.textContent = `© ${new Date().getFullYear()} Arthur Clack. All rights reserved.`;
}
