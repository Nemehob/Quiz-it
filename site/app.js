// GEOGRAFISCH EXACTE LANDGRENZEN / POLYGONEN (VIEWBOX 1000x750)
const QUESTIONS_DB = {
    1: [ // Niveau 1 – Landen
        { 
            text: "🇳🇱 Waar ligt Nederland?", 
            name: "Nederland",
            x: 395, y: 388, 
            polygons: [
                [[375, 365], [420, 365], [420, 410], [375, 410]]
            ]
        },
        { 
            text: "🇧🇪 Waar ligt België?", 
            name: "België",
            x: 380, y: 428, 
            polygons: [
                [[360, 410], [405, 410], [405, 445], [360, 445]]
            ]
        },
        { 
            text: "🇩🇪 Waar ligt Duitsland?", 
            name: "Duitsland",
            x: 470, y: 415, 
            polygons: [
                [[425, 355], [515, 355], [515, 470], [425, 470]]
            ]
        },
        { 
            text: "🇫🇷 Waar ligt Frankrijk?", 
            name: "Frankrijk",
            x: 350, y: 510, 
            polygons: [
                [[280, 445], [415, 445], [415, 575], [280, 575]]
            ]
        },
        { 
            text: "🇪🇸 Waar ligt Spanje?", 
            name: "Spanje",
            x: 250, y: 625, 
            polygons: [
                [[200, 555], [325, 555], [325, 690], [200, 690]]
            ]
        },
        { 
            text: "🇵🇹 Waar ligt Portugal?", 
            name: "Portugal",
            x: 175, y: 630, 
            polygons: [
                [[155, 580], [195, 580], [195, 685], [155, 685]]
            ]
        },
        { 
            text: "🇮🇹 Waar ligt Italië?", 
            name: "Italië",
            x: 485, y: 590, 
            polygons: [
                [[430, 520], [535, 520], [535, 680], [430, 680]]
            ]
        },
        { 
            text: "🇦🇹 Waar ligt Oostenrijk?", 
            name: "Oostenrijk",
            x: 515, y: 495, 
            polygons: [
                [[465, 475], [560, 475], [560, 515], [465, 515]]
            ]
        },
        { 
            text: "🇨🇭 Waar ligt Zwitserland?", 
            name: "Zwitserland",
            x: 435, y: 498, 
            polygons: [
                [[415, 480], [460, 480], [460, 515], [415, 515]]
            ]
        },
        { 
            text: "🇵🇱 Waar ligt Polen?", 
            name: "Polen",
            x: 580, y: 410, 
            polygons: [
                [[520, 355], [640, 355], [640, 465], [520, 465]]
            ]
        },
        { 
            text: "🇩🇰 Waar ligt Denemarken?", 
            name: "Denemarken",
            x: 465, y: 315, 
            polygons: [
                [[440, 280], [490, 280], [490, 350], [440, 350]]
            ]
        },
        { 
            text: "🇬🇷 Waar ligt Griekenland?", 
            name: "Griekenland",
            x: 650, y: 660, 
            polygons: [
                [[610, 620], [690, 620], [690, 710], [610, 710]]
            ]
        },
        { 
            text: "🇮🇪 Waar ligt Ierland?", 
            name: "Ierland",
            x: 215, y: 395, 
            polygons: [
                [[185, 350], [250, 350], [250, 440], [185, 440]]
            ]
        },
        { 
            text: "🇳🇴 Waar ligt Noorwegen?", 
            name: "Noorwegen",
            x: 440, y: 190, 
            polygons: [
                [[380, 100], [470, 100], [470, 280], [380, 280]]
            ]
        },
        { 
            text: "🇸🇪 Waar ligt Zweden?", 
            name: "Zweden",
            x: 510, y: 220, 
            polygons: [
                [[475, 110], [550, 110], [550, 330], [475, 330]]
            ]
        },
        { 
            text: "🇫🇮 Waar ligt Finland?", 
            name: "Finland",
            x: 615, y: 180, 
            polygons: [
                [[570, 90], [660, 90], [660, 270], [570, 270]]
            ]
        }
    ],
    2: [ // Niveau 2 – Hoofdsteden
        { text: "🏛 Waar ligt Amsterdam? (Nederland)", name: "Amsterdam", x: 395, y: 388 },
        { text: "🏛️ Waar ligt Brussel? (België)", name: "Brussel", x: 380, y: 428 },
        { text: "🏛️ Waar ligt Berlijn? (Duitsland)", name: "Berlijn", x: 505, y: 400 },
        { text: "🏛️ Waar ligt Parijs? (Frankrijk)", name: "Parijs", x: 345, y: 485 },
        { text: "🏛️ Waar ligt Madrid? (Spanje)", name: "Madrid", x: 245, y: 625 },
        { text: "🏛️ Waar ligt Rome? (Italië)", name: "Rome", x: 485, y: 615 },
        { text: "🏛️ Waar ligt Lissabon? (Portugal)", name: "Lissabon", x: 170, y: 655 },
        { text: "🏛️ Waar ligt Wenen? (Oostenrijk)", name: "Wenen", x: 545, y: 490 },
        { text: "🏛️ Waar ligt Athene? (Griekenland)", name: "Athene", x: 660, y: 670 },
        { text: "🏛 Waar ligt Kopenhagen? (Denemarken)", name: "Kopenhagen", x: 480, y: 330 },
        { text: "🏛️ Waar ligt Oslo? (Noorwegen)", name: "Oslo", x: 450, y: 255 },
        { text: "🏛️ Waar ligt Stockholm? (Zweden)", name: "Stockholm", x: 520, y: 250 },
        { text: "🏛️ Waar ligt Helsinki? (Finland)", name: "Helsinki", x: 615, y: 235 },
        { text: "🏛️️ Waar ligt Dublin? (Ierland)", name: "Dublin", x: 220, y: 395 },
        { text: "🏛️️ Waar ligt Warschau? (Polen)", name: "Warschau", x: 600, y: 405 }
    ],
    3: [ // Niveau 3 – Buurlanden
        { 
            text: "🗺️ Welk land ligt ten zuiden van Nederland?", 
            name: "België", 
            x: 380, y: 428,
            polygons: [[[360, 410], [405, 410], [405, 445], [360, 445]]]
        },
        { 
            text: "🗺️ Welk land ligt ten oosten van Nederland?", 
            name: "Duitsland", 
            x: 470, y: 415,
            polygons: [[[425, 355], [515, 355], [515, 470], [425, 470]]]
        },
        { 
            text: "🗺️ Welk land ligt ten noorden van Duitsland?", 
            name: "Denemarken", 
            x: 465, y: 315,
            polygons: [[[440, 280], [490, 280], [490, 350], [440, 350]]]
        },
        { 
            text: "🗺 Welk land ligt ten zuiden van Frankrijk?", 
            name: "Spanje", 
            x: 250, y: 625,
            polygons: [[[200, 555], [325, 555], [325, 690], [200, 690]]]
        },
        { 
            text: "🗺️ Welk land ligt ten westen van Polen?", 
            name: "Duitsland", 
            x: 470, y: 415,
            polygons: [[[425, 355], [515, 355], [515, 470], [425, 470]]]
        }
    ],
    4: [ // Niveau 4 – Locaties & Bezienswaardigheden
        { text: "🗼 Waar ligt de Eiffeltoren? (Parijs)", name: "Eiffeltoren", x: 345, y: 485 },
        { text: "🏛️ Waar ligt het Colosseum? (Rome)", name: "Colosseum", x: 485, y: 615 },
        { text: "⛵ Waar ligt de Sagrada Família? (Barcelona)", name: "Sagrada Família", x: 290, y: 615 },
        { text: "🏛️ Waar ligt de Akropolis? (Athene)", name: "Akropolis", x: 660, y: 670 },
        { text: "🕰️ Waar ligt de Big Ben? (Londen)", name: "Big Ben", x: 305, y: 405 }
    ]
};

