import React, { useState, useEffect } from 'react';
import { Trash2, Plus, MonitorPlay, Edit } from 'lucide-react';
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
  
  const initialFormState = { title: '', description: '', event_id: '', start_time: '', location: '', technology: '', duration: '', link: '' };
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
    if (window.confirm(t('confirm_delete_workshop') || 'Delete this workshop?')) {
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
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        fd.append(key, formData[key] || '');
      });
      
      const fileInput = e.target.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        fd.append('pdf', fileInput.files[0]);
      }

      if (isEditing) {
        await workshopsApi.update(editingId, fd);
      } else {
        await workshopsApi.create(fd);
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
      start_time: workshop.start_time ? new Date(workshop.start_time).toISOString().slice(0, 16) : '',
      location: workshop.location || '',
      technology: workshop.technology || '',
      duration: workshop.duration || '',
      link: workshop.link || '',
      event_id: workshop.event_id || workshop.eventId || workshop.event?.id || formData.event_id
    });
    setShowForm(true);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-toolbar" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ minWidth: '200px' }}>
          <h1 className="page-title">{t('workshops_management')}</h1>
          <p className="page-subtitle">{t('plan_sessions')}</p>
        </div>
        
        <div className="admin-toolbar-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: '1', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div className="search-input-wrapper" style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}>
             <div className="search-icon-pos"><MonitorPlay size={18} /></div>
             <select 
               className="search-input"
               style={{ paddingLeft: '3rem', width: '100%' }}
               value={formData.event_id}
               onChange={(e) => handleEventChange(e.target.value)}
             >
               {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
             </select>
          </div>
          <button 
            onClick={() => showForm ? setShowForm(false) : openCreateForm()}
            className="btn-admin"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center' }}
          >
            {showForm ? <Plus size={20} style={{transform: 'rotate(45deg)'}} /> : <Plus size={20} />}
            {showForm ? t('cancel') : t('add_workshop')}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card-premium animate-in mb-12" style={{maxWidth: '1000px', margin: '0 auto 3rem'}}>
          <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div className="btn-action-premium active" style={{width: '2.5rem', height: '2.5rem', borderRadius: '10px'}}><Plus size={18} /></div>
            {isEditing ? t('edit_workshop') || 'Edit Workshop' : t('add_workshop')}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem'}}>
              <div className="form-group mb-0">
                <label className="label-premium">{t('title')}</label>
                <input type="text" required className="input-premium"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('technology')}</label>
                <input type="text" placeholder="e.g. React, Python" className="input-premium"
                  value={formData.technology} onChange={e => setFormData({...formData, technology: e.target.value})} />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('start_time')}</label>
                <input type="datetime-local" required className="input-premium"
                  value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('duration_hours') || 'Duration (hours)'}</label>
                <input type="number" required placeholder="e.g. 1.5" step="0.1" min="0" className="input-premium"
                  value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('location')}</label>
                <input type="text" className="input-premium"
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              
              <div className="form-group mb-0">
                <label className="label-premium">{t('pdf_file') || 'Upload PDF'}</label>
                <input type="file" accept=".pdf,application/pdf" className="input-premium" style={{ paddingTop: '0.75rem', fontSize: '0.875rem' }} />
              </div>

              <div className="form-group mb-0">
                <label className="label-premium">{t('external_link') || 'Or External Link URL'}</label>
                <input type="url" placeholder="https://..." className="input-premium"
                  value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} />
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="label-premium">{t('description')}</label>
              <textarea className="input-premium" rows="3" style={{resize: 'none', height: 'auto'}}
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--slate-100)'}}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">{t('cancel')}</button>
              <button type="submit" className="btn-admin" style={{minWidth: '150px'}}>
                {isEditing ? t('save') : t('create')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card animate-in">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary-600 rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-slate-400 font-medium">{t('fetching_workshops') || 'Loading workshops...'}</p>
          </div>
        ) : workshops.length === 0 ? (
          <div className="empty-state p-12">
            <div className="empty-icon">
              <MonitorPlay size={40} />
            </div>
            <p className="empty-text">{t('no_workshops_found')}</p>
          </div>
        ) : (
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>{t('workshop_details') || 'Workshop Details'}</th>
                  <th>{t('technology')}</th>
                  <th>{t('schedule') || 'Schedule'}</th>
                  <th style={{textAlign: 'right'}}>{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map(workshop => (
                  <tr key={workshop.id}>
                    <td data-label={t('workshop_details') || 'Workshop Details'}>
                      <div style={{fontWeight: 700, color: 'var(--slate-900)'}}>{workshop.title}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--slate-400)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        {workshop.description}
                      </div>
                    </td>
                    <td data-label={t('technology')}>
                      <div className="badge-premium badge-info">{workshop.technology || 'General'}</div>
                    </td>
                    <td data-label={t('schedule') || 'Schedule'}>
                      <div style={{fontWeight: 600}}>{new Date(workshop.start_time || workshop.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--slate-400)'}}>
                        {workshop.location || 'Meeting Room'} 
                        {workshop.duration && ` • ${workshop.duration} h`}
                      </div>
                    </td>
                    <td data-label={t('actions') || 'Actions'}>
                      <div className="action-group" style={{justifyContent: 'flex-end'}}>
                        <button 
                          onClick={() => openEditForm(workshop)}
                          className="btn-action-premium"
                          title={t('edit_workshop')}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(workshop.id)}
                          className="btn-action-premium danger"
                          title={t('delete_workshop') || 'Delete'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWorkshops;
