/* ---------- Theme toggle (remembers choice) ---------- */
const toggle = document.getElementById("themeToggle");

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  toggle.textContent = dark ? "☀️" : "🌙";
}

let savedDark = false;
try {
  savedDark = localStorage.getItem("theme") === "dark";
} catch (e) {}
applyTheme(savedDark);

toggle.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");
  applyTheme(dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch (e) {}
});

/* ---------- Reveal on scroll ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ---------- Typed text in hero ---------- */
const phrases = [
  "full-stack apps",
  "mobile experiences",
  "multithreaded systems",
  "human-centered AI",
];
const typedEl = document.getElementById("typed");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = phrases[phraseIndex];
  charIndex += deleting ? -1 : 1;
  typedEl.textContent = current.slice(0, charIndex);

  let delay = deleting ? 40 : 90;
  if (!deleting && charIndex === current.length) {
    deleting = true;
    delay = 1500;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();

/* ---------- Scroll progress, back-to-top, active nav link ---------- */
const progress = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const sections = Array.from(navLinks)
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  toTop.classList.toggle("show", window.scrollY > 500);

  let current = null;
  sections.forEach((sec) => {
    if (sec.getBoundingClientRect().top <= 120) current = sec.id;
  });
  navLinks.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current)
  );
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

/* ---------- Project filters ---------- */
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;

    projects.forEach((p) => {
      const match = f === "all" || p.dataset.tags.split(" ").includes(f);
      p.classList.toggle("hidden", !match);
      if (match) {
        p.classList.remove("pop");
        void p.offsetWidth; // restart animation
        p.classList.add("pop");
      }
    });
  });
});

/* ---------- 3D tilt on cards ---------- */
const canHover = window.matchMedia("(hover: hover)").matches;
if (canHover) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ---------- Placeholder links shouldn't jump the page ---------- */
document.querySelectorAll(".placeholder-link").forEach((a) =>
  a.addEventListener("click", (e) => e.preventDefault())
);
