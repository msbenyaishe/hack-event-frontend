import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { eventsApi } from '../../api/eventsApi';
import { workshopsApi } from '../../api/workshopsApi';
import { Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
          const res = await workshopsApi.getByEvent(eventData._id);
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
      <main className="container-inner" style={{paddingTop: '4rem', paddingBottom: '4rem'}}>
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
              <div key={workshop._id} className="public-workshop-card animate-in">
                <h3 className="card-title" style={{marginBottom: '1rem'}}>{workshop.title}</h3>
                <p className="card-description" style={{marginBottom: '0'}}>{workshop.description}</p>
                <div className="workshop-meta">
                  <div className="meta-item">
                    <Clock size={18} className="meta-icon" />
                    <span>{new Date(workshop.startTime).toLocaleString()}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={18} className="meta-icon" />
                    <span>{workshop.location || 'Online'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Workshops;
