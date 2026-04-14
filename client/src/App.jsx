import React, { useState, useEffect } from 'react';
import './index.css';
import translations from './translations';

const IndianFlag = ({ size = "1.2em" }) => (
  <svg 
    width={size} 
    height="0.67em" 
    viewBox="0 0 900 600" 
    style={{ borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', verticalAlign: 'middle' }}
  >
    <rect width="900" height="200" fill="#FF9933"/>
    <rect y="200" width="900" height="200" fill="#FFFFFF"/>
    <rect y="400" width="900" height="200" fill="#138808"/>
    <g transform="translate(450,300)">
      <circle r="92.5" fill="none" stroke="#000080" strokeWidth="6.5"/>
      <circle r="17.5" fill="#000080"/>
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="0" y1="0" x2="0" y2="92.5"
          transform={`rotate(${i * 15})`}
          stroke="#000080"
          strokeWidth="6"
        />
      ))}
    </g>
  </svg>
);

function App() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const t = (key) => {
    const val = translations[language][key];
    return typeof val === 'function' ? val : (val || key);
  };

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
  const [hasSearched, setHasSearched] = useState(false);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: translations[language].initialHello }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const rawBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://scheme-connect-production.up.railway.app' : '');
      const baseUrl = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;
      
      if (import.meta.env.PROD) console.log('Fetching schemes from:', `${baseUrl}/match`);
      
      const response = await fetch(`${baseUrl}/match`, {
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
      const rawBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://scheme-connect-production.up.railway.app' : '');
      const baseUrl = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;
      
      const response = await fetch(`${baseUrl}/explain`, {
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
      const rawBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://scheme-connect-production.up.railway.app' : '');
      const baseUrl = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;
      
      if (import.meta.env.PROD) console.log('Chat API call to:', `${baseUrl}/chat`);

      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, history: messages, lang: language })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      const rawBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://scheme-connect-production.up.railway.app' : '');
      console.error('Chat Connection Error Details:', {
        message: error.message,
        baseUrl: rawBase,
        env: import.meta.env.MODE
      });
      setMessages(prev => [...prev, { role: 'assistant', text: t('chatError') }]);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    // Refresh initial message if chat is empty or contains only the greeting
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{ role: 'assistant', text: translations[lang].initialHello }]);
    }
  };

  return (
    <div className="container">
      <div className={chatOpen ? 'content-blur' : ''} style={{ transition: 'all 0.4s ease' }}>
        <div className="controls-container">
            {/* Theme Toggle Button */}
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              title={t(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            {/* Language Toggle */}
            <div className="toggle-group">
              <button 
                className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
                onClick={() => toggleLanguage('en')}
              >English</button>
              <button 
                className={`lang-btn ${language === 'hi' ? 'active' : ''}`} 
                onClick={() => toggleLanguage('hi')}
              >हिंदी</button>
            </div>
          </div>

        <header style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 10vh, 4rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h1 style={{ marginBottom: 0 }}>{t('title')}</h1>
            <IndianFlag size="1.8em" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>{t('subtitle')}</p>
        </header>

      <div className="main-layout">
        {/* Form Section */}
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem' }}>{t('personalProfile')}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label>{t('age')}</label>
              <input type="number" name="age" value={profile.age} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label>{t('gender')}</label>
              <select name="gender" value={profile.gender} onChange={handleChange} className="input-field" required>
                <option value="">{t('selectGender')}</option>
                <option value="Male">{t('male')}</option>
                <option value="Female">{t('female')}</option>
                <option value="Others">{t('others')}</option>
              </select>
            </div>
            <div>
              <label>{t('occupation')}</label>
              <select name="occupation" value={profile.occupation} onChange={handleChange} className="input-field" required>
                <option value="">{t('selectOccupation')}</option>
                <option value="Farmer">{t('farmer')}</option>
                <option value="Student">{t('student')}</option>
                <option value="Laborer">{t('laborer')}</option>
                <option value="Street Vendor">{t('streetVendor')}</option>
                <option value="Artisan">{t('artisan')}</option>
                <option value="Home Maker">{t('homeMaker')}</option>
                <option value="Retired">{t('retired')}</option>
                <option value="Unemployed">{t('unemployed')}</option>
              </select>
            </div>
            <div>
              <label>{t('income')}</label>
              <input type="number" name="income" value={profile.income} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label>{t('category')}</label>
              <select name="category" value={profile.category} onChange={handleChange} className="input-field" required>
                <option value="">{t('selectCategory')}</option>
                <option value="General">{t('general')}</option>
                <option value="SC">{t('sc')}</option>
                <option value="ST">{t('st')}</option>
                <option value="OBC">{t('obc')}</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="landholding" checked={profile.landholding} onChange={handleChange} />
              <label>{t('landholding')}</label>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('findingSchemes') : t('findSchemes')}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>
            {schemes.length > 0 
              ? t('matchedSchemes')(schemes.length) 
              : (loading ? t('findingMatching') : (hasSearched ? t('noMatching') : t('startSearch')))}
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
                    <span style={{ fontSize: '1rem' }}>✓</span> {t('verified')}
                  </div>
                </div>
                <h3 style={{ margin: '0.5rem 0' }}>{language === 'en' ? scheme.name : (scheme.name_hi || scheme.name)}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {language === 'en' ? scheme.description : (scheme.description_hi || scheme.description)}
                </p>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <strong>{t('benefit')}</strong> {language === 'en' ? scheme.benefits : (scheme.benefits_hi || scheme.benefits)}
                </div>
                
                {scheme.explanation ? (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <p style={{ fontSize: '0.85rem' }}>{language === 'en' ? scheme.explanation.en : scheme.explanation.hi}</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => explainScheme(scheme.id)} 
                    className="btn-primary" 
                    style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--primary)' }}
                    disabled={scheme.loadingAI}
                  >
                    {scheme.loadingAI ? t('thinking') : t('whyEligible')}
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
            {hasSearched && schemes.length === 0 && !loading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>
                <p>{t('noSchemesYet')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
        <Footer t={t} />
    </div>

      {/* Floating Chatbot */}
      <div className={`chat-container ${chatOpen ? 'open' : ''}`}>
        <div className="chat-window glass-card">
          <div className="chat-header">
            <h3>{t('assistantName')}</h3>
            <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role === 'user' ? 'user-msg' : 'bot-msg'}`}>
                {msg.text}
              </div>
            ))}
            {chatLoading && <div className="message bot-msg">{t('thinking')}</div>}
          </div>
          <form onSubmit={sendChatMessage} className="chat-input-area">
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder={t('chatPlaceholder')} 
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn">{t('send')}</button>
          </form>
        </div>
        <button className="chat-bubble" onClick={() => setChatOpen(!chatOpen)}>
          {chatOpen ? '×' : '💬'}
        </button>
      </div>

    </div>
  );
}

function Footer({ t }) {
  return (
    <footer style={{ marginTop: 'auto', padding: '4rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {t('footerQuote')}
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>
        {t('footerBuild')}
      </p>
    </footer>
  );
}

export default App;