const AudioFX = {
    enabled: true,
    ctx: null,
    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playCorrect() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    },
    playWrong() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    },
    playFanfare() {
        if (!this.enabled) return;
        this.init();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.12 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + i * 0.12);
            osc.stop(this.ctx.currentTime + i * 0.12 + 0.3);
        });
    }
};

let currentLevel = 1;
let questionIndex = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let hasAnswered = false;
let currentQuestions = [];
let zoomScale = 1;

let europeMap, mapViewport, playerFlag, targetFlag, distanceLine, hintCircle;
let questionText, feedbackText, statScore, statStreak, statProgress, statHighscore;
let btnNext, btnHint, levelBadge, gameOverModal;

document.addEventListener('DOMContentLoaded', () => {
    europeMap = document.getElementById('europe-map');
    mapViewport = document.getElementById('map-viewport');
    playerFlag = document.getElementById('player-flag');
    targetFlag = document.getElementById('target-flag');
    distanceLine = document.getElementById('distance-line');
    hintCircle = document.getElementById('hint-circle');
    questionText = document.getElementById('question-text');
    feedbackText = document.getElementById('feedback-text');
    statScore = document.getElementById('stat-score');
    statStreak = document.getElementById('stat-streak');
    statProgress = document.getElementById('stat-progress');
    statHighscore = document.getElementById('stat-highscore');
    btnNext = document.getElementById('btn-next');
    btnHint = document.getElementById('btn-hint');
    levelBadge = document.getElementById('level-badge');
    gameOverModal = document.getElementById('game-over-modal');

    setupEventListeners();
    startLevel(1);
});

