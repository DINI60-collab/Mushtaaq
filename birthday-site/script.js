/* =============================================================
   For My Love — script
   Everything you might want to change lives in CONFIG.
============================================================= */

const CONFIG = {
  birthday:    { day: 29, month: 9, year: 2006 },   // her date of birth
  anniversary: "2022-07-31T22:52:00",               // when it started
  songVolume:  0.35,
  revealLine:  "Happy birthday, my love",
};

/* ---------- small helpers ---------- */

const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const pad = (n) => String(n).padStart(2, "0");
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, val) { try { localStorage.setItem(key, val); } catch { /* private mode */ } },
};

/* age she turns on this year's birthday */
function ageThisYear() {
  return new Date().getFullYear() - CONFIG.birthday.year;
}

/* =============================================================
   HEARTS
============================================================= */

function hearts(x, y, count = 18) {
  if (calm) return;
  for (let i = 0; i < count; i++) {
    const h = document.createElement("span");
    h.className = "spark-heart";
    h.textContent = Math.random() > 0.5 ? "♥" : "❤";
    h.style.left = x + "px";
    h.style.top = y + "px";
    h.style.setProperty("--x", (Math.random() - 0.5) * 340 + "px");
    h.style.setProperty("--y", (Math.random() - 0.5) * 340 + "px");
    h.style.fontSize = 0.9 + Math.random() * 1.4 + "rem";
    h.style.animationDelay = Math.random() * 0.15 + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1400);
  }
}

function heartsFrom(el, count) {
  const r = el.getBoundingClientRect();
  hearts(r.left + r.width / 2, r.top + r.height / 2, count);
}

function confetti(amount) {
  if (calm) return;
  const colors = ["#FF5C86", "#E7B579", "#F7E9EE", "#C33C63"];
  for (let i = 0; i < amount; i++) {
    const p = document.createElement("i");
    p.className = "confetti";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[(Math.random() * colors.length) | 0];
    p.style.animationDuration = 3.5 + Math.random() * 3 + "s";
    p.style.animationDelay = Math.random() * 1.5 + "s";
    p.style.opacity = 0.6 + Math.random() * 0.4;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 9000);
  }
}

/* =============================================================
   LOCK SCREEN
============================================================= */

const lock = $("#lock");
const keyInput = $("#keyInput");
const lockError = $("#lockError");

const SECRET = pad(CONFIG.birthday.day) + pad(CONFIG.birthday.month) + CONFIG.birthday.year;

keyInput.addEventListener("input", () => {
  let v = keyInput.value.replace(/\D/g, "").slice(0, 8);
  if (v.length > 4) v = v.slice(0, 2) + "." + v.slice(2, 4) + "." + v.slice(4);
  else if (v.length > 2) v = v.slice(0, 2) + "." + v.slice(2);
  keyInput.value = v;
  lockError.hidden = true;
});

$("#lockForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (keyInput.value.replace(/\./g, "") === SECRET) {
    unlock();
  } else {
    lockError.hidden = false;
    keyInput.classList.remove("shake");
    void keyInput.offsetWidth;
    keyInput.classList.add("shake");
  }
});

function unlock() {
  lock.classList.add("is-gone");
  setTimeout(() => lock.remove(), 700);
  startSong();
  playReveal();
}

/* =============================================================
   THE REVEAL
============================================================= */

function playReveal() {
  const reveal = $("#reveal");
  const turns = ageThisYear();
  $("#revealOld").textContent = turns - 1;
  $("#revealNew").textContent = turns;
  $("#revealLine").textContent = CONFIG.revealLine;

  reveal.hidden = false;
  reveal.removeAttribute("aria-hidden");

  const steps = [
    [80,   () => reveal.classList.add("lit")],
    [1800, () => { reveal.classList.add("step-2"); confetti(70); }],
    [3100, () => reveal.classList.add("step-3")],
    [6400, () => finish()],
  ];
  const timers = steps.map(([t, fn]) => setTimeout(fn, calm ? Math.min(t, 300) : t));

  function finish() {
    reveal.classList.add("is-fading");
    setTimeout(() => { reveal.remove(); openSite(); }, calm ? 50 : 900);
  }

  $("#revealSkip").addEventListener("click", () => {
    timers.forEach(clearTimeout);
    finish();
  });
}

function openSite() {
  document.body.classList.remove("is-locked");
  $("#app").hidden = false;
  hearts(window.innerWidth / 2, window.innerHeight * 0.4, 14);
}

/* =============================================================
   NAVIGATION
============================================================= */

function go(name) {
  $$(".view").forEach((v) => v.classList.toggle("is-active", v.id === "view-" + name));
  $$(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.go === name));
  window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
}

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-go]");
  if (!trigger) return;
  e.preventDefault();
  go(trigger.dataset.go);
});

/* =============================================================
   COUNTDOWN + DAYS TOGETHER
============================================================= */

const clockEls = {
  d: $("#cDays"), h: $("#cHours"), m: $("#cMin"), s: $("#cSec"),
  label: $("#countLabel"),
};

