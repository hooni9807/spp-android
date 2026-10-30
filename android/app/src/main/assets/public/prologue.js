(() => {
  'use strict';
  const dialog = document.getElementById('auth-gate');
  const opener = document.getElementById('prologue-open');
  const motion = document.getElementById('prologue-motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [...dialog.querySelectorAll('[data-chapter]')];
  const scenes = [
    ['serve', '탁구의 순간을, 내 손끝으로.', '민희쌤 vs 만취범. SPP의 코트에서 첫 번째 랠리가 시작됩니다.'],
    ['spin', '최신 필살기의 순간.', '민희쌤의 4티어 빛의 반격과 만취범의 3티어 불사조 스매시가 교차합니다.'],
    ['ready', '다음 랠리의 주인공은 당신.', '캐릭터를 고르고, 나만의 코디로 코트에 서 보세요.']
  ];
  const starts = [0, 5200, 11000];
  let elapsed = 0, last = 0, frame = 0, paused = false, scene = -1, previewReady = false;
  const canvas = document.getElementById('prologue-court');
  function drawRally(time) {
    const ready = window.drawPrologueMatch?.(canvas, time / 1000);
    document.getElementById('prologue-loading').hidden = !!ready;
    if (ready) {
      document.getElementById('prologue-rally').textContent = canvas.dataset.rally.padStart(2, '0');
      document.getElementById('prologue-shot').textContent = canvas.dataset.shot;
    }
    previewReady = !!ready;
    return previewReady;
  }
  Promise.allSettled(['minhee','drunk'].map(key => loadFace(key).decode())).then(() => {
    if (dialog.open && !drawRally(elapsed)) {
      document.getElementById('prologue-loading').textContent = '미리보기를 불러오지 못했어요. 아래에서 게임을 시작할 수 있어요.';
    }
  });

  function showScene(index) {
    if (scene === index) return;
    scene = index;
    dialog.dataset.scene = scenes[index][0];
    document.getElementById('prologue-story-title').textContent = scenes[index][1];
    document.getElementById('prologue-story-copy').textContent = scenes[index][2];
    document.getElementById('prologue-scene-number').textContent = `0${index + 1} / 03`;
    chapters.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }

  function tick(now) {
    // Reduced-motion users still get a playable rally; only its pace and the
    // heavier cut-in/shake effects are reduced by the renderer.
    if (last && previewReady) elapsed += Math.min(now - last, 100) * (reduced.matches ? .65 : 1);
    last = now;
    showScene(elapsed < starts[1] ? 0 : elapsed < starts[2] ? 1 : 2);
    dialog.style.setProperty('--prologue-progress', Math.min(1,elapsed / 12000));
    drawRally(elapsed);
    frame = requestAnimationFrame(tick);
  }

  function syncMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    const stopped = paused || document.hidden;
    dialog.classList.toggle('pl-paused', stopped);
    motion.disabled = false;
    motion.textContent = paused ? '▷ 움직임 재생' : reduced.matches ? 'Ⅱ 동작 줄임 · 재생 중' : 'Ⅱ 움직임 멈추기';
    motion.setAttribute('aria-pressed', String(paused));
    if (dialog.open && !stopped) frame = requestAnimationFrame(tick);
  }

  function replay() {
    elapsed = 0;
    paused = false;
    dialog.classList.remove('pl-running');
    showScene(0);
    dialog.style.setProperty('--prologue-progress', elapsed / 12000);
    drawRally(elapsed);
    // Reset the CSS sequence together with the scene timeline.
    void dialog.offsetWidth;
    dialog.classList.add('pl-running');
    syncMotion();
  }

  function openPrologue() {
    if (dialog.open || !dialog.dispatchEvent(new Event('prologue-before-open', { cancelable: true }))) return;
    try {
      dialog.showModal();
      document.body.classList.add('prologue-open');
      replay();
    } catch {
      window.mysPrologueBoot?.fail();
    }
  }
  opener?.addEventListener('click', openPrologue);
  dialog.querySelectorAll('[data-prologue-close]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('close', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    dialog.classList.remove('pl-running');
    document.body.classList.remove('prologue-open');
    try { localStorage.setItem('spin-prologue-seen', '1'); } catch {}
    opener?.focus({ preventScroll: true });
  });
  document.getElementById('prologue-replay').addEventListener('click', replay);
  motion.addEventListener('click', () => { paused = !paused; syncMotion(); });
  chapters.forEach((button, index) => button.addEventListener('click', () => {
    elapsed = starts[index];
    showScene(index);
    dialog.style.setProperty('--prologue-progress', elapsed / 12000);
    drawRally(elapsed);
    syncMotion();
  }));
  document.addEventListener('visibilitychange', syncMotion);
  reduced.addEventListener('change', syncMotion);
  const boot = window.mysPrologueBoot;
  // A timed-out download must not open the intro over an already usable main page.
  if (boot?.autoOpen) openPrologue();
  boot?.finish();
})();
