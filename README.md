# 🛡️ Janhit — Privacy Policy Simplifier

**Janhit** (जनहित) is a Chrome extension that translates complex privacy policies and terms of service into plain, casual language — so you know what you're actually agreeing to before you click "I Agree."

## Features

- 🔍 **Auto-detects** privacy/legal pages as you browse
- 💬 **Floating bubble** appears on detected pages
- 📝 **Simplifies** legal jargon into simple bullet-point summaries
- 📊 **Identifies** what personal data the site collects (email, location, payment info, etc.)
- 🌐 **Translates** summaries into 20+ languages (Hindi, Bengali, Tamil, Spanish, French, etc.)
- ✅ **You decide** — "I Understand & Proceed" or "Go Back"

## How It Works

1. Visit any privacy policy, terms of service, or legal page
2. A blue Janhit bubble appears at the bottom-right
3. Click it to open the analysis panel
4. Read the simplified summary in your preferred language
5. Make an informed choice — agree or leave

## Installation

### From Chrome Web Store (coming soon)

### Developer Mode (manual)

1. Download or clone this repo
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the `janhit` folder
5. Visit any privacy policy page to test

## Project Structure

```
janhit/
├── manifest.json          # Extension manifest (v3)
├── background.js          # Service worker — AI processing, translation, heuristics
├── content.js             # Content script — page detection, bubble, panel UI
├── styles.css             # Panel & bubble styling
├── popup.html             # Extension popup settings
├── popup.js               # Popup logic
├── icons/                 # Extension icons (16, 48, 128 PNG)
├── .gitignore
└── README.md
```

## Languages Supported

English, हिन्दी, বাংলা, తెలుగు, मराठी, தமிழ், اردو, ગુજરાતી, ಕನ್ನಡ, മലയാളം, ਪੰਜਾਬੀ, Español, Français, Deutsch, 中文, 日本語, 한국어, العربية, Português, Русский

## How Analysis Works

1. **On-device AI** (Chrome Prompt API) — if available, uses local AI for natural simplification
2. **Heuristic fallback** — keyword-based extraction when AI is unavailable
3. **Google Translate API** — for non-English translation

## Tech Stack

- Chrome Extension Manifest V3
- Vanilla JavaScript (no frameworks)
- SVG-based custom logo & icons
- Google Translate API (unofficial, for translation)
- Chrome Prompt API (on-device AI, optional)

## License

MIT
