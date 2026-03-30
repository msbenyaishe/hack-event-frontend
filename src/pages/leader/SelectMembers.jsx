import React, { useEffect, useState } from 'react';
import { teamsApi } from '../../api/teamsApi';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus, Search, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SelectMembers = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableMembers, setAvailableMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Get current member/leader info to find event_id and team_id
        const authRes = await api.get('/auth/me'); // Safe endpoint for all logged-in members
        const myTeamId = authRes.data.user?.team_id || authRes.data.team_id;
        const eventId = authRes.data.user?.event_id || authRes.data.event_id;

        if (!myTeamId) {
          alert(t('team_required_error'));
          navigate('/leader/team');
          return;
        }

        // 2. Fetch team details (to check capacity)
        const teamRes = await teamsApi.getById(myTeamId);
        setTeam(teamRes.data);

        // 3. Fetch available members for this event
        const membersRes = await teamsApi.getAvailableMembers(eventId);
        setAvailableMembers(membersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, navigate, t]);

  const handleAddMember = async (memberId) => {
    try {
      setAddingId(memberId);
      await teamsApi.addMember(team.id, memberId);
      
      // Update local state
      setAvailableMembers(prev => prev.filter(m => m.id !== memberId));
      
      // Update team member count locally
      const updatedTeam = await teamsApi.getById(team.id);
      setTeam(updatedTeam.data);

      alert(t('member_added_successfully'));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || t('failed_to_add_member') || 'Failed to add member');
    } finally {
      setAddingId(null);
    }
  };

  const filteredMembers = availableMembers.filter(member => 
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="leader-page-wrapper">
      <div className="premium-spinner" />
      <p style={{ color: 'var(--slate-400)', fontWeight: 'bold' }}>{t('loading_members')}</p>
    </div>
  );

  return (
    <div className="leader-page-wrapper full-width">
      <div className="admin-toolbar" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/leader/team" className="btn-action-premium" style={{ width: 'auto' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="page-title">{t('find_members')}</h1>
            <p className="page-subtitle">{t('available_participants')}</p>
          </div>
        </div>
      </div>

      <div className="select-members-search animate-in">
        <div className="select-members-search-icon">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder={t('search_members_placeholder')}
          className="select-members-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card-premium animate-in">
        {filteredMembers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <UserPlus size={48} />
            </div>
            <p className="empty-text">{t('no_members_found')}</p>
          </div>
        ) : (
          <div>
            {filteredMembers.map(member => (
              <div key={member.id} className="select-member-card">
                <div className="select-member-info">
                  <div className="select-member-avatar">
                    {member.first_name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="select-member-name">
                      {member.first_name} {member.last_name}
                    </h4>
                    <p className="select-member-email">{member.email}</p>
                    {member.portfolio && (
                      <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="select-member-portfolio">
                        {t('view_portfolio')}
                      </a>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleAddMember(member.id)}
                  className="select-member-add-btn"
                  disabled={addingId === member.id}
                >
                  <UserPlus size={18} />
                  {addingId === member.id ? t('adding_member') : t('add_to_team')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectMembers;
