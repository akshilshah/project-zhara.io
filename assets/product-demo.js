(() => {
  'use strict';
  const stage = document.getElementById('product-demo');
  const content = document.getElementById('demo-content');
  const query = document.getElementById('demo-query');
  const heading = document.getElementById('demo-heading');
  const description = document.getElementById('demo-description');
  const play = document.getElementById('demo-play');
  const buttons = [...stage.querySelectorAll('[data-scene]')];
  const discoveryMarkup = content.innerHTML;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const products = {
    pebble: { name: 'Men’s T Shirt – Pebble', category: 'men-s-t-shirt', price: '₹899', previous: '₹999' },
    'women-galaxy': { name: 'Women’s T Shirt – Galaxy', category: 'women-s-t-shirt', price: '₹799', previous: '₹899' },
    frostee: { name: 'Men’s T Shirt – Frostee', category: 'men-s-t-shirt', price: '₹899', previous: '₹999' },
    galaxy: { name: 'Men’s T Shirt – Galaxy', category: 'men-s-t-shirt', price: '₹899', previous: '₹999' },
    dory: { name: 'Women’s T Shirt – Dory', category: 'women-s-t-shirt', price: '₹699', previous: '₹899' }
  };
  const scenes = [
    { query: 'Search products', title: 'Discovery starts before the first keystroke.', description: 'Prompts, categories, and trending products invite shoppers in.', duration: 5200 },
    { query: 't sh', title: 'A few letters. Already on the right track.', description: 'Relevant products appear as your shopper types.', duration: 5300 },
    { query: 'blue t shirt', title: 'From their words to your products.', description: 'Turn a specific search into a selection worth exploring.', duration: 6200 }
  ];
  let sceneIndex = 0;
  let elapsed = 0;
  let lastFrame = null;
  let inView = false;
  let userPaused = reducedMotion.matches;
  let frame = null;
  let lastLength = -1;
  const canPlay = () => !userPaused && !reducedMotion.matches && inView && !document.hidden;
  const image = (key, p) => `<img src="assets/demo/${key}.webp" alt="${p.name}" width="240" height="320">`;
  function resultsMarkup(index) {
    const categories = '<div class="demo-categories"><span>men-s-t-shirt</span><span>women-s-t-shirt</span></div>';
    if (index === 1) return categories + '<p class="ui-label demo-results-label">Products <span>Selected results ↗</span></p><div class="demo-list">' + ['pebble', 'women-galaxy', 'frostee'].map(key => {
      const p = products[key];
      return `<div class="demo-list-item">${image(key, p)}<div>${p.name}<small>${p.category}</small></div><strong>${p.price}<del>${p.previous}</del></strong></div>`;
    }).join('') + '</div>';
    return categories + '<p class="ui-label demo-results-label">Products <span>Selected results ↗</span></p><div class="demo-results-grid">' + ['galaxy', 'dory', 'frostee'].map(key => {
      const p = products[key];
      return `<div class="demo-product">${image(key, p)}<b>${p.name}</b><span>${p.price} <del>${p.previous}</del></span></div>`;
    }).join('') + '</div>';
  }
  function renderScene(index, animate = false) {
    sceneIndex = index;
    elapsed = 0;
    lastLength = -1;
    const scene = scenes[index];
    stage.dataset.scene = String(index);
    heading.textContent = scene.title;
    description.textContent = scene.description;
    content.innerHTML = index === 0 ? discoveryMarkup : resultsMarkup(index);
    content.classList.toggle('is-entering', animate && !reducedMotion.matches);
    query.textContent = animate && index > 0 ? '' : scene.query;
    stage.classList.toggle('is-typing', animate && index > 0);
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      button.querySelector('i').style.transform = `scaleX(${i === index && !canPlay() ? 1 : 0})`;
    });
  }
  function tick(now) {
    frame = null;
    if (!canPlay()) { lastFrame = null; return; }
    if (lastFrame !== null) elapsed += Math.min(now - lastFrame, 100);
    lastFrame = now;
    if (elapsed >= scenes[sceneIndex].duration) renderScene((sceneIndex + 1) % scenes.length, true);
    const scene = scenes[sceneIndex];
    if (sceneIndex > 0) {
      const length = Math.min(scene.query.length, Math.floor(elapsed / 90));
      if (length !== lastLength) { query.textContent = scene.query.slice(0, length); lastLength = length; }
      stage.classList.toggle('is-typing', length < scene.query.length);
    }
    buttons[sceneIndex].querySelector('i').style.transform = `scaleX(${elapsed / scene.duration})`;
    frame = window.requestAnimationFrame(tick);
  }
  function syncPlayback() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    lastFrame = null;
    const paused = userPaused || reducedMotion.matches;
    play.setAttribute('aria-label', paused ? 'Play product animation' : 'Pause product animation');
    play.innerHTML = paused ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 8 6-8 6Z"/></svg>' : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10M13 5v10"/></svg>';
    // Scene buttons remain usable when the system requests reduced motion.
    play.hidden = reducedMotion.matches;
    if (paused) {
      query.textContent = scenes[sceneIndex].query;
      stage.classList.remove('is-typing');
    }
    if (canPlay()) frame = window.requestAnimationFrame(tick);
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    userPaused = true;
    renderScene(Number(button.dataset.scene));
    syncPlayback();
  }));
  play.addEventListener('click', () => {
    userPaused = !userPaused;
    if (!userPaused) renderScene(sceneIndex, true);
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
  renderScene(0);
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
