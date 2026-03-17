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
    <div className="container-inner flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary-600 rounded-full animate-spin mb-4" />
      <p>{t('loading_members')}</p>
    </div>
  );

  return (
    <div className="container-inner">
      <div className="page-header animate-in">
        <div className="flex items-center gap-4">
          <Link to="/leader/team" className="btn-action-premium" style={{ width: '3rem', height: '3rem', borderRadius: '12px' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="page-title">{t('find_members')}</h1>
            <p className="page-subtitle">{t('available_participants')}</p>
          </div>
        </div>
      </div>

      <div className="search-input-wrapper mb-8">
        <div className="search-icon-pos">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder={t('search_members_placeholder')}
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="data-table-container animate-in">
        {filteredMembers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <UserPlus size={32} />
            </div>
            <p className="empty-text">{t('no_members_found')}</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredMembers.map(member => (
              <div key={member.id} className="member-item hover-bg p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="user-avatar-box avatar-member w-14 h-14 text-xl">
                    {member.first_name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="user-display-name text-lg">
                      {member.first_name} {member.last_name}
                    </h4>
                    <p className="user-email">{member.email}</p>
                    {member.portfolio && (
                      <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-xs font-semibold hover:underline">
                        {t('view_portfolio')}
                      </a>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleAddMember(member.id)}
                  className={`btn-indigo px-6 ${addingId === member.id ? 'opacity-50 cursor-wait' : ''}`}
                  disabled={addingId === member.id}
                  style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
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
