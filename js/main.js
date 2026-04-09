/* ============================================================
   Aryaveer Bajpai – iOS Developer Portfolio
   JS: typing · scroll reveal · nav · cursor · magnetic ·
       counters · timeline · 3D tilt · progress bar
   ============================================================ */

// ── Typing animation ──────────────────────────────────────
const roles = [
  'Senior iOS Engineer',
  'Swift & SwiftUI Specialist',
  '5+ Years on Apple Platforms',
  'Offline-First Architecture',
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typing-text');

function type() {
  if (!typingEl) return;
  const current = roles[roleIndex];
  if (!isDeleting) {
    typingEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) { isDeleting = true; setTimeout(type, 1800); return; }
  } else {
    typingEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(type, isDeleting ? 50 : 72);
}
document.addEventListener('DOMContentLoaded', () => setTimeout(type, 600));

// ── Navbar: scroll state + active section ────────────────
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Scroll reveal (IntersectionObserver) ─────────────────
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Mobile hamburger ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger?.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
});
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open'); mobileNav.classList.remove('open');
}));

// ── Smooth scroll ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Footer year ───────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ════════════════════════════════════════════════════════
//  NEW FEATURES
// ════════════════════════════════════════════════════════

// ── Scroll progress bar ───────────────────────────────────
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  if (!progressBar) return;
  const scrolled  = window.scrollY;
  const total     = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ── Custom cursor with lerp (desktop only) ────────────────
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const isHoverDevice = window.matchMedia('(hover: hover)').matches;

if (cursorDot && cursorRing && isHoverDevice) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  const LERP = 0.13;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * LERP;
    ry += (my - ry) * LERP;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const INTERACTIVES = 'a, button, .btn, .bento-card, .timeline-slide, .contact-card, .contact-cta-box, .marquee-pill, .stack-pill, .about-link, .skill-tag';
  document.querySelectorAll(INTERACTIVES).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => { cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursorDot.style.opacity = '1'; cursorRing.style.opacity = '1'; });
}

// ── Magnetic button effect ────────────────────────────────
if (isHoverDevice) {
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.32;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.32;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ── Animated number counters ──────────────────────────────
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

function animateCounter(el) {
  const target     = parseInt(el.dataset.value, 10);
  const duration   = 1800;
  const start      = performance.now();
  const suffixSpan = el.querySelector('span');

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const val      = Math.round(easeOutQuart(progress) * target);
    if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
      el.firstChild.textContent = val;
    } else if (suffixSpan) {
      el.insertBefore(document.createTextNode(val), suffixSpan);
    }
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.5 }
);
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ── Timeline slide-in observer ────────────────────────────
const timelineObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.delay || '0', 10);
      setTimeout(() => e.target.classList.add('visible'), delay);
      timelineObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.timeline-slide').forEach(el => timelineObserver.observe(el));

// ── 3D card tilt on mousemove ─────────────────────────────
if (isHoverDevice) {
  const MAX_TILT = 8;
  const tiltEls  = document.querySelectorAll('.bento-card, .timeline-slide, .contact-cta-box');

  tiltEls.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r     = card.getBoundingClientRect();
      const normX = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const normY = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      card.classList.add('tilting');
      card.style.transform = `perspective(800px) rotateX(${-normY * MAX_TILT}deg) rotateY(${normX * MAX_TILT}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilting');
      card.style.transform = '';
    });
  });
}