function nextBirthday(now) {
  const { day, month } = CONFIG.birthday;
  let t = new Date(now.getFullYear(), month - 1, day, 0, 0, 0);
  if (t <= now) t = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0);
  return t;
}

function isBirthdayToday(now) {
  return now.getDate() === CONFIG.birthday.day && now.getMonth() === CONFIG.birthday.month - 1;
}

function tick() {
  const now = new Date();
  const birthdayNow = isBirthdayToday(now);
  let target;

  if (birthdayNow) {
    document.body.classList.add("is-birthday");
    clockEls.label.textContent = "Today is your day — enjoy every hour of it";
    target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else {
    document.body.classList.remove("is-birthday");
    clockEls.label.textContent = "Until your next birthday";
    target = nextBirthday(now);
  }

  const diff = Math.max(0, target - now);
  clockEls.d.textContent = pad(Math.floor(diff / 86400000));
  clockEls.h.textContent = pad(Math.floor(diff / 3600000) % 24);
  clockEls.m.textContent = pad(Math.floor(diff / 60000) % 60);
  clockEls.s.textContent = pad(Math.floor(diff / 1000) % 60);
}

tick();
setInterval(tick, 1000);

(function daysTogether() {
  const start = new Date(CONFIG.anniversary);
  const days = Math.floor((Date.now() - start.getTime()) / 86400000);
  $("#daysTogether").textContent = days.toLocaleString("en-GB");
})();

(function heroLine() {
  const now = new Date();
  const turns = ageThisYear();
  const days = Math.ceil((nextBirthday(now) - now) / 86400000);
  const opener = isBirthdayToday(now)
    ? `You are ${turns} today.`
    : `In ${days} ${days === 1 ? "day" : "days"} you turn ${turns}.`;
  const p = $("#heroText");
  p.textContent = opener + " " + p.textContent.trim();
})();

(function heroDate() {
  const d = new Date(2000, CONFIG.birthday.month - 1, CONFIG.birthday.day);
  $("#heroDate").textContent = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
})();

/* =============================================================
   MUSIC
============================================================= */

const song = $("#song");
const musicBtn = $("#musicBtn");

function startSong() {
  song.volume = 0;
  song.play().then(() => {
    setMusicState(true);
    let v = 0;
    const fade = setInterval(() => {
      v = Math.min(CONFIG.songVolume, v + 0.02);
      song.volume = v;
      if (v >= CONFIG.songVolume) clearInterval(fade);
    }, 90);
  }).catch(() => setMusicState(false));
}

function setMusicState(on) {
  musicBtn.setAttribute("aria-pressed", on ? "true" : "false");
  musicBtn.querySelector(".music-label").textContent = on ? "Pause" : "Music";
}

musicBtn.addEventListener("click", () => {
  if (song.paused) {
    song.volume = CONFIG.songVolume;
    song.play().then(() => setMusicState(true)).catch(() => setMusicState(false));
  } else {
    song.pause();
    setMusicState(false);
  }
});

song.addEventListener("pause", () => setMusicState(false));
song.addEventListener("play", () => setMusicState(true));

/* videos take over the sound */
$$("video").forEach((v) => {
  v.addEventListener("play", () => { if (!song.paused) song.pause(); });
});

/* =============================================================
   PANDA
============================================================= */

const panda = $("#panda");

function hugPanda() {
  heartsFrom(panda, 20);
  panda.classList.remove("hugged");
  void panda.offsetWidth;
  panda.classList.add("hugged");
  $("#pandaHint").textContent = [
    "I love you", "Still you", "Every single time", "You are my favourite person",
  ][Math.floor(Math.random() * 4)];
}

panda.addEventListener("click", hugPanda);
panda.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hugPanda(); }
});

if (!calm && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (e) => {
    $$(".panda-eye i").forEach((pupil) => {
      const r = pupil.parentElement.getBoundingClientRect();
      const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
      pupil.style.transform = `translate(${Math.cos(a) * 7}px, ${Math.sin(a) * 8}px)`;
    });
  });
}

/* =============================================================
   LETTER
============================================================= */

const letterMore = $("#letterMore");
const letterToggle = $("#letterToggle");

letterToggle.addEventListener("click", () => {
  const open = !letterMore.hidden;
  letterMore.hidden = open;
  letterToggle.textContent = open ? "Keep reading" : "Close the letter";
  if (open) $("#view-letter").scrollIntoView({ behavior: calm ? "auto" : "smooth" });
});

/* =============================================================
   GALLERY + LIGHTBOX
============================================================= */

const cells = $$(".cell");
const lightbox = $("#lightbox");
const lbImg = $("#lbImg");
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = (i + cells.length) % cells.length;
  const cell = cells[lbIndex];
  lbImg.src = cell.dataset.full;
  lbImg.alt = cell.querySelector("img").alt;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

cells.forEach((cell, i) => cell.addEventListener("click", () => openLightbox(i)));

