import React, { useEffect, useState } from 'react';
import { teamsApi } from '../../api/teamsApi';
import { useAuth } from '../../hooks/useAuth';
import { Trash2, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MyTeam = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const res = await teamsApi.getAll();
        const myTeam = res.data.find(t => 
          t.leader === user.id || t.members.some(m => m.user?._id === user.id || m.user === user.id)
        );
        
        if (myTeam) {
           const teamRes = await teamsApi.getById(myTeam._id);
           setTeam(teamRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyTeam();
    }
  }, [user]);

  const handleRemoveMember = async (memberId) => {
    if (window.confirm(t('remove_member') + '?')) {
      try {
        await teamsApi.removeMember(team._id, memberId);
        const res = await teamsApi.getById(team._id);
        setTeam(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-bold tracking-tight">{t('loading_team')}</p>
    </div>
  );

  if (!team) return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center py-24 bg-white rounded-[2.5rem] shadow-premium border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
          <UserPlus size={40} className="text-slate-200" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">{t('you_dont_have_team')}</h2>
        <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto">{t('create_one_hint') || 'Join a hackathon event first to form your dream team'}</p>
        <Link to="/public/workshops" className="btn-indigo px-8 inline-block">
          {t('explore_events') || 'Explore Events'}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container-inner">
      <div className="page-header animate-in">
        <div style={{flex: 1}}>
          <h1 className="page-title">{t('my_team')}</h1>
          <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '1.5rem'}}>
            <span className="card-title" style={{fontSize: '2rem', color: 'var(--primary-600)', backgroundColor: 'var(--primary-50)', padding: '0.5rem 1.25rem', borderRadius: '1rem', border: '1px solid var(--primary-100)'}}>
              {team.name}
            </span>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--slate-900)', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '1rem'}}>
              <span style={{fontSize: '1.25rem', fontWeight: '900', fontFamily: 'monospace'}}>{team.score || 0}</span>
              <span className="filter-label" style={{color: 'rgba(255,255,255,0.6)', marginBottom: 0}}>{t('points')}</span>
            </div>
          </div>
        </div>
        <Link 
          to="/leader/invite"
          className="btn-indigo"
          style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
        >
          <UserPlus size={18} />
          {t('invite_members')}
        </Link>
      </div>

      <div className="data-table-container animate-in">
        <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', backgroundColor: 'var(--slate-50)'}}>
          <div>
            <h2 className="card-title" style={{marginBottom: '0.25rem'}}>{t('team_members')}</h2>
            <p className="filter-label" style={{marginBottom: 0}}>Core contributors of {team.name}</p>
          </div>
          <div className="badge badge-indigo" style={{fontSize: '0.875rem', padding: '0.5rem 1rem'}}>
            {team.members?.length || 0} / 5
          </div>
        </div>
        
        {team.members?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <UserPlus size={32} />
            </div>
            <p className="empty-text">No members added yet.</p>
            <p className="page-subtitle">Invite some colleagues to start building!</p>
          </div>
        ) : (
          <div className="divide-y">
            {team.members?.map(member => {
              const userInfo = member.user || {};
              const name = userInfo.name || userInfo.email || 'Unknown User';
              const role = member.role || 'member';
              const isLeader = role === 'leader';
              
              return (
                <div key={member._id} className="member-item hover-bg" style={{padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                    <div className={`user-avatar-box ${isLeader ? 'avatar-leader' : 'avatar-member'}`} style={{width: '3.5rem', height: '3.5rem', fontSize: '1.25rem', fontWeight: '900'}}>
                      {name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="user-display-name" style={{fontSize: '1.25rem'}}>
                        {name}
                        {isLeader && <span className="badge badge-indigo" style={{marginLeft: '0.75rem', fontSize: '0.625rem'}}>Leader</span>}
                      </h4>
                      <p className="user-email">{userInfo.email}</p>
                    </div>
                  </div>
                  
                  {!isLeader && (
                    <button 
                      onClick={() => handleRemoveMember(userInfo._id || userInfo)}
                      className="action-btn action-btn-danger"
                      title={t('remove_member')}
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
