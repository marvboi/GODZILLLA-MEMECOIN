// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Copy Policy ID button
const copyBtn = document.getElementById('copyPolicy');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const input = document.getElementById('policyId');
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input.value);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
    } catch (_) {}
  });
}

// Banner Maker basics
const bannerCanvas = document.getElementById('bannerCanvas');
if (bannerCanvas) {
  const ctx = bannerCanvas.getContext('2d');
  const bgInput = document.getElementById('bgColor');
  const headline = document.getElementById('headlineText');
  const addImg = document.getElementById('bannerImage');
  const exportBtn = document.getElementById('exportBanner');

  const state = { bg: '#26b4ff', text: 'GODZILLA #WEIRD', image: null };
  const fontFace = '48px Chewy, Poppins, sans-serif';

  function drawBanner() {
    const { width, height } = bannerCanvas;
    // background
    ctx.fillStyle = state.bg;
    ctx.fillRect(0, 0, width, height);
    // text
    ctx.font = fontFace;
    ctx.fillStyle = '#000';
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#fff';
    ctx.strokeText(state.text, 40, 240);
    ctx.fillText(state.text, 40, 240);
    // image
    if (state.image) {
      const imgW = Math.min(320, state.image.width);
      const scale = imgW / state.image.width;
      const imgH = state.image.height * scale;
      ctx.drawImage(state.image, width - imgW - 40, height - imgH - 40, imgW, imgH);
    }
  }

  bgInput.addEventListener('input', () => {
    state.bg = bgInput.value;
    drawBanner();
  });
  headline.addEventListener('input', () => {
    state.text = headline.value || 'GODZILLA #WEIRD';
    drawBanner();
  });
  addImg.addEventListener('change', () => {
    const file = addImg.files && addImg.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      state.image = img;
      drawBanner();
    };
    img.src = URL.createObjectURL(file);
  });
  exportBtn.addEventListener('click', () => {
    const url = bannerCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zilla-banner.png';
    a.click();
  });

  drawBanner();
}

