import React, { useEffect, useState } from 'react';
import { eventsApi } from '../../api/eventsApi';
import { workshopsApi } from '../../api/workshopsApi';
import { Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getPdfUrl } from '../../utils/imageUrl';

const Workshops = () => {
  const { t } = useTranslation();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        let eventData = null;
        try {
          const eventRes = await eventsApi.getCurrent();
          eventData = eventRes.data;
        } catch (err) {
          const allEvents = await eventsApi.getAll();
          // Find first event with status current
          eventData = allEvents.data.find(e => e.status === 'current');
        }

        if (eventData) {
          const res = await workshopsApi.getByEvent(eventData.id);
          setWorkshops(res.data);
        }
      } catch (err) {
        console.error('Failed to load workshops', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  return (
    <div className="layout-member">
      <main className="container-inner">
        <div className="page-header" style={{textAlign: 'center', alignItems: 'center'}}>
          <h1 className="page-title">{t('event_workshops')}</h1>
          <p className="page-subtitle" style={{maxWidth: '40rem'}}>
            {t('join_sessions')}
          </p>
        </div>

        {loading ? (
          <div className="empty-state" style={{border: 'none', boxShadow: 'none'}}>
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : workshops.length === 0 ? (
          <div className="empty-state">
            <h3 className="card-title">{t('no_workshops_scheduled')}</h3>
            <p className="page-subtitle">{t('no_workshops_subtitle')}</p>
          </div>
        ) : (
          <div className="grid-cards">
            {workshops.map(workshop => (
              <div key={workshop.id} className="public-workshop-card animate-in">
                <h3 className="card-title" style={{marginBottom: '1rem'}}>{workshop.title}</h3>
                <p className="card-description" style={{marginBottom: '0'}}>{workshop.description}</p>
                <div className="workshop-meta">
                  <div className="meta-item">
                    <Clock size={18} className="meta-icon" />
                    <span>
                      {new Date(workshop.startTime || workshop.start_time).toLocaleString()}
                      {workshop.duration && ` • ${workshop.duration} h`}
                    </span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={18} className="meta-icon" />
                    <span>{workshop.location || 'Online'}</span>
                  </div>
                </div>

                {workshop.link && (
                  <a 
                    href={getPdfUrl(workshop.link)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '0.625rem 1.25rem', fontSize: '0.875rem', width: 'fit-content' }}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t('view_resources') || 'View PDF'}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Workshops;
