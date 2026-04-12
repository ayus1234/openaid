const profiles = [
  {
    name: "Standard Farmer",
    data: { age: 25, gender: "Male", occupation: "Farmer", income: 50000, category: "General", landholding: true }
  },
  {
    name: "Urban Widow",
    data: { age: 45, gender: "Female", occupation: "Unorganized Sector", income: 20000, category: "BPL", maritalStatus: "Widowed", urban: true }
  },
  {
    name: "Small Entrepreneur",
    data: { age: 30, gender: "Female", occupation: "Entrepreneur", income: 200000, category: "SC", landholding: false }
  }
];

async function runTests() {
  console.log('🚀 STARTING COMPREHENSIVE TEST SUITE...\n');

  for (const profile of profiles) {
    try {
      console.log(`Testing Profile: [${profile.name}]`);
      const response = await fetch('http://localhost:5000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile.data)
      });
      const schemes = await response.json();
      console.log(`✅ Success: Found ${schemes.length} schemes.`);
      
      if (schemes.length > 0) {
        const first = schemes[0];
        console.log(`   Sample Match: ${first.name}`);
        
        // Test AI Explanation for the first match
        const aiRes = await fetch('http://localhost:5000/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheme: first, profile: profile.data })
        });
        const explanation = await aiRes.json();
        console.log(`   AI Status: ${explanation.error ? '❌ FAIL' : '✅ SUCCESS'}`);
        console.log(`   Snippet: ${explanation.explanation.substring(0, 50)}...`);
      }
      console.log('-----------------------------------\n');
    } catch (err) {
      console.error(`❌ Error testing ${profile.name}:`, err.message);
    }
  }
}

runTests();
