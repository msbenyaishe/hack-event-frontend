import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../api/authApi';
import { User, Lock, Briefcase, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    portfolio: '',
    password: '',
    confirm_password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        portfolio: user.portfolio || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (formData.password && formData.password !== formData.confirm_password) {
      setError(t('passwords_do_not_match') || 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        portfolio: formData.portfolio
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      await authApi.updateProfile(updateData);
      setSuccess(t('profile_updated_successfully') || 'Profile updated successfully!');
      
      // Clear password fields on success
      setFormData(prev => ({
        ...prev,
        password: '',
        confirm_password: ''
      }));
    } catch (err) {
      setError(err.response?.data?.error || t('failed_to_update_profile') || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center">Please log in...</div>;

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '3rem', maxWidth: '800px', minHeight: '80vh' }}>
      <div className="admin-toolbar animate-in mb-8">
        <div>
          <h1 className="page-title">{t('my_profile') || 'My Profile'}</h1>
          <p className="page-subtitle">{t('manage_personal_info') || 'Manage your personal information and login details.'}</p>
        </div>
      </div>

      <div className="form-card-premium animate-in">
        {success && (
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Read Only Stats Area (optional but nice) */}
          <div className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600 }}>
                {user.first_name ? user.first_name[0] : (user.email ? user.email[0].toUpperCase() : 'U')}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : 'User'}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={14} /> {user.email}
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className="badge-premium badge-info" style={{ textTransform: 'capitalize' }}>
                  {t(user.role) || user.role}
                </span>
              </div>
            </div>
            {user.role === 'admin' && (
              <p style={{ fontSize: '0.85rem', color: 'var(--error)', marginTop: '0.5rem', marginBottom: 0 }}>
                * Admins cannot update profile via this form.
              </p>
            )}
          </div>

          <div className="form-section mb-8">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800}}>
              <User size={22} className="text-primary" />
              {t('personal_details') || 'Personal Details'}
            </h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
              <div className="form-group mb-0">
                <label className="label-premium">{t('first_name') || 'First Name'}</label>
                <input 
                  type="text" 
                  name="first_name"
                  className="input-premium"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={user.role === 'admin'}
                />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('last_name') || 'Last Name'}</label>
                <input 
                  type="text" 
                  name="last_name"
                  className="input-premium"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={user.role === 'admin'}
                />
              </div>
            </div>

            <div className="form-group mt-6 mb-0">
              <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={16} /> {t('portfolio_url') || 'Portfolio / LinkedIn URL'}
              </label>
              <input 
                type="url" 
                name="portfolio"
                className="input-premium"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://"
                disabled={user.role === 'admin'}
              />
            </div>
          </div>

          <div className="form-section pt-6" style={{ borderTop: '1px solid var(--slate-100)' }}>
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800}}>
              <Lock size={22} className="text-primary" />
              {t('security') || 'Security'}
            </h3>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
              {t('leave_password_blank') || 'Leave password fields blank if you do not want to change your password.'}
            </p>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
              <div className="form-group mb-0">
                <label className="label-premium">{t('new_password') || 'New Password'}</label>
                <input 
                  type="password" 
                  name="password"
                  className="input-premium"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={user.role === 'admin'}
                />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('confirm_password') || 'Confirm Password'}</label>
                <input 
                  type="password" 
                  name="confirm_password"
                  className="input-premium"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={user.role === 'admin'}
                />
              </div>
            </div>
          </div>

          <div className="form-actions-row mt-8 pt-6" style={{ borderTop: '1px solid var(--slate-100)' }}>
            <button 
              type="submit" 
              disabled={loading || user.role === 'admin'}
              className="btn-admin"
              style={{ minWidth: '160px' }}
            >
              {loading ? (t('saving') || 'Saving...') : (t('save_changes') || 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
