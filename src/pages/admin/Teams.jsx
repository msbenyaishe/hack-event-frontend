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
  const [newScore, setNewScore] = useState(0);

  // Details Editing
  const [editingTeam, setEditingTeam] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '' });

  useEffect(() => {
    let active = true;
    eventsApi.getAll().then(res => {
      if(!active) return;
      setEvents(res.data);
      if (res.data.length > 0) {
        setSelectedEventId(res.data[0]._id);
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
      setTeams(res.data.sort((a,b) => (b.score || 0) - (a.score || 0)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this team?')) {
      try {
        await teamsApi.delete(id);
        fetchTeams(selectedEventId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateScore = async (id, currentScore) => {
    if (editingScore === id) {
      try {
        await teamsApi.updateScores(id, { score: newScore });
        setEditingScore(null);
        fetchTeams(selectedEventId);
      } catch (err) {
        console.error("Failed to update score", err);
      }
    } else {
      setEditingScore(id);
      setNewScore(currentScore || 0);
    }
  };

  const handleEditTeamDetails = (team) => {
    setEditingTeam(team._id);
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
    <div className="container-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('teams_management')}</h1>
          <p className="page-subtitle">{t('monitor_teams')}</p>
        </div>
        <div className="filter-bar">
          <span className="filter-label">{t('event')}</span>
          <select 
            className="filter-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {events.map(event => (
              <option key={event._id} value={event._id}>{event.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="data-table-container animate-in">
        {loading ? (
          <div className="empty-state">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="empty-text">{t('fetching_teams')}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('team_info')}</th>
                  <th style={{textAlign: 'center'}}>{t('members')}</th>
                  <th style={{textAlign: 'right'}}>{t('score')}</th>
                  <th style={{textAlign: 'right'}}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => (
                  <tr key={team._id}>
                    <td>
                      <div className="team-name-cell">
                        <div className="team-main-name">
                          {team.name}
                          <button onClick={() => handleEditTeamDetails(team)} className="action-btn" style={{width: '1.25rem', height: '1.25rem', border: 'none'}}>
                            <Edit size={12} />
                          </button>
                        </div>
                        <div className="team-sub-id">ID: {team._id?.slice(-8)}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div className="members-badge">
                          <Users size={14} />
                          {team.membersCount || team.members?.length || 0}
                        </div>
                      </div>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      {editingScore === team._id ? (
                        <input 
                          type="number" 
                          value={newScore}
                          onChange={(e) => setNewScore(Number(e.target.value))}
                          className="score-input"
                          autoFocus
                          onBlur={() => handleUpdateScore(team._id, team.score)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateScore(team._id, team.score)}
                        />
                      ) : (
                        <button 
                          onClick={() => handleUpdateScore(team._id, team.score)}
                          className="score-display"
                        >
                          {team.score || 0}
                        </button>
                      )}
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'}}>
                        <button 
                          onClick={() => handleUpdateScore(team._id, team.score)}
                          className="action-btn"
                          title="Edit Score"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(team._id)}
                          className="action-btn action-btn-danger"
                          title="Delete Team"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {teams.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state" style={{boxShadow: 'none', border: 'none'}}>
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
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <div className="modal-header-info">
                <h3>Edit Team</h3>
                <p>Update team identifiers</p>
              </div>
              <button onClick={() => setEditingTeam(null)} className="modal-close">&times;</button>
            </div>
            <form onSubmit={submitEditTeam} className="modal-body">
              <div className="form-group">
                <label className="form-label">Team Name</label>
                <input required type="text" className="form-input"
                  value={editFormData.name} onChange={e => setEditFormData({ name: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setEditingTeam(null)} className="btn-ghost">{t('cancel')}</button>
                <button type="submit" className="btn-indigo">
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
