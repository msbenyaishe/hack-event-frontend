import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { User, Trash2, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Members = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Platform Members State

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
    if (userId && window.confirm(t('confirm_delete') || "Delete this user?")) {
      try {
        await adminApi.deleteMember(userId);
        fetchMembers();
      } catch (err) {
        console.error(err);
      }
    }
  };


  return (
    <div className="admin-page-container">
      <div className="admin-toolbar">
        <div>
          <h1 className="page-title">{t('platform_members')}</h1>
          <p className="page-subtitle">{t('manage_users')}</p>
        </div>
      </div>


      <div className="admin-card animate-in">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary-600 rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-slate-400 font-medium">{t('fetching_members')}</p>
          </div>
        ) : members.length === 0 ? (
          <div className="empty-state p-12">
            <div className="empty-icon">
              <User size={40} />
            </div>
            <p className="empty-text">{t('no_members_found') || 'No members found'}</p>
          </div>
        ) : (
          <div className="premium-table-wrapper">
            <table className="premium-table">
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
                    <td data-label={t('user')}>
                      <div className="flex items-center gap-4">
                        <div className={`btn-action-premium ${
                          member.role === 'admin' 
                            ? 'active' 
                            : member.role === 'leader'
                            ? ''
                            : ''
                        }`} style={{ width: '3rem', height: '3rem', borderRadius: '12px', background: member.role === 'admin' ? 'var(--primary)' : 'var(--slate-50)', color: member.role === 'admin' ? 'white' : 'var(--slate-400)' }}>
                          {member.role === 'admin' ? <Shield size={20} /> : <User size={20} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{member.name || t('unnamed_participant')}</div>
                            {member.role === 'leader' && (
                              <div className="badge-premium badge-success" style={{ fontSize: '0.625rem', padding: '0.25rem 0.5rem' }}>
                                {t('leader').toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)' }}>{member.email}</div>
                          {member.portfolio && (
                             <a 
                               href={member.portfolio} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="badge-premium badge-info" 
                               style={{ display: 'inline-flex', fontSize: '0.8rem', padding: '2px 8px', marginTop: '4px', textDecoration: 'none', lineHeight: '1.2' }}
                             >
                               {t('view_portfolio') || 'View Portfolio'}
                             </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-label={t('role')}>
                      <select 
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="input-premium"
                        style={{ 
                          padding: '0.5rem 1rem', 
                          fontSize: '0.8125rem', 
                          fontWeight: 700,
                          width: '140px',
                          border: 'none',
                          background: member.role === 'admin' ? '#FEF2F2' : member.role === 'leader' ? '#EFF6FF' : '#F8FAFC',
                          color: member.role === 'admin' ? '#DC2626' : member.role === 'leader' ? '#2563EB' : '#64748B'
                        }}
                      >
                        <option value="member">{t('member')}</option>
                        <option value="leader">{t('leader')}</option>
                        {member.role === 'admin' && <option value="admin">{t('admin')}</option>}
                      </select>
                    </td>
                    <td data-label={t('actions')} style={{textAlign: 'right'}}>
                      <div className="action-group" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleDeleteUser(member.id)}
                          className="btn-action-premium danger"
                          title={t('delete_member')}
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
