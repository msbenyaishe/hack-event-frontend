import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import TeamCard from '../../components/TeamCard';
import EventTimer from '../../components/EventTimer';
import { eventsApi } from '../../api/eventsApi';
import { teamsApi } from '../../api/teamsApi';
import { workshopsApi } from '../../api/workshopsApi';
import { useTranslation } from 'react-i18next';
import { getImageUrl, getPdfUrl } from '../../utils/imageUrl';

const Scoreboard = () => {
  const { t } = useTranslation();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [teams, setTeams] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Members Modal State
  const [selectedTeamForMembers, setSelectedTeamForMembers] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const handleViewMembers = async (team) => {
    setSelectedTeamForMembers(team);
    setLoadingMembers(true);
    setTeamMembers([]);
    try {
      const res = await teamsApi.getTeamMembers(team.id);
      setTeamMembers(res.data);
    } catch (err) {
      console.error('Failed to load team members', err);
    } finally {
      setLoadingMembers(false);
    }
  };

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
            <div className="event-title-container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {currentEvent?.logo && (
                <div className="animate-in" style={{ 
                  width: 'clamp(12rem, 30vw, 18rem)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  borderRadius: '24px'
                }}>
                  <img src={getImageUrl(currentEvent.logo)} alt="Event Logo" style={{ width: '100%', height: 'auto', maxHeight: '16rem', objectFit: 'contain', borderRadius: '16px',}} />
                </div>
              )}
              <h1 className="hero-title leading-tight" style={{ margin: 0 }}>
                {currentEvent ? currentEvent.name : t('live_scoreboard') || 'Live Scoreboard'}
              </h1>
            </div>
            <div className="flex items-start gap-4 mt-6 max-w-2xl animate-in hero-description-wrapper">
              <svg className="hero-quote-icon" width="28" height="28" viewBox="0 0 24 24" fill="var(--primary)" style={{ opacity: 0.8, flexShrink: 0, marginTop: '5px' }}>
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="description-text text-2xl md:text-4xl text-slate-700 font-bold italic leading-tight" style={{ letterSpacing: '-0.015em' }}>
                {currentEvent?.description || 'Track real-time rankings, upcoming workshops, and event progress right here.'}
              </p>
            </div>
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
                    <TeamCard key={team.id || index} team={team} rank={index + 1} onViewMembers={handleViewMembers} />
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
                         {workshop.duration} h
                      </div>
                      <h3>{workshop.title}</h3>
                      <p className="font-medium">
                        {workshop.description}
                      </p>
                      
                      {workshop.link && (
                        <a 
                          href={getPdfUrl(workshop.link)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-secondary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '10px' }}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {t('view_resource') || 'View PDF'}
                        </a>
                      )}
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

      {/* Members Modal */}
      {selectedTeamForMembers && (
        <div className="modal-overlay modal-overlay-premium" style={{zIndex: 1000}}>
          <div className="modal-content modal-content-premium animate-in" style={{maxWidth: '550px'}}>
            <div className="modal-header">
              <div className="modal-header-info">
                <h3>{selectedTeamForMembers.name} Members</h3>
                <p className="text-slate-500 font-medium">List of members in this team</p>
              </div>
              <button 
                onClick={() => setSelectedTeamForMembers(null)} 
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body member-modal-body">
              {loadingMembers ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', border: '4px solid var(--primary-100)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--slate-400)', fontWeight: 600 }}>Loading members...</p>
                </div>
              ) : teamMembers.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--slate-50)', borderRadius: '20px', border: '2px dashed var(--slate-200)' }}>
                  <p style={{ color: 'var(--slate-400)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>No members found in this team</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {teamMembers.map(member => (
                    <div key={member.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: '20px', background: '#fff', border: '1px solid var(--slate-100)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--primary-200)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--slate-100)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 200px', minWidth: 0 }}>
                        {/* Avatar */}
                        <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-50), #fff)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 900, flexShrink: 0, position: 'relative', border: '1px solid var(--primary-100)' }}>
                          {member.first_name?.charAt(0).toUpperCase()}{member.last_name?.charAt(0).toUpperCase()}
                          {member.role === 'leader' && (
                            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '22px', height: '22px', background: 'linear-gradient(135deg, var(--warning), #f97316)', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', boxShadow: 'var(--shadow-sm)' }} title="Team Leader">
                              ★
                            </div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h4 style={{ fontWeight: 800, color: 'var(--slate-900)', fontSize: '1.05rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                              {member.first_name} {member.last_name}
                            </h4>
                            {member.role === 'leader' ? (
                              <span style={{ background: '#fffbeb', color: '#d97706', fontSize: '0.65rem', padding: '0.2rem 0.6rem', border: '1px solid #fef3c7', borderRadius: '999px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                Leader
                              </span>
                            ) : (
                              <span style={{ background: 'var(--slate-50)', color: 'var(--slate-500)', fontSize: '0.65rem', padding: '0.2rem 0.6rem', border: '1px solid var(--slate-100)', borderRadius: '999px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                Member
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                            {member.email}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions / Portfolio Link */}
                      {member.portfolio && (
                        <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end', minWidth: 'fit-content' }}>
                          <a 
                            href={member.portfolio.startsWith('http') ? member.portfolio : `https://${member.portfolio}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', background: 'var(--slate-50)', color: 'var(--slate-500)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid var(--slate-100)', transition: 'all 0.2s', textDecoration: 'none' }}
                            title="View Portfolio"
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-600)'; e.currentTarget.style.borderColor = 'var(--primary-200)'; e.currentTarget.style.background = 'var(--primary-50)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--slate-500)'; e.currentTarget.style.borderColor = 'var(--slate-100)'; e.currentTarget.style.background = 'var(--slate-50)'; }}
                          >
                            Portfolio
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;
