import React, { useEffect, useState } from 'react';
import { eventsApi } from '../../api/eventsApi';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit } from 'lucide-react';
import EventCard from '../../components/EventCard';
import { useTranslation } from 'react-i18next';

const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    location: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsApi.getAll();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('delete_event') + '?')) {
      try {
        await eventsApi.delete(id);
        fetchEvents();
      } catch (err) {
        console.error("Failed to delete event", err);
      }
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event.id);
    setEditFormData({
      name: event.name,
      description: event.description || '',
      start_date: event.start_date ? event.start_date.replace('Z', '').slice(0, 16) : '',
      end_date: event.end_date ? event.end_date.replace('Z', '').slice(0, 16) : '',
      location: event.location || ''
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await eventsApi.update(editingEvent, editFormData);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Failed to update event", err);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-toolbar">
        <div>
          <h1 className="page-title">{t('events_management')}</h1>
          <p className="page-subtitle">{t('manage_all_events')}</p>
        </div>
        <Link 
          to="/admin/events/create" 
          className="btn-admin"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={20} />
          {t('create_new_event')}
        </Link>
      </div>

      <div className="admin-card animate-in">
        {loading ? (
          <div className="p-8 text-center color-slate-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Plus size={40} />
            </div>
            <p className="empty-text">{t('no_events')}</p>
          </div>
        ) : (
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>{t('event_name')}</th>
                  <th>{t('location')}</th>
                  <th>{t('start_date')}</th>
                  <th>{t('end_date')}</th>
                  <th style={{ textAlign: 'right' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td data-label={t('event_name')}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{event.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {event.description}
                      </div>
                    </td>
                    <td data-label={t('location')}>
                      <div className="badge-premium badge-info">{event.location || 'Online'}</div>
                    </td>
                    <td data-label={t('start_date')}>{new Date(event.start_date).toLocaleDateString()}</td>
                    <td data-label={t('end_date')}>{new Date(event.end_date).toLocaleDateString()}</td>
                    <td data-label={t('actions')}>
                      <div className="action-group" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleEditClick(event)}
                          className="btn-action-premium"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="btn-action-premium danger"
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

      {/* Edit Modal (Glass) */}
      {editingEvent && (
        <div className="modal-overlay modal-overlay-premium">
          <div className="modal-content-premium modal-content animate-in" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <div className="modal-header-info">
                <h3>{t('edit_event')}</h3>
                <p>{t('refine_hackathon_details')}</p>
              </div>
              <button 
                onClick={() => setEditingEvent(null)} 
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={submitEdit} className="modal-body p-8">
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
                <div className="form-group mb-0">
                  <label className="label-premium">{t('event_name')}</label>
                  <input required type="text" className="input-premium"
                    value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                </div>
                
                <div className="form-group mb-0">
                  <label className="label-premium">{t('location')}</label>
                  <input type="text" className="input-premium"
                    value={editFormData.location} onChange={e => setEditFormData({...editFormData, location: e.target.value})} />
                </div>
                
                <div className="form-group mb-0">
                  <label className="label-premium">{t('start_time')}</label>
                  <input required type="datetime-local" className="input-premium"
                    value={editFormData.start_date} onChange={e => setEditFormData({...editFormData, start_date: e.target.value})} />
                </div>
                
                <div className="form-group mb-0">
                  <label className="label-premium">{t('end_time')}</label>
                  <input required type="datetime-local" className="input-premium"
                    value={editFormData.end_date} onChange={e => setEditFormData({...editFormData, end_date: e.target.value})} />
                </div>
              </div>

              <div className="form-group mb-8">
                <label className="label-premium">{t('event_description')}</label>
                <textarea rows="3" className="input-premium" style={{ resize: 'none', height: 'auto' }}
                  value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} />
              </div>
              
              <div className="modal-footer pt-6" style={{ borderTop: '1px solid var(--slate-100)' }}>
                <button type="button" onClick={() => setEditingEvent(null)} className="btn-ghost">{t('cancel')}</button>
                <button type="submit" className="btn-admin" style={{minWidth: '150px'}}>
                  {t('save_changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default Events;
