let aiSession = null;

const LEGAL_PHRASES = [
  'privacy policy', 'terms of service', 'terms and conditions',
  'terms of use', 'cookie policy', 'data policy', 'legal notice',
  'end user license agreement', 'eula', 'gdpr', 'ccpa',
  'data processing', 'personal information', 'data collection',
  'privacy notice', 'acceptable use', 'service agreement',
  'license agreement', 'disclaimer', 'refund policy'
];

const DATA_POINTS_PATTERNS = [
  { label: 'Your email address', icon: '📧', patterns: ['email', 'e-mail', 'mail address'] },
  { label: 'Your name', icon: '👤', patterns: ['name', 'full name', 'first name', 'last name'] },
  { label: 'Your phone number', icon: '📞', patterns: ['phone', 'telephone', 'mobile number', 'phone number'] },
  { label: 'Where you are (location)', icon: '📍', patterns: ['location', 'gps', 'geo', 'coordinate', 'geolocation'] },
  { label: 'Your IP address', icon: '🌐', patterns: ['ip address', 'ip addr'] },
  { label: 'What device/browser you use', icon: '💻', patterns: ['device', 'browser', 'os', 'operating system', 'user agent'] },
  { label: 'Which sites you visit', icon: '📜', patterns: ['browsing history', 'browsing data', 'search history', 'viewed pages'] },
  { label: 'Your card / payment details', icon: '💳', patterns: ['credit card', 'debit card', 'payment', 'bank account', 'financial'] },
  { label: 'Cookies that track you', icon: '🍪', patterns: ['cookie', 'tracker', 'tracking', 'beacon', 'pixel'] },
  { label: 'Your social media info', icon: '🔗', patterns: ['social media', 'facebook', 'google', 'twitter', 'linkedin'] },
  { label: 'Your messages / chats', icon: '💬', patterns: ['message', 'communication', 'chat log', 'correspondence'] },
  { label: 'Your government ID', icon: '🪪', patterns: ['passport', 'driving license', 'aadhaar', 'ssn', 'social security', 'pan card'] },
  { label: 'Your face / fingerprints', icon: '🔐', patterns: ['biometric', 'fingerprint', 'facial', 'face recognition'] },
  { label: 'Your age, gender etc.', icon: '📊', patterns: ['age', 'gender', 'date of birth', 'demographic'] },
  { label: 'Your job / income details', icon: '💼', patterns: ['employ', 'job', 'occupation', 'salary', 'income'] }
];

async function ensureAISession() {
  if (aiSession) return aiSession;
  try {
    if (window.ai && window.ai.createTextSession) {
      aiSession = await window.ai.createTextSession();
      return aiSession;
    }
  } catch (_) {}
  try {
    const caps = await chrome.languageModel?.capabilities();
    if (caps?.available === 'readily') {
      aiSession = await chrome.languageModel?.create();
      return aiSession;
    }
  } catch (_) {}
  return null;
}

async function simplifyWithAI(text) {
  const session = await ensureAISession();
  if (!session) return null;
  try {
    const prompt = `You are Janhit, a legal-to-casual translator. Summarize this privacy/legal text in VERY SIMPLE, friendly, casual language (like explaining to a friend).

Focus on:
1. What personal data does this site collect?
2. How is the data used?
3. Who do they share it with?
4. Any rights the user has
5. Any important warnings

Keep it short, bullet-point style, no legal jargon. Use emojis sparingly.

Text: ${text.slice(0, 6000)}`;
    return await session.prompt(prompt);
  } catch (_) {
    return null;
  }
}

function extractDataPoints(text) {
  const lower = text.toLowerCase();
  return DATA_POINTS_PATTERNS.filter(dp =>
    dp.patterns.some(p => lower.includes(p))
  );
}

