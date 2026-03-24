import React, { useState } from 'react';
import { eventsApi } from '../../api/eventsApi';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin, Users, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CreateEvent = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    start_date: '', 
    end_date: '',
    location: '',
    max_leaders: 20,
    max_team_members: 5,
    status: 'upcoming'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (logoFile) {
        data.append('logo', logoFile);
      }

      await eventsApi.create(data);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Failed to create event. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-toolbar animate-in">
        <div>
          <h1 className="page-title">{t('create_new_event')}</h1>
          <p className="page-subtitle">{t('create_event_subtitle')}</p>
        </div>
      </div>

      <div className="form-card-premium animate-in" style={{margin: '0 auto'}}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-section mb-10">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.35rem', fontWeight: 800}}>
              <Target size={26} className="text-primary" />
              {t('event_details')}
            </h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
              <div className="form-group mb-0">
                <label className="label-premium">{t('event_name')}</label>
                <input 
                  type="text" required
                  className="input-premium"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('location')}</label>
                <input 
                  type="text" 
                  className="input-premium"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                />
              </div>

              <div className="form-group mb-0">
                <label className="label-premium">{t('event_logo') || 'Event Logo'}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {logoPreview && (
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--slate-200)', flexShrink: 0 }}>
                      <img src={logoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div className="custom-file-upload" style={{ flex: 1 }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="input-premium"
                      style={{ padding: '8px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="label-premium">{t('description')}</label>
              <textarea 
                rows="3"
                className="input-premium"
                style={{resize: 'none', height: 'auto'}}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})} 
              ></textarea>
            </div>
          </div>

          <div className="form-section mb-10 pt-6">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.35rem', fontWeight: 800}}>
              <CalendarIcon size={26} className="text-primary" />
              {t('schedule')}
            </h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
              <div className="form-group mb-0">
                <label className="label-premium">{t('start_date')}</label>
                <input 
                  type="datetime-local" required
                  className="input-premium"
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})} 
                />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('end_date')}</label>
                <input 
                  type="datetime-local" required
                  className="input-premium"
                  value={formData.end_date}
                  onChange={e => setFormData({...formData, end_date: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="form-section pt-6">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.35rem', fontWeight: 800}}>
              <Users size={26} className="text-primary" />
              {t('capacity_settings') || 'Team Capacity'}
            </h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
              <div className="form-group mb-0">
                <label className="label-premium">{t('max_leaders') || 'Max Teams (Leaders)'}</label>
                <input 
                  type="number" 
                  min="1"
                  className="input-premium"
                  value={formData.max_leaders}
                  onChange={e => setFormData({...formData, max_leaders: Number(e.target.value)})} 
                />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('max_team_members') || 'Members per Team'}</label>
                <input 
                  type="number" 
                  min="1"
                  className="input-premium"
                  value={formData.max_team_members}
                  onChange={e => setFormData({...formData, max_team_members: Number(e.target.value)})} 
                />
              </div>
            </div>
          </div>

          <div className="form-actions-row">
            <button 
              type="button"
              onClick={() => navigate('/admin')}
              className="btn-ghost"
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-admin"
            >
              {loading ? '...' : t('confirm_launch')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default CreateEvent;