$("#lbClose").addEventListener("click", closeLightbox);
$("#lbPrev").addEventListener("click", () => openLightbox(lbIndex - 1));
$("#lbNext").addEventListener("click", () => openLightbox(lbIndex + 1));

lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
});

/* swipe */
let touchX = null;
lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) openLightbox(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

/* =============================================================
   QUIZ
============================================================= */

const QUESTIONS = [
  {
    q: "Which date turned us into us?",
    options: ["14.02.2022", "31.07.2022", "29.09.2022"],
    answer: 1,
    note: "31 July 2022, 22:52. I still have the message.",
  },
  {
    q: "What time did you send me “my beautiful day”?",
    options: ["20:10", "22:52", "23:40"],
    answer: 1,
    note: "22:52 — I checked more than once.",
  },
  {
    q: "Which animal belongs to us?",
    options: ["A panda", "A bear", "A cat"],
    answer: 0,
    note: "Panda. Obviously. 🐼",
  },
  {
    q: "What did I promise you in my letter?",
    options: [
      "To be perfect from now on",
      "To show it, not only say it",
      "To never be tired again",
    ],
    answer: 1,
    note: "Actions over paragraphs. That is the whole promise.",
  },
];

let qIndex = 0;
let qScore = 0;

const quizQ = $("#quizQ");
const quizOptions = $("#quizOptions");
const quizFeedback = $("#quizFeedback");
const quizNext = $("#quizNext");
const quizProgress = $("#quizProgress");

function renderQuestion() {
  const item = QUESTIONS[qIndex];
  quizProgress.textContent = `Question ${qIndex + 1} of ${QUESTIONS.length}`;
  quizQ.textContent = item.q;
  quizFeedback.textContent = "";
  quizNext.hidden = true;
  quizOptions.innerHTML = "";

  item.options.forEach((text, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "quiz-option";
    b.textContent = text;
    b.addEventListener("click", () => answer(i, b));
    quizOptions.appendChild(b);
  });
}

function answer(i, button) {
  const item = QUESTIONS[qIndex];
  const buttons = Array.from(quizOptions.children);
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === item.answer) b.classList.add("correct");
    else if (idx === i) b.classList.add("wrong");
  });

  if (i === item.answer) {
    qScore++;
    heartsFrom(button, 10);
  }
  quizFeedback.textContent = item.note;
  quizNext.hidden = false;
  quizNext.textContent = qIndex === QUESTIONS.length - 1 ? "See the result" : "Next";
}

quizNext.addEventListener("click", () => {
  if (qIndex < QUESTIONS.length - 1) {
    qIndex++;
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizProgress.textContent = "Result";
  quizQ.textContent = `${qScore} out of ${QUESTIONS.length}`;
  quizOptions.innerHTML = "";
  quizFeedback.textContent =
    qScore === QUESTIONS.length
      ? "You remember all of it. Of course you do."
      : "Good enough — I will remind you of the rest in person.";
  quizNext.hidden = false;
  quizNext.textContent = "Play again";
  quizNext.onclick = () => {
    qIndex = 0; qScore = 0; quizNext.onclick = null; renderQuestion();
  };
  confetti(qScore === QUESTIONS.length ? 40 : 0);
}

renderQuestion();

/* =============================================================
   HEART CLICKER  (10 second round)
============================================================= */

const clickerBtn = $("#clickerBtn");
const clickerScore = $("#clickerScore");
const clickerBest = $("#clickerBest");
const clickerHint = $("#clickerHint");

let running = false;
let score = 0;
let endsAt = 0;
let timer = null;

showBest();

clickerBtn.addEventListener("click", () => {
  if (!running) startRound();
  score++;
  clickerScore.textContent = score;
  heartsFrom(clickerBtn, 4);
});

function startRound() {
  running = true;
  score = 0;
  endsAt = Date.now() + 10000;
  timer = setInterval(() => {
    const left = Math.max(0, endsAt - Date.now());
    clickerHint.textContent = `${(left / 1000).toFixed(1)} seconds left`;
    if (left === 0) endRound();
  }, 100);
}

function endRound() {
  clearInterval(timer);
  running = false;
  const best = Number(store.get("clickerBest") || 0);
  if (score > best) {
    store.set("clickerBest", String(score));
    clickerHint.textContent = "New record. Tap again to beat it.";
    confetti(30);
  } else {
    clickerHint.textContent = "Time. Tap the heart to go again.";
  }
  showBest();
}

function showBest() {
  const best = store.get("clickerBest");
  clickerBest.textContent = best ? `your record: ${best}` : "";
}

/* =============================================================
   DUST  (soft rising specks)
============================================================= */

(function dust() {
  if (calm) return;
  const canvas = $("#dust");
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, specks = [], raf = null;

  function size() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.round(w / 12));
    specks = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      v: Math.random() * 0.35 + 0.08,
      o: Math.random() * 0.5 + 0.12,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const s of specks) {
      s.y -= s.v;
      if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 150, 180, ${s.o})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  window.addEventListener("resize", size);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) frame();
  });

  size();
  frame();
})();
