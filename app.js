// Quiz IT – kaartdata (grenzen, steden, locaties) staat in map-data.js (MAP_DATA).
const $ = (s) => document.querySelector(s);
const SVG_NS = 'http://www.w3.org/2000/svg';
const REGIONS = { europe: 'Europa', world: 'Wereld' };
const CATEGORIES = { landen: 'Landen', hoofdsteden: 'Hoofdsteden', buurlanden: 'Buurlanden', locaties: 'Locaties' };
const HINT_COST = 75;
// Afstandsdrempels in km: [uitstekend, dichtbij, in de buurt]
const DISTANCE_STEPS = { europe: [70, 180, 350], world: [300, 800, 1600] };

const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* opslag niet beschikbaar */ } }
};
const settings = { theme: 'system', sound: true, hints: true, difficulty: 1, ...store.get('quizit.settings', {}) };

// ---------- Thema ----------
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && darkQuery.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
darkQuery.addEventListener('change', applyTheme);
applyTheme();
let records = store.get('quizit.best', {});

const state = {
    region: 'europe', category: 'landen', rounds: 10,
    active: false, answered: false, hintUsed: false,
    questions: [], index: 0, score: 0, streak: 0, maxStreak: 0, correct: 0
};
const view = { w: 1000, h: 750, zoom: 1, panX: 0, panY: 0, countries: {}, markers: { player: [0, 0], target: [0, 0] } };

// ---------- Geluid ----------
const audio = {
    ctx: null,
    play(freqs, type, step, length, volume) {
        if (!settings.sound) return;
        this.ctx ||= new (window.AudioContext || window.webkitAudioContext)();
        const t0 = this.ctx.currentTime;
        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator(), gain = this.ctx.createGain(), t = t0 + i * step;
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(volume, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + length);
            osc.connect(gain).connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + length);
        });
    },
    correct() { this.play([523.25, 659.25], 'sine', 0.12, 0.25, 0.2); },
    wrong() { this.play([220, 160], 'sawtooth', 0.12, 0.25, 0.15); },
    finish() { this.play([523.25, 659.25, 783.99, 1046.5], 'triangle', 0.12, 0.3, 0.15); }
};

// ---------- Kaart ----------
function setRegion(region) {
    state.region = region;
    const data = MAP_DATA[region];
    view.w = data.w;
    view.h = data.h;
    $('#map').setAttribute('viewBox', `0 0 ${data.w} ${data.h}`);
    $('#sea').setAttribute('width', data.w);
    $('#sea').setAttribute('height', data.h);
    const group = $('#countries');
    group.replaceChildren();
    view.countries = {};
    for (const c of data.countries) {
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', c.d);
        path.dataset.c = colorIndex(c.i);
        group.append(path);
        view.countries[c.i] = path;
    }
    $('#region-label').textContent = REGIONS[region];
    resetView();
    clearMarks();
}

// Vaste kleur per land (zes tinten uit het palet), zodat de kaart er levendig uitziet.
function colorIndex(id) {
    let h = 0;
    for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) % 997;
    return h % 6;
}

function countryAt(x, y) {
    const point = new DOMPoint(x, y);
    return Object.keys(view.countries).find((id) => view.countries[id].isPointInFill(point)) ?? null;
}

function viewportPoint(e) {
    const ctm = $('#viewport').getScreenCTM();
    return new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
}

// SVG-elementen hebben geen `.hidden`-property, dus het attribuut zelf aan/uit zetten.
function setShown(el, shown) { el.toggleAttribute('hidden', !shown); }

function clearMarks() {
    Object.values(view.countries).forEach((el) => el.classList.remove('target', 'wrong'));
    ['#pin-player', '#pin-target', '#link', '#hint-circle'].forEach((s) => setShown($(s), false));
}

function placePin(which, x, y) {
    view.markers[which] = [x, y];
    setShown($(`#pin-${which}`), true);
    refreshPins();
}

