# OpenAid 🇮🇳 — AI Govt Scheme Finder

> "Empowering citizens through AI-driven government scheme discovery and accessibility."

OpenAid is a professional-grade dashboard designed to bridge the awareness gap in Indian government welfare. It features a high-fidelity glassmorphism interface and a sophisticated multi-language engine powered by **Google Gemini 1.5 Flash**.

---

## ✨ Features

- **🌓 Dual-Theme Support**: Seamlessly toggle between a premium, deep-space **Dark Mode** and a clean, high-contrast **Light Mode**.
- **📱 Mobile-First Design**: Fully responsive architecture that adapts perfectly to smartphones, tablets, and desktops.
- **🌐 Full Multi-Language Support**: Seamlessly switch between **English** and **Hindi** for the entire platform including UI, search results, and AI logic.
- **🎯 Dynamic Background Focus**: Premium "Focused Chat Mode" that elegantly blurs and dims the dashboard when the AI assistant is active.
- **🤖 Intelligent AI Explanations**: Real-time, localized eligibility insights powered by Gemini 1.5 Flash. Now with synchronized multi-language support (English/Hindi).
- **💬 Context-Aware Chatbot**: A smart assistant that respects your language preference—replying in Hindi mode even if you type in English/Hinglish.
- **🛡️ Security Hardened**: Production-ready configuration with strict Content Security Policy (CSP) and optimized headers for Netlify.
- **📊 Real-time Matching**: Instant eligibility confidence scores for 20+ major schemes with localized "No Match" feedback.

---

## 🧱 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| **Frontend** | React 19 + Vite + CSS3 (Glassmorphism) |
| **Backend**  | Node.js + Express (Robust API Layer) |
| **AI Engine**| Google Gemini 1.5 Flash |
| **Styling**  | Managed CSS Variables (Light/Dark themes) |
| **I18n**     | Custom Multi-Language Engine (EN/HI) |
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
npm run dev
```

---

## 📁 Project Structure

```
openaid/
├── client/              # High-fidelity React Frontend
│   └── src/
│       ├── App.jsx      # Core dashboard logic & theme management
│       ├── translations.js # Multi-language dictionary
│       └── index.css    # Premium glassmorphism & theme tokens
├── server/              # Fast Express Backend
│   ├── index.js         # API and AI integration
│   └── schemes.json     # Localized scheme database
├── netlify.toml         # Security and Deployment config
└── README.md
```

---

## 🏆 Innovation & Accessibility

OpenAid was built to solve the **Awareness Crisis** in government welfare. By combining **localized AI logic** with a **mobile-first intuitive design**, it ensures that even the most digitally underserved citizens can find the help they are entitled to.

- **Localized AI**: Doesn't just translate text; it thinks in the user's preferred language.
- **Accessibility First**: Focused on speed, readability, and cultural relevance across all devices.
- **Scalable Design**: Modular architecture built to seamlessly integrate hundreds of additional state and central schemes.