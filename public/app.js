const EASE_LABELS = { 1: 'Again', 2: 'Hard', 3: 'Good', 4: 'Easy' };

const connDot = document.getElementById('conn-dot');
const emptyState = document.getElementById('empty-state');
const emptyMessage = document.getElementById('empty-message');
const showAnswerBtn = document.getElementById('show-answer-btn');
const easeButtons = document.getElementById('ease-buttons');
const undoBtn = document.getElementById('undo-btn');

let busy = false;

function showZone(zone) {
  emptyState.classList.add('hidden');
  showAnswerBtn.classList.add('hidden');
  easeButtons.classList.add('hidden');
  zone.classList.remove('hidden');
}

function render(state) {
  if (state.error) {
    connDot.className = 'dot dot-off';
    emptyMessage.textContent = "Can't reach Anki — is it open with AnkiConnect installed?";
    showZone(emptyState);
    return;
  }

  connDot.className = 'dot dot-on';

  if (!state.reviewing) {
    emptyMessage.textContent = 'Not reviewing';
    showZone(emptyState);
    return;
  }

  if (!state.answerShown) {
    showZone(showAnswerBtn);
  } else {
    renderEaseButtons(state.buttons, state.nextReviews);
    showZone(easeButtons);
  }
}

function renderEaseButtons(buttons, nextReviews) {
  easeButtons.innerHTML = '';
  easeButtons.className = `zone count-${buttons.length}`;
  buttons.forEach((ease, i) => {
    const btn = document.createElement('button');
    btn.className = `ease-btn ease-${ease}`;
    btn.dataset.ease = ease;
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = EASE_LABELS[ease] || `Ease ${ease}`;
    const interval = document.createElement('span');
    interval.className = 'interval';
    interval.textContent = nextReviews[i] || '';
    btn.appendChild(label);
    btn.appendChild(interval);
    btn.addEventListener('click', () => answerCard(ease));
    easeButtons.appendChild(btn);
  });
}

async function api(path, options) {
  const res = await fetch(path, options);
  return res.json();
}

async function poll() {
  if (busy) return;
  try {
    const state = await api('/api/state');
    render(state);
  } catch (err) {
    render({ error: err.message });
  }
}

async function withBusy(fn) {
  if (busy) return;
  busy = true;
  try {
    const state = await fn();
    render(state);
  } catch (err) {
    render({ error: err.message });
  } finally {
    busy = false;
  }
}

showAnswerBtn.addEventListener('click', () => {
  withBusy(() => api('/api/show-answer', { method: 'POST' }));
});

undoBtn.addEventListener('click', () => {
  withBusy(() => api('/api/undo', { method: 'POST' }));
});

function answerCard(ease) {
  withBusy(() =>
    api('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ease }),
    })
  );
}

poll();
setInterval(poll, 1000);