function refreshPins() {
    for (const which of ['player', 'target']) {
        const [x, y] = view.markers[which];
        $(`#pin-${which}`).setAttribute('transform', `translate(${x} ${y}) scale(${1 / view.zoom})`);
    }
}

function applyView() {
    $('#viewport').setAttribute('transform', `translate(${view.panX} ${view.panY}) scale(${view.zoom})`);
    refreshPins();
}

function clampPan() {
    view.panX = Math.min(0, Math.max(view.w * (1 - view.zoom), view.panX));
    view.panY = Math.min(0, Math.max(view.h * (1 - view.zoom), view.panY));
}

function zoomBy(factor, cx = view.w / 2, cy = view.h / 2) {
    const next = Math.min(8, Math.max(1, view.zoom * factor));
    const k = next / view.zoom;
    view.panX = cx - (cx - view.panX) * k;
    view.panY = cy - (cy - view.panY) * k;
    view.zoom = next;
    clampPan();
    applyView();
}

function resetView() {
    Object.assign(view, { zoom: 1, panX: 0, panY: 0 });
    applyView();
}

function setupMapInput() {
    const svg = $('#map');
    let drag = null;
    svg.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, panX: view.panX, panY: view.panY, moved: false }; });
    svg.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) < 6) return;
        drag.moved = true;
        const rect = svg.getBoundingClientRect();
        const unit = Math.max(view.w / rect.width, view.h / rect.height);
        view.panX = drag.panX + dx * unit;
        view.panY = drag.panY + dy * unit;
        clampPan();
        applyView();
    });
    const release = (e) => {
        if (drag && !drag.moved && e.type === 'pointerup') handleMapClick(e);
        drag = null;
    };
    svg.addEventListener('pointerup', release);
    svg.addEventListener('pointercancel', release);
    svg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
        zoomBy(e.deltaY < 0 ? 1.2 : 1 / 1.2, p.x, p.y);
    }, { passive: false });
    $('#zoom-in').addEventListener('click', () => zoomBy(1.4));
    $('#zoom-out').addEventListener('click', () => zoomBy(1 / 1.4));
    $('#zoom-reset').addEventListener('click', resetView);
}

// ---------- Vragen ----------
function buildPool(region, category) {
    const data = MAP_DATA[region];
    switch (category) {
        case 'landen':
            return data.quiz.map((c) => ({ kind: 'country', text: `${c.f} Waar ligt ${c.n}?`, name: c.n, answers: [c.i], at: c.p }));
        case 'hoofdsteden':
            return data.quiz.filter((c) => c.cp).map((c) => ({ kind: 'point', text: `Waar ligt ${c.c}?`, sub: `${c.f} ${c.n}`, name: c.c, at: c.cp }));
        case 'buurlanden':
            return data.quiz.filter((c) => c.b.length).map((c) => ({ kind: 'country', text: `${c.f} Welk land grenst aan ${c.n}?`, sub: 'Elk grenzend land is goed.', name: c.n, answers: c.b, at: c.p }));
        case 'locaties':
            return data.spots.map((s) => ({ kind: 'point', text: `Waar ligt ${s.n}?`, sub: s.w, name: s.n, at: s.p }));
        default:
            return [];
    }
}

