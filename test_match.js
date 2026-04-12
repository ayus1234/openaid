const profile = {
  age: 25,
  gender: "Male",
  occupation: "Farmer",
  income: 50000,
  category: "General",
  landholding: true
};

async function test() {
  try {
    const response = await fetch('http://localhost:5000/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    const data = await response.json();
    console.log('--- TEST RESULTS ---');
    console.log('Status:', response.status);
    console.log('Matched Schemes Count:', data.length);
    if (data.length > 0) {
      console.log('First Match:', data[0].name);
    }
    console.log('--------------------');
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

test();
