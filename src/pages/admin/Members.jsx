import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { invitesApi } from '../../api/invitesApi';
import { Shield, User, Trash2, Send, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Members = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invite Leader State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);
  const [inviteError, setInviteError] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getMembers();
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateRole(userId, newRole);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Delete this user?")) {
      try {
        await adminApi.deleteMember(userId);
        fetchMembers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleInviteLeader = async (e) => {
    e.preventDefault();
    try {
      setInviteLoading(true);
      setInviteError(null);
      setInviteMessage(null);
      await invitesApi.createLeaderInvite({ email: inviteEmail });
      setInviteMessage(`Leader invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (err) {
      console.error(err);
      setInviteError(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="container-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('platform_members')}</h1>
          <p className="page-subtitle">{t('manage_users')}</p>
        </div>
      </div>

      <div className="invite-form-container animate-in">
        <div className="invite-form-header">
          <div className="invite-icon">
            <Shield size={20} />
          </div>
          <h3 className="card-title">Invite Platform Leader</h3>
        </div>
        
        {inviteMessage && (
          <div className="auth-error" style={{backgroundColor: '#ecfdf5', color: '#059669', borderColor: '#d1fae5'}}>
            <div className="error-dot" style={{backgroundColor: '#059669'}} />
            {inviteMessage}
          </div>
        )}
        {inviteError && (
          <div className="auth-error">
            <div className="error-dot" />
            {inviteError}
          </div>
        )}

        <form onSubmit={handleInviteLeader} className="invite-form">
          <div className="input-with-icon">
            <div className="input-icon">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              required
              placeholder="leader@example.com"
              className="input-field"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={inviteLoading}
            className="btn-indigo btn-full sm:w-auto"
            style={{marginTop: 0}}
          >
            <Send size={16} />
            {inviteLoading ? t('sending') : t('send_invite')}
          </button>
        </form>
      </div>

      <div className="data-table-container animate-in">
        {loading ? (
          <div className="empty-state">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="empty-text">{t('fetching_members')}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('user')}</th>
                  <th>{t('role')}</th>
                  <th style={{textAlign: 'right'}}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div className="member-info-cell">
                        <div className={`user-avatar-box ${
                          member.role === 'admin' 
                            ? 'avatar-admin' 
                            : member.role === 'leader'
                            ? 'avatar-leader'
                            : 'avatar-member'
                        }`}>
                          {member.role === 'admin' ? <Shield size={20} /> : <User size={20} />}
                        </div>
                        <div className="user-details">
                          <div className="user-display-name">{member.name || 'Unnamed Participant'}</div>
                          <div className="user-email">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select 
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className={`role-select ${
                          member.role === 'admin' 
                            ? 'role-admin' 
                            : member.role === 'leader'
                            ? 'role-leader'
                            : 'role-member'
                        }`}
                      >
                        <option value="member">Member</option>
                        <option value="leader">Leader</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{textAlign: 'right'}}>
                      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <button 
                          onClick={() => handleDeleteUser(member.id)}
                          className="action-btn action-btn-danger"
                          title="Delete Member"
                          style={member.role === 'admin' ? {opacity: 0.2, cursor: 'not-allowed'} : {}}
                          disabled={member.role === 'admin'} 
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
