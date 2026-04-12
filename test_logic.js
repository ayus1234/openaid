const fs = require('fs');
const path = require('path');

// Mocking the backend logic
const schemes = JSON.parse(fs.readFileSync('server/schemes.json', 'utf8'));

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

const testProfiles = [
  { name: "Student", age: 20, gender: "Male", occupation: "Student", income: 50000, category: "General" },
  { name: "Senior Citizen", age: 65, gender: "Male", occupation: "Retired", income: 200000, category: "General" },
  { name: "Professional", age: 30, gender: "Female", occupation: "Software Engineer", income: 1200000, category: "General" },
  { name: "Artisan", age: 40, gender: "Male", occupation: "Artisan", income: 100000, category: "OBC" },
  { name: "Middle Class Housing", age: 35, gender: "Male", occupation: "Teacher", income: 800000, category: "General", urban: true }
];

testProfiles.forEach(p => {
  const matches = matchSchemes(p);
  console.log(`Profile: ${p.name} | Found: ${matches.length} schemes`);
  matches.forEach(m => console.log(`  - ${m.name}`));
});
