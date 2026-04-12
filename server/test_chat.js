const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const prompt = `You are OpenAid, a helpful assistant for Indian government welfare schemes. Answer in English and Hindi briefly.

User: What schemes are available for farmers?`;

model.generateContent(prompt)
  .then(r => console.log('✅ Chat works:\n', r.response.text().substring(0, 300)))
  .catch(e => console.error('❌ Error:', e.message));
