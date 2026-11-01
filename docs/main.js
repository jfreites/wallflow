(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero: rota los wallpapers del escritorio, igual que hace la app al aplicar uno nuevo */
  const slides = [...document.querySelectorAll('.desk-slide')];
  const ambient = document.querySelector('.hero-visual');
  const caption = document.querySelector('.desk-caption');
  const capTitle = caption?.querySelector('.cap-title');
  const capSource = caption?.querySelector('.cap-source');
  let current = 0;
  let timer = null;

  slides.forEach((img) => {
    img.addEventListener('error', () => { img.dataset.failed = '1'; img.remove(); });
  });

  const usable = () => slides.filter((s) => !s.dataset.failed && s.complete && s.naturalWidth > 0);

  function show(next) {
    const list = usable();
    if (list.length < 2) return;
    const prev = slides[current];
    const target = list[(list.indexOf(prev) + 1) % list.length] || list[0];
    if (target === prev) return;
    prev.classList.remove('is-active');
    target.classList.add('is-active');
    current = slides.indexOf(target);
    ambient.style.setProperty('--ambient', `url("${target.currentSrc || target.src}")`);
    caption.classList.add('is-changing');
    setTimeout(() => {
      capTitle.textContent = target.dataset.caption;
      capSource.textContent = target.dataset.source;
      caption.classList.remove('is-changing');
    }, 400);
  }

  function start() { if (!timer && !reduce) timer = setInterval(show, 4800); }
  function stop() { clearInterval(timer); timer = null; }

  if (slides.length && 'IntersectionObserver' in window) {
    // Carga las demás imágenes del hero después de la primera
    slides.slice(1).forEach((s) => { s.loading = 'eager'; });
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.2 })
      .observe(document.querySelector('.desk'));
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }

  /* Marquee: duplica la lista para un bucle continuo */
  const track = document.querySelector('.strip-track');
  const list = track?.querySelector('.strip-list');
  if (list) {
    list.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', () => img.closest('li')?.remove());
    });
    const clone = list.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach((img) => {
      img.alt = '';
      img.addEventListener('error', () => img.closest('li')?.remove());
    });
    track.appendChild(clone);
  }

  /* Bento: si una imagen externa no carga, el mosaico conserva su fondo */
  document.querySelectorAll('.tile > img').forEach((img) => {
    img.addEventListener('error', () => img.remove());
  });

  /* Aparición al hacer scroll, con un pequeño escalonado por grupo */
  const reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      let i = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.style.setProperty('--rd', `${i++ * 70}ms`);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* Teclado: las teclas de la sección se iluminan al presionarlas */
  const groups = Object.fromEntries(
    [...document.querySelectorAll('.key-group')].map((g) => [g.dataset.key, g])
  );
  const press = (name) => {
    const g = groups[name];
    if (!g) return;
    g.classList.add('is-pressed');
    clearTimeout(g._t);
    g._t = setTimeout(() => g.classList.remove('is-pressed'), 260);
  };
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') press('cmdk');
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') press('arrows');
    else if (e.key === 'Escape') press('esc');
    else if (e.key === 'Tab') press('tab');
  });
  Object.entries(groups).forEach(([name, g]) => g.addEventListener('pointerdown', () => press(name)));

  /* Copiar el comando de Terminal */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = document.querySelector(btn.dataset.copy)?.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copiado';
        btn.classList.add('is-done');
      } catch {
        btn.textContent = 'Selecciónalo y copia';
      }
      setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('is-done'); }, 1800);
    });
  });

  /* Botones de descarga con un leve efecto magnético (solo con mouse) */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }
})();
