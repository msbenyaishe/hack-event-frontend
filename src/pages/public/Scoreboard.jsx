import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import TeamCard from '../../components/TeamCard';
import Timer from '../../components/Timer';
import { eventsApi } from '../../api/eventsApi';
import { teamsApi } from '../../api/teamsApi';
import { workshopsApi } from '../../api/workshopsApi';
import { useTranslation } from 'react-i18next';
import { Users, BookOpen, Trophy } from 'lucide-react';
import Countdown from '../../components/Countdown';

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
      <main className="container-inner" style={{paddingTop: '6rem', paddingBottom: '6rem'}}>
        <div className="scoreboard-hero animate-in mb-12 flex flex-col items-center text-center">
          <div className="max-w-3xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
               <Trophy size={14} />
               {t('live_event_hub') || 'Live Event Hub'}
            </div>
            <h1 className="hero-title mb-4 leading-tight">
              {currentEvent ? currentEvent.name : t('live_scoreboard')}
            </h1>
            <p className="text-slate-500 text-lg font-medium mb-12 max-w-xl">
               {currentEvent?.description || 'Track real-time rankings, upcoming workshops, and event progress right here.'}
            </p>
            
            {currentEvent?.start_date && (
              <div className="w-full transition-all hover:scale-[1.01] duration-300">
                <Countdown startDate={currentEvent.start_date} />
              </div>
            )}
          </div>
        </div>

        <div className="animate-in mb-24 flex justify-center" style={{animationDelay: '0.1s'}}>
           <Timer />
        </div>

        {loading ? (
          <div className="empty-state">
             <div className="skeleton" style={{width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 2rem'}} />
             <p className="empty-text">{t('syncing_scores')}</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="empty-state animate-in">
            <div className="empty-icon">
               <Users size={64} />
            </div>
            <h3 className="mb-2">{t('no_teams_found')}</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest">{t('check_back_later')}</p>
          </div>
        ) : (
          <div className="animate-in" style={{animationDelay: '0.2s'}}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Rankings */}
              <div className="lg:col-span-8">
                <div className="section-header flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                      <Trophy size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 leading-none">{t('teams_ranking')}</h2>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">{teams.length} {t('teams_registered') || 'Teams Ranked'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {teams.map((team, index) => (
                    <TeamCard key={team.id || index} team={team} rank={index + 1} />
                  ))}
                </div>
              </div>

              {/* Right Column: Workshops Side Widget */}
              <div className="lg:col-span-4">
                <div className="section-header flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-none">{t('event_workshops')}</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">{t('upcoming_sessions') || 'Upcoming Sessions'}</p>
                  </div>
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
