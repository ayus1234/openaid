const fs = require('fs');
const path = './server/schemes.json';
const currentSchemes = JSON.parse(fs.readFileSync(path, 'utf8'));

// Only keep schemes that aren't already categorized clearly as State to avoid duplicates if re-run
const centralSchemes = currentSchemes.filter(s => s.type === 'Central');

const statesData = {
  "Andhra Pradesh": { portal: "https://jnanabhumi.ap.gov.in/", name_hi: "आंध्र प्रदेश" },
  "Arunachal Pradesh": { portal: "https://scholarships.gov.in/", name_hi: "अरुणाचल प्रदेश" },
  "Assam": { portal: "https://sewasetu.assam.gov.in/", name_hi: "असम" },
  "Bihar": { portal: "https://pmsonline.bihar.gov.in/", name_hi: "बिहार" },
  "Chhattisgarh": { portal: "https://postmatric-scholarship.cg.nic.in/", name_hi: "छत्तीसगढ़" },
  "Goa": { portal: "https://cmscholarship.goa.gov.in/", name_hi: "गोवा" },
  "Gujarat": { portal: "https://www.digitalgujarat.gov.in/", name_hi: "गुजरात" },
  "Haryana": { portal: "https://harchhatravratti.highereduhry.ac.in/", name_hi: "हरियाणा" },
  "Himachal Pradesh": { portal: "https://hpepass.cgg.gov.in/", name_hi: "हिमाचल प्रदेश" },
  "Jharkhand": { portal: "https://ekalyan.cgg.gov.in/", name_hi: "झारखंड" },
  "Karnataka": { portal: "https://ssp.postmatric.karnataka.gov.in/", name_hi: "कर्नाटक" },
  "Kerala": { portal: "https://www.egrantz.kerala.gov.in/", name_hi: "केरल" },
  "Madhya Pradesh": { portal: "https://hescholarship.mp.gov.in/", name_hi: "मध्य प्रदेश" },
  "Maharashtra": { portal: "https://mahadbt.maharashtra.gov.in/", name_hi: "महाराष्ट्र" },
  "Manipur": { portal: "https://scholarships.gov.in/", name_hi: "मणिपुर" },
  "Meghalaya": { portal: "https://scholarships.gov.in/", name_hi: "मेघालय" },
  "Mizoram": { portal: "https://scholarship.mizoram.gov.in/", name_hi: "मिजोरम" },
  "Nagaland": { portal: "https://scholarship.nagaland.gov.in/", name_hi: "नागालैंड" },
  "Odisha": { portal: "https://scholarship.odisha.gov.in/", name_hi: "ओडिशा" },
  "Punjab": { portal: "https://scholarships.punjab.gov.in/", name_hi: "पंजाब" },
  "Rajasthan": { portal: "https://sjms.rajasthan.gov.in/", name_hi: "राजस्थान" },
  "Sikkim": { portal: "https://scholarships.gov.in/", name_hi: "सिक्किम" },
  "Tamil Nadu": { portal: "https://ssp.tn.gov.in/", name_hi: "तमिलनाडु" },
  "Telangana": { portal: "https://telanganaepass.cgg.gov.in/", name_hi: "तेलंगाना" },
  "Tripura": { portal: "https://scholarships.gov.in/", name_hi: "त्रिपुरा" },
  "Uttar Pradesh": { portal: "https://scholarship.up.gov.in/", name_hi: "उत्तर प्रदेश" },
  "Uttarakhand": { portal: "https://scholarships.gov.in/", name_hi: "उत्तराखंड" },
  "West Bengal": { portal: "https://oasis.gov.in/", name_hi: "पश्चिम बंगाल" },
  "Andaman and Nicobar Islands": { portal: "https://scholarships.gov.in/", name_hi: "अंडमान और निकोबार द्वीप समूह" },
  "Chandigarh": { portal: "https://chdeducation.gov.in/", name_hi: "चंडीगढ़" },
  "Dadra and Nagar Haveli and Daman and Diu": { portal: "https://scholarships.gov.in/", name_hi: "दादरा और नगर हवेली और दमन और दीव" },
  "Delhi": { portal: "https://edistrict.delhigovt.nic.in/", name_hi: "दिल्ली" },
  "Jammu and Kashmir": { portal: "https://scholarships.gov.in/", name_hi: "जम्मू और कश्मीर" },
  "Ladakh": { portal: "https://scholarships.gov.in/", name_hi: "लद्दाख" },
  "Lakshadweep": { portal: "https://scholarships.gov.in/", name_hi: "लक्षद्वीप" },
  "Puducherry": { portal: "https://scholarships.gov.in/", name_hi: "पुडुचेरी" }
};

const allStateSchemes = [];

