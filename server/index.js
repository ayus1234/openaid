const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

let model = null;
if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });
}

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());

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
  
  if (!process.env.GEMINI_API_KEY) {
    return res.json({ 
      explanation: `You are eligible for ${scheme.name} because you match the criteria. (AI disabled - Add API Key for detailed insights)`,
      hindi: `आप ${scheme.name} के लिए पात्र हैं। (AI अक्षम - विस्तृत जानकारी के लिए API कुंजी जोड़ें)`
    });
  }

  try {
    const prompt = `You are a professional government scheme counselor. 
    Explain why this user is eligible for the "${scheme.name}" scheme.
    User Profile: ${JSON.stringify(profile)}
    Scheme Benefits: ${scheme.benefits}
    
    Provide exactly two sentences:
    1. One concise sentence in English explaining the specific benefit they match.
    2. One concise sentence in Hindi for the same.
    Do not use markdown. Just plain text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const [english, hindi] = text.split('\n').filter(l => l.trim());

    res.json({ explanation: english || text, hindi: hindi || "प्राप्त जानकारी के अनुसार।" });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: 'AI explanation failed' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ reply: "AI is disabled. Please add a Gemini API key." });
  }

  try {
    const systemPrompt = `You are OpenAid, a helpful assistant for Indian government welfare schemes. 
Know about: PM Kisan, Ayushman Bharat, PM Ujjwala, MUDRA Yojana, PM Vidyalaxmi, Atal Pension, PM Vishwakarma, and more.
Always reply in both English and Hindi. Keep answers short and friendly.`;

    const fullMessage = history.length === 0
      ? `${systemPrompt}\n\nUser: ${message}`
      : `${systemPrompt}\n\n${history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n')}\nUser: ${message}`;

    const result = await model.generateContent(fullMessage);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error('Chat error full:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ error: 'Chat failed', detail: error.message });
  }
});

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
