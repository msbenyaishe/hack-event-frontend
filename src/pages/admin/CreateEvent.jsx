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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await eventsApi.create(formData);
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

      <div className="form-card-premium animate-in" style={{maxWidth: '800px', margin: '0 auto'}}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-section mb-12">
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 800}}>
              <Target size={24} className="text-primary" />
              {t('event_details')}
            </h3>
            <div className="form-group mb-6">
              <label className="label-premium">{t('event_name')}</label>
              <input 
                type="text" required
                className="input-premium"
                placeholder="e.g. Winter Hackathon 2026"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="label-premium">{t('description')}</label>
              <textarea 
                rows="4"
                className="input-premium"
                style={{resize: 'none'}}
                placeholder="Tell us about the event..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})} 
              ></textarea>
            </div>
          </div>

          <div className="form-section mb-12 pt-8" style={{borderTop: '1px solid var(--slate-100)'}}>
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 800}}>
              <CalendarIcon size={24} className="text-primary" />
              {t('schedule_location')}
            </h3>
            <div className="responsive-form-grid">
              <div className="form-group">
                <label className="label-premium">{t('start_date')}</label>
                <input 
                  type="datetime-local" required
                  className="input-premium"
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="label-premium">{t('end_date')}</label>
                <input 
                  type="datetime-local" required
                  className="input-premium"
                  value={formData.end_date}
                  onChange={e => setFormData({...formData, end_date: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="label-premium">{t('location')}</label>
                <input 
                  type="text" 
                  className="input-premium"
                  placeholder="e.g. Main Hall or Remote"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="form-section pt-8" style={{borderTop: '1px solid var(--slate-100)'}}>
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 800}}>
              <Users size={24} className="text-primary" />
              {t('capacity_settings') || 'Team Capacity'}
            </h3>
            <div className="responsive-form-grid">
              <div className="form-group">
                <label className="label-premium">{t('max_leaders') || 'Max Teams (Leaders)'}</label>
                <input 
                  type="number" 
                  min="1"
                  className="input-premium"
                  value={formData.max_leaders}
                  onChange={e => setFormData({...formData, max_leaders: Number(e.target.value)})} 
                />
              </div>
              <div className="form-group">
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
