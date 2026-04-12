const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function check() {
  console.log('--- GEMINI KEY DIAGNOSTICS ---');
  console.log('Key:', process.env.GEMINI_API_KEY ? 'Present' : 'MISSING');
  
  try {
    // List models
    const models = await genAI.listModels();
    console.log('Available Models:', models.models.map(m => m.name));
    
    // Try to find any flash model
    const flashModel = models.models.find(m => m.name.includes('flash'))?.name;
    console.log('Selected Model:', flashModel || 'gemini-1.5-flash');
    
    const model = genAI.getGenerativeModel({ model: flashModel || "gemini-1.5-flash" });
    const result = await model.generateContent("Test connection. Reply with 'OK'.");
    console.log('Response:', result.response.text());
  } catch (err) {
    console.log('❌ Error Code:', err.status || 'No status');
    console.log('❌ Error Message:', err.message);
  }
}

check();
