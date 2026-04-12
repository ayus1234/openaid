# OpenAid 🇮🇳 — AI Govt Scheme Finder

> "Empowering citizens through AI-driven government scheme discovery and accessibility."

OpenAid is a professional-grade dashboard designed to bridge the awareness gap in Indian government welfare. It features a high-fidelity glassmorphism interface and a sophisticated multi-language engine powered by **Google Gemini 2.5 Flash**.

---

## ✨ Features

- **🌐 Full Multi-Language Support**: Seamlessly switch between **English** and **Hindi** for the entire platform including UI, search results, and AI logic.
- **🎯 Dynamic Background Focus**: Premium "Focused Chat Mode" that elegantly blurs and dims the dashboard when the AI assistant is active.
- **🤖 Intelligent AI Explanations**: Real-time, localized eligibility insights powered by Gemini 2.5 Flash. Now with synchronized multi-language support.
- **💬 Smart Chat Assistant**: A context-aware chatbot that respects your language preference—replying in Hindi mode even if you type in English/Hinglish.
- **👤 Targeted Accessibility**: Optimized profile matching for rural and urban low-income groups (Farmers, Students, Laborers, Artisans).
- **📊 Match Scoring**: Real-time eligibility confidence scores for 20+ major schemes.
- **💎 High-Fidelity UI**: Modern glassmorphism design with deep shadows, smooth transitions, and mobile-first responsiveness.

---

## 🧱 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| **Frontend** | React 19 + Vite + CSS3 (Glassmorphism) |
| **Backend**  | Node.js + Express (Robust API Layer) |
| **AI Engine**| Google Gemini 2.5 Flash |
| **I18n**     | Custom Multi-Language Engine (EN/HI) |
| **Data**     | Curated JSON scheme dataset (20+ schemes) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone & Install
```bash
git clone https://github.com/ayus1234/scheme-connect.git
cd scheme-connect
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
│       ├── App.jsx      # Core dashboard logic
│       ├── translations.js # Multi-language dictionary
│       └── index.css    # Premium glassmorphism styles
├── server/              # Fast Express Backend
│   ├── index.js         # API and AI integration
│   └── schemes.json     # Localized scheme database
└── README.md
```

---

## 🏆 Hackathon Innovation

OpenAid was built to solve the **Awareness Crisis** in government welfare. By combining **localized AI logic** with a **mobile-first intuitive design**, it ensures that even the most digitally underserved citizens can find the help they are entitled to.

- **Localized AI**: Doesn't just translate text; it thinks in the user's preferred language.
- **Accessibility First**: Focused on speed, readability, and cultural relevance.
- **Scalable Design**: Modular architecture built to seamlessly integrate hundreds of additional state and central schemes.

