const fs = require('fs');
const path = './server/schemes.json';
const schemes = JSON.parse(fs.readFileSync(path, 'utf8'));

console.log(`Total Schemes: ${schemes.length}`);

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const missingStates = states.filter(s => !schemes.some(scheme => scheme.state === s));

if (missingStates.length === 0) {
  console.log("✅ All 36 States/UTs have schemes!");
} else {
  console.log("❌ Missing states:", missingStates.join(', '));
}

// Deep personalization check (Kerala OBC Student)
const keralaOBC = schemes.filter(s => s.state === 'Kerala' && s.eligibility.category && s.eligibility.category.includes('OBC') && s.eligibility.occupation && s.eligibility.occupation.includes('Student'));
console.log(`Kerala OBC Student schemes: ${keralaOBC.length}`);
if (keralaOBC.length > 0) console.log(`✅ First match: ${keralaOBC[0].name}`);

// Deep personalization check (Delhi EWS Women)
const delhiEWSWomen = schemes.filter(s => s.state === 'Delhi' && s.eligibility.gender === 'Female' && (s.eligibility.incomeLimit || 0) >= 400000);
console.log(`Delhi EWS Women schemes: ${delhiEWSWomen.length}`);
if (delhiEWSWomen.length > 0) console.log(`✅ First match: ${delhiEWSWomen[0].name}`);
