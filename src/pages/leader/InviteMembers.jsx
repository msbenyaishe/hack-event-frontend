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
    <div className="container-inner" style={{maxWidth: '40rem'}}>
      <div className="page-header" style={{textAlign: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <div className="invite-icon" style={{width: '5rem', height: '5rem', borderRadius: '1.5rem', marginBottom: '2rem'}}>
          <Send size={32} />
        </div>
        <h1 className="page-title">{t('invite_to_team')}</h1>
        <p className="page-subtitle">{t('send_invitations')}</p>
      </div>

      <div className="invite-form-container animate-in">
        
        {message && (
          <div className="auth-error" style={{backgroundColor: '#ecfdf5', color: '#059669', borderColor: '#d1fae5', marginBottom: '2rem'}}>
            <div className="error-dot" style={{backgroundColor: '#059669'}} />
            {message}
          </div>
        )}
        
        {error && (
          <div className="auth-error" style={{marginBottom: '2rem'}}>
            <div className="error-dot" />
            {error}
          </div>
        )}

        <form onSubmit={handleInvite} className="invite-form" style={{flexDirection: 'column', gap: '2rem'}}>
          <div className="form-group">
            <label className="form-label" style={{marginBottom: '0.75rem'}}>{t('email_address')}</label>
            <div className="input-with-icon">
              <div className="input-icon">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                required
                placeholder="colleague@example.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-indigo btn-full"
            style={{padding: '1.25rem'}}
          >
            {loading ? t('sending') : t('send_invitation')}
          </button>
        </form>

        <div style={{marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--slate-50)', textAlign: 'center'}}>
          <p className="filter-label" style={{fontSize: '0.75rem'}}>{t('invite_limit_hint')}</p>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
