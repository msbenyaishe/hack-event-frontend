import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      <div className="auth-page">
        <div className="auth-card animate-in">
          <div className="auth-header">
            <div className="auth-icon-box">
              <User size={32} />
            </div>
            <h2 className="auth-title">{t('member_login')}</h2>
            <p className="auth-subtitle">{t('participant_access')}</p>
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
              {t('dont_have_account')} <Link to="/register" className="text-indigo-600 font-bold">{t('register_here')}</Link>
            </p>
            <p className="auth-footer-text mt-2">
              {t('access_problem')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;