function heuristicSimplify(text) {
  const lower = text.toLowerCase();
  const parts = [];

  if (lower.includes('third party') || lower.includes('third-party') || lower.includes('share') || lower.includes('sell')) {
    parts.push('🔄 Your data may be shared with or sold to third parties');
  }
  if (lower.includes('retain') || lower.includes('store') || lower.includes('keep your')) {
    parts.push('⏳ Your data may be stored even after you stop using the service');
  }
  if (lower.includes('cookie') || lower.includes('track')) {
    parts.push('🍪 Cookies and trackers are used to monitor your activity');
  }
  if (lower.includes('advertis') || lower.includes('ad') || lower.includes('marketing')) {
    parts.push('📢 Your data may be used for advertising or marketing');
  }
  if (lower.includes('right to') || lower.includes('opt-out') || lower.includes('opt out') || lower.includes('delete your') || lower.includes('access your')) {
    parts.push('✅ You may have rights to access, delete, or opt out of data collection');
  }
  if (lower.includes('encrypt') || lower.includes('secure') || lower.includes('protection')) {
    parts.push('🔒 They mention taking security measures to protect your data');
  }

  return parts.length > 0
    ? parts.join('\n\n')
    : '📄 This page contains legal terms. Please review carefully before agreeing.';
}

async function translateViaGoogle(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data[0].map(s => s[0]).join('');
  } catch (_) {
    return null;
  }
}

const STATIC_TRANSLATIONS = {
  hi: {
    'Your data may be shared with or sold to third parties': 'आपका डेटा तीसरे पक्ष के साथ साझा या बेचा जा सकता है',
    'Your data may be stored even after you stop using the service': 'सेवा बंद करने के बाद भी आपका डेटा संग्रहीत रह सकता है',
    'Cookies and trackers are used to monitor your activity': 'कुकीज़ और ट्रैकर्स का उपयोग आपकी गतिविधि पर नज़र रखने के लिए किया जाता है',
    'Your data may be used for advertising or marketing': 'आपका डेटा विज्ञापन या मार्केटिंग के लिए उपयोग किया जा सकता है',
    'You may have rights to access, delete, or opt out of data collection': 'आपको डेटा तक पहुंचने, हटाने या ऑप्ट-आउट करने का अधिकार हो सकता है',
    'They mention taking security measures to protect your data': 'वे आपके डेटा की सुरक्षा के उपायों का उल्लेख करते हैं',
    'This page contains legal terms. Please review carefully before agreeing.': 'इस पृष्ठ में कानूनी शर्तें हैं। सहमत होने से पहले ध्यान से समीक्षा करें।',
  }
};

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;

  let translated = await translateViaGoogle(text, targetLang);
  if (translated) return translated;

  const dict = STATIC_TRANSLATIONS[targetLang];
  if (dict) {
    let result = text;
    for (const [en, t] of Object.entries(dict)) {
      result = result.split(en).join(t);
    }
    return result;
  }

  return null;
}

async function processLegalText(text, language = 'en') {
  let simplified = await simplifyWithAI(text);
  if (!simplified) {
    simplified = heuristicSimplify(text);
  }

  let translatedSimplified = simplified;
  if (language !== 'en') {
    const t = await translateText(simplified, language);
    if (t) translatedSimplified = t;
  }

  const dataPoints = extractDataPoints(text);

  return {
    original: text.slice(0, 8000),
    simplified,
    translatedSimplified,
    dataPoints,
    language
  };
}

function isLegalPage(url, text) {
  const urlLower = url.toLowerCase();
  if (LEGAL_PHRASES.some(p => urlLower.includes(p.replace(/\s+/g, '')))) return true;

  const textLower = text.toLowerCase();
  let matchCount = 0;
  for (const p of LEGAL_PHRASES) {
    if (textLower.includes(p)) {
      matchCount++;
      if (matchCount >= 3) return true;
    }
  }
  return text.length > 200 && matchCount >= 2;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_LEGAL_PAGE') {
    sendResponse({ isLegal: isLegalPage(message.url, message.text) });
    return true;
  }

  if (message.type === 'PROCESS_TEXT') {
    processLegalText(message.text, message.language || 'en').then(sendResponse);
    return true;
  }

  if (message.type === 'TRANSLATE_TEXT') {
    translateText(message.text, message.targetLang).then(result => {
      sendResponse({ translated: result, original: message.text });
    });
    return true;
  }

  if (message.type === 'GET_AI_STATUS') {
    ensureAISession().then(session => {
      sendResponse({ available: !!session });
    });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ language: 'en', showBubble: true, autoDetect: true });
});
