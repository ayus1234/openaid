const profile = { age: 30, gender: "Female", occupation: "Entrepreneur", income: 200000, category: "SC", landholding: false };
const scheme = { id: "pm-mudra", name: "PM MUDRA Yojana", eligibility: { occupation: ["Entrepreneur"] } };

async function verify() {
  console.log('--- FINAL AI VERIFICATION ---');
  try {
    const response = await fetch('http://localhost:5000/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheme, profile })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    if (data.explanation && !data.explanation.includes('Simulated')) {
      console.log('✅ Success: Real AI Explanation Received!');
      console.log('Preview:', data.explanation.substring(0, 100) + '...');
    } else {
      console.log('❌ Failure: Still getting fallback or error.');
      console.log('Response:', data);
    }
  } catch (err) {
    console.error('❌ Verify Failed:', err.message);
  }
}

verify();