function setupEventListeners() {
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.level-btn').forEach(b => {
                b.classList.remove('active', 'border-blue-500', 'bg-blue-500/10');
                b.classList.add('border-slate-800', 'bg-slate-950/60');
            });
            btn.classList.add('active', 'border-blue-500', 'bg-blue-500/10');
            btn.classList.remove('border-slate-800', 'bg-slate-950/60');

            const lvl = parseInt(btn.dataset.level);
            startLevel(lvl);
        });
    });

    europeMap.addEventListener('click', handleMapClick);
    btnNext.addEventListener('click', nextQuestion);
    btnHint.addEventListener('click', showHint);

    // Enter-toets ondersteuning
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (hasAnswered && !btnNext.classList.contains('invisible')) {
                nextQuestion();
            } else if (gameOverModal && !gameOverModal.classList.contains('hidden')) {
                document.getElementById('btn-modal-restart').click();
            }
        }
    });

    document.getElementById('btn-zoom-in').addEventListener('click', () => updateZoom(1.35));
    document.getElementById('btn-zoom-out').addEventListener('click', () => updateZoom(0.75));
    document.getElementById('btn-zoom-reset').addEventListener('click', () => resetZoom());

    document.getElementById('btn-modal-restart').addEventListener('click', () => {
        gameOverModal.classList.add('hidden');
        startLevel(currentLevel);
    });

    document.getElementById('btn-modal-next-lvl').addEventListener('click', () => {
        gameOverModal.classList.add('hidden');
        const nextLvl = currentLevel < 4 ? currentLevel + 1 : 1;
        const nextBtn = document.querySelector(`.level-btn[data-level="${nextLvl}"]`);
        if (nextBtn) nextBtn.click();
    });

    document.getElementById('btn-sound').addEventListener('click', (e) => {
        AudioFX.enabled = !AudioFX.enabled;
        e.currentTarget.innerHTML = AudioFX.enabled 
            ? '<i class="fa-solid fa-volume-high text-base text-blue-400"></i>' 
            : '<i class="fa-solid fa-volume-xmark text-base text-slate-500"></i>';
    });
}

function getSVGPoint(e) {
    const pt = europeMap.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = mapViewport.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
}

function handleMapClick(e) {
    if (hasAnswered) return;
    const svgPt = getSVGPoint(e);
    checkAnswer(svgPt.x, svgPt.y);
}

