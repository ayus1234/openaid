const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Key present:', !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

model.generateContent('Say hello in one word')
  .then(r => console.log('AI Response:', r.response.text()))
  .catch(e => console.error('AI Error:', e.message));
