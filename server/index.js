const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

let model = null;
const initAI = () => {
  if (model) return model;
  if (!process.env.GEMINI_API_KEY) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  console.log('AI Model Initialized (Key starts with:', process.env.GEMINI_API_KEY.substring(0, 4) + '...)');
  return model;
};

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());

// Global Request Logger for Troubleshooting
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const schemes = JSON.parse(fs.readFileSync(path.join(__dirname, 'schemes.json'), 'utf8'));

// Professional Occupation Mapping
const occupationGroups = {
  "Software Engineer": ["Salaried Professional", "Professional"],
  "Doctor": ["Salaried Professional", "Professional"],
  "Teacher": ["Salaried Professional", "Professional"],
  "Engineer": ["Salaried Professional", "Professional"],
  "Business Owner": ["Entrepreneur", "Small Business"],
  "Daily Wage Worker": ["Laborer", "Unorganized Sector"],
  "Home Maker": ["Female", "Unemployed"],
  "Retired": ["Senior Citizen"],
  "Student": ["Student"]
};

const matchSchemes = (profile) => {
  return schemes.filter(scheme => {
    const e = scheme.eligibility;

    // 0. Scheme Type (Central/State) & State Check
    if (profile.schemeType === 'Central') {
      if (scheme.type !== 'Central') return false;
    } else if (profile.schemeType === 'State') {
      if (scheme.type !== 'State' || (scheme.state && scheme.state !== profile.state)) return false;
    }

    // 1. Universal Schemes Check
    // Some schemes like Insurance apply to everyone regardless of specific occupation
    if (e.universal) {
      if (e.gender && e.gender !== "All" && e.gender !== profile.gender) return false;
      const [min, max] = e.ageRange || [0, null];
      if (min && profile.age < min) return false;
      if (max && profile.age > max) return false;
      return true;
    }

    // 2. Gender check
    if (e.gender && e.gender !== "All" && e.gender !== profile.gender) return false;

    // 3. Age check
    if (e.ageRange) {
      const [min, max] = e.ageRange;
      if (min && profile.age < min) return false;
      if (max && profile.age > max) return false;
    }

    // 4. Income check
    if (e.incomeLimit && profile.income > e.incomeLimit) return false;

    // 5. Advanced Occupation check
    if (e.occupation) {
      // Get all valid matches for the user's occupation
      const userOccupations = [profile.occupation, ...(occupationGroups[profile.occupation] || [])];
      const hasMatch = e.occupation.some(occ => userOccupations.includes(occ));
      if (!hasMatch) return false;
    }

    // 6. Category check
    if (e.category && profile.category && !e.category.includes(profile.category)) return false;

    // 7. Landholding check
    if (e.landholding !== undefined && profile.landholding !== e.landholding) return false;

    return true;
  });
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/schemes', (req, res) => {
  res.json(schemes);
});

app.post('/api/match', (req, res) => {
  try {
    const profile = req.body;
    console.log('Matching schemes for profile:', profile);
    const matched = matchSchemes(profile);
    console.log(`Found ${matched.length} matched schemes.`);
    res.json(matched);
  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ error: 'Server error during matching' });
  }
});

app.post('/api/explain', async (req, res) => {
  const { scheme, profile } = req.body;
  
  const aiModel = initAI();
  if (!aiModel) {
    return res.json({ 
      en: `You are eligible for ${scheme.name} because you match the criteria. (AI disabled)`,
      hi: `आप ${scheme.name_hi || scheme.name} के लिए पात्र हैं क्योंकि आप मानदंडों से मेल खाते हैं। (AI अक्षम है)`
    });
  }

  try {
    const prompt = `You are a professional government scheme counselor. 
    Explain why this user is eligible for the "${scheme.name}" scheme. 
    User Profile: ${JSON.stringify(profile)}
    Scheme Benefits: ${scheme.benefits}
    
    Provide exactly two concise sentences:
    1. First sentence in English explaining why they are eligible.
    2. Second sentence in Hindi explaining the same.
    Do not use markdown. Just plain text.`;

    const result = await aiModel.generateContent(prompt);
    const text = result.response.text().trim();
    const lines = text.split('\n').filter(l => l.trim());
    
    res.json({ 
      en: lines[0] || text,
      hi: lines[1] || "प्राप्त जानकारी के अनुसार।"
    });
  } catch (error) {
    console.error('Gemini Explain error:', error);
    res.status(500).json({ error: 'AI explanation failed', detail: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, history = [], lang = 'en' } = req.body;
  console.log(`Incoming chat request [${lang}]:`, message);

  const aiModel = initAI();
  if (!aiModel) {
    console.warn('Chat failed: GEMINI_API_KEY is not set or model init failed');
    return res.json({ reply: lang === 'hi' ? "AI अक्षम है। कृपया Gemini API कुंजी जोड़ें।" : "AI is disabled. Please add a Gemini API key." });
  }

  try {
    const languageName = lang === 'hi' ? 'Hindi' : 'English';
    const systemPrompt = `You are OpenAid, a helpful assistant for Indian government welfare schemes. 
Know about: PM Kisan, Ayushman Bharat, PM Ujjwala, MUDRA Yojana, PM Vidyalaxmi, Atal Pension, PM Vishwakarma, and more.
STRICT RULE: You must respond ONLY in ${languageName}. 
Even if the user types in English, if the language mode is ${languageName}, you must reply ONLY in ${languageName}.
Keep answers short, friendly and professional.`;

    const fullMessage = history.length === 0
      ? `${systemPrompt}\n\nUser: ${message}\nAssistant [In ${languageName}]:`
      : `${systemPrompt}\n\n${history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}\nUser: ${message}\nAssistant [In ${languageName}]:`;

    const result = await aiModel.generateContent(fullMessage);
    res.json({ reply: result.response.text().trim() });
  } catch (error) {
    console.error('Chat error full:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ error: 'Chat failed', detail: error.message });
  }
});

// Alias routes for resilience
app.post('/match', (req, res) => res.redirect(307, '/api/match'));
app.post('/chat', (req, res) => res.redirect(307, '/api/chat'));
app.post('/explain', (req, res) => res.redirect(307, '/api/explain'));

// Serve built client
const clientBuild = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

const PORT = process.env.PORT || 5000;
console.log('Starting server, PORT env:', process.env.PORT);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
