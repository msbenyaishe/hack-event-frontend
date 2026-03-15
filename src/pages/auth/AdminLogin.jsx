import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';

const AdminLogin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin({ email, password });
      navigate('/admin');
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
              <Lock size={32} />
            </div>
            <h2 className="auth-title">{t('admin_access')}</h2>
            <p className="auth-subtitle">Master Dashboard</p>
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
                placeholder="admin@hackevent.com"
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
        </div>
      </div>
      <footer className="footer">
        <p className="footer-text">Built for Innovation • HackEvent 2024</p>
      </footer>
    </div>
  );
};

export default AdminLogin;
