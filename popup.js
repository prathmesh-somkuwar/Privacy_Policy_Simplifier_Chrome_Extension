document.addEventListener('DOMContentLoaded', () => {
  const autoDetect = document.getElementById('auto-detect');
  const showBubble = document.getElementById('show-bubble');
  const defaultLang = document.getElementById('default-lang');
  const scanBtn = document.getElementById('scan-now');
  const pageUrl = document.getElementById('page-url');
  const statusTitle = document.getElementById('status-title');
  const statusIcon = document.getElementById('status-icon');
  const agreedList = document.getElementById('agreed-list');
  const aiDot = document.getElementById('ai-dot');
  const aiStatusText = document.getElementById('ai-status-text');

  chrome.storage.local.get(['autoDetect', 'showBubble', 'language', 'agreedSites'], (data) => {
    autoDetect.checked = data.autoDetect !== false;
    showBubble.checked = data.showBubble !== false;
    if (data.language) defaultLang.value = data.language;
    if (data.agreedSites && data.agreedSites.length > 0) {
      agreedList.innerHTML = data.agreedSites
        .slice(-10)
        .reverse()
        .map(s =>
          `<div class="history-item">
            <span class="dot">●</span>
            <span class="site">${new URL(s.url).hostname}</span>
            <span class="date">${new Date(s.date).toLocaleDateString()}</span>
          </div>`
        ).join('');
    }
  });

  autoDetect.addEventListener('change', () => {
    chrome.storage.local.set({ autoDetect: autoDetect.checked });
  });

  showBubble.addEventListener('change', () => {
    chrome.storage.local.set({ showBubble: showBubble.checked });
  });

  defaultLang.addEventListener('change', () => {
    chrome.storage.local.set({ language: defaultLang.value });
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab && tab.url) {
      pageUrl.textContent = tab.url;
      checkPage(tab);
    } else {
      statusTitle.textContent = 'No active page';
      statusIcon.className = 'status-icon unknown';
      statusIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }
  });

  scanBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) checkPage(tabs[0], true);
    });
  });

  chrome.runtime.sendMessage({ type: 'GET_AI_STATUS' }, (response) => {
    if (response && response.available) {
      aiDot.className = 'ai-dot online';
      aiStatusText.textContent = 'On-device AI available';
    } else {
      aiDot.className = 'ai-dot offline';
      aiStatusText.textContent = 'AI unavailable — using heuristic analysis';
    }
  });
});

function checkPage(tab, forceScan = false) {
  const statusTitle = document.getElementById('status-title');
  const statusIcon = document.getElementById('status-icon');
  const pageUrl = document.getElementById('page-url');

  statusTitle.textContent = 'Checking page...';
  statusIcon.className = 'status-icon checking';
  statusIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

  chrome.tabs.sendMessage(tab.id, { type: 'CHECK_LEGAL_PAGE' }, (response) => {
    if (chrome.runtime.lastError) {
      statusTitle.textContent = 'Cannot connect to page';
      statusIcon.className = 'status-icon unknown';
      statusIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
      return;
    }
    if (response && response.isLegal) {
      statusTitle.textContent = '✅ Legal / privacy page detected';
      statusIcon.className = 'status-icon legal';
      statusIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 2C16 2 30 8 30 16C30 25 16 31 16 31C16 31 2 25 2 16C2 8 16 2 16 2Z" fill="#2563eb"/><path d="M10 10.5C10 9.7 10.7 9 11.5 9H20.5C21.3 9 22 9.7 22 10.5V19.5C22 20.3 21.3 21 20.5 21H11.5C10.7 21 10 20.3 10 19.5V10.5Z" fill="white" opacity="0.9"/><rect x="11.5" y="12" width="6" height="1.2" rx="0.6" fill="#2563eb" opacity="0.3"/><rect x="11.5" y="14.5" width="9" height="1.2" rx="0.6" fill="#2563eb" opacity="0.3"/><rect x="11.5" y="17" width="7" height="1.2" rx="0.6" fill="#2563eb" opacity="0.3"/><path d="M13.5 15.5L15 17L18.5 13.5" stroke="#059669" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      if (forceScan) {
        chrome.tabs.sendMessage(tab.id, { type: 'TRIGGER_SCAN' });
      }
    } else {
      statusTitle.textContent = 'Not a legal/privacy page';
      statusIcon.className = 'status-icon unknown';
      statusIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }
  });
}
