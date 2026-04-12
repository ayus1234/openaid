const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const schemes = JSON.parse(fs.readFileSync(path.join(__dirname, 'schemes.json'), 'utf8'));

const occupationGroups = {
  "Software Engineer": ["Salaried Professional", "Professional"],
  "Business Owner": ["Entrepreneur", "Small Business"],
  "Daily Wage Worker": ["Laborer", "Unorganized Sector"],
  "Home Maker": ["Female", "Unemployed"],
  "Retired": ["Senior Citizen"],
  "Student": ["Student"]
};

const matchSchemes = (profile) => {
  return schemes.filter(scheme => {
    const e = scheme.eligibility;
    if (e.universal) {
      if (e.gender && e.gender !== "All" && e.gender !== profile.gender) return false;
      const [min, max] = e.ageRange || [0, null];
      if (min && profile.age < min) return false;
      if (max && profile.age > max) return false;
      return true;
    }
    if (e.gender && e.gender !== "All" && e.gender !== profile.gender) return false;
    if (e.ageRange) {
      const [min, max] = e.ageRange;
      if (min && profile.age < min) return false;
      if (max && profile.age > max) return false;
    }
    if (e.incomeLimit && profile.income > e.incomeLimit) return false;
    if (e.occupation) {
      const userOccupations = [profile.occupation, ...(occupationGroups[profile.occupation] || [])];
      const hasMatch = e.occupation.some(occ => userOccupations.includes(occ));
      if (!hasMatch) return false;
    }
    if (e.category && profile.category && !e.category.includes(profile.category)) return false;
    if (e.landholding !== undefined && profile.landholding !== e.landholding) return false;
    return true;
  });
};

async function runFullTest() {
  console.log('=== OpenAid Full Test Suite ===\n');

  // Test 1: Scheme Matching
  console.log('--- Test 1: Scheme Matching ---');
  const testCases = [
    { profile: { age: 25, gender: "Male", occupation: "Farmer", income: 50000, category: "General", landholding: true }, expectedMin: 1, label: "Farmer with land" },
    { profile: { age: 20, gender: "Male", occupation: "Student", income: 30000, category: "SC" }, expectedMin: 1, label: "SC Student" },
    { profile: { age: 65, gender: "Male", occupation: "Retired", income: 200000, category: "General" }, expectedMin: 1, label: "Senior Citizen" },
    { profile: { age: 30, gender: "Female", occupation: "Entrepreneur", income: 300000, category: "SC" }, expectedMin: 1, label: "Female SC Entrepreneur" },
    { profile: { age: 35, gender: "Male", occupation: "Laborer", income: 100000, category: "General" }, expectedMin: 1, label: "Laborer" },
  ];

  let passed = 0;
  for (const tc of testCases) {
    const matches = matchSchemes(tc.profile);
    const ok = matches.length >= tc.expectedMin;
    console.log(`  ${ok ? '✅' : '❌'} ${tc.label}: ${matches.length} schemes matched`);
    if (ok) passed++;
  }
  console.log(`  Result: ${passed}/${testCases.length} passed\n`);

  // Test 2: AI Integration
  console.log('--- Test 2: Gemini AI Integration ---');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const profile = { age: 25, gender: "Male", occupation: "Farmer", income: 50000 };
    const scheme = schemes.find(s => s.id === 'pm-kisan');
    
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
    const lines = text.split('\n').filter(l => l.trim());
    
    console.log('  ✅ AI Response received');
    console.log(`  English: ${lines[0]?.substring(0, 80)}...`);
    console.log(`  Hindi: ${lines[1]?.substring(0, 80)}...`);
  } catch (e) {
    console.log('  ❌ AI Error:', e.message);
  }

  console.log('\n=== Test Complete ===');
}

runFullTest();
