import React, { useEffect, useState } from 'react';
import { eventsApi } from '../../api/eventsApi';
import { teamsApi } from '../../api/teamsApi';
import { Trash2, Edit2, Users, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Teams = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Score Editing
  const [editingScore, setEditingScore] = useState(null);
  const [newScores, setNewScores] = useState({ practical: 0, theoretical: 0 });

  // Details Editing
  const [editingTeam, setEditingTeam] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '' });

  useEffect(() => {
    let active = true;
    eventsApi.getAll().then(res => {
      if(!active) return;
      setEvents(res.data);
      if (res.data.length > 0) {
        setSelectedEventId(res.data[0].id);
      }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchTeams(selectedEventId);
    }
  }, [selectedEventId]);

  const fetchTeams = async (eventId) => {
    try {
      setLoading(true);
      const res = await teamsApi.getScoreboard(eventId);
      // Use total_score field from backend
      setTeams(res.data.sort((a,b) => (b.total_score || 0) - (a.total_score || 0)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_delete') || 'Delete this team?')) {
      try {
        await teamsApi.delete(id);
        fetchTeams(selectedEventId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateScore = async (id, team) => {
    if (editingScore === id) {
      try {
        await teamsApi.updateScores(id, { 
          practical_score: newScores.practical,
          theoretical_score: newScores.theoretical 
        });
        setEditingScore(null);
        fetchTeams(selectedEventId);
      } catch (err) {
        console.error("Failed to update score", err);
      }
    } else {
      setEditingScore(id);
      setNewScores({ 
        practical: team.practical_score || 0, 
        theoretical: team.theoretical_score || 0 
      });
    }
  };

  const handleEditTeamDetails = (team) => {
    setEditingTeam(team.id);
    setEditFormData({ name: team.name });
  };

  const submitEditTeam = async (e) => {
    e.preventDefault();
    try {
      await teamsApi.update(editingTeam, editFormData);
      setEditingTeam(null);
      fetchTeams(selectedEventId);
    } catch (err) {
      console.error("Failed to update team", err);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-toolbar" style={{display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
        <div style={{ flex: '1 1 300px' }}>
          <h1 className="page-title">{t('teams_management')}</h1>
          <p className="page-subtitle">{t('monitor_teams')}</p>
        </div>
        
        <div className="flex gap-4 items-center" style={{ flex: '1 1 auto' }}>
          <div className="search-input-wrapper" style={{ width: '100%' }}>
             <div className="search-icon-pos"><Users size={18} /></div>
             <select 
               className="search-input"
               style={{ paddingLeft: '3rem', width: '100%' }}
               value={selectedEventId}
               onChange={(e) => setSelectedEventId(e.target.value)}
             >
               {events.map(event => (
                 <option key={event.id} value={event.id}>{event.name}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      <div className="admin-card animate-in">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary-600 rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-slate-400 font-medium">{t('fetching_teams')}</p>
          </div>
        ) : (
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>{t('team_info')}</th>
                  <th style={{textAlign: 'center'}}>{t('members')}</th>
                  <th style={{textAlign: 'center'}}>{t('practical')}</th>
                  <th style={{textAlign: 'center'}}>{t('theory')}</th>
                  <th style={{textAlign: 'right'}}>{t('total_score')}</th>
                  <th style={{textAlign: 'right'}}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => (
                  <tr key={team.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{team.name}</div>
                        <button 
                          onClick={() => handleEditTeamDetails(team)} 
                          className="btn-action-premium" 
                          style={{width: '1.5rem', height: '1.5rem'}}
                          title={t('edit_team')}
                        >
                          <Edit size={12} />
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '2px' }}>
                        ID: {team.id?.toString().slice(-8)}
                      </div>
                    </td>
                    <td>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div className="badge-premium badge-info">
                          <Users size={14} />
                          {team.membersCount || team.members?.length || 0}
                        </div>
                      </div>
                    </td>
                    <td style={{textAlign: 'center'}}>
                      {editingScore === team.id ? (
                        <input 
                          type="number" 
                          max="20" min="0"
                          value={newScores.practical}
                          onChange={(e) => setNewScores(prev => ({ ...prev, practical: Number(e.target.value) }))}
                          className="input-premium"
                          style={{ width: '70px', padding: '0.5rem', textAlign: 'center' }}
                        />
                      ) : (
                        <div className="badge-premium" style={{ background: 'var(--slate-50)', color: 'var(--slate-600)' }}>
                          {team.practical_score || 0}
                        </div>
                      )}
                    </td>
                    <td style={{textAlign: 'center'}}>
                      {editingScore === team.id ? (
                        <input 
                          type="number" 
                          max="20" min="0"
                          value={newScores.theoretical}
                          onChange={(e) => setNewScores(prev => ({ ...prev, theoretical: Number(e.target.value) }))}
                          className="input-premium"
                          style={{ width: '70px', padding: '0.5rem', textAlign: 'center' }}
                        />
                      ) : (
                        <div className="badge-premium" style={{ background: 'var(--slate-50)', color: 'var(--slate-600)' }}>
                          {team.theoretical_score || 0}
                        </div>
                      )}
                    </td>
                    <td style={{textAlign: 'right'}}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {editingScore === team.id ? (newScores.practical + newScores.theoretical) : (team.total_score || team.score || 0)}
                        </div>
                    </td>
                    <td>
                      <div className="action-group" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleUpdateScore(team.id, team)}
                          className={`btn-action-premium ${editingScore === team.id ? 'active' : ''}`}
                          style={editingScore === team.id ? { background: 'var(--primary)', color: 'white' } : {}}
                          title={editingScore === team.id ? t('save') || "Save" : t('edit_scores') || "Edit Scores"}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(team.id)}
                          className="btn-action-premium danger"
                          title={t('delete_team') || "Delete Team"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {teams.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state" style={{boxShadow: 'none', border: 'none', padding: '4rem'}}>
                        <div className="empty-icon">
                          <Users size={32} />
                        </div>
                        <p className="empty-text">{t('no_teams_found')}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingTeam && (
        <div className="modal-overlay modal-overlay-premium">
          <div className="modal-content modal-content-premium animate-in" style={{maxWidth: '450px'}}>
            <div className="modal-header">
              <div className="modal-header-info">
                <h3>{t('edit_team')}</h3>
                <p>{t('update_team_identifiers') || 'Update team identifiers'}</p>
              </div>
              <button 
                onClick={() => setEditingTeam(null)} 
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={submitEditTeam} className="modal-body p-8">
              <div className="form-group mb-8">
                <label className="label-premium">{t('team_name')}</label>
                <input required type="text" className="input-premium"
                  value={editFormData.name} onChange={e => setEditFormData({ name: e.target.value })} />
              </div>
              <div className="modal-footer pt-4" style={{borderTop: '1px solid var(--slate-100)'}}>
                <button type="button" onClick={() => setEditingTeam(null)} className="btn-ghost">{t('cancel')}</button>
                <button type="submit" className="btn-admin">
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


export default Teams;
