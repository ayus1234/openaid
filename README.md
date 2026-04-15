# OpenAid 🇮🇳 — AI Govt Scheme Finder

> "Empowering citizens through AI-driven government scheme discovery and accessibility."

OpenAid is a professional-grade dashboard designed to bridge the awareness gap in Indian government welfare. It features a high-fidelity glassmorphism interface and a sophisticated multi-language engine powered by **Google Gemini 2.5 Flash**.

---

## ✨ Features

- **🌓 Premium Theme Engine**: Seamlessly toggle between a premium, deep-space **Dark Mode** and a clean, high-contrast **Light Mode**.
- **🇮🇳 Total India Coverage**: Verified support for all **28 States and 8 Union Territories** with localized results for every region.
- **🎯 Dual-Government Selection**: Advanced filtering for both **Central Government** and **State Government** schemes.
- **📊 200+ Personalized Schemes**: A massive database of verified schemes across every category (General, SC, ST, OBC, EWS) and occupation.
- **🤖 Synchronized AI Assistant**: Context-aware chatbot powered by **Gemini 3.0 Flash** that is synchronized with the local scheme database for real-time, accurate advice.
- **🌐 Dual-Language Logic**: Full multi-language support (**English & Hindi**) for UI, eligibility logic, and AI consultations.
- **📱 Responsive Glassmorphism**: High-fidelity, mobile-first design that adapts perfectly to any device.
- **🛡️ Secure Connectivity**: Production-ready architecture with strict Content Security Policy (CSP) and verified official government portal links.

---

## 🧱 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| **Frontend** | React 19 + Vite + CSS3 (Glassmorphism) |
| **Backend**  | Node.js + Express (Robust API Layer) |
| **AI Engine**| Google Gemini 3.0 Flash |
| **Styling**  | Managed CSS Variables (Light/Dark themes) |
| **I18n**     | Custom Multi-Language Engine (EN/HI) |
| **Coverage** | 200+ Schemes (36 States & UTs) |
| **Security** | Netlify-optimized CSP Headers |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone & Install
```bash
git clone https://github.com/ayus1234/openaid.git
cd openaid
```

### 2. Configure Backend
```bash
cd server
npm install
# Create .env and add GEMINI_API_KEY
npm start
```

### 3. Launch Frontend
```bash
cd client
npm install
# Note: VITE_API_URL can be set if backend is not on standard localhost
npm run dev
```

---

## 📁 Project Structure

```
openaid/
├── client/              # High-fidelity React Frontend
│   └── src/
│       ├── App.jsx      # Core dashboard logic & theme management
│       ├── translations.js # Multi-language dictionary (all States/UTs)
│       └── index.css    # Premium glassmorphism & theme tokens
├── server/              # Fast Express Backend
│   ├── index.js         # API and AI integration (Smart Context Sync)
│   └── schemes.json     # All-India 200+ scheme database
├── netlify.toml         # Security and Deployment config
└── README.md
```

---

## 🏆 Innovation & Accessibility

OpenAid was built to solve the **Awareness Crisis** in government welfare. By combining **localized AI logic** with a **mobile-first intuitive design**, it ensures that even the most digitally underserved citizens can find the help they are entitled to.

- **Universal Data Coverage**: The only platform integrating localized eligibility for all 28 states and 8 union territories into a single context-aware experience.
- **Localized AI**: Doesn't just translate text; it thinks in the user's preferred language (Gemini 3.0 Flash).
- **Accessibility First**: Focused on speed, readability, and cultural relevance across all devices.
- **Data-Driven Advice**: Chatbot intelligence is synchronized with the live scheme database for zero-hallucination support.