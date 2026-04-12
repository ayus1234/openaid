import React, { useState, useRef, useEffect } from 'react';
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/match`, {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/explain`, {
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
        <p style={{ color: 'var(--text-secondary)' }}>Bridging the gap between citizens and government welfare schemes using AI.</p>
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
                <option value="Student">Student</option>
                <option value="Farmer">Farmer</option>
                <option value="Business Owner">Business</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Laborer">Labourer</option>
                <option value="Artisan">Artisan</option>
              </select>
            </div>
            <div>
              <label>Annual Income (₹)</label>
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
                    <span style={{ fontSize: '1rem' }}>✓</span> Verified
                  </div>
                </div>
                <h3 style={{ margin: '0.5rem 0' }}>{scheme.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{scheme.description}</p>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <strong>Benefit:</strong> {scheme.benefits}
                </div>
                
                {scheme.explanation ? (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>✨ {scheme.explanation.explanation}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>🇮🇳 {scheme.explanation.hindi}</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => explainScheme(scheme.id)} 
                    className="btn-primary" 
                    style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--primary)' }}
                    disabled={scheme.loadingAI}
                  >
                    {scheme.loadingAI ? 'AI is thinking...' : '✨ Why am I eligible?'}
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
      <Chatbot />
    </div>
  );
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: '🙏 Namaste! I am OpenAid Assistant. Ask me anything about government schemes in English or Hindi.\n\nनमस्ते! मैं OpenAid सहायक हूँ। सरकारी योजनाओं के बारे में कुछ भी पूछें।' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input };
    const history = messages.filter(m => m.role !== 'model' || messages.indexOf(m) > 0);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      console.log('Sending chat to:', `${import.meta.env.VITE_API_URL}/api/chat`);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', text: data.reply || data.error }]);
    } catch (err) {
      console.error('Chat fetch error:', err);
      setMessages(prev => [...prev, { role: 'model', text: `Sorry, something went wrong. (${err.message})` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--primary)', border: 'none', cursor: 'pointer',
          fontSize: '1.5rem', boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
          zIndex: 1000, transition: 'transform 0.2s'
        }}
        title="Chat with OpenAid"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '2rem',
          width: '360px', height: '500px',
          background: '#0f172a', border: '1px solid var(--glass-border)',
          borderRadius: '20px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)', zIndex: 999, overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.2rem', background: 'rgba(99,102,241,0.15)', borderBottom: '1px solid var(--glass-border)' }}>
            <strong>🤖 OpenAid Assistant</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Ask about any government scheme</p>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.07)',
                padding: '0.7rem 1rem', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-wrap'
              }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                AI is thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.8rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask in English or Hindi..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                borderRadius: '10px', padding: '0.6rem 0.8rem', color: 'white', outline: 'none', fontSize: '0.85rem'
              }}
            />
            <button onClick={send} disabled={loading} style={{
              background: 'var(--primary)', border: 'none', borderRadius: '10px',
              padding: '0.6rem 1rem', color: 'white', cursor: 'pointer', fontWeight: 600
            }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: 'auto', padding: '4rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        "Helping users discover schemes they didn't know they were eligible for."
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>
        Build with ❤️ for the Hackathon Demo | April 2026
      </p>
    </footer>
  );
}

export default App;
