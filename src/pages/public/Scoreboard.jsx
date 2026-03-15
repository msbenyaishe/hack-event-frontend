import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import TeamCard from '../../components/TeamCard';
import Timer from '../../components/Timer';
import { eventsApi } from '../../api/eventsApi';
import { teamsApi } from '../../api/teamsApi';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

const Scoreboard = () => {
  const { t } = useTranslation();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
          setCurrentEvent(eventData);
          const scoreRes = await teamsApi.getScoreboard(eventData._id);
          const rawData = scoreRes.data;
          // Sort teams by score descending
          const sorted = Array.isArray(rawData) 
            ? [...rawData].sort((a, b) => (b.score || 0) - (a.score || 0))
            : [];
          setTeams(sorted);
        }
      } catch (err) {
        console.error('Failed to load scoreboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh scoreboard every 60s
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="layout-member">
      <Navbar />
      <main className="container-inner" style={{paddingTop: '4rem', paddingBottom: '4rem'}}>
        <div className="scoreboard-hero animate-in">
          <div>
            <h1 className="hero-title">
              {t('live_scoreboard')}
            </h1>
            <div className="live-indicator">
              <div className="live-dot" />
              <p className="hero-subtitle">
                {currentEvent ? currentEvent.name : t('waiting_event')}
              </p>
            </div>
          </div>
          <div className="timer-container">
            <Timer />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
             <div className="skeleton" style={{width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 2rem'}} />
             <p className="empty-text">{t('syncing_scores') || 'Syncing Live Scores'}</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="empty-state animate-in">
            <div className="empty-icon">
               <Users size={64} />
            </div>
            <h3 className="mb-2">{t('no_teams_found')}</h3>
            <p className="hero-subtitle">{t('check_back_later')}</p>
          </div>
        ) : (
          <div className="animate-in" style={{animationDelay: '0.2s'}}>
            <div className="grid-cards" style={{gridTemplateColumns: '1fr'}}>
              {teams.map((team, index) => (
                <TeamCard key={team._id || index} team={team} rank={index + 1} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="footer">
        <p className="footer-text">Built for Innovation • HackEvent 2024</p>
      </footer>
    </div>
  );
};

export default Scoreboard;
