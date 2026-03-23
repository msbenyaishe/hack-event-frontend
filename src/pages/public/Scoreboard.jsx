import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import TeamCard from '../../components/TeamCard';
import EventTimer from '../../components/EventTimer';
import { eventsApi } from '../../api/eventsApi';
import { teamsApi } from '../../api/teamsApi';
import { workshopsApi } from '../../api/workshopsApi';
import { useTranslation } from 'react-i18next';

const Scoreboard = () => {
  const { t } = useTranslation();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [teams, setTeams] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching scoreboard data...');
      const timeoutId = setTimeout(() => {
        console.warn('Scoreboard: fetchData timed out after 30s');
        setLoading(false);
      }, 30000);

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
          console.log('Current event found:', eventData.id);
          setCurrentEvent(eventData);
          
          // Use .id instead of ._id
          const eventId = eventData.id;
          
          const [scoreRes, workshopRes] = await Promise.all([
            teamsApi.getScoreboard(eventId),
            workshopsApi.getByEvent(eventId)
          ]);

          const rawData = scoreRes.data;
          const sorted = Array.isArray(rawData) 
            ? [...rawData].sort((a, b) => (b.total_score || b.score || 0) - (a.total_score || a.score || 0))
            : [];
          setTeams(sorted);
          setWorkshops(workshopRes.data);
          console.log('Scoreboard and workshops loaded:', sorted.length, workshopRes.data.length);
        } else {
          console.warn('No current event found');
        }
      } catch (err) {
        console.error('Failed to load scoreboard', err);
      } finally {
        clearTimeout(timeoutId);
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
      <main className="container-inner">
        <div className="scoreboard-section animate-in mb-16">
          {/* Left Column: Header Content */}
          <div className="scoreboard-hero-content">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
               {t('live_event_hub') || 'Live Event Hub'}
            </div>
            <h1 className="hero-title mb-4 leading-tight">
              {currentEvent ? currentEvent.name : t('live_scoreboard') || 'Live Scoreboard'}
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
               {currentEvent?.description || 'Track real-time rankings, upcoming workshops, and event progress right here.'}
            </p>
          </div>

          {/* Right Column: Unified Timer */}
          <div className="unified-timer-container">
            {currentEvent && (
              <EventTimer 
                startDate={currentEvent.start_date} 
                endDate={currentEvent.end_date} 
              />
            )}
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
             <div className="skeleton" style={{width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 2rem'}} />
             <p className="empty-text">{t('syncing_scores')}</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="empty-state animate-in">
            <h3 className="mb-2">{t('no_teams_found')}</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest">{t('check_back_later')}</p>
          </div>
        ) : (
          <div className="animate-in" style={{animationDelay: '0.2s'}}>
            <div className="member-grid-layout">
              
              {/* Left Column: Rankings */}
              <div className="member-grid-main">
                <div className="section-header mb-12">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t('teams_ranking') || 'Teams Ranking'}</h2>
                   <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-3">{teams.length} {t('teams_registered') || 'Teams Registered'}</p>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {teams.map((team, index) => (
                    <TeamCard key={team.id || index} team={team} rank={index + 1} />
                  ))}
                </div>
              </div>

              {/* Right Column: Workshops Side Widget */}
              <div className="member-grid-sidebar">
                <div className="section-header mb-12">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t('event_workshops') || 'Event Workshops'}</h2>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-3">{t('upcoming_sessions') || 'Upcoming Sessions'}</p>
                </div>

                <div className="flex flex-col gap-8">
                  {workshops.length > 0 ? workshops.map(workshop => (
                    <div key={workshop.id} className="public-workshop-card animate-in">
                      <div className="workshop-tag">
                         {workshop.technology || 'General'}
                      </div>
                      <div className="workshop-duration-badge">
                         {workshop.duration}m
                      </div>
                      <h3>{workshop.title}</h3>
                      <p className="font-medium">
                        {workshop.description}
                      </p>
                    </div>
                  )) : (
                    <div className="p-12 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                       <p className="text-slate-400 font-black text-xs uppercase tracking-widest">{t('no_workshops_yet') || 'No sessions yet'}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Scoreboard;
