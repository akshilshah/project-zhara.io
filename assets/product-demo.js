(() => {
  'use strict';
  // Hero: a muted, looping recording of the real widget on the demo store.
  // Plays only while visible; pausable. Reduced motion starts paused on the poster
  // frame, and the visitor can still choose to play it.
  const stage = document.getElementById('product-demo');
  const video = document.getElementById('hero-video');
  const play = document.getElementById('demo-play');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let userPaused = reducedMotion.matches;
  const shouldPlay = () => !userPaused && inView && !document.hidden;
  function syncPlayback() {
    const paused = userPaused;
    play.setAttribute('aria-label', paused ? 'Play product video' : 'Pause product video');
    play.innerHTML = paused ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 8 6-8 6Z"/></svg>' : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10M13 5v10"/></svg>';
    if (shouldPlay()) {
      if (video.preload !== 'auto') video.preload = 'auto';
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
  play.addEventListener('click', () => {
    userPaused = !userPaused;
    syncPlayback();
  });
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    syncPlayback();
  }, { threshold: .15 }).observe(stage);
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) userPaused = true;
    syncPlayback();
  });
  syncPlayback();
  // A deterministic screenshot tour, with standard arrow-key tab behavior.
  document.querySelectorAll('[data-tour]').forEach(tour => {
    const tabs = [...tour.querySelectorAll('[role="tab"]')];
    function selectTab(tab) {
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
      });
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        selectTab(tabs[next]);
        tabs[next].focus();
      });
    });
  });
  const dialog = document.querySelector('.screenshot-dialog');
  const expanded = document.getElementById('expanded-screenshot');
  const zoom = document.getElementById('zoom-screenshot');
  const imageViewport = dialog.querySelector('.dialog-image');
  const mobileTour = window.matchMedia('(max-width: 700px)');
  function syncScreenshotPreviews() {
    document.querySelectorAll('.screenshot-viewport').forEach(viewport => {
      viewport.tabIndex = mobileTour.matches ? -1 : 0;
      const title = viewport.closest('.tour-panel').querySelector('[data-title]').dataset.title;
      viewport.setAttribute('aria-label', title + (mobileTour.matches ? ' screenshot' : ' screenshot; scroll to explore'));
    });
  }
  syncScreenshotPreviews();
  mobileTour.addEventListener('change', syncScreenshotPreviews);
  function setZoom(active) {
    dialog.classList.toggle('is-zoomed', active);
    zoom.setAttribute('aria-pressed', String(active));
    zoom.textContent = active ? 'Fit width' : 'Zoom in';
    imageViewport.scrollTo(0, 0);
  }
  let priorFocus;
  document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
    priorFocus = button;
    expanded.src = button.dataset.image;
    expanded.alt = button.dataset.title + ' in Shopify admin';
    document.getElementById('screenshot-title').textContent = button.dataset.title;
    setZoom(false);
    dialog.showModal();
    imageViewport.scrollTo(0, 0);
  }));
  zoom.addEventListener('click', () => setZoom(!dialog.classList.contains('is-zoomed')));
  document.getElementById('close-screenshot').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => priorFocus?.focus());
})();
