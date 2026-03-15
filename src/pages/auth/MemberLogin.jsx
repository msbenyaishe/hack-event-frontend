import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';

const MemberLogin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { loginMember } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginMember({ email, password });
      if (res.user?.role === 'leader') {
        navigate('/leader/team');
      } else {
        navigate('/'); // Ordinary member might just see scoreboard
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="layout-member">
      <Navbar />
      <div className="auth-page">
        <div className="auth-card animate-in">
          <div className="auth-header">
            <div className="auth-icon-box">
              <User size={32} />
            </div>
            <h2 className="auth-title">{t('member_login')}</h2>
            <p className="auth-subtitle">Participant Access</p>
          </div>
          
          {error && (
            <div className="auth-error">
              <div className="error-dot" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input 
                type="email" 
                required
                placeholder="member@hackevent.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-indigo btn-full">
              {t('login')}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Problem accessing your account? Check with your team leader or the admin desk.
            </p>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p className="footer-text">Built for Innovation • HackEvent 2024</p>
      </footer>
    </div>
  );
};

export default MemberLogin;