Object.entries(statesData).forEach(([state, info]) => {
  const safeState = state.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
  
  // 1. SC/ST Post Matric
  allStateSchemes.push({
    "type": "State",
    "state": state,
    "id": `${safeState}-sc-st-pms`,
    "name": `${state} Post Matric Scholarship (SC/ST)`,
    "name_hi": `${info.name_hi} पोस्ट मैट्रिक छात्रवृत्ति (SC/ST)`,
    "description": `Scholarship for SC/ST students in ${state} per state norms.`,
    "description_hi": `राज्य के मानदंडों के अनुसार ${info.name_hi} में अनुसूचित जाति/जनजाति के छात्रों के लिए छात्रवृत्ति।`,
    "benefits": "Tuition fees reimbursement and maintenance allowance.",
    "benefits_hi": "शिक्षण शुल्क की प्रतिूर्ति और रखरखाव भत्ता।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST"],
      "incomeLimit": 250000
    },
    "tags": ["Scholarship", state],
    "link": info.portal
  });

  // 2. OBC Post Matric
  allStateSchemes.push({
    "type": "State",
    "state": state,
    "id": `${safeState}-obc-pms`,
    "name": `${state} Post Matric Scholarship (OBC)`,
    "name_hi": `${info.name_hi} पोस्ट मैट्रिक छात्रवृत्ति (OBC)`,
    "description": `Scholarship for OBC students in ${state} based on merit/income.`,
    "description_hi": `योग्यता/आय के आधार पर ${info.name_hi} में ओबीसी छात्रों के लिए छात्रवृत्ति।`,
    "benefits": "Financial aid for higher education.",
    "benefits_hi": "उच्च शिक्षा के लिए वित्तीय सहायता।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["OBC"],
      "incomeLimit": 200000
    },
    "tags": ["Scholarship", state],
    "link": info.portal
  });

  // 3. EWS/General Merit
  allStateSchemes.push({
    "type": "State",
    "state": state,
    "id": `${safeState}-ews-general-merit`,
    "name": `${state} Merit Scholarship (EWS/General)`,
    "name_hi": `${info.name_hi} मेरिट छात्रवृत्ति (EWS/सामान्य)`,
    "description": `Merit-cum-means scholarship for EWS and General category students in ${state}.`,
    "description_hi": `${info.name_hi} में ईडब्ल्यूएस और सामान्य श्रेणी के छात्रों के लिए योग्यता-सह-साधन छात्रवृत्ति।`,
    "benefits": "Financial reward for meritorious students with low family income.",
    "benefits_hi": "कम पारिवारिक आय वाले मेधावी छात्रों के लिए वित्तीय इनाम।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["EWS", "General"],
      "incomeLimit": 800000
    },
    "tags": ["Scholarship", state],
    "link": info.portal
  });

  // 4. Agricultural Support
  allStateSchemes.push({
    "type": "State",
    "state": state,
    "id": `${safeState}-farmer-support`,
    "name": `${state} Agricultural & Farmer Support`,
    "name_hi": `${info.name_hi} कृषि और किसान सहायता`,
    "description": `State-sponsored DBT and technical support for farmers in ${state}.`,
    "description_hi": `${info.name_hi} में किसानों के लिए राज्य प्रायोजित डीबीटी (DBT) और तकनीकी सहायता।`,
    "benefits": "Direct financial aid, equipment subsidies, and crop insurance support.",
    "benefits_hi": "प्रत्यक्ष वित्तीय सहायता, उपकरण सब्सिडी और फसल बीमा सहायता।",
    "eligibility": {
      "occupation": ["Farmer"],
      "landholding": true
    },
    "tags": ["Agriculture", state],
    "link": info.portal
  });

  // 5. Women Welfare
  allStateSchemes.push({
    "type": "State",
    "state": state,
    "id": `${safeState}-women-welfare`,
    "name": `${state} Women Welfare & Empowerment`,
    "name_hi": `${info.name_hi} महिला कल्याण और सशक्तिकरण`,
    "description": `Comprehensive welfare scheme for girls and women in ${state}.`,
    "description_hi": `${info.name_hi} में लड़कियों और महिलाओं के लिए व्यापक कल्याणकारी योजना।`,
    "benefits": "Includes education incentives, health support, and self-employment grants.",
    "benefits_hi": "इसमें शिक्षा प्रोत्साहन, स्वास्थ्य सहायता और स्वरोजगार अनुदान शामिल हैं।",
    "eligibility": {
      "gender": "Female",
      "incomeLimit": 400000
    },
    "tags": ["Women Welfare", state],
    "link": info.portal
  });
});

fs.writeFileSync(path, JSON.stringify([...centralSchemes, ...allStateSchemes], null, 2));
console.log(`Successfully generated and appended ${allStateSchemes.length} schemes for 36 States/UTs.`);
