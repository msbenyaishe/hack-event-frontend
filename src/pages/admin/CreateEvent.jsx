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
    <div className="container-inner" style={{maxWidth: '56rem'}}>
      <div className="page-header animate-in">
        <div>
          <h1 className="page-title">{t('create_new_event')}</h1>
          <p className="page-subtitle">Set up a new hackathon, configure dates and capacity.</p>
        </div>
      </div>

      <div className="data-table-container animate-in">
        <form onSubmit={handleSubmit} className="modal-body" style={{padding: '3rem'}}>
          
          <div className="form-section" style={{marginBottom: '3rem'}}>
            <h3 className="modal-header-info p" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'}}>
              <span className="error-dot" style={{backgroundColor: 'var(--primary-500)', width: '0.5rem', height: '0.5rem', boxShadow: '0 0 8px rgba(99,102,241,0.5)'}} />
              {t('event_details')}
            </h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem'}}>
              <div className="form-group">
                <label className="form-label">{t('event_name')}</label>
                <input 
                  type="text" required
                  className="form-input"
                  placeholder="e.g. Winter Hackathon 2026"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('description')}</label>
                <textarea 
                  rows="4"
                  className="form-input"
                  style={{resize: 'none'}}
                  placeholder="Tell us about the event..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                ></textarea>
              </div>
            </div>
          </div>

          <div className="form-section" style={{paddingTop: '3rem', borderTop: '1px solid var(--slate-50)'}}>
            <h3 className="modal-header-info p" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'}}>
              <span className="error-dot" style={{backgroundColor: 'var(--primary-500)', width: '0.5rem', height: '0.5rem', boxShadow: '0 0 8px rgba(99,102,241,0.5)'}} />
              {t('schedule_location')}
            </h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem'}}>
              <div className="form-group">
                <label className="form-label">{t('start_date')}</label>
                <input 
                  type="datetime-local" required
                  className="form-input"
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('end_date')}</label>
                <input 
                  type="datetime-local" required
                  className="form-input"
                  value={formData.end_date}
                  onChange={e => setFormData({...formData, end_date: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('location')}</label>
                <div className="input-with-icon">
                  <div className="input-icon">
                    <MapPin size={18} />
                  </div>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="e.g. Main Hall or remote Link"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('max_leaders') || 'Max Teams (Leaders)'}</label>
                <div className="input-with-icon">
                  <div className="input-icon">
                    <Users size={18} />
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    className="input-field"
                    value={formData.max_leaders}
                    onChange={e => setFormData({...formData, max_leaders: Number(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('max_team_members') || 'Members per Team'}</label>
                <div className="input-with-icon">
                  <div className="input-icon">
                    <Users size={18} />
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    className="input-field"
                    value={formData.max_team_members}
                    onChange={e => setFormData({...formData, max_team_members: Number(e.target.value)})} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--slate-50)'}}>
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
              className="btn-indigo"
              style={{paddingLeft: '3rem', paddingRight: '3rem'}}
            >
              {loading ? '...' : t('create_event_btn') || 'Confirm & Launch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
