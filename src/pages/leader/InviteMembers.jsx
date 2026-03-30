import React, { useState } from 'react';
import { invitesApi } from '../../api/invitesApi';
import { Send, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const InviteMembers = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      // Backend expects { email } to generate an invite token/send email
      await invitesApi.createTeamInvite({ email });
      setMessage(t('invitation_sent_successfully', { email }));
      setEmail('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t('failed_to_send_invite'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invite-page-wrapper animate-in">
      <div className="admin-toolbar" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title">{t('invite_to_team')}</h1>
          <p className="page-subtitle">{t('send_invitations')}</p>
        </div>
      </div>

      <div className="invite-form-card">
        {message && (
          <div className="success-alert">
            <div className="success-alert-dot" />
            {message}
          </div>
        )}
        
        {error && (
          <div className="error-alert">
            <div className="error-alert-dot" />
            {error}
          </div>
        )}

        <form onSubmit={handleInvite}>
          <div className="invite-input-group">
            <label className="invite-input-label">{t('email_address')}</label>
            <div className="invite-input-wrapper">
              <div className="invite-input-icon">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                required
                placeholder="colleague@example.com"
                className="invite-input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="invite-submit-btn"
          >
            {loading ? t('sending') : t('send_invitation')}
          </button>
        </form>

        <div className="invite-footer">
          <p className="invite-footer-text">{t('invite_limit_hint')}</p>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
