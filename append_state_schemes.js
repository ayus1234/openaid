const fs = require('fs');
const path = './server/schemes.json';
const schemes = JSON.parse(fs.readFileSync(path, 'utf8'));

const stateSchemes = [
  {
    "type": "State",
    "state": "Uttar Pradesh",
    "id": "up-pms-sc",
    "name": "UP Post Matric Scholarship (SC/ST/General)",
    "name_hi": "यूपी पोस्ट मैट्रिक छात्रवृत्ति (SC/ST/सामान्य)",
    "description": "Scholarship for students in UP from SC, ST and General categories.",
    "description_hi": "SC, ST और सामान्य श्रेणियों के यूपी के छात्रों के लिए छात्रवृत्ति।",
    "benefits": "Full tuition fee reimbursement and maintenance allowance.",
    "benefits_hi": "पूर्ण शिक्षण शुल्क प्रतिपूर्ति और रखरखाव भत्ता।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST", "General", "EWS"],
      "incomeLimit": 250000
    },
    "tags": ["Scholarship", "UP"],
    "link": "https://scholarship.up.gov.in/"
  },
  {
    "type": "State",
    "state": "Uttar Pradesh",
    "id": "up-pms-obc",
    "name": "UP Post Matric Scholarship (OBC)",
    "name_hi": "यूपी पोस्ट मैट्रिक छात्रवृत्ति (OBC)",
    "description": "Scholarship for OBC students in Uttar Pradesh.",
    "description_hi": "उत्तर प्रदेश में ओबीसी छात्रों के लिए छात्रवृत्ति।",
    "benefits": "Reimbursement of fees and fixed monthly allowance.",
    "benefits_hi": "शुल्क की प्रतिपूर्ति और निश्चित मासिक भत्ता।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["OBC"],
      "incomeLimit": 200000
    },
    "tags": ["Scholarship", "UP"],
    "link": "https://scholarship.up.gov.in/"
  },
  {
    "type": "State",
    "state": "Bihar",
    "id": "bihar-pms-bc-ebc",
    "name": "Bihar Post Matric Scholarship (BC/EBC)",
    "name_hi": "बिहार पोस्ट मैट्रिक छात्रवृत्ति (BC/EBC)",
    "description": "Financial assistance for BC and EBC students in Bihar.",
    "description_hi": "बिहार में बीसी और ईबीसी छात्रों के लिए वित्तीय सहायता।",
    "benefits": "Scholarship amount based on course fee and maintenance.",
    "benefits_hi": "पाठ्यक्रम शुल्क और रखरखाव के आधार पर छात्रवृत्ति राशि।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["OBC"],
      "incomeLimit": 300000
    },
    "tags": ["Scholarship", "Bihar"],
    "link": "https://pmsonline.bih.nic.in/"
  },
  {
    "type": "State",
    "state": "Bihar",
    "id": "bihar-kanya-utthan",
    "name": "Mukhyamantri Kanya Utthan Yojana",
    "name_hi": "मुख्यमंत्री कन्या उत्थान योजना",
    "description": "Incentive for girl students in Bihar to promote education.",
    "description_hi": "शिक्षा को बढ़ावा देने के लिए बिहार में छात्राओं के लिए प्रोत्साहन।",
    "benefits": "Financial reward of up to ₹50,000 upon graduation.",
    "benefits_hi": "स्नातक होने पर ₹50,000 तक का वित्तीय इनाम।",
    "eligibility": {
      "gender": "Female",
      "occupation": ["Student"],
      "state": "Bihar"
    },
    "tags": ["Women Welfare", "Bihar"],
    "link": "https://edudbt.bih.nic.in/"
  },
  {
    "type": "State",
    "state": "Maharashtra",
    "id": "maha-ebc-fees",
    "name": "Rajarshi Chhatrapati Shahu Maharaj Fee Reimbursement",
    "name_hi": "राजर्षि छत्रपति शाहू महाराज शुल्क प्रतिपूर्ति",
    "description": "50% fee reimbursement for EWS and OBC students in Maharashtra.",
    "description_hi": "महाराष्ट्र में ईडब्ल्यूएस और ओबीसी छात्रों के लिए 50% शुल्क प्रतिपूर्ति।",
    "benefits": "50% reduction in tuition and exam fees for professional courses.",
    "benefits_hi": "व्यावसायिक पाठ्यक्रमों के लिए शिक्षण और परीक्षा शुल्क में 50% की कमी।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["EWS", "OBC", "General"],
      "incomeLimit": 800000
    },
    "tags": ["Education", "Maharashtra"],
    "link": "https://mahadbt.maharashtra.gov.in/"
  },
  {
    "type": "State",
    "state": "Maharashtra",
    "id": "maha-swadhar",
    "name": "Dr. Babasaheb Ambedkar Swadhar Yojana",
    "name_hi": "डॉ. बाबासाहेब अंबेडकर स्वाधार योजना",
    "description": "Scholarship for SC/Nav-Buddhist students for higher education in Maharashtra.",
    "description_hi": "महाराष्ट्र में उच्च शिक्षा के लिए अनुसूचित जाति/नव-बौद्ध छात्रों के लिए छात्रवृत्ति।",
    "benefits": "Maintenance allowance of up to ₹60,000 per year for living expenses.",
    "benefits_hi": "रहने के खर्च के लिए प्रति वर्ष ₹60,000 तक का रखरखाव भत्ता।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC"],
      "incomeLimit": 250000
    },
    "tags": ["Education", "Maharashtra"],
    "link": "https://sjsa.maharashtra.gov.in/"
  },
  {
    "type": "State",
    "state": "Karnataka",
    "id": "karnataka-ssp-sc-st",
    "name": "Karnataka Post Matric Scholarship (SC/ST)",
    "name_hi": "कर्नाटक पोस्ट मैट्रिक छात्रवृत्ति (SC/ST)",
    "description": "Scholarship for SC/ST students in Karnataka through SSP.",
    "description_hi": "SSP के माध्यम से कर्नाटक में SC/ST छात्रों के लिए छात्रवृत्ति।",
    "benefits": "Course fee reimbursement and monthly stipend.",
    "benefits_hi": "पाठ्यक्रम शुल्क प्रतिपूर्ति और मासिक वजीफा।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST"],
      "incomeLimit": 250000
    },
    "tags": ["Scholarship", "Karnataka"],
    "link": "https://ssp.postmatric.karnataka.gov.in/"
  },
  {
    "type": "State",
    "state": "Karnataka",
    "id": "karnataka-vidyasiri",
    "name": "Karnataka Vidyasiri (Food & Accommodation)",
    "name_hi": "कर्नाटक विद्यासिरी (भोजन और आवास)",
    "description": "Food and accommodation allowance for OBC students in Karnataka.",
    "description_hi": "कर्नाटक में ओबीसी छात्रों के लिए भोजन और आवास भत्ता।",
    "benefits": "₹1,500 per month for food and hostel expenses.",
    "benefits_hi": "भोजन और छात्रावास के खर्च के लिए ₹1,500 प्रति माह।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["OBC"],
      "incomeLimit": 200000
    },
    "tags": ["Scholarship", "Karnataka"],
    "link": "https://backwardclasses.kar.nic.in/"
  },
  {
    "type": "State",
    "state": "Tamil Nadu",
    "id": "tn-adim-pms",
    "name": "TN Post Matric Scholarship (Adi Dravidar/Tribal)",
    "name_hi": "तमिलनाडु पोस्ट मैट्रिक छात्रवृत्ति (आदि द्रविड़/जनजाति)",
    "description": "Scholarship for SC/ST students in Tamil Nadu.",
    "description_hi": "तमिलनाडु में SC/ST छात्रों के लिए छात्रवृत्ति।",
    "benefits": "Maintenance allowance and special fees reimbursement.",
    "benefits_hi": "रखरखाव भत्ता और विशेष शुल्क प्रतिपूर्ति।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST"],
      "incomeLimit": 250000
    },
    "tags": ["Scholarship", "Tamil Nadu"],
    "link": "https://www.tn.gov.in/scheme/data_view/40432"
  },
  {
    "type": "State",
    "state": "Rajasthan",
    "id": "rajasthan-pms-sc-st-obc",
    "name": "Rajasthan Post Matric Scholarship",
    "name_hi": "राजस्थान पोस्ट मैट्रिक छात्रवृत्ति",
    "description": "Financial aid for students of Rajasthan belonging to SC, ST and OBC.",
    "description_hi": "SC, ST और OBC से संबंधित राजस्थान के छात्रों के लिए वित्तीय सहायता।",
    "benefits": "Scholarship for education and professional courses.",
    "benefits_hi": "शिक्षा और व्यावसायिक पाठ्यक्रमों के लिए छात्रवृत्ति।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST", "OBC", "SBC"],
      "incomeLimit": 250000
    },
    "tags": ["Scholarship", "Rajasthan"],
    "link": "https://sjms.rajasthan.gov.in/sjms/Login.aspx"
  },
  {
    "type": "State",
    "state": "West Bengal",
    "id": "wb-oasis-pms",
    "name": "West Bengal Oasis Scholarship",
    "name_hi": "पश्चिम बंगाल ओएसिस छात्रवृत्ति",
    "description": "Scholarship portal for SC, ST and OBC students in West Bengal.",
    "description_hi": "पश्चिम बंगाल में SC, ST और OBC छात्रों के लिए छात्रवृत्ति पोर्टल।",
    "benefits": "Grant for pre-matric and post-matric education.",
    "benefits_hi": "प्री-मैट्रिक और पोस्ट-मैट्रिक शिक्षा के लिए अनुदान।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST", "OBC"],
      "incomeLimit": 250000
    },
    "tags": ["Scholarship", "West Bengal"],
    "link": "https://oasis.gov.in/"
  },
  {
    "type": "State",
    "state": "Delhi",
    "id": "delhi-pms-sc-st-obc",
    "name": "Delhi SC/ST/OBC Scholarship",
    "name_hi": "दिल्ली SC/ST/OBC छात्रवृत्ति",
    "description": "State-funded scholarship for Delhi residents.",
    "description_hi": "दिल्ली के निवासियों के लिए राज्य वित्त पोषित छात्रवृत्ति।",
    "benefits": "Maintenance and fee reimbursement for higher education.",
    "benefits_hi": "उच्च शिक्षा के लिए रखरखाव और शुल्क प्रतिपूर्ति।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST", "OBC"],
      "incomeLimit": 250000
    },
    "tags": ["Scholarship", "Delhi"],
    "link": "https://edistrict.delhigovt.nic.in/"
  },
  {
    "type": "State",
    "state": "Madhya Pradesh",
    "id": "mp-pms-sc-st-obc",
    "name": "MP Post Matric Scholarship",
    "name_hi": "एमपी पोस्ट मैट्रिक छात्रवृत्ति",
    "description": "Scholarship for backward classes in Madhya Pradesh.",
    "description_hi": "मध्य प्रदेश में पिछड़े वर्गों के लिए छात्रवृत्ति।",
    "benefits": "Financial support for higher education.",
    "benefits_hi": "उच्च शिक्षा के लिए वित्तीय सहायता।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST", "OBC"],
      "incomeLimit": 300000
    },
    "tags": ["Scholarship", "Madhya Pradesh"],
    "link": "https://www.scholarshipportal.mp.nic.in/"
  },
  {
    "type": "State",
    "state": "Gujarat",
    "id": "gujarat-digital-guj-pms",
    "name": "Digital Gujarat Post Matric Scholarship",
    "name_hi": "डिजिटल गुजरात पोस्ट मैट्रिक छात्रवृत्ति",
    "description": "Portal for various state scholarships in Gujarat.",
    "description_hi": "गुजरात में विभिन्न राज्य छात्रवृत्तियों के लिए पोर्टल।",
    "benefits": "Scholarship and fee reimbursement for SC/ST/OBC students.",
    "benefits_hi": "SC/ST/OBC छात्रों के लिए छात्रवृत्ति और शुल्क प्रतिपूर्ति।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST", "OBC", "EWS"],
      "incomeLimit": 250000
    },
    "tags": ["Scholarship", "Gujarat"],
    "link": "https://www.digitalgujarat.gov.in/"
  },
  {
    "type": "State",
    "state": "Kerala",
    "id": "kerala-e-grantz",
    "name": "Kerala e-Grantz 3.0",
    "name_hi": "केरल ई-ग्रांट्ज़ 3.0",
    "description": "Direct benefit transfer for students in Kerala.",
    "description_hi": "केरल में छात्रों के लिए प्रत्यक्ष लाभ हस्तांतरण।",
    "benefits": "Course fee and hostel fee reimbursement.",
    "benefits_hi": "पाठ्यक्रम शुल्क और छात्रावास शुल्क प्रतिपूर्ति।",
    "eligibility": {
      "occupation": ["Student"],
      "category": ["SC", "ST", "OBC", "EWS"],
      "incomeLimit": 100000
    },
    "tags": ["Scholarship", "Kerala"],
    "link": "https://www.egrantz.kerala.gov.in/"
  }
];

fs.writeFileSync(path, JSON.stringify([...schemes, ...stateSchemes], null, 2));
console.log('Successfully appended 15 state schemes.');
