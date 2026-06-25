const EASE_LABELS = { 1: 'Again', 2: 'Hard', 3: 'Good', 4: 'Easy' };

const deckNameEl = document.getElementById('deck-name');
const connDot = document.getElementById('conn-dot');
const emptyState = document.getElementById('empty-state');
const emptyMessage = document.getElementById('empty-message');
const cardContent = document.getElementById('card-content');
const showAnswerBtn = document.getElementById('show-answer-btn');
const easeButtons = document.getElementById('ease-buttons');
const undoBtn = document.getElementById('undo-btn');

let busy = false;

function render(state) {
  if (state.error) {
    connDot.className = 'dot dot-off';
    emptyState.classList.remove('hidden');
    cardContent.classList.add('hidden');
    showAnswerBtn.classList.add('hidden');
    easeButtons.classList.add('hidden');
    deckNameEl.textContent = 'Anki Remote';
    emptyMessage.textContent = "Can't reach Anki — is it open with AnkiConnect installed?";
    return;
  }

  connDot.className = 'dot dot-on';

  if (!state.reviewing) {
    emptyState.classList.remove('hidden');
    cardContent.classList.add('hidden');
    showAnswerBtn.classList.add('hidden');
    easeButtons.classList.add('hidden');
    deckNameEl.textContent = 'Anki Remote';
    emptyMessage.textContent = 'Not reviewing.';
    return;
  }

  deckNameEl.textContent = state.deckName || 'Anki Remote';
  emptyState.classList.add('hidden');
  cardContent.classList.remove('hidden');

  if (!state.answerShown) {
    cardContent.innerHTML = state.question;
    showAnswerBtn.classList.remove('hidden');
    easeButtons.classList.add('hidden');
  } else {
    cardContent.innerHTML = state.answer;
    showAnswerBtn.classList.add('hidden');
    easeButtons.classList.remove('hidden');
    renderEaseButtons(state.buttons, state.nextReviews);
  }
}

function renderEaseButtons(buttons, nextReviews) {
  easeButtons.innerHTML = '';
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
