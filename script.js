// Tells the CSS that JS is running, so scroll-reveal never hides content without it
document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
    '.section-kicker, .section-title, .about-content, .education-item, .skills-description, ' +
    '.resume-content, .experience-card, .project-card, .skills-group, .about-facts, .contact-content'
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

// ===== Active HUD link =====
const navAnchors = document.querySelectorAll('.hud-nav a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => {
                const on = a.getAttribute('href') === `#${entry.target.id}`;
                a.classList.toggle('active', on);
                if (on && a.scrollIntoView) a.parentElement.scrollTo({ left: a.offsetLeft - 40, behavior: 'auto' });
            });
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

// ===== Typing effect =====
const typed = document.getElementById('typed');
const roles = ['software developer', 'game developer', 'builder'];

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
