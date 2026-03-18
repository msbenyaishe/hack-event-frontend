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
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('color', editData.color);
      
      const fileInput = e.target.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formData.append('logo', fileInput.files[0]);
      }

      await teamsApi.update(team.id, formData);
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
    <div className="leader-page-wrapper">
      <div className="premium-spinner" />
      <p style={{ color: 'var(--slate-400)', fontWeight: 'bold' }}>{t('loading_team') || 'Loading team details…'}</p>
    </div>
  );

  if (!team) return (
    <div className="leader-page-wrapper">
      <div className="leader-header-card animate-in">
        <div className="leader-header-icon">
          <UserPlus />
        </div>
        
        {user?.role === 'leader' ? (
          <>
            <h2 className="leader-title">{t('Create your team') || 'Create your team'}</h2>
            <p className="leader-subtitle">{t('Leader create hint') || 'As a leader, you can create your team now.'}</p>
            
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
            }} className="create-team-form" style={{ maxWidth: '32rem', margin: '0 auto', textAlign: 'left' }}>
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
                    <input name="color" type="color" style={{ width: '100%', height: '3rem', borderRadius: '0.75rem', cursor: 'pointer', border: 'none', padding: 0 }} defaultValue="#4f46e5" />
                  </div>
                  <div className="create-team-field">
                    <label className="form-label">{t('logo') || 'Logo'}</label>
                    <input name="logo" type="file" className="form-input create-team-file" accept="image/*" style={{ fontSize: '0.875rem' }} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-indigo create-team-submit" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}>
                {t('create_team') || 'Create team'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="leader-title">{t('you_dont_have_team') || "You don't have a team yet."}</h2>
            <p className="leader-subtitle">{t('create_one_hint') || 'Join an event first to form your team.'}</p>
            <Link to="/workshops" className="btn-indigo" style={{ display: 'inline-block', padding: '1rem 2rem' }}>
              {t('explore_events') || 'Explore events'}
            </Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="leader-page-wrapper full-width"
      style={{ '--team-brand': team?.color || 'var(--primary)' }}
    >
      {successMessage && (
        <div className="success-alert animate-in">
          <div className="success-alert-dot" />
          {successMessage}
        </div>
      )}

      <div className="myteam-header animate-in">
        <div>
          <h1 className="page-title">{t('my_team') || 'My team'}</h1>
          <div className="myteam-header-info">
            <div 
              className="myteam-logo"
              style={{ backgroundColor: team.color || 'var(--primary-600)' }}
            >
              {team.logo ? (
                <img src={team.logo.startsWith('http') || team.logo.startsWith('/') ? team.logo : `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/uploads/events/${team.logo}`} alt={team.name} />
              ) : (
                team.name?.charAt(0)
              )}
            </div>
            <span className="leader-title" style={{ marginBottom: 0 }}>
              {team.name}
            </span>
            <div className="myteam-points-badge">
              <span className="myteam-points-score">{team.score || 0}</span>
              <span className="myteam-points-label">{t('points') || 'Points'}</span>
            </div>
          </div>
        </div>
        <div className="myteam-actions">
          {user?.role === 'leader' && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="myteam-action-btn btn-secondary"
            >
              <Edit size={18} />
              {t('edit_team') || 'Edit team'}
            </button>
          )}
          <Link 
            to="/leader/select-members"
            className="myteam-action-btn btn-indigo"
          >
            <Search size={18} />
            {t('find_members') || 'Find teammates'}
          </Link>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="myteam-modal-overlay">
          <div className="myteam-modal-content animate-in">
            <div className="myteam-modal-header">
              <h2>{t('edit_team') || 'Edit team'}</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="myteam-modal-close">
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateTeam} className="myteam-modal-body">
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
                  style={{ width: '100%', height: '3rem', borderRadius: '0.75rem', cursor: 'pointer', border: 'none', padding: 0 }}
                  value={editData.color}
                  onChange={(e) => setEditData({...editData, color: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('logo') || 'Team Logo'}</label>
                <input 
                  type="file" 
                  name="logo"
                  accept="image/*"
                  className="form-input" 
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
              <div className="myteam-modal-actions">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">
                  {t('cancel') || 'Cancel'}
                </button>
                <button type="submit" className="btn-indigo">
                  {t('save_changes') || 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card-premium animate-in">
        <div className="myteam-table-header">
          <div>
            <h2 className="myteam-table-title">{t('team_members') || 'Team members'}</h2>
            <p className="myteam-table-subtitle">{t('core_contributors') || 'Core contributors of'} {team.name}</p>
          </div>
          <div className="badge badge-indigo">
            {team.members?.length || 0} / 5
          </div>
        </div>
        
        {team.members?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <UserPlus size={48} />
            </div>
            <p className="empty-text">{t('no_members_added') || 'No members added yet.'}</p>
            <p style={{ marginTop: '0.5rem', color: 'var(--slate-400)' }}>{t('invite_colleagues') || 'Invite teammates to start building.'}</p>
          </div>
        ) : (
          <div>
            {team.members?.map(member => {
              const name = member.name || `${member.first_name} ${member.last_name}` || member.email || t('unnamed_participant');
              const role = member.role || 'member';
              const isLeader = role === 'leader';
              
              return (
                <div key={member.id} className="myteam-member-item">
                  <div className="myteam-member-info">
                    <div className={`myteam-member-avatar ${isLeader ? 'leader' : ''}`}>
                      {name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="myteam-member-name">
                        {name}
                        {isLeader && <span className="myteam-member-role">{t('leader') || 'Leader'}</span>}
                      </h4>
                      <p className="myteam-member-email">{member.email}</p>
                    </div>
                  </div>
                  
                  {!isLeader && (
                    <button 
                      onClick={() => handleRemoveMember(member.id)}
                      className="btn-admin" // Reuse btn-admin style or action-btn style
                      style={{ padding: '0.5rem 1rem', borderColor: 'var(--error)', color: 'var(--error)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--error)'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--error)'; }}
                      title={t('remove_member') || 'Remove member'}
                    >
                      <Trash2 size={18} />
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
