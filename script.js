/* ───────── footer year ───────── */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ───────── custom cursor ───────── */
const cursor = document.getElementById('cursor');
const dot    = document.getElementById('cursor-dot');
let cx = innerWidth/2, cy = innerHeight/2, tx = cx, ty = cy;
addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`; });
(function loop(){
  cx += (tx - cx) * .18;
  cy += (ty - cy) * .18;
  cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
  requestAnimationFrame(loop);
})();
const linkSel = 'a, button, [data-magnetic], input, textarea';
document.querySelectorAll(linkSel).forEach(el => {
  el.addEventListener('pointerenter', () => cursor.classList.add('is-link'));
  el.addEventListener('pointerleave', () => cursor.classList.remove('is-link'));
});

/* ───────── magnetic buttons ───────── */
document.querySelectorAll('[data-magnetic]').forEach(el => {
  const strength = 0.35;
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width/2);
    const y = e.clientY - (r.top  + r.height/2);
    el.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

/* ───────── nav scrolled state + scroll bar ───────── */
const nav = document.querySelector('.nav');
const bar = document.getElementById('scroll-bar');
const onScroll = () => {
  const y = scrollY;
  nav.classList.toggle('scrolled', y > 24);
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = max > 0 ? (y / max * 100) + '%' : '0%';
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ───────── reveal-on-scroll ───────── */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

document.querySelectorAll('.reveal, .reveal-line, .hero-title').forEach(el => io.observe(el));

/* hero title: split into per-word .reveal-word (already in markup) */
document.querySelectorAll('.hero-title').forEach(el => {
  el.classList.add('is-in-parent');
  io.observe(el);
});
const heroIO = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); heroIO.unobserve(e.target); }
}, { threshold: 0.1 });
document.querySelectorAll('.hero-title, .manifesto-text').forEach(el => heroIO.observe(el));

/* ───────── capability tile cursor glow ───────── */
document.querySelectorAll('.cap').forEach(el => {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top)  + 'px');
  });
});

/* ───────── parallax for hero orb ───────── */
const orb = document.querySelector('.hero-orb');
if (orb) {
  addEventListener('scroll', () => {
    const y = scrollY;
    orb.style.transform = `translate(-50%, calc(-50% + ${y * 0.15}px)) rotate(${y * 0.05}deg)`;
  }, { passive: true });
}

/* ───────── smooth-scroll for anchor links (extra easing) ───────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });
});
