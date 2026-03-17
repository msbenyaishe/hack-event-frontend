import React, { useEffect, useState } from 'react';
import { teamsApi } from '../../api/teamsApi';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import { Trash2, Edit, Search, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MyTeam = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ name: '', color: '' });
  const [refresh, setRefresh] = useState(0);

  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      await teamsApi.update(team.id, editData);
      setIsEditModalOpen(false);
      setSuccessMessage('Team updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setRefresh(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to update team');
    }
  };

  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        setLoading(true);
        // Find the team where this user is the leader or a member.
        const authRes = await api.get('/auth/me'); 
        const freshUser = authRes.data.user;
        
        const myTeamId = freshUser?.team_id;
        
        if (myTeamId) {
           const teamRes = await teamsApi.getById(myTeamId);
           const membersRes = await teamsApi.getTeamMembers(myTeamId);
           setTeam({ ...teamRes.data, members: membersRes.data });
           setEditData({ name: teamRes.data.name, color: teamRes.data.color || '#4f46e5' });
        } else {
           setTeam(null);
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
  }, [user, refresh]);

  const handleRemoveMember = async (memberId) => {
    if (window.confirm(t('remove_member') + '?')) {
      try {
        await teamsApi.removeMember(team.id, memberId);
        setSuccessMessage('Member removed successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        const membersRes = await teamsApi.getTeamMembers(team.id);
        setTeam(prev => ({ ...prev, members: membersRes.data }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-bold tracking-tight">{t('loading_team') || 'Loading team details…'}</p>
    </div>
  );

  if (!team) return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center py-24 bg-white rounded-[2.5rem] shadow-premium border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
          <UserPlus size={40} className="text-slate-200" />
        </div>
        
        {user?.role === 'leader' ? (
          <>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">{t('Create your team') || 'Create your team'}</h2>
            <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto">{t('Leader create hint') || 'As a leader, you can create your team now.'}</p>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              try {
                setLoading(true);
                await teamsApi.create(formData);
                setSuccessMessage('Team successfully created! Welcome leader.');
                setTimeout(() => setSuccessMessage(''), 5000);
                setRefresh(prev => prev + 1);
              } catch (err) {
                console.error(err);
                alert(err.response?.data?.error || 'Failed to create team');
              } finally {
                setLoading(false);
              }
            }} className="create-team-form max-w-lg mx-auto text-left">
              <div className="create-team-grid">
              <div className="create-team-field">
                <label className="form-label">{t('team_name') || 'Team name'}</label>
                <input
                  name="name"
                  type="text"
                  className="form-input"
                  required
                  placeholder={t('enter_team_name') || 'Enter a team name'}
                />
              </div>
              <div className="create-team-row">
                <div className="create-team-field">
                  <label className="form-label">{t('color') || 'Brand color'}</label>
                  <input name="color" type="color" className="w-full h-12 rounded-xl cursor-pointer" defaultValue="#4f46e5" />
                </div>
                <div className="create-team-field">
                  <label className="form-label">{t('logo') || 'Logo'}</label>
                  <input name="logo" type="file" className="form-input text-xs create-team-file" accept="image/*" />
                </div>
              </div>
              </div>

              <button type="submit" className="btn-indigo w-full py-4 mt-4 create-team-submit">
                {t('create_team') || 'Create team'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">{t('you_dont_have_team') || "You don't have a team yet."}</h2>
            <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto">{t('create_one_hint') || 'Join an event first to form your team.'}</p>
            <Link to="/workshops" className="btn-indigo px-8 inline-block">
              {t('explore_events') || 'Explore events'}
            </Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="container-inner">
      {successMessage && (
        <div className="mb-8 animate-in slide-in-from-top duration-500">
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {successMessage}
          </div>
        </div>
      )}

      <div className="page-header animate-in">
        <div style={{flex: 1}}>
          <h1 className="page-title">{t('my_team') || 'My team'}</h1>
          <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem'}}>
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-premium border-4 border-white"
              style={{ backgroundColor: team.color || 'var(--primary-600)' }}
            >
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                team.name?.charAt(0)
              )}
            </div>
            <span className="card-title" style={{fontSize: '2rem', color: 'var(--slate-900)', fontWeight: 900}}>
              {team.name}
            </span>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--slate-900)', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '1rem'}}>
              <span style={{fontSize: '1.25rem', fontWeight: '900', fontFamily: 'monospace'}}>{team.score || 0}</span>
              <span className="filter-label" style={{color: 'rgba(255,255,255,0.6)', marginBottom: 0}}>{t('points') || 'Points'}</span>
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem'}}>
          {user?.role === 'leader' && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="btn btn-secondary"
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flex: '1 1 auto'}}
            >
              <Edit size={18} />
              {t('edit_team') || 'Edit team'}
            </button>
          )}
          <Link 
            to="/leader/select-members"
            className="btn-indigo"
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flex: '1 1 auto'}}
          >
            <Search size={18} />
            {t('find_members') || 'Find teammates'}
          </Link>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-premium w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900">{t('edit_team') || 'Edit team'}</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateTeam} className="p-8 space-y-6">
              <div className="form-group">
                <label className="form-label">{t('team_name') || 'Team name'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('color') || 'Brand color'}</label>
                <input 
                  type="color" 
                  className="w-full h-12 rounded-xl cursor-pointer" 
                  value={editData.color}
                  onChange={(e) => setEditData({...editData, color: e.target.value})}
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary flex-1">
                  {t('cancel') || 'Cancel'}
                </button>
                <button type="submit" className="btn-indigo flex-1">
                  {t('save_changes') || 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="data-table-container animate-in">
        <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', backgroundColor: 'var(--slate-50)'}}>
          <div>
            <h2 className="card-title" style={{marginBottom: '0.25rem'}}>{t('team_members') || 'Team members'}</h2>
            <p className="filter-label" style={{marginBottom: 0}}>{t('core_contributors') || 'Core contributors of'} {team.name}</p>
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
            <p className="empty-text">{t('no_members_added') || 'No members added yet.'}</p>
            <p className="page-subtitle">{t('invite_colleagues') || 'Invite teammates to start building.'}</p>
          </div>
        ) : (
          <div className="divide-y">
            {team.members?.map(member => {
              const name = member.name || `${member.first_name} ${member.last_name}` || member.email || t('unnamed_participant');
              const role = member.role || 'member';
              const isLeader = role === 'leader';
              
              return (
                <div key={member.id} className="member-item hover-bg" style={{padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                    <div className={`user-avatar-box ${isLeader ? 'avatar-leader' : 'avatar-member'}`} style={{width: '3.5rem', height: '3.5rem', fontSize: '1.25rem', fontWeight: '900'}}>
                      {name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="user-display-name" style={{fontSize: '1.25rem'}}>
                        {name}
                        {isLeader && <span className="badge badge-indigo" style={{marginLeft: '0.75rem', fontSize: '0.625rem'}}>{t('leader') || 'Leader'}</span>}
                      </h4>
                      <p className="user-email">{member.email}</p>
                    </div>
                  </div>
                  
                  {!isLeader && (
                    <button 
                      onClick={() => handleRemoveMember(member.id)}
                      className="action-btn action-btn-danger"
                      title={t('remove_member') || 'Remove member'}
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
