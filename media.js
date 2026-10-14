// Footage loads only when it scrolls near the screen, and plays only while it's on screen.
(function () {
    'use strict';

    var videos = document.querySelectorAll('.sr-video');
    if (!videos.length) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function load(video) {
        if (video.dataset.loaded) return;
        video.querySelectorAll('source[data-src]').forEach(function (s) { s.src = s.dataset.src; });
        video.dataset.loaded = '1';
        video.load();
    }

    // Reduced motion: no autoplay, the viewer starts clips with the native controls.
    if (reducedMotion || !('IntersectionObserver' in window)) {
        videos.forEach(function (v) { v.controls = true; v.preload = 'metadata'; load(v); });
    } else {
        var near = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { load(e.target); near.unobserve(e.target); }
            });
        }, { rootMargin: '300px 0px' });

        var onScreen = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    load(e.target);
                    var p = e.target.play();
                    if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays */ });
                } else {
                    e.target.pause();
                }
            });
        }, { threshold: 0.35 });

        videos.forEach(function (v) { near.observe(v); onScreen.observe(v); });
    }

    // Hero clip has game audio; it starts muted and this button toggles it.
    var hero = document.querySelector('.sr-video[data-hero]');
    var btn = document.querySelector('.sr-sound');
    if (hero && btn) {
        btn.addEventListener('click', function () {
            hero.muted = !hero.muted;
            if (!hero.muted) { load(hero); hero.play().catch(function () {}); }
            btn.setAttribute('aria-pressed', String(!hero.muted));
            btn.querySelector('i').className = hero.muted ? 'fas fa-volume-xmark' : 'fas fa-volume-high';
            btn.querySelector('span').textContent = hero.muted ? 'Sound off' : 'Sound on';
        });
    }
})();