// Zilla Builder (layers)
const zillaCanvas = document.getElementById('zillaCanvas');
if (zillaCanvas) {
  const ctx = zillaCanvas.getContext('2d');
  const exportZilla = document.getElementById('exportZilla');
  const inputs = document.querySelectorAll('input[data-layer]');
  const layers = [];

  function redraw() {
    const { width, height } = zillaCanvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    layers.forEach((img) => {
      if (img) {
        const scale = Math.min(width / img.width, height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (width - w) / 2;
        const y = (height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      }
    });
  }

  inputs.forEach((el) => {
    el.addEventListener('change', () => {
      const index = Number(el.getAttribute('data-layer'));
      const file = el.files && el.files[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        layers[index] = img;
        redraw();
      };
      img.src = URL.createObjectURL(file);
    });
  });

  exportZilla.addEventListener('click', () => {
    const url = zillaCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-zilla.png';
    a.click();
  });

  redraw();
}

// Generator page toggles
const pickBanner = document.getElementById('pickBanner');
const pickZilla = document.getElementById('pickZilla');
if (pickBanner || pickZilla) {
  const studioSection = document.getElementById('studioSection');
  const panelBanner = document.getElementById('panelBanner');
  const panelZilla = document.getElementById('panelZilla');
  function show(which) {
    if (!studioSection || !panelBanner || !panelZilla) return;
    studioSection.hidden = false;
    panelBanner.hidden = which !== 'banner';
    panelZilla.hidden = which !== 'zilla';
    (studioSection.scrollIntoView || (()=>{})).call(studioSection, { behavior: 'smooth' });
  }
  pickBanner && pickBanner.addEventListener('click', () => show('banner'));
  pickZilla && pickZilla.addEventListener('click', () => show('zilla'));
}

// Zilla-nomics donut (placeholder percentages – replace later)
const donut = document.getElementById('donutChart');
if (donut) {
  const ring = donut.querySelector('g');
  const legend = document.getElementById('nomicsLegend');
  const entries = [
    { label: 'Public', value: 75, color: '#77a6f7' },
    { label: 'Vested', value: 12, color: '#caa24c' },
    { label: 'Reserves', value: 8, color: '#c27a55' },
    { label: 'Burned', value: 3, color: '#cfcfcf' },
    { label: 'Dev', value: 2, color: '#000000' },
  ];
  const total = entries.reduce((a, b) => a + b.value, 0);
  let acc = 0;
  const r = 100;
  const c = 2 * Math.PI * r;
  entries.forEach((e) => {
    const frac = e.value / total;
    const len = c * frac;
    const dash = `${len} ${c - len}`;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '130');
    circle.setAttribute('cy', '130');
    circle.setAttribute('r', String(r));
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', e.color);
    circle.setAttribute('stroke-width', '40');
    circle.setAttribute('stroke-dasharray', dash);
    circle.setAttribute('stroke-dashoffset', String(-acc * c));
    circle.setAttribute('pathLength', String(c));
    circle.setAttribute('stroke-linecap', 'butt');
    circle.setAttribute('transform', 'rotate(0 130 130)');
    ring.appendChild(circle);
    acc += frac;
    if (legend) {
      const li = document.createElement('li');
      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.background = e.color;
      li.appendChild(sw);
      li.appendChild(document.createTextNode(`${e.label} — ${e.value}%`));
      legend.appendChild(li);
    }
  });
  // inner hole
  const hole = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  hole.setAttribute('cx', '130');
  hole.setAttribute('cy', '130');
  hole.setAttribute('r', '60');
  hole.setAttribute('fill', '#fff');
  donut.appendChild(hole);
}

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  // close on link click
  mobileMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Meme gallery: load images from /web/public/memes and make horizontal carousel
(function initMemeGallery(){
  const gallery = document.getElementById('memeGallery');
  if (!gallery) return;
  // Clear existing nodes to avoid duplicates on re-init
  gallery.innerHTML = '';
  // Try to fetch manifest of images for static hosting. If it fails, fall back to defaults.
  const fallback = ['zillamascot.png','zillaVSbears.png','zillameme1.png','zillameme2.png','zillameme3.png','zillameme4.png','zillameme5.png','zillameme6.png','zillameme7.png'];
  fetch('public/memes/manifest.json')
    .then(r => r.ok ? r.json() : fallback)
    .catch(() => fallback)
    .then((files) => {
      const sources = Array.isArray(files) ? files : fallback;
      const uniqueSources = Array.from(new Set((sources || []).filter(Boolean)));
      const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"/>';

      // Helper to set the best available source
      function setSource(img, pngSrc, webpSrc) {
        fetch(webpSrc, { method: 'HEAD' })
          .then(r => { img.src = r.ok ? webpSrc : pngSrc; })
          .catch(() => { img.src = pngSrc; });
      }

      // Lazy insert with IntersectionObserver to avoid loading heavy images until visible
      const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          const png = img.getAttribute('data-png');
          const webp = img.getAttribute('data-webp');
          setSource(img, png, webp);
          io.unobserve(img);
        });
      }, { root: null, rootMargin: '200px 0px', threshold: 0.01 }) : null;

      const eagerCount = Math.min(4, uniqueSources.length);
      uniqueSources.forEach((name, index) => {
        const pngSrc = `public/memes/${name}`;
        const webpSrc = pngSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const item = document.createElement('div');
        item.className = 'gallery__item';
        const img = document.createElement('img');
        img.src = placeholder;
        img.setAttribute('fetchpriority', index < eagerCount ? 'high' : 'low');
        img.loading = index < eagerCount ? 'eager' : 'lazy';
        img.decoding = 'async';
        img.draggable = false;
        img.alt = 'ZILLA meme';
        img.setAttribute('data-png', pngSrc);
        img.setAttribute('data-webp', webpSrc);
        item.appendChild(img);
        gallery.appendChild(item);
        if (io && index >= eagerCount) {
          io.observe(img);
        } else {
          setSource(img, pngSrc, webpSrc);
        }
      });

      // After population, compute step from first card width + gap
      const prev = document.getElementById('galleryPrev');
      const next = document.getElementById('galleryNext');
      const gapStr = getComputedStyle(gallery).columnGap || getComputedStyle(gallery).gap || '16px';
      let step = 260;
      function computeStep(){
        const first = gallery.querySelector('.gallery__item');
        const gap = parseInt(gapStr, 10) || 16;
        step = first ? first.getBoundingClientRect().width + gap : 260;
      }
      computeStep();
      window.addEventListener('resize', computeStep);
      function scrollByStep(dir){
        gallery.scrollBy({ left: dir * step, behavior: 'smooth' });
      }
      prev && prev.addEventListener('click', () => scrollByStep(-1));
      next && next.addEventListener('click', () => scrollByStep(1));
    });
})();


