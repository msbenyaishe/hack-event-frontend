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
      // Sending both email and login ensures compatibility with any backend version
      await loginAdmin({ email, login: email, password });
      navigate('/admin');
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="layout-member">
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
    </div>
  );
};

export default AdminLogin;
