let bubble = null;
let panel = null;
let overlay = null;
let dismissOverlay = null;
let panelData = null;
let panelOpen = false;

const LEGAL_PHRASES = [
  'privacy policy', 'terms of service', 'terms and conditions',
  'terms of use', 'cookie policy', 'data policy', 'legal notice',
  'end user license agreement', 'eula', 'gdpr', 'ccpa',
  'data processing', 'personal information', 'data collection',
  'privacy notice', 'acceptable use', 'service agreement',
  'license agreement', 'disclaimer', 'refund policy'
];

function isLegalPageCheck(url, text) {
  const urlLower = url.toLowerCase();
  if (LEGAL_PHRASES.some(p => urlLower.includes(p.replace(/\s+/g, '')))) return true;

  const textLower = text.toLowerCase();
  let matchCount = 0;
  for (const p of LEGAL_PHRASES) {
    if (textLower.includes(p) && ++matchCount >= 3) return true;
  }
  return text.length > 500 && matchCount >= 2;
}

function getPageTextContent() {
  const text = [];
  for (const el of document.querySelectorAll('p, li, div, span, section')) {
    const t = el.textContent.trim();
    if (t.length > 20) text.push(t);
    if (text.join('\n').length > 10000) break;
  }
  return text.join('\n');
}

function getLegalSections(text) {
  const sentences = text.match(/[^.!?\n]+[.!?\n]/g) || [];
  const legal = sentences.filter(s =>
    LEGAL_PHRASES.some(p => s.toLowerCase().includes(p))
  );
  return legal.length >= 5 ? legal.join('\n') : text;
}

function closePanel() {
  if (!panelOpen) return;
  panelOpen = false;

  const overlayEl = overlay;
  const panelEl = panel;
  const dismissEl = dismissOverlay;

  overlay = null;
  panel = null;
  dismissOverlay = null;

  if (dismissEl && dismissEl.parentNode) dismissEl.remove();
  if (overlayEl && overlayEl.parentNode) {
    overlayEl.style.opacity = '0';
    setTimeout(() => { if (overlayEl.parentNode) overlayEl.remove(); }, 250);
  }
  if (panelEl && panelEl.parentNode) {
    panelEl.classList.remove('jh-visible');
    panelEl.classList.add('jh-closing');
    setTimeout(() => { if (panelEl.parentNode) panelEl.remove(); }, 250);
  }
  document.body.style.overflow = '';
}

function injectBubble() {
  if (bubble) return;

  bubble = document.createElement('div');
  bubble.id = 'jh-bubble';
  bubble.innerHTML = `
    <div class="jh-bubble-dot"></div>
    <svg class="jh-bubble-ring" viewBox="0 0 48 48" width="48" height="48">
      <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="1.5"/>
    </svg>
    <div class="jh-bubble-icon">
      <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
        <path d="M14 2C14 2 26 7 26 14C26 22 14 27 14 27C14 27 2 22 2 14C2 7 14 2 14 2Z" fill="currentColor"/>
        <path d="M8.5 9.5C8.5 8.8 9.1 8.2 9.8 8.2H18.2C18.9 8.2 19.5 8.8 19.5 9.5V17.5C19.5 18.2 18.9 18.8 18.2 18.8H9.8C9.1 18.8 8.5 18.2 8.5 17.5V9.5Z" fill="white" opacity="0.9"/>
        <rect x="10" y="10.8" width="5" height="1" rx="0.5" fill="#2563eb" opacity="0.35"/>
        <rect x="10" y="13" width="8" height="1" rx="0.5" fill="#2563eb" opacity="0.35"/>
        <rect x="10" y="15.2" width="6" height="1" rx="0.5" fill="#2563eb" opacity="0.35"/>
        <path d="M11.5 14L13 15.5L16 12.5" stroke="#059669" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <span class="jh-bubble-label">Janhit</span>
  `;
  document.body.appendChild(bubble);

  requestAnimationFrame(() => bubble.classList.add('jh-visible'));

  bubble.addEventListener('click', (e) => {
    e.stopPropagation();
    openPanel();
  });
}