function pointInPolygon(point, vs) {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function checkAnswer(userX, userY) {
    hasAnswered = true;
    const q = currentQuestions[questionIndex];

    // Visual feedback flags
    playerFlag.setAttribute('transform', `translate(${userX}, ${userY})`);
    playerFlag.classList.remove('hidden');

    targetFlag.setAttribute('transform', `translate(${q.x}, ${q.y})`);
    targetFlag.classList.remove('hidden');

    distanceLine.setAttribute('x1', userX);
    distanceLine.setAttribute('y1', userY);
    distanceLine.setAttribute('x2', q.x);
    distanceLine.setAttribute('y2', q.y);
    distanceLine.classList.remove('hidden');

    const hasPolygons = q.polygons && q.polygons.length > 0;

    if (hasPolygons) {
        // EXCLUSIEVE GEOGRAFISCHE POINT-IN-POLYGON CONTROLE
        let isInsideCountry = false;
        for (const poly of q.polygons) {
            if (pointInPolygon([userX, userY], poly)) {
                isInsideCountry = true;
                break;
            }
        }

        if (isInsideCountry) {
            score += 100;
            streak++;
            if (streak > maxStreak) maxStreak = streak;
            AudioFX.playCorrect();
            feedbackText.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> Uitstekend! ${q.name || 'Het land'} goed geraden! (+100 pt)`;
            feedbackText.className = "text-xs font-bold text-emerald-400 min-h-[36px] flex items-center gap-2";
        } else {
            streak = 0;
            AudioFX.playWrong();
            feedbackText.innerHTML = `<i class="fa-solid fa-circle-xmark text-rose-400"></i> Helaas! Je klikte buiten ${q.name || 'het land'}. (0 pt)`;
            feedbackText.className = "text-xs font-bold text-rose-400 min-h-[36px] flex items-center gap-2";
        }
    } else {
        // Afstandslogica voor steden/locaties
        const dx = userX - q.x;
        const dy = userY - q.y;
        const svgDistance = Math.sqrt(dx * dx + dy * dy);
        const kmDistance = Math.round(svgDistance * 3.8);

        let points = 0;
        if (kmDistance < 70) {
            points = 100;
            streak++;
            if (streak > maxStreak) maxStreak = streak;
            AudioFX.playCorrect();
            feedbackText.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i> Uitstekend! ${q.name || ''} goed geraden! (+100 pt)`;
            feedbackText.className = "text-xs font-bold text-emerald-400 min-h-[36px] flex items-center gap-2";
        } else if (kmDistance < 180) {
            points = 70;
            streak++;
            if (streak > maxStreak) maxStreak = streak;
            AudioFX.playCorrect();
            feedbackText.innerHTML = `<i class="fa-solid fa-circle-check text-amber-400"></i> Heel dichtbij! Afwijking: ${kmDistance} km (+70 pt)`;
            feedbackText.className = "text-xs font-bold text-amber-400 min-h-[36px] flex items-center gap-2";
        } else if (kmDistance < 350) {
            points = 30;
            streak = 0;
            AudioFX.playWrong();
            feedbackText.innerHTML = `<i class="fa-solid fa-circle-exclamation text-orange-400"></i> In de buurt. Afwijking: ${kmDistance} km (+30 pt)`;
            feedbackText.className = "text-xs font-bold text-orange-400 min-h-[36px] flex items-center gap-2";
        } else {
            points = 0;
            streak = 0;
            AudioFX.playWrong();
            feedbackText.innerHTML = `<i class="fa-solid fa-circle-xmark text-rose-400"></i> Helaas, te ver weg! Afwijking: ${kmDistance} km (0 pt)`;
            feedbackText.className = "text-xs font-bold text-rose-400 min-h-[36px] flex items-center gap-2";
        }
        score += points;
    }

    updateStatsDisplay();
    btnNext.classList.remove('invisible');
}

function nextQuestion() {
    questionIndex++;
    if (questionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        finishLevel();
    }
}

function showHint() {
    if (hasAnswered) return;
    if (!hintCircle.classList.contains('hidden')) return;

    if (score < 75) {
        feedbackText.innerHTML = '<i class="fa-solid fa-lock text-rose-400"></i> Je hebt minimaal 75 punten nodig voor een hint!';
        feedbackText.className = "text-xs font-bold text-rose-400 min-h-[36px] flex items-center gap-2";
        AudioFX.playWrong();
        return;
    }

    score -= 75;
    updateStatsDisplay();

    const q = currentQuestions[questionIndex];
    hintCircle.setAttribute('cx', q.x);
    hintCircle.setAttribute('cy', q.y);
    hintCircle.classList.remove('hidden');

    feedbackText.innerHTML = '<i class="fa-solid fa-lightbulb text-amber-400"></i> Hint gebruikt (-75 pt)! Zoek in de oranje cirkel.';
    feedbackText.className = "text-xs font-bold text-amber-400 min-h-[36px] flex items-center gap-2";
}

function updateZoom(factor) {
    zoomScale = Math.min(Math.max(zoomScale * factor, 1), 3.5);
    mapViewport.setAttribute('transform', `scale(${zoomScale})`);
}

function resetZoom() {
    zoomScale = 1;
    mapViewport.setAttribute('transform', `translate(0,0) scale(1)`);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startLevel(lvl) {
    currentLevel = lvl;
    questionIndex = 0;
    score = 0;
    streak = 0;
    maxStreak = 0;
    currentQuestions = shuffleArray([...(QUESTIONS_DB[lvl] || QUESTIONS_DB[1])]);

    const badgeTitles = {
        1: "Niveau 1 – Landen (Uit je hoofd)",
        2: "Niveau 2 – Hoofdsteden",
        3: "Niveau 3 – Buurlanden",
        4: "Niveau 4 – Locaties & Bezienswaardigheden"
    };
    levelBadge.textContent = badgeTitles[lvl] || "Niveau 1";

    const hs = localStorage.getItem(`topo_hs_lvl_${lvl}`) || 0;
    statHighscore.textContent = hs;

    updateStatsDisplay();
    loadQuestion();
}

function loadQuestion() {
    hasAnswered = false;
    const q = currentQuestions[questionIndex];

    questionText.textContent = q.text;
    statProgress.textContent = `${questionIndex + 1}/${currentQuestions.length}`;
    feedbackText.innerHTML = '<i class="fa-solid fa-hand-pointer text-blue-400 animate-bounce"></i> Tik of klik ergens op de kaart om te beantwoorden!';
    feedbackText.className = "text-xs font-semibold text-slate-400 min-h-[36px] flex items-center gap-2";

    btnNext.classList.add('invisible');

    playerFlag.classList.add('hidden');
    targetFlag.classList.add('hidden');
    distanceLine.classList.add('hidden');
    hintCircle.classList.add('hidden');
}

function updateStatsDisplay() {
    statScore.textContent = score;
    statStreak.textContent = `${streak}x`;

    if (score < 75) {
        btnHint.classList.add('opacity-50');
    } else {
        btnHint.classList.remove('opacity-50');
    }
}

function finishLevel() {
    AudioFX.playFanfare();

    const savedHs = parseInt(localStorage.getItem(`topo_hs_lvl_${currentLevel}`) || "0");
    if (score > savedHs) {
        localStorage.setItem(`topo_hs_lvl_${currentLevel}`, score);
        statHighscore.textContent = score;
    }

    const maxPossible = currentQuestions.length * 100;
    const ratio = score / maxPossible;
    let grade = "Brons 🥉";
    let gradeColor = "text-amber-600";

    if (ratio >= 0.85) {
        grade = "Diamant 💎";
        gradeColor = "text-cyan-400";
    } else if (ratio >= 0.65) {
        grade = "Goud 🥇";
        gradeColor = "text-amber-400";
    } else if (ratio >= 0.45) {
        grade = "Zilver 🥈";
        gradeColor = "text-slate-300";
    }

    document.getElementById('modal-final-score').textContent = score;
    document.getElementById('modal-max-streak').textContent = `${maxStreak}x`;
    const gradeEl = document.getElementById('modal-grade');
    gradeEl.textContent = grade;
    gradeEl.className = `text-2xl font-black mt-0.5 ${gradeColor}`;

    gameOverModal.classList.remove('hidden');
}
