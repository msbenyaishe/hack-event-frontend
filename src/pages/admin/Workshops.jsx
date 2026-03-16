import React, { useState, useEffect } from 'react';
import { Trash2, Plus, MonitorPlay } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import WorkshopCard from '../../components/WorkshopCard';
import { workshopsApi } from '../../api/workshopsApi';
import { eventsApi } from '../../api/eventsApi';

const AdminWorkshops = () => {
  const { t } = useTranslation();
  const [workshops, setWorkshops] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create / Edit Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = { title: '', description: '', event_id: '', start_time: '', location: '', technology: '', duration: '' };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const eventsRes = await eventsApi.getAll();
      setEvents(eventsRes.data);
      
      if (eventsRes.data.length > 0) {
        const firstEventId = eventsRes.data[0].id;
        const wsRes = await workshopsApi.getByEvent(firstEventId);
        setWorkshops(wsRes.data);
        setFormData(prev => ({ ...prev, event_id: firstEventId }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = async (eventId) => {
    try {
      setLoading(true);
      const wsRes = await workshopsApi.getByEvent(eventId);
      setWorkshops(wsRes.data);
      setFormData(prev => ({ ...prev, event_id: eventId }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workshop?')) {
      try {
        await workshopsApi.delete(id);
        handleEventChange(formData.event_id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await workshopsApi.update(editingId, formData);
      } else {
        await workshopsApi.create(formData);
      }
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({ ...initialFormState, event_id: formData.event_id });
      handleEventChange(formData.event_id);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ ...initialFormState, event_id: formData.event_id || (events[0]?.id || '') });
    setShowForm(true);
  };

  const openEditForm = (workshop) => {
    setIsEditing(true);
    setEditingId(workshop.id);
    setFormData({
      title: workshop.title,
      description: workshop.description || '',
      startTime: workshop.startTime ? new Date(workshop.startTime).toISOString().slice(0, 16) : '',
      location: workshop.location || '',
      technology: workshop.technology || '',
      duration: workshop.duration || '',
      event_id: workshop.event_id || workshop.eventId || workshop.event?.id || formData.event_id
    });
    setShowForm(true);
  };

  return (
    <div className="container-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('workshops_management')}</h1>
          <p className="page-subtitle">{t('plan_sessions')}</p>
        </div>
        <button 
          onClick={() => showForm ? setShowForm(false) : openCreateForm()}
          className={`btn-indigo ${showForm ? 'btn-red' : ''}`}
          style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
        >
          {showForm ? <Plus size={20} style={{transform: 'rotate(45deg)'}} /> : <Plus size={20} />}
          {showForm ? t('cancel') : t('add_workshop')}
        </button>
      </div>

      {showForm && (
        <div className="invite-form-container animate-in" style={{maxWidth: '100%'}}>
          <h3 className="card-title" style={{marginBottom: '2rem'}}>{isEditing ? 'Edit Workshop' : t('add_workshop')}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
              <div style={{gridColumn: '1 / -1'}}>
                <label className="form-label">{t('title')}</label>
                <input type="text" required className="form-input"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div style={{gridColumn: '1 / -1'}}>
                <label className="form-label">{t('description')}</label>
                <textarea className="form-input" rows="3"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="form-label">{t('technology')}</label>
                <input type="text" placeholder="e.g. React, Python" className="form-input"
                  value={formData.technology} onChange={e => setFormData({...formData, technology: e.target.value})} />
              </div>
              <div>
                <label className="form-label">{t('duration')}</label>
                <input type="text" placeholder="e.g. 45 min" className="form-input"
                  value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
              <div>
                <label className="form-label">{t('start_time')}</label>
                <input type="datetime-local" required className="form-input"
                  value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
              </div>
              <div>
                <label className="form-label">{t('location')}</label>
                <input type="text" className="form-input"
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer" style={{marginTop: '2rem'}}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">{t('cancel')}</button>
              <button type="submit" className="btn-indigo">
                {isEditing ? t('save') : t('create')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="page-header" style={{marginBottom: '2rem'}}>
        <div className="filter-bar">
          <span className="filter-label">{t('filter_event')}</span>
          <select 
            className="filter-select"
            value={formData.event_id}
            onChange={(e) => handleEventChange(e.target.value)}
          >
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid-cards">
          {[1,2,3].map(i => <div key={i} className="skeleton" />)}
        </div>
      ) : workshops.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <MonitorPlay size={40} />
          </div>
          <p className="empty-text">{t('no_workshops_found')}</p>
        </div>
      ) : (
        <div className="grid-cards">
          {workshops.map(workshop => (
            <WorkshopCard 
              key={workshop.id} 
              workshop={workshop} 
              isAdmin={true} 
              onEdit={openEditForm} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWorkshops;