function createPanelElements() {
  dismissOverlay = document.createElement('div');
  dismissOverlay.id = 'jh-dismiss';
  dismissOverlay.addEventListener('click', closePanel);

  overlay = document.createElement('div');
  overlay.id = 'jh-overlay';

  panel = document.createElement('div');
  panel.id = 'jh-panel';
  panel.innerHTML = `
    <div class="jh-header">
      <div class="jh-header-top">
        <div class="jh-header-brand">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="jh-logo-g" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#fff" stop-opacity="0.95"/>
                <stop offset="100%" stop-color="#fff" stop-opacity="0.85"/>
              </linearGradient>
            </defs>
            <path d="M16 2C16 2 30 8 30 16C30 25 16 31 16 31C16 31 2 25 2 16C2 8 16 2 16 2Z" fill="url(#jh-logo-g)"/>
            <path d="M10 10.5C10 9.7 10.7 9 11.5 9H20.5C21.3 9 22 9.7 22 10.5V19.5C22 20.3 21.3 21 20.5 21H11.5C10.7 21 10 20.3 10 19.5V10.5Z" fill="#2563eb" opacity="0.12" rx="2"/>
            <rect x="11.5" y="12" width="6" height="1.2" rx="0.6" fill="#2563eb" opacity="0.35"/>
            <rect x="11.5" y="14.5" width="9" height="1.2" rx="0.6" fill="#2563eb" opacity="0.35"/>
            <rect x="11.5" y="17" width="7" height="1.2" rx="0.6" fill="#2563eb" opacity="0.35"/>
            <path d="M13.5 15.5L15 17L18.5 13.5" stroke="#059669" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Janhit</span>
        </div>
        <button class="jh-header-close" id="jh-close-btn" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="jh-header-sub">Know what you're agreeing to</div>
    </div>

    <div class="jh-body" id="jh-body">
      <div class="jh-loading" id="jh-loading">
        <div class="jh-spinner"><div></div><div></div><div></div><div></div></div>
        <p>Analyzing legal content...</p>
      </div>

      <div id="jh-content" style="display:none">
        <div class="jh-toolbar">
          <div class="jh-lang-group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <select id="jh-lang" class="jh-select">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
              <option value="te">తెలుగు</option>
              <option value="mr">मराठी</option>
              <option value="ta">தமிழ்</option>
              <option value="ur">اردو</option>
              <option value="gu">ગુજરાતી</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ml">മലയാളം</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="ar">العربية</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
            </select>
          </div>
          <button id="jh-translate-btn" class="jh-btn jh-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Translate
          </button>
        </div>

        <div class="jh-tabs" id="jh-tabs">
          <button class="jh-tab jh-active" data-tab="summary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            Summary
          </button>
          <button class="jh-tab" data-tab="data">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
            Data Collected
          </button>
          <button class="jh-tab" data-tab="original">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Original
          </button>
        </div>

        <div class="jh-tab-content" id="jh-tab-summary">
          <div id="jh-summary" class="jh-summary"></div>
        </div>

        <div class="jh-tab-content jh-hidden" id="jh-tab-data">
          <div id="jh-data-section">
            <p class="jh-section-label">👀 This site might take:</p>
            <div id="jh-data-points" class="jh-data-points"></div>
          </div>
          <div class="jh-warning-card" id="jh-warning-card" style="display:none">
            <div class="jh-warning-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="jh-warning-text">
              <strong>Heads up!</strong>
              <span>This site wants your personal info. Only agree if you're okay sharing what's listed above.</span>
            </div>
          </div>
        </div>

        <div class="jh-tab-content jh-hidden" id="jh-tab-original">
          <details class="jh-details">
            <summary class="jh-details-summary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              <span>Show original legal text</span>
            </summary>
            <div id="jh-original" class="jh-original-text"></div>
          </details>
        </div>
      </div>

      <div id="jh-error" class="jh-error-state" style="display:none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>Could not analyze this page as a legal document.</p>
        <span>The content doesn't appear to contain privacy policies or terms of service.</span>
      </div>
    </div>

    <div class="jh-footer" id="jh-footer" style="display:none">
      <button id="jh-agree-btn" class="jh-btn jh-btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        I Understand &amp; Proceed
      </button>
      <button id="jh-leave-btn" class="jh-btn jh-btn-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Go Back
      </button>
    </div>
  `;

  document.body.appendChild(dismissOverlay);
  document.body.appendChild(overlay);
  document.body.appendChild(panel);
}

function openPanel() {
  if (panelOpen) return;
  panelOpen = true;

  createPanelElements();
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    dismissOverlay.classList.add('jh-visible');
    overlay.classList.add('jh-visible');
    panel.classList.add('jh-visible');
  });

  document.getElementById('jh-close-btn').addEventListener('click', closePanel);
  document.getElementById('jh-translate-btn').addEventListener('click', handleTranslate);

  document.querySelectorAll('.jh-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  document.getElementById('jh-agree-btn').addEventListener('click', handleAgree);
  document.getElementById('jh-leave-btn').addEventListener('click', handleLeave);

  chrome.storage.local.get('language', (data) => {
    if (data.language) {
      const sel = document.getElementById('jh-lang');
      if (sel) sel.value = data.language;
    }
  });

  analyzePage();
}

