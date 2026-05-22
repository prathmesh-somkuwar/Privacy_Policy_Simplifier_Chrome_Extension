
# 🛡️ Janhit — Privacy Policy Simplifier

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&pause=500&color=00D4AA&center=true&vCenter=true&width=700&lines=USE+JANHIT+STAY+SAFE;PRIVACY+POLICIES+TRANSLATED;SIMPLIFY+LEGAL+JARGON;SECURE+🟢" alt="Typing SVG" />
</p>

<p align="center">
<sub>Built by Prathamesh Somkuwar | Nagpur, Maharashtra, India | Security Odyssey 🏛️</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-00D4AA?style=for-the-badge&logo=google-chrome&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-3776AB?style=for-the-badge&logo=javascript&logoColor=white" />
  <img src="https://img.shields.io/badge/Chrome-Prompt_API-00D4AA?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMEQ0QUEiLz4KPHRleHQgeD0iMjAiIHk9IjI0IiBmb250LWZhbWlseT0iRmlyYSBDb2RlIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2hyb21lPC90ZXh0Pgo=" />
  <img src="https://img.shields.io/badge/Google_Translate-API-00D4AA?style=for-the-badge&logo=googletranslate&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-LIVE-EA4C46?style=for-the-badge&logo=radioactive&logoColor=white" />
</p>

---

## 🎯 **Mission Brief**
```
Target      : Privacy policies, terms of service, and data‑processing pages  
Threat Model: Legal‑jargon overload, hidden data collection, uninformed consent  
Objective   : Real‑time, casual‑language summaries in 20+ languages so users know what they’re agreeing to  

Transformed legalese → Simple, human‑friendly insights

| Metric                 | Pre‑Mission    | Post‑Mission                          | Improvement |
|------------------------|----------------|---------------------------------------|-------------|
| 📜 Policy Readability | Dense legalese  | Bullet‑point summaries                | +∞          |
| 🌐 Language Coverage  | English‑only    | 20+ languages                         | +95%        |
| 🛡️ User Control       | Blind "I Agree" | "I Understand & Proceed" or "Go Back" | +100%       |
| 📊 Data Transparency  | Hidden clauses  | Explicit data‑collection tags         | +100%       |
```
---

## ⚙️ **Installation (Developer Mode)**

```bash
# 1. Clone repo
git clone https://github.com/prathmesh-somkuwar/janhit.git
cd janhit

# 2. Open Chrome
# Go to chrome://extensions
# Enable Developer mode (top-right toggle)

# 3. Load unpacked
# Click "Load unpacked" → select the janhit folder

# 4. Test
# Visit any privacy policy page (e.g., /privacy, /terms)
# Click the blue Janhit bubble to open the analysis panel
```

---

## 📱 **Extension View**

<img width="1906" height="856" alt="Screenshot 2026-05-22 152103" src="https://github.com/user-attachments/assets/a4c954a2-5901-4cd8-b308-fe82d75792db" />


---

## 📂 **Project Structure**
```
janhit/
├── manifest.json     # ⭐ Extension manifest (Manifest V3)
├── background.js     # ⭐ Service worker — AI, translation, heuristics
├── content.js        # ⭐ Content script — page detection, bubble, panel UI
├── styles.css        # 🎨 Panel & bubble styling
├── popup.html        # ⭐ Extension popup settings
├── popup.js          # ⭐ Popup logic
├── icons/            # 🎯 Extension icons (16, 48, 128 PNG)
├── .gitignore
└── README.md         # 📄 This file
```


---

## 🛡️ **Ethical Disclaimer** ⚠️
```
This tool is for EDUCATIONAL PURPOSES ONLY:

✅ Use on YOUR OWN devices and browsers

✅ Great for understanding privacy policies

✅ Encourages informed consent

❌ Do NOT modify or distribute altered versions without clear attribution

❌ Do NOT use this extension to bypass or misrepresent legal terms

❌ Always respect user privacy, local laws, and applicable terms of service

```

---

## 🚀 **How Analysis Works**
```

- On‑device AI (Chrome Prompt API) — uses local AI to simplify policy text when available.  
- Heuristic fallback               — keyword‑based extraction when AI is not available (matches patterns like “email”, “location”, “payment”, “cookies”, “device”, “tracking”).  
- Google Translate API             — translates summaries into non‑English languages when required.  

  User Flow:
1. Open a privacy policy or terms page.  
2. Janhit detects the page and shows a blue bubble.  
3. User clicks the bubble → opens the analysis panel.  
4. Extension extracts key clauses, tags data types, and summarizes in bullet points.  
5. User chooses: **"I Understand & Proceed"** or **"Go Back"**.
```
---

## 🌐 **Languages Supported**
```
- English  
- हिन्दी (Hindi)  
- বাংলা (Bengali)  
- తెలుగు (Telugu)  
- मराठी (Marathi)  
- தமிழ் (Tamil)  
- اردو (Urdu)  
- ગુજરાતી (Gujarati)  
- ಕನ್ನಡ (Kannada)  
- മലയാളം (Malayalam)  
- ਪੰਜਾਬੀ (Punjabi)  
- Español (Spanish)  
- Français (French)  
- Deutsch (German)  
- 中文 (Chinese)  
- 日本語 (Japanese)  
- 한국어 (Korean)  
- العربية (Arabic)  
- Português (Portuguese)  
- Русский (Russian)
```
---

## 🛠️ **Tech Stack**
```

| Component          | Technology                                                   |
|--------------------|--------------------------------------------------------------|
|   Platform         | Chrome Extension (Manifest V3)                               |
|   Core Logic       | Vanilla JavaScript (no frameworks)                           |
|   Simplification   | Chrome Prompt API (on‑device AI, optional)                   |
|   Translation      | Google Translate API (unofficial)                            |
|   UI               | HTML + CSS + SVG icons                                       |
|   Detection        | Content‑script page‑heuristics (privacy/term keywords, URLs) |
```
---
📄 License
```
MIT License - Educational Use Only
Copyright (c) 2026 Prathamesh Somkuwar

For Educational and Ethical Practice only.
```


---

<p align="center">
<sub>⭐ Built by Prathamesh Somkuwar | Nagpur, Maharashtra, India | <a href="https://www.linkedin.com/in/prathamesh-somkuwar-a15ab4248/">LinkedIn</a> | Security Odyssey 🏛️ ⭐</sub>
</p>
