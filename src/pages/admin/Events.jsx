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
    startTime: '',
    endTime: ''
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
    setEditingEvent(event._id);
    setEditFormData({
      name: event.name,
      description: event.description || '',
      startTime: event.startTime ? new Date(event.startTime).toISOString().slice(0,16) : '',
      endTime: event.endTime ? new Date(event.endTime).toISOString().slice(0,16) : ''
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
    <div className="container-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('events_management')}</h1>
          <p className="page-subtitle">{t('manage_all_events')}</p>
        </div>
        <Link 
          to="/admin/events/create" 
          className="btn-indigo"
        >
          <Plus size={20} />
          {t('create_new_event')}
        </Link>
      </div>

      {loading ? (
        <div className="grid-cards">
          {[1,2,3].map(i => <div key={i} className="skeleton" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Plus size={40} />
          </div>
          <p className="empty-text">{t('no_events')}</p>
          <Link to="/admin/events/create" className="brand-link" style={{justifyContent: 'center'}}>
            <span className="brand-name" style={{fontSize: '1rem'}}>{t('create_new_event')} →</span>
          </Link>
        </div>
      ) : (
        <div className="grid-cards">
          {events.map(event => (
            <div key={event._id} className="relative group">
              <EventCard event={event} />
              
              <div className="workshop-actions">
                <button 
                  onClick={() => handleEditClick(event)}
                  className="action-btn"
                  title="Edit Event"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(event._id)}
                  className="action-btn action-btn-danger"
                  title={t('delete_event')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingEvent && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <div className="modal-header-info">
                <h3>Edit Event</h3>
                <p>Refine hackathon details</p>
              </div>
              <button 
                onClick={() => setEditingEvent(null)} 
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={submitEdit} className="modal-body">
              <div className="form-group">
                <label className="form-label">{t('event_name')}</label>
                <input required type="text" className="form-input"
                  value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('event_description')}</label>
                <textarea rows="3" className="form-input"
                  value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label className="form-label">{t('start_time')}</label>
                  <input required type="datetime-local" className="form-input"
                    value={editFormData.startTime} onChange={e => setEditFormData({...editFormData, startTime: e.target.value})} />
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">{t('end_time')}</label>
                  <input required type="datetime-local" className="form-input"
                    value={editFormData.endTime} onChange={e => setEditFormData({...editFormData, endTime: e.target.value})} />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" onClick={() => setEditingEvent(null)} className="btn-ghost">{t('cancel')}</button>
                <button type="submit" className="btn-indigo">
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