function switchTab(tabId) {
  document.querySelectorAll('.jh-tab').forEach(t => t.classList.remove('jh-active'));
  document.querySelectorAll('.jh-tab-content').forEach(t => t.classList.add('jh-hidden'));
  document.querySelector(`.jh-tab[data-tab="${tabId}"]`).classList.add('jh-active');
  const content = document.getElementById(`jh-tab-${tabId}`);
  if (content) content.classList.remove('jh-hidden');
}

async function handleTranslate() {
  const lang = document.getElementById('jh-lang').value;
  if (!panelData) return;

  chrome.storage.local.set({ language: lang });

  if (lang === 'en') {
    document.getElementById('jh-summary').innerHTML = panelData.simplified
      .replace(/\n{2,}/g, '<div class="jh-summary-spacer"></div>')
      .replace(/\n/g, '<br>');
    return;
  }

  const btn = document.getElementById('jh-translate-btn');
  btn.disabled = true;
  btn.innerHTML = `<div class="jh-spinner-inline"></div> Translating...`;

  chrome.runtime.sendMessage({
    type: 'TRANSLATE_TEXT',
    text: panelData.simplified,
    targetLang: lang
  }, (response) => {
    btn.disabled = false;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Translate`;

    const summary = document.getElementById('jh-summary');
    if (response && response.translated) {
      summary.innerHTML = response.translated
        .replace(/\n{2,}/g, '<div class="jh-summary-spacer"></div>')
        .replace(/\n/g, '<br>');
      if (lang !== 'en') {
        summary.classList.add('jh-translated');
      } else {
        summary.classList.remove('jh-translated');
      }
    } else {
      summary.innerHTML = '<div class="jh-translation-failed">Translation unavailable. Showing English:</div>' +
        panelData.simplified.replace(/\n/g, '<br>');
    }
  });
}

function analyzePage() {
  const pageText = getPageTextContent();
  const legalText = getLegalSections(pageText);

  if (!legalText || legalText.length < 50) {
    document.getElementById('jh-loading').style.display = 'none';
    document.getElementById('jh-error').style.display = 'block';
    return;
  }

  const lang = document.getElementById('jh-lang').value;

  chrome.runtime.sendMessage({
    type: 'PROCESS_TEXT',
    text: legalText,
    language: lang
  }, (response) => {
    const loading = document.getElementById('jh-loading');
    const content = document.getElementById('jh-content');
    loading.style.display = 'none';
    content.style.display = 'block';

    if (response) {
      panelData = response;
      displayResults(response);
    }
  });
}

function displayResults(data) {
  const summary = document.getElementById('jh-summary');
  const dataPoints = document.getElementById('jh-data-points');
  const original = document.getElementById('jh-original');
  const footer = document.getElementById('jh-footer');

  const text = data.translatedSimplified || data.simplified;
  summary.innerHTML = text
    .replace(/\n{2,}/g, '<div class="jh-summary-spacer"></div>')
    .replace(/\n/g, '<br>');

  if (data.language !== 'en') summary.classList.add('jh-translated');
  else summary.classList.remove('jh-translated');

  if (data.dataPoints && data.dataPoints.length > 0) {
    dataPoints.innerHTML = data.dataPoints.map(dp =>
      `<span class="jh-dp-tag"><span class="jh-dp-icon">${dp.icon || '📌'}</span> ${dp.label}</span>`
    ).join('');
    document.getElementById('jh-warning-card').style.display = 'flex';
  } else {
    dataPoints.innerHTML = '<span class="jh-dp-empty">Could not detect what data this site collects</span>';
  }

  original.textContent = data.original;
  footer.style.display = 'flex';
}

function handleAgree() {
  chrome.storage.local.get('agreedSites', (data) => {
    const sites = data.agreedSites || [];
    sites.push({ url: window.location.href, date: new Date().toISOString() });
    chrome.storage.local.set({ agreedSites: sites });
  });
  closePanel();
}

function handleLeave() {
  closePanel();
  window.history.back();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_LEGAL_PAGE') {
    const text = getPageTextContent();
    sendResponse({ isLegal: isLegalPageCheck(window.location.href, text) });
    return true;
  }
  if (message.type === 'TRIGGER_SCAN') {
    if (!panelOpen) openPanel();
    sendResponse({ triggered: true });
    return true;
  }
});

(function init() {
  const text = getPageTextContent();
  const isLegal = isLegalPageCheck(window.location.href, text);

  chrome.storage.local.get('autoDetect', (data) => {
    if (data.autoDetect !== false && isLegal) {
      injectBubble();
    }
  });
})();
