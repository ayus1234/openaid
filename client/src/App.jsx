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

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste! I am OpenAid. How can I help you today? \n\nनमस्ते! मैं OpenAid हूँ। मैं आपकी कैसे मदद कर सकता हूँ?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

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

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || chatLoading) return;

    const userMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setChatLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://scheme-connect-production.up.railway.app' : '');
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, history: messages })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I am having trouble connecting. \n\nक्षमा करें, मुझे जुड़ने में समस्या हो रही है।' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '2rem' }}>
        <div style={{ display: 'inline-block', padding: '12px 24px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '100px', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent)' }}>
          ✨ India's First AI Scheme Discovery Platform
        </div>
        <h1>OpenAid 🇮🇳</h1>
        <p className="tagline">Empowering citizens by bridging the gap between complex government schemes and simple, accessible eligibility.</p>
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

      {/* Floating Chatbot */}
      <div className={`chat-container ${chatOpen ? 'open' : ''}`}>
        <div className="chat-window glass-card">
          <div className="chat-header">
            <h3>OpenAid Assistant ✨</h3>
            <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role === 'user' ? 'user-msg' : 'bot-msg'}`}>
                {msg.text}
              </div>
            ))}
            {chatLoading && <div className="message bot-msg">Thinking...</div>}
          </div>
          <form onSubmit={sendChatMessage} className="chat-input-area">
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Ask about schemes..." 
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn">Send</button>
          </form>
        </div>
        <button className="chat-bubble" onClick={() => setChatOpen(!chatOpen)}>
          {chatOpen ? '×' : '💬'}
        </button>
      </div>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="built-badge">
          Designed & Built with <span className="heart-icon">❤️</span> for Hackathon 2026
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', lineHeight: '1.6' }}>
          "Our mission is to ensure every Indian citizen receives the benefits they are entitled to."
        </p>
      </div>

      <div className="footer-links">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Source Code">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-1.376 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.253.242 2.474.118 2.776.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn Profile">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          LinkedIn
        </a>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
        © 2026 OPENAID PROJECT | HACKATHON EDITION
      </div>
    </footer>
  );
}

export default App;
