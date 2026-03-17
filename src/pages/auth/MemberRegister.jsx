import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Briefcase, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { eventsApi } from '../../api/eventsApi';

const MemberRegister = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    portfolio: '',
    event_id: ''
  });
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { registerMember } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventsApi.getAll();
        setEvents(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, event_id: res.data[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerMember(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-member">
      <div className="auth-page">
        <div className="auth-card animate-in" style={{ maxWidth: '500px' }}>
          <div className="auth-header">
            <div className="auth-icon-box">
              <UserPlus size={32} />
            </div>
            <h2 className="auth-title">{t('member_registration')}</h2>
            <p className="auth-subtitle">{t('join_hackathon')}</p>
          </div>
          
          {error && (
            <div className="auth-error">
              <div className="error-dot" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">{t('first_name') || 'First Name'}</label>
                <div className="relative">
                  <input 
                    name="first_name"
                    type="text" 
                    required
                    placeholder="John"
                    className="form-input"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('last_name') || 'Last Name'}</label>
                <input 
                  name="last_name"
                  type="text" 
                  required
                  placeholder="Doe"
                  className="form-input"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('email') || 'Email'}</label>
              <input 
                name="email"
                type="email" 
                required
                placeholder="john@example.com"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('password') || 'Password'}</label>
              <input 
                name="password"
                type="password" 
                required
                placeholder="••••••••"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('portfolio') || 'Portfolio URL (Optional)'}</label>
              <input 
                name="portfolio"
                type="url" 
                placeholder="https://github.com/..."
                className="form-input"
                value={formData.portfolio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('select_event') || 'Select Event'}</label>
              <select 
                name="event_id"
                required
                className="form-input"
                value={formData.event_id}
                onChange={handleChange}
              >
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-indigo btn-full mt-4">
              {loading ? t('creating_account') : t('register')}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              {t('already_have_account')} <Link to="/login" className="text-indigo-600 font-bold">{t('login_here')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRegister;
