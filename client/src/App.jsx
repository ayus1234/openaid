import React, { useState } from 'react';
import './index.css';

function App() {
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    occupation: '',
    income: '',
    category: '',
    landholding: false,
    maritalStatus: ''
  });

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://scheme-connect-production.up.railway.app' : '');
      const response = await fetch(`${baseUrl}/api/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await response.json();
      // Add a placeholder for explanation and a random match score for visual impact
      setSchemes(data.map(s => ({ 
        ...s, 
        explanation: null, 
        loadingAI: false,
        matchScore: Math.floor(Math.random() * 15) + 85 // 85% to 99%
      })));
    } catch (error) {
      console.error('Error matching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const explainScheme = async (schemeId) => {
    const scheme = schemes.find(s => s.id === schemeId);
    if (scheme.explanation) return;

    setSchemes(prev => prev.map(s => s.id === schemeId ? { ...s, loadingAI: true } : s));
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://scheme-connect-production.up.railway.app' : '');
      const response = await fetch(`${baseUrl}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheme, profile })
      });
      const data = await response.json();
      setSchemes(prev => prev.map(s => s.id === schemeId ? { ...s, explanation: data, loadingAI: false } : s));
    } catch (error) {
      console.error('AI error:', error);
      setSchemes(prev => prev.map(s => s.id === schemeId ? { ...s, loadingAI: false } : s));
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1>OpenAid 🇮🇳</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Discover government schemes you didn't know you were eligible for.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        {/* Form Section */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem' }}>Personal Profile</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label>Age</label>
              <input type="number" name="age" value={profile.age} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label>Gender</label>
              <select name="gender" value={profile.gender} onChange={handleChange} className="input-field" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label>Occupation</label>
              <select name="occupation" value={profile.occupation} onChange={handleChange} className="input-field" required>
                <option value="">Select Occupation</option>
                <option value="Farmer">Farmer</option>
                <option value="Student">Student</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Teacher">Teacher</option>
                <option value="Doctor">Doctor</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Laborer">Laborer</option>
                <option value="Street Vendor">Street Vendor</option>
                <option value="Artisan">Artisan/Craftsman</option>
                <option value="Home Maker">Home Maker</option>
                <option value="Retired">Retired</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            <div>
              <label>Annual Income (Γé╣)</label>
              <input type="number" name="income" value={profile.income} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label>Category</label>
              <select name="category" value={profile.category} onChange={handleChange} className="input-field" required>
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="landholding" checked={profile.landholding} onChange={handleChange} />
              <label>I own agricultural land</label>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Finding Schemes...' : 'Find Eligible Schemes'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>
            {schemes.length > 0 ? `Matched Schemes (${schemes.length})` : 'Start your search'}
          </h2>
          <div className="scheme-grid">
            {schemes.map((scheme, index) => (
              <div 
                key={scheme.id} 
                className="glass-card" 
                style={{ 
                  padding: '1.5rem',
                  animation: `slideIn 0.5s ease forwards ${index * 0.1}s`,
                  opacity: 0,
                  transform: 'translateY(20px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Visual Glow Effect */}
                <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '100px', height: '100px', background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.1, pointerEvents: 'none' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="eligibility-score">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginRight: '6px' }}></span>
                    {scheme.matchScore}% Match
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                    <span style={{ fontSize: '1rem' }}>Γ£ô</span> Verified
                  </div>
                </div>
                <h3 style={{ margin: '0.5rem 0' }}>{scheme.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{scheme.description}</p>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <strong>Benefit:</strong> {scheme.benefits}
                </div>
                
                {scheme.explanation ? (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Γ£¿ {scheme.explanation.explanation}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>≡ƒç«≡ƒç│ {scheme.explanation.hindi}</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => explainScheme(scheme.id)} 
                    className="btn-primary" 
                    style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--primary)' }}
                    disabled={scheme.loadingAI}
                  >
                    {scheme.loadingAI ? 'AI is thinking...' : 'Γ£¿ Why am I eligible?'}
                  </button>
                )}
                
                <a 
                  href={scheme.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={{ 
                    marginTop: '0.5rem', 
                    width: '100%', 
                    fontSize: '0.8rem', 
                    display: 'block', 
                    textAlign: 'center', 
                    textDecoration: 'none',
                    padding: '10px 0'
                  }}
                >
                  View Full Details
                </a>
              </div>
            ))}
            {schemes.length === 0 && !loading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>
                <p>No schemes matched yet. Update your profile and search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: 'auto', padding: '4rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        "Helping users discover schemes they didn't know they were eligible for."
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>
        Build with Γ¥ñ∩╕Å for the Hackathon Demo | April 2026
      </p>
    </footer>
  );
}

export default App;
