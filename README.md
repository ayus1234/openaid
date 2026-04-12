# OpenAid 🇮🇳 — AI Govt Scheme Finder

> "Bridging the gap between citizens and government welfare schemes using AI"

OpenAid helps Indian citizens discover government schemes they are eligible for — with AI-powered explanations in both **English and Hindi**.

---

## ✨ Features

- 👤 User profile form (age, income, state, category, occupation)
- 🎯 Smart scheme matching engine across 20+ major Indian schemes
- 🤖 AI explanations via Google Gemini (why you're eligible, in Hindi + English)
- 🔗 Direct links to official scheme portals
- 📊 Eligibility match score per scheme
- 📱 Clean, mobile-friendly glassmorphism UI

---

## 🧱 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 19 + Vite                   |
| Backend    | Node.js + Express                 |
| AI         | Google Gemini 2.5 Flash API       |
| Data       | Curated JSON dataset (20 schemes) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/ayus1234/scheme-connect.git
cd scheme-connect
```

### 2. Setup the backend
```bash
cd server
cp .env.example .env
# Add your GEMINI_API_KEY to .env
npm install
node index.js
```

### 3. Setup the frontend
```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

---

## 📁 Project Structure

```
openaid/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── App.jsx
│       └── index.css
├── server/          # Node.js backend
│   ├── index.js
│   ├── schemes.json # Curated scheme dataset
│   └── .env.example
├── README.md
└── .gitignore
```

---

## 🎤 Demo Flow

1. Fill in your profile (age, income, occupation, category)
2. Click "Find Eligible Schemes"
3. Browse matched schemes with eligibility scores
4. Click "✨ Why am I eligible?" for an AI explanation in Hindi + English
5. Click "View Full Details" to go to the official scheme portal

---

## 🏆 Hackathon Highlights

- Built for **rural accessibility** and **digital inclusion**
- Supports **Hindi** for wider reach
- Bridges the **awareness gap** in government welfare
- Open-source and designed for **scalability**

---

## 📄 License

MIT © 2026 [ayus1234](https://github.com/ayus1234)
