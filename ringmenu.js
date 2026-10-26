/* Landing menu: original 3D ringworld (three.js) behind a glowing, centred menu.
   Menu picks jump to the matching section of the page; Projects shows cards in the menu itself. */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- content ---------- */
    // Each entry: [label, line 1, line 2, children?, url?]. 'target' jumps to a page section.
    var TREE = [
        { label: 'Projects', cards: true, target: '#projects' },
        { label: 'Experience', target: '#experience', l1: 'Where he has worked.', l2: 'UW, Blue Origin, King County.', kids: [
            ['UW', 'Software Developer Intern, July 2025 to now.', 'Go, TypeScript, PostgreSQL and AWS. Requirements to deployment on a web app for UW staff.'],
            ['Blue Origin', 'Security and Onsite IT Support, Sep 2024 to Jan 2025.', 'Built an internal web app tied to access-control systems, used by 25,000+ employees.'],
            ['King County', 'Contract Specialist Intern II, Mar to Dec 2023.', '600+ contracts with zero compliance issues. Led 4 interns on a compliance database.']
        ] },
        { label: 'Skills', target: '#skills', l1: 'Loadout.', l2: 'Languages, engines, tools.', kids: [
            ['Languages', 'C++, C#, Python, Go, TypeScript, JavaScript, Java, GDScript, SQL.', ''],
            ['Engines', 'Unreal Engine 4/5, Godot 4, Jolt Physics, Steamworks.', 'Leaflet and Node.js too.'],
            ['Tools', 'Git, AWS, PostgreSQL, Jira, Blender, CAD and 3D printing, Linux.', ''],
            ['Practices', 'Agile, networking and replication, physics simulation.', 'Procedural generation, shaders, requirements gathering.']
        ] },
        { label: 'About', target: '#about', l1: 'Briefing.', l2: 'Student, builder.', kids: [
            ['Bio', 'Computer Science and Systems at the University of Washington, class of 2027.', 'Heading toward embedded and safety-critical software.'],
            ['Education', 'B.S. Computer Science and Systems, UW, expected spring 2027.', 'A.A. Computer Science, Tacoma Community College, GPA 3.9.', null, '#education'],
            ['Hobbies', 'Muay Thai, working on cars, guitar.', '']
        ] },
        { label: 'Contact', target: '#contact', l1: 'Comms.', l2: 'Open to software and embedded roles.', kids: [
            ['Email', 'arthurjamesclack@gmail.com', 'Seattle or remote.', 'mailto:arthurjamesclack@gmail.com'],
            ['GitHub', 'github.com/ArthurJClack', 'Opens in a new tab.', 'https://github.com/ArthurJClack'],
            ['LinkedIn', 'linkedin.com/in/arthurclack333', 'Opens in a new tab.', 'https://www.linkedin.com/in/arthurclack333/']
        ] },
        { label: 'Resume', target: '#resume', l1: 'The one-pager.', l2: 'View it or download the PDF.' }
    ];

    var PROJECTS = [
        { n: 'Shitbox Rally', st: 'v0.7.6.4 released', d: 'A rally game about tired old cars on procedurally generated stages with a PS1/PS2-era look. Built from the physics up in Godot 4 with Jolt. 60 cars, a race track with laps, ECU tuning, Steam multiplayer, force-feedback wheels.', t: ['Godot 4', 'Jolt', 'Steamworks'], l: [['Download', 'https://github.com/ArthurJClack/shitboxrally-releases/releases/latest'], ['Code', 'https://github.com/ArthurJClack/shitbox-rally']] },
        { n: 'WA Commute Crash Risk', st: 'Live', d: 'Maps every fatal traffic crash in Washington from 2010 to 2024 using NHTSA data and estimates your odds of a crash on your own commute.', t: ['JavaScript', 'Leaflet', 'Open data'], l: [['Live app', 'https://arthurjclack.github.io/wa-commute-crash-risk/'], ['Code', 'https://github.com/ArthurJClack/wa-commute-crash-risk']] },
        { n: 'AUTO3D', st: 'In progress', d: 'A website for sharing 3D models of car parts, built for 3D printing and fabrication.', t: ['Web', 'CAD', '3D printing'], l: [['Code', 'https://github.com/ArthurJClack/AUTO3D']] },
        { n: 'wetwaresuite', st: 'In progress', d: 'An all-in-one, lightweight software suite: CAD, photo, paint, 3D, audio, video, office and a file toolkit as small standalone apps on one shared core. Offline, no account, drivable by Claude over MCP.', t: ['C++20', 'Rust', 'MCP'], l: [['Download', 'https://github.com/ArthurJClack/wetwaresuite/releases/latest'], ['Code', 'https://github.com/ArthurJClack/wetwaresuite']] },
        { n: 'Coming soon', st: '', d: 'Something new is in the garage. Check back shortly.', t: [], l: [], soon: true }
    ];

    /* ---------- DOM ---------- */
    function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html) n.innerHTML = html; return n; }

    var root = el('div', 'rm rm-overlay');
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Main menu');
    root.innerHTML =
        '<canvas class="rm-gl" aria-hidden="true"></canvas><div class="rm-shade"></div><div class="rm-scan"></div>' +
        '<div class="rm-ui"><h1>ARTHUR<br> CLACK</h1><div class="rm-sub">SOFTWARE DEVELOPER</div>' +
        '<div class="rm-menu" id="rmMenu"></div><div class="rm-panel" id="rmPanel"></div><div class="rm-cards" id="rmCards"></div></div>' +
        '<nav class="rm-quick" aria-label="Quick links"><a href="resume.pdf" target="_blank" rel="noopener">Resume</a><a href="mailto:arthurjamesclack@gmail.com">Email</a><a href="https://www.linkedin.com/in/arthurclack333/" target="_blank" rel="noopener">LinkedIn</a><a href="https://github.com/ArthurJClack" target="_blank" rel="noopener">GitHub</a></nav>' +
        '<div class="rm-gate" id="rmGate" role="button" tabindex="0" aria-label="Start"><b>ARTHUR CLACK</b><span>TAP TO START</span></div>';
    document.body.appendChild(root);

    var menu = root.querySelector('#rmMenu'), panel = root.querySelector('#rmPanel'), cardsEl = root.querySelector('#rmCards');
    var gate = root.querySelector('#rmGate'), sub = root.querySelector('.rm-sub');
    var stack = [], current = TREE, inCards = false, lastFocus = null;

    cardsEl.innerHTML = PROJECTS.map(function (p) {
        return '<div class="rm-card' + (p.soon ? ' soon' : '') + '"><h3>' + p.n + '</h3>' + (p.st ? '<div class="st">' + p.st + '</div>' : '') +
            '<p>' + p.d + '</p>' + (p.t.length ? '<div class="tg">' + p.t.map(function (x) { return '<i>' + x + '</i>'; }).join('') + '</div>' : '') +
            (p.l.length ? '<div class="ln">' + p.l.map(function (k) { return '<a href="' + k[1] + '" target="_blank" rel="noopener">' + k[0] + '</a>'; }).join('') + '</div>' : '') + '</div>';
    }).join('') + '<div style="grid-column:1/-1;text-align:center"><button type="button" class="rm-back" id="rmMore">Full details</button> <button type="button" class="rm-back" id="rmBack">Back</button></div>';

    /* ---------- menu logic ---------- */
    function itemLines(it) {
        if (it.kids && it.target && !it.l1) return ['', ''];
        return [it.l1 || it[1] || '', it.l2 || it[2] || ''];
    }
    function show(label, a, b, withCopy) {
        panel.innerHTML = '<h3></h3><p></p><p></p>';
        panel.querySelector('h3').textContent = label;
        var ps = panel.querySelectorAll('p');
        ps[0].textContent = a || ''; ps[1].textContent = b || '';
        if (withCopy) {
            var c = el('button', 'rm-copy', 'Copy address');
            c.type = 'button';
            c.onclick = function (e) {
                e.stopPropagation();
                var done = function () { c.textContent = 'Copied'; };
                try { navigator.clipboard.writeText(withCopy).then(done, function () { c.textContent = withCopy; }); } catch (x) { c.textContent = withCopy; }
            };
            panel.appendChild(c);
        }
    }
    function mark(node) { menu.querySelectorAll('button, a').forEach(function (x) { x.classList.toggle('on', x === node); }); }

    /* ---------- pages: the site's sections open as panels over the ring ---------- */
    var pages = document.getElementById('pages');
    var pageOpen = false;
    var bar = el('div', 'rm-pagebar');
    var pbBack = el('button', '', '\u25c4 Back');
    pbBack.type = 'button';
    bar.appendChild(pbBack);
    if (pages) pages.insertBefore(bar, pages.firstChild);

    var pushed = false;
    function openPage(node) {
        Array.prototype.forEach.call(pages.querySelectorAll('section'), function (s) { s.classList.toggle('on', s === node); });
        pages.classList.add('on');
        pages.scrollTop = 0;
        pageOpen = true;
        root.querySelector('.rm-ui').setAttribute('inert', '');
        pbBack.focus();
    }
    function hidePage() {
        pageOpen = false;
        pages.classList.remove('on');
        root.querySelector('.rm-ui').removeAttribute('inert');
        if (menu.firstChild) menu.firstChild.focus();
    }
    function goTo(target) {
        var node = pages && pages.querySelector(target);
        if (!node) return;
        if (location.hash !== target) { try { history.pushState(null, '', target); pushed = true; } catch (e) {} }
        openPage(node);
    }
    function closePage() {
        if (location.hash && pushed) { history.back(); return; }
        if (location.hash) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
        hidePage();
    }
    // deep links (#projects, #resume ...) and the browser back button
    function fromHash(fresh) {
        var node = null;
        try { node = pages && location.hash.length > 1 && pages.querySelector(location.hash); } catch (e) {}
        if (node && node.tagName === 'SECTION') { if (fresh) startGate(); openPage(node); }
        else if (pageOpen) hidePage();
    }
    window.addEventListener('popstate', function () { fromHash(false); });
    pbBack.addEventListener('click', closePage);

    function render(list, isSub) {
        menu.innerHTML = '';
        list.forEach(function (it) {
            var isArr = Array.isArray(it);
            var url = isArr ? it[3] : it.url;
            var label = isArr ? it[0] : it.label;
            var node = document.createElement(url ? 'a' : 'button');
            node.textContent = label;
            if (url) { node.href = url; if (url.indexOf('http') === 0) { node.target = '_blank'; node.rel = 'noopener'; } } else { node.type = 'button'; }
            var lines = isArr ? [it[1], it[2]] : itemLines(it);
            var preview = function () { mark(node); show(label, lines[0], lines[1], label === 'Email' ? 'arthurjamesclack@gmail.com' : null); };
            node.onmouseenter = node.onfocus = preview;
            if (!url) {
                node.onclick = function () {
                    preview();
                    if (isArr) { if (it[4]) goTo(it[4]); return; }
                    if (it.cards) { openCards(); return; }
                    if (it.kids) { stack.push(current); current = it.kids.concat([{ label: 'Open page', target: it.target, l1: 'Jump to this section of the site.', l2: '' }]); render(current, true); menu.firstChild.focus(); }
                    else if (it.target) { goTo(it.target); }
                };
            }
            // sub-menu entries that have a target (the "Open page" item) jump on click
            if (!isArr && it.target && !it.kids && !it.cards && !it.action) node.onclick = function () { goTo(it.target); };
            menu.appendChild(node);
        });
        if (isSub) {
            var bk = el('button', '', 'Back');
            bk.type = 'button';
            bk.onclick = back;
            bk.onmouseenter = bk.onfocus = function () { mark(bk); show('Back', 'Return to the main menu.', ''); };
            menu.appendChild(bk);
        }
        var first = menu.firstChild;
        mark(first);
        var l = Array.isArray(list[0]) ? [list[0][1], list[0][2]] : itemLines(list[0]);
        show(Array.isArray(list[0]) ? list[0][0] : list[0].label, l[0], l[1]);
    }

    function back() {
        if (inCards) { closeCards(); return; }
        if (!stack.length) return;
        current = stack.pop();
        render(current, stack.length > 0);
    }
    function openCards() {
        inCards = true;
        menu.style.display = 'none'; panel.style.display = 'none'; sub.style.display = 'none';
        cardsEl.classList.add('on');
        root.querySelector('.rm-card a, #rmBack').focus();
    }
    function closeCards() {
        inCards = false;
        menu.style.display = ''; panel.style.display = ''; sub.style.display = '';
        cardsEl.classList.remove('on');
        if (menu.firstChild) menu.firstChild.focus();
    }
    root.querySelector('#rmBack').onclick = closeCards;

    function startGate() {
        gate.classList.add('off');
        root.classList.add('rm-started');
        zoom = 1;
        if (menu.firstChild) menu.firstChild.focus();
    }
    gate.addEventListener('click', startGate);
    gate.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startGate(); } });
    root.querySelector('#rmMore').onclick = function () { goTo('#projects'); };
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { if (pageOpen) closePage(); else if (inCards || stack.length) back(); return; }
        if (e.key === 'Tab') {
            var f = Array.prototype.filter.call((pageOpen ? pages : root).querySelectorAll('button, a[href], input, textarea, video[tabindex], [tabindex="0"]'), function (n) { return n.offsetParent !== null; });
            if (!f.length) return;
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    /* ---------- 3D ring ---------- */
    var renderer, scene, cam, ring, planet, rafId = 0, t0 = 0, px = 0, py = 0, tx = 0, ty = 0, zoom = 0, ready = false;

    function buildScene() {
        if (ready || !window.THREE) return;
        var THREE = window.THREE, cv = root.querySelector('.rm-gl');
        try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e) { return; }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        scene = new THREE.Scene(); scene.background = new THREE.Color(0x02060a);
        cam = new THREE.PerspectiveCamera(48, 1, .1, 400);

        // stars
        var sp = [], i;
        for (i = 0; i < 1600; i++) {
            var u = Math.random() * 2 - 1, t = Math.random() * 6.283, s = Math.sqrt(1 - u * u), R = 120 + Math.random() * 60;
            sp.push(R * s * Math.cos(t), R * u, R * s * Math.sin(t));
        }
        var sg = new THREE.BufferGeometry();
        sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
        scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xcfe8ff, size: .7, sizeAttenuation: false })));

        // painted ring surface
        var tc = document.createElement('canvas'); tc.width = 2048; tc.height = 128;
        var x = tc.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 128);
        g.addColorStop(0, '#1d4a3a'); g.addColorStop(.5, '#2f6b4a'); g.addColorStop(1, '#1b3f5a');
        x.fillStyle = g; x.fillRect(0, 0, 2048, 128);
        for (i = 0; i < 500; i++) {
            var cx = Math.random() * 2048, cy = Math.random() * 128, rr = 4 + Math.random() * 28, c = Math.random();
            x.fillStyle = c < .35 ? 'rgba(180,210,170,.18)' : c < .7 ? 'rgba(20,70,110,.35)' : 'rgba(255,255,255,.12)';
            x.beginPath(); x.ellipse(cx, cy, rr * 2.2, rr * .6, 0, 0, 6.283); x.fill();
        }
        for (i = 0; i < 6; i++) { x.fillStyle = 'rgba(8,20,30,.55)'; x.fillRect(0, i * 22 + 4, 2048, 2); }
        var tex = new THREE.CanvasTexture(tc); tex.wrapS = THREE.RepeatWrapping; tex.repeat.set(3, 1); tex.anisotropy = 4;

        ring = new THREE.Group();
        var RR = 8, H = 1.5;
        var inner = new THREE.Mesh(new THREE.CylinderGeometry(RR, RR, H, 200, 1, true), new THREE.MeshStandardMaterial({ map: tex, side: THREE.BackSide, roughness: .85, emissive: 0x0c2a3c, emissiveMap: tex, emissiveIntensity: .6 }));
        var outer = new THREE.Mesh(new THREE.CylinderGeometry(RR + .35, RR + .35, H, 200, 1, true), new THREE.MeshStandardMaterial({ color: 0x5a6c78, metalness: .8, roughness: .35, side: THREE.FrontSide }));
        ring.add(inner, outer);
        [H / 2, -H / 2].forEach(function (y) {
            var cap = new THREE.Mesh(new THREE.RingGeometry(RR, RR + .35, 200, 1), new THREE.MeshStandardMaterial({ color: 0x8aa2b2, metalness: .85, roughness: .3, side: THREE.DoubleSide }));
            cap.rotation.x = -Math.PI / 2; cap.position.y = y; ring.add(cap);
            var lip = new THREE.Mesh(new THREE.TorusGeometry(RR + .17, .05, 8, 240), new THREE.MeshBasicMaterial({ color: 0x9fe4ff }));
            lip.rotation.x = Math.PI / 2; lip.position.y = y; ring.add(lip);
        });
        ring.rotation.x = 1.18; ring.rotation.z = -.22; ring.position.set(0, .4, -2);
        scene.add(ring);

        // gas giant with glow
        planet = new THREE.Mesh(new THREE.SphereGeometry(3.2, 48, 32), new THREE.MeshStandardMaterial({ color: 0xd7a063, roughness: 1, emissive: 0x2a1608, emissiveIntensity: .8 }));
        planet.position.set(-14, 7, -40); scene.add(planet);
        var gc = document.createElement('canvas'); gc.width = gc.height = 128;
        var gx = gc.getContext('2d'), gr = gx.createRadialGradient(64, 64, 4, 64, 64, 64);
        gr.addColorStop(0, 'rgba(255,200,130,.55)'); gr.addColorStop(1, 'rgba(255,200,130,0)');
        gx.fillStyle = gr; gx.fillRect(0, 0, 128, 128);
        var glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), blending: THREE.AdditiveBlending, depthWrite: false }));
        glow.scale.set(15, 15, 1); glow.position.copy(planet.position); scene.add(glow);
        scene.add(new THREE.AmbientLight(0x4a6a80, .9));
        var sun = new THREE.DirectionalLight(0xfff0d8, 1.6); sun.position.set(8, 6, 10); scene.add(sun);
        ready = true;
        resize();
    }
    function baseZ() { return (window.innerWidth / window.innerHeight < .8 ? 26 : 20) - zoom * 5; }
    function resize() {
        if (!ready) return;
        var w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); cam.position.z = baseZ();
    }
    function frame() {
        rafId = requestAnimationFrame(frame);
        var t = (performance.now() - t0) / 1000;
        px += (tx - px) * .04; py += (ty - py) * .04;
        ring.rotation.y = reduceMotion ? 0 : t * .1;
        cam.position.z += (baseZ() - cam.position.z) * .03;
        cam.position.x = px * 2.2 + (reduceMotion ? 0 : Math.sin(t * .07) * .8);
        cam.position.y = -py * 1.4 + (reduceMotion ? 0 : Math.cos(t * .05) * .4);
        cam.lookAt(0, 0, -2);
        planet.rotation.y = t * .02;
        renderer.render(scene, cam);
    }
    function startRender() { buildScene(); if (ready && !rafId) { t0 = performance.now(); frame(); } }
    function stopRender() { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function (e) { tx = e.clientX / window.innerWidth * 2 - 1; ty = e.clientY / window.innerHeight * 2 - 1; });

    /* ---------- boot ---------- */
    render(TREE, false);
    startRender();
    fromHash(true);
}());
