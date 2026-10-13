/* MGS2-style codec call for the portfolio. Portraits are original drawings, not game assets. */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- contacts: each caller covers one section of the site ---------- */
    var PLAYER = { id: 'player', name: 'Visitor' };
    var CONTACTS = [
        { id: 'commander', name: 'Commander', freq: '140.85', tag: 'About', target: '#about', pages: [
            'This is Arthur Clack. Computer Science and Systems student at the University of Washington, graduating spring 2027.',
            'He builds games, web apps and tools. Right now he is aiming at embedded and safety-critical software.',
            'Outside of code: Muay Thai, working on cars, and guitar. Hit the button below for the full briefing.'
        ] },
        { id: 'medic', name: 'Medic', freq: '140.96', tag: 'Experience', target: '#experience', pages: [
            'Software Developer Intern at the University of Washington since July 2025.',
            'Before that he built an internal web app for 25,000+ Blue Origin employees, and drafted 600+ contracts at King County with zero compliance issues.',
            'Want the whole file? I can open it for you.'
        ] },
        { id: 'engineer', name: 'Engineer', freq: '141.52', tag: 'Skills', target: '#skills', pages: [
            'Languages first: C++, C#, Python, Go, TypeScript and JavaScript. He has shipped networked games in Unreal Engine and Godot.',
            'On the tooling side it is AWS, PostgreSQL, Blender, CAD and 3D printing. He is also a certified Scrum Master and AWS Cloud Practitioner.',
            'The full loadout is on the skills page.'
        ] },
        { id: 'operative', name: 'Operative', freq: '141.12', tag: 'Projects', target: '#projects', pages: [
            'His main mission is Shitbox Rally: a physics-based rally game in Godot with Steam multiplayer. Version 0.3.0 is out.',
            'There is also WA Commute Crash Risk, built on open data, plus ApplyBot, AUTO3D and RBR Codriver.',
            'Go see the hardware for yourself.'
        ] },
        { id: 'analyst', name: 'Analyst', freq: '140.15', tag: 'Contact', target: '#contact', pages: [
            'Arthur is open to software and embedded roles, internships and new-grad positions. Seattle or remote.',
            'You can reach him at arthurjamesclack@gmail.com, or on GitHub and LinkedIn.',
            'Do not go radio silent on him. Say hi!'
        ] }
    ];

    /* ---------- portraits: green three-tone sprites drawn in SVG ---------- */
    var EYES = '<g class="cdx-eyes"><rect class="k" x="36" y="45" width="10" height="3.4"/><rect class="k" x="54" y="45" width="10" height="3.4"/></g>';
    var BASE = {
        body: '<path class="m" d="M0 120 L0 102 Q8 88 34 83 L66 83 Q92 88 100 102 L100 120Z"/><rect class="d" x="42" y="68" width="16" height="18"/>',
        head: '<ellipse class="h" cx="50" cy="48" rx="22" ry="27"/><path class="m" d="M50 21 Q72 22 72 48 Q72 74 50 75 Q64 62 64 48 Q64 32 50 21Z" opacity=".55"/>',
        nose: '<path class="ln" d="M50 49 L47.5 57 L52.5 57"/>',
        mouth: '<rect class="k cdx-mouth" x="44" y="62" width="12" height="2"/>'
    };
    var EXTRAS = {
        player: {
            back: '<path class="d" d="M24 50 L18 84 L34 72Z M76 50 L82 84 L66 72Z"/>',
            front: '<path class="d" d="M25 50 Q20 12 52 14 Q82 16 76 48 Q70 30 54 30 Q42 32 38 50 Q32 36 25 50Z"/><rect class="k" x="38" y="42" width="9" height="2"/><rect class="k" x="54" y="42" width="9" height="2"/>',
            body: '<path class="h" d="M34 83 L50 96 L66 83 L62 83 L50 91 L38 83Z"/>'
        },
        operative: {
            back: '',
            front: '<path class="d" d="M26 42 L28 22 L38 27 L44 12 L52 24 L62 14 L68 28 L77 28 L74 42 Q50 30 26 42Z"/><path class="ln" style="stroke-width:3" d="M26 46 Q26 18 50 18 Q74 18 74 46"/><rect class="m" x="21" y="43" width="8" height="13"/><rect class="m" x="71" y="43" width="8" height="13"/><path class="ln" d="M75 56 Q72 66 60 66"/><rect class="k" x="37" y="43" width="10" height="2.4"/><rect class="k" x="54" y="43" width="10" height="2.4"/><path class="ln" d="M36 63 Q50 78 64 63" opacity=".7"/><path class="ln" d="M34 56 Q36 66 44 72 M66 56 Q64 66 56 72" opacity=".5"/>',
            body: '<path class="d" d="M20 100 L38 84 L40 120 L18 120Z M80 100 L62 84 L60 120 L82 120Z"/>'
        },
        engineer: {
            back: '',
            front: '<path class="d" d="M26 46 Q22 18 50 18 Q78 18 74 46 Q68 30 54 32 Q48 24 40 32 Q30 32 26 46Z"/><rect class="m" x="29" y="27" width="42" height="9"/><circle class="gl" cx="40" cy="31.5" r="4"/><circle class="gl" cx="60" cy="31.5" r="4"/>',
            body: '<path class="h" d="M30 83 L50 104 L70 83 L64 83 L50 98 L36 83Z"/><rect class="d" x="48" y="98" width="4" height="22"/>'
        },
        commander: {
            back: '',
            front: '<path class="d" d="M27 42 Q28 18 50 18 Q72 18 73 42 Q50 28 27 42Z"/><path class="ln" style="stroke-width:2.6" d="M35 40 L46 44 M65 40 L54 44"/><path class="ln" d="M36 58 Q40 62 41 66 M64 58 Q60 62 59 66 M43 38 L57 38" opacity=".8"/>',
            body: '<rect class="h" x="38" y="83" width="24" height="5"/><rect class="d" x="14" y="98" width="6" height="3"/><rect class="d" x="24" y="98" width="6" height="3"/><rect class="d" x="70" y="98" width="6" height="3"/>'
        },
        medic: {
            back: '<path class="d" d="M22 52 Q16 12 50 12 Q84 12 78 52 L84 104 L62 104 L66 60 L34 60 L38 104 L16 104Z"/>',
            front: '<path class="d" d="M26 44 Q34 20 50 20 Q66 20 74 44 Q60 32 50 38 Q40 32 26 44Z"/>',
            body: ''
        },
        analyst: {
            back: '<circle class="d" cx="28" cy="20" r="9"/><circle class="d" cx="72" cy="20" r="9"/><path class="d" d="M24 50 L20 80 L34 66Z M76 50 L80 80 L66 66Z"/>',
            front: '<path class="d" d="M25 48 Q24 22 50 20 Q76 22 75 48 Q64 34 50 36 Q36 34 25 48Z"/><path class="ln" d="M20 12 L36 28 M80 12 L64 28" stroke="#8bffa6" stroke-width="1.6"/>',
            body: ''
        }
    };
    function portrait(id) {
        var x = EXTRAS[id];
        return '<svg class="cdx-svg" viewBox="0 0 100 120" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' +
            BASE.body + x.body + '<g class="cdx-head">' + x.back + BASE.head + EYES + BASE.nose + BASE.mouth + x.front + '</g></svg>';
    }

    /* ---------- audio: a short square blip per letter, off by default ---------- */
    var audio = null, soundOn = false;
    function blip(freq, len) {
        if (!soundOn) return;
        try {
            audio = audio || new (window.AudioContext || window.webkitAudioContext)();
            var o = audio.createOscillator(), g = audio.createGain();
            o.type = 'square'; o.frequency.value = freq; g.gain.value = 0.015;
            o.connect(g); g.connect(audio.destination);
            o.start(); o.stop(audio.currentTime + len);
        } catch (e) { /* audio is optional */ }
    }

    /* ---------- build the DOM ---------- */
    var launch = el('button', 'cdx cdx-launch', '<i aria-hidden="true"></i>Call');
    launch.type = 'button';
    launch.setAttribute('aria-haspopup', 'dialog');
    launch.title = 'Open codec (C)';

    var overlay = el('div', 'cdx cdx-overlay');
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Codec call');
    overlay.innerHTML =
        '<div class="cdx-screen">' +
          '<div class="cdx-frame l"><div class="cdx-fig" id="cdxFigL"></div><div class="cdx-nameplate" id="cdxNameL"></div></div>' +
          '<div class="cdx-mid">' +
            '<small>FREQ</small>' +
            '<div class="cdx-freq" id="cdxFreq">---.--</div>' +
            '<div class="cdx-tune"><button type="button" id="cdxPrev" aria-label="Previous frequency">&#9664;</button><button type="button" id="cdxNext" aria-label="Next frequency">&#9654;</button></div>' +
            '<div class="cdx-bars" id="cdxBars" aria-hidden="true"></div>' +
            '<div class="cdx-led"><b id="cdxPtt">PTT</b><b id="cdxMem">MEM</b></div>' +
          '</div>' +
          '<div class="cdx-frame r"><div class="cdx-fig" id="cdxFigR"></div><div class="cdx-nameplate" id="cdxNameR"></div></div>' +
          '<div class="cdx-dlg" id="cdxDlg" tabindex="0" role="button" aria-live="polite" aria-label="Dialogue. Press to continue.">' +
            '<span class="cdx-who" id="cdxWho"></span><div class="cdx-text" id="cdxText"></div><span class="cdx-next" id="cdxMore" hidden>&#9660;</span>' +
          '</div>' +
          '<div class="cdx-ctl">' +
            '<button type="button" id="cdxMemory">Memory</button>' +
            '<button type="button" id="cdxSound" aria-pressed="false">Sound off</button>' +
            '<button type="button" id="cdxClose">Close</button>' +
            '<a class="cdx-go" id="cdxGo" href="#" hidden></a>' +
          '</div>' +
          '<div class="cdx-list" id="cdxList" hidden><h3>MEMORY</h3></div>' +
        '</div>';

    document.body.appendChild(launch);
    document.body.appendChild(overlay);

    function el(tag, cls, html) {
        var n = document.createElement(tag);
        n.className = cls;
        if (html) n.innerHTML = html;
        return n;
    }
    function $(id) { return document.getElementById(id); }

    var screen = overlay.querySelector('.cdx-screen');
    var bars = $('cdxBars');
    for (var b = 0; b < 9; b++) bars.appendChild(document.createElement('i'));

    var list = $('cdxList');
    CONTACTS.forEach(function (c, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = '<span>' + c.freq + '</span><span>' + c.name.toUpperCase() + '</span><span>' + c.tag.toUpperCase() + '</span>';
        btn.addEventListener('click', function () { list.hidden = true; connect(i); });
        list.appendChild(btn);
    });

    /* ---------- call logic ---------- */
    var index = 0, page = 0, typer = null, typing = false, lastFocus = null;
    var textEl = $('cdxText'), more = $('cdxMore'), go = $('cdxGo');

    function setFigure(slot, id, name, animate) {
        var fig = $('cdxFig' + slot);
        fig.innerHTML = portrait(id);
        fig.classList.remove('enter');
        if (animate && !reduceMotion) { void fig.offsetWidth; fig.classList.add('enter'); }
        $('cdxName' + slot).textContent = name;
    }

    function speak(side) {
        screen.querySelector('.cdx-frame.l').classList.toggle('speaking', side === 'l');
        screen.querySelector('.cdx-frame.r').classList.toggle('speaking', side === 'r');
    }

    function connect(i) {
        index = (i + CONTACTS.length) % CONTACTS.length;
        page = 0;
        var c = CONTACTS[index];
        $('cdxFreq').textContent = c.freq;
        $('cdxMem').classList.add('on');
        setFigure('L', PLAYER.id, PLAYER.name, true);
        setFigure('R', c.id, c.name, true);
        go.hidden = true;
        blip(1400, 0.12);
        showPage();
    }

    function showPage() {
        var c = CONTACTS[index];
        var line = c.pages[page];
        clearInterval(typer);
        $('cdxWho').textContent = c.name + ' > ' + c.tag;
        more.hidden = true;
        speak('r');
        screen.classList.add('talking');
        $('cdxPtt').classList.remove('on');
        if (reduceMotion) { textEl.textContent = line; endTyping(); return; }
        var n = 0;
        typing = true;
        textEl.textContent = '';
        typer = setInterval(function () {
            n++;
            textEl.textContent = line.slice(0, n);
            if (n % 2 === 0) blip(900 + (n % 5) * 60, 0.02);
            if (n >= line.length) endTyping();
        }, 24);
    }

    function endTyping() {
        clearInterval(typer);
        typing = false;
        screen.classList.remove('talking');
        speak(null);
        var c = CONTACTS[index];
        textEl.textContent = c.pages[page];
        var last = page >= c.pages.length - 1;
        more.hidden = last;
        if (last) {
            go.hidden = false;
            go.textContent = 'Go to ' + c.tag;
            go.setAttribute('href', c.target);
        }
    }

    function advance() {
        if (!list.hidden) return;
        var c = CONTACTS[index];
        if (typing) { endTyping(); return; }
        if (page < c.pages.length - 1) { page++; showPage(); blip(1100, 0.04); }
    }

    function openCodec() {
        lastFocus = document.activeElement;
        overlay.hidden = false;
        list.hidden = true;
        document.documentElement.style.overflow = 'hidden';
        // Re-trigger the screen-open animation each time
        screen.style.animation = 'none'; void screen.offsetWidth; screen.style.animation = '';
        connect(0);
        $('cdxDlg').focus();
    }

    function closeCodec() {
        clearInterval(typer);
        overlay.hidden = true;
        document.documentElement.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    /* ---------- events ---------- */
    launch.addEventListener('click', openCodec);
    $('cdxClose').addEventListener('click', closeCodec);
    $('cdxDlg').addEventListener('click', advance);
    $('cdxPrev').addEventListener('click', function () { list.hidden = true; connect(index - 1); });
    $('cdxNext').addEventListener('click', function () { list.hidden = true; connect(index + 1); });
    $('cdxMemory').addEventListener('click', function () {
        list.hidden = !list.hidden;
        if (!list.hidden) {
            var btns = list.querySelectorAll('button');
            btns.forEach(function (bt, k) { bt.setAttribute('aria-current', k === index ? 'true' : 'false'); });
            btns[index].focus();
        }
    });
    $('cdxSound').addEventListener('click', function () {
        soundOn = !soundOn;
        this.textContent = soundOn ? 'Sound on' : 'Sound off';
        this.setAttribute('aria-pressed', String(soundOn));
        blip(1200, 0.08);
    });
    go.addEventListener('click', function () { closeCodec(); });

    document.addEventListener('keydown', function (e) {
        if (overlay.hidden) {
            var tag = (e.target && e.target.tagName) || '';
            if ((e.key === 'c' || e.key === 'C') && !e.metaKey && !e.ctrlKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test(tag)) openCodec();
            return;
        }
        if (e.key === 'Escape') { closeCodec(); return; }
        if (e.target === $('cdxDlg') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); advance(); }
        if (e.key === 'ArrowRight') connect(index + 1);
        if (e.key === 'ArrowLeft') connect(index - 1);
        if (e.key === 'Tab') {
            // keep focus inside the codec
            var f = Array.prototype.filter.call(overlay.querySelectorAll('button, a[href], [tabindex="0"]'), function (n) { return n.offsetParent !== null; });
            if (!f.length) return;
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeCodec(); });
})();