function shuffle(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function startRound() {
    const pool = buildPool(state.region, state.category);
    const count = state.rounds === 'all' ? pool.length : Math.min(state.rounds, pool.length);
    Object.assign(state, { active: true, questions: shuffle(pool).slice(0, count), index: 0, score: 0, streak: 0, maxStreak: 0, correct: 0 });
    setRegion(state.region);
    $('#idle').hidden = true;
    $('#quiz').hidden = false;
    $('#stats').hidden = false;
    loadQuestion();
}

function loadQuestion() {
    const q = state.questions[state.index];
    Object.assign(state, { answered: false, hintUsed: false });
    clearMarks();
    $('#q-meta').textContent = `${CATEGORIES[state.category]} · vraag ${state.index + 1} van ${state.questions.length}`;
    $('#q-text').textContent = q.text;
    $('#q-sub').textContent = q.sub || '';
    setFeedback('Klik op de kaart om te antwoorden.');
    $('#btn-next').hidden = true;
    $('#btn-hint').hidden = !settings.hints;
    updateStats();
}

function setFeedback(text, tone = '') {
    const el = $('#feedback');
    el.textContent = text;
    el.className = `feedback ${tone}`.trim();
}

function updateStats() {
    $('#stat-score').textContent = state.score;
    $('#stat-streak').textContent = `${state.streak}×`;
    $('#stat-round').textContent = `${Math.min(state.index + 1, state.questions.length)}/${state.questions.length}`;
    $('#btn-hint').disabled = state.score < HINT_COST || state.hintUsed || state.answered;
}

function handleMapClick(e) {
    if (!state.active || state.answered) return;
    const p = viewportPoint(e);
    checkAnswer(p.x, p.y);
}

function checkAnswer(x, y) {
    const q = state.questions[state.index];
    state.answered = true;
    let points = 0, tone = 'bad', message;

    if (q.kind === 'country') {
        const hit = countryAt(x, y);
        const ok = q.answers.includes(hit);
        q.answers.forEach((id) => view.countries[id]?.classList.add('target'));
        if (!ok && hit) view.countries[hit].classList.add('wrong');
        if (ok) {
            points = 100;
            tone = 'good';
            message = q.answers.length === 1 ? `Goed! Dat is ${q.name}.` : 'Goed! Dat is een buurland.';
        } else {
            message = q.answers.length === 1 ? `Helaas, ${q.name} staat groen gemarkeerd.` : 'Helaas, de buurlanden staan groen gemarkeerd.';
        }
    } else {
        const km = Math.round(Math.hypot(x - q.at[0], y - q.at[1]) * MAP_DATA[state.region].kmPerUnit);
        const [great, close, near] = DISTANCE_STEPS[state.region].map((s) => s * settings.difficulty);
        placePin('player', x, y);
        placePin('target', q.at[0], q.at[1]);
        const link = $('#link');
        link.setAttribute('x1', x);
        link.setAttribute('y1', y);
        link.setAttribute('x2', q.at[0]);
        link.setAttribute('y2', q.at[1]);
        setShown(link, true);
        if (km < great) { points = 100; tone = 'good'; message = `Uitstekend! Slechts ~${km} km ernaast.`; }
        else if (km < close) { points = 70; tone = 'good'; message = `Dichtbij! Ongeveer ${km} km ernaast.`; }
        else if (km < near) { points = 30; message = `In de buurt: ongeveer ${km} km ernaast.`; }
        else message = `Te ver weg: ongeveer ${km} km ernaast.`;
    }

    const good = points >= 70;
    state.score += points;
    state.streak = good ? state.streak + 1 : 0;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    if (good) state.correct++;
    if (good) audio.correct(); else audio.wrong();
    setFeedback(`${message} (+${points})`, tone);
    updateStats();
    const next = $('#btn-next');
    next.textContent = state.index === state.questions.length - 1 ? 'Resultaat' : 'Volgende';
    next.hidden = false;
    next.focus();
}

function nextQuestion() {
    if (++state.index < state.questions.length) loadQuestion();
    else finishRound();
}

function showHint() {
    if (!state.active || state.answered || state.hintUsed) return;
    if (state.score < HINT_COST) { setFeedback(`Je hebt minimaal ${HINT_COST} punten nodig voor een hint.`, 'bad'); return; }
    const q = state.questions[state.index];
    state.score -= HINT_COST;
    state.hintUsed = true;
    const circle = $('#hint-circle');
    circle.setAttribute('cx', q.at[0]);
    circle.setAttribute('cy', q.at[1]);
    setShown(circle, true);
    setFeedback(`Hint gebruikt (−${HINT_COST}). Zoek in de gestippelde cirkel.`);
    updateStats();
}

function endRound() {
    state.active = false;
    clearMarks();
    $('#quiz').hidden = true;
    $('#idle').hidden = false;
    $('#stats').hidden = true;
}

function finishRound() {
    audio.finish();
    const total = state.questions.length;
    const ratio = Math.max(0, state.score) / (total * 100);
    const grade = ratio >= 0.85 ? 'Diamant' : ratio >= 0.65 ? 'Goud' : ratio >= 0.45 ? 'Zilver' : 'Brons';
    const key = `${state.region}.${state.category}.${total}`;
    const isRecord = state.score > (records[key] || 0);
    if (isRecord) { records[key] = state.score; store.set('quizit.best', records); }

    $('#result-sub').textContent = `${REGIONS[state.region]} · ${CATEGORIES[state.category]} · ${total} vragen`;
    $('#res-score').textContent = state.score;
    $('#res-correct').textContent = `${state.correct}/${total}`;
    $('#res-streak').textContent = `${state.maxStreak}×`;
    $('#res-grade').textContent = grade;
    $('#res-best').textContent = isRecord ? 'Nieuw record!' : `Beste score: ${records[key]}`;
    endRound();
    $('#dlg-result').showModal();
}

// ---------- Dialogen ----------
function readSetupForm() {
    const form = $('#setup-form');
    state.region = form.region.value;
    state.category = form.category.value;
    state.rounds = form.rounds.value === 'all' ? 'all' : Number(form.rounds.value);
}

function syncSetupForm() {
    const form = $('#setup-form');
    form.region.value = state.region;
    form.category.value = state.category;
    const size = buildPool(state.region, state.category).length;
    form.querySelectorAll('input[name=rounds]').forEach((input) => {
        if (input.value === 'all') input.parentElement.lastChild.textContent = `Alles (${size})`;
        else input.disabled = Number(input.value) > size;
    });
    const wanted = form.querySelector(`input[name=rounds][value="${state.rounds}"]`);
    form.rounds.value = wanted && !wanted.disabled ? String(state.rounds) : 'all';
}

function setupDialogs() {
    const form = $('#setup-form');
    form.addEventListener('change', (e) => {
        const regionChanged = e.target.name === 'region' && form.region.value !== state.region;
        readSetupForm();
        if (regionChanged) setRegion(state.region); // voorbeeld van de gekozen kaart
        syncSetupForm();
    });
    form.addEventListener('submit', () => { readSetupForm(); startRound(); });
    document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));

    $('#set-theme').value = settings.theme;
    $('#set-sound').checked = settings.sound;
    $('#set-hints').checked = settings.hints;
    $('#set-difficulty').value = String(settings.difficulty);
    $('#dlg-settings').addEventListener('change', () => {
        settings.theme = $('#set-theme').value;
        applyTheme();
        settings.sound = $('#set-sound').checked;
        settings.hints = $('#set-hints').checked;
        settings.difficulty = Number($('#set-difficulty').value);
        store.set('quizit.settings', settings);
        if (state.active) $('#btn-hint').hidden = !settings.hints;
    });
    $('#btn-reset-best').addEventListener('click', () => {
        if (confirm('Alle records wissen?')) { records = {}; store.set('quizit.best', records); }
    });

    const openSetup = () => { syncSetupForm(); $('#dlg-setup').showModal(); };
    $('#btn-settings').addEventListener('click', () => $('#dlg-settings').showModal());
    $('#btn-start').addEventListener('click', openSetup);
    $('#btn-new').addEventListener('click', () => { $('#dlg-result').close(); openSetup(); });
    $('#btn-again').addEventListener('click', () => { $('#dlg-result').close(); startRound(); });
}

// ---------- Start ----------
document.addEventListener('DOMContentLoaded', () => {
    setRegion(state.region);
    setupMapInput();
    setupDialogs();
    $('#btn-next').addEventListener('click', nextQuestion);
    $('#btn-hint').addEventListener('click', showHint);
    $('#btn-stop').addEventListener('click', () => { if (confirm('Ronde stoppen? Je voortgang gaat verloren.')) endRound(); });
});
