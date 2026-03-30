import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { workshopsApi } from '../../api/workshopsApi';
import { submissionsApi } from '../../api/submissionsApi';
import { useTranslation } from 'react-i18next';
import { BookOpen, CheckCircle, Github, Globe, FileText, Send, Sparkles, ClipboardCheck } from 'lucide-react';

const Submissions = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [workshops, setWorkshops] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  
  const [formData, setFormData] = useState({
    repo_link: '',
    web_app_link: '',
    pdf_link: ''
  });
  
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const authRes = await api.get('/auth/me');
      const eventId = authRes.data.user?.event_id;
      
      if (eventId) {
        const [wsRes, subRes] = await Promise.all([
          workshopsApi.getByEvent(eventId),
          submissionsApi.getMine()
        ]);
        setWorkshops(wsRes.data);
        setSubmissions(subRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkshopChange = (e) => {
    const wsId = e.target.value;
    setSelectedWorkshop(wsId);
    
    // Auto-fill existing submission if any
    const existing = submissions.find(s => s.workshop_id.toString() === wsId);
    if (existing) {
      setFormData({
        repo_link: existing.repo_link || '',
        web_app_link: existing.web_app_link || '',
        pdf_link: existing.pdf_link || ''
      });
    } else {
      setFormData({ repo_link: '', web_app_link: '', pdf_link: '' });
    }
    setSubmitMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWorkshop) return;
    
    try {
      setSubmitting(true);
      await submissionsApi.submit({
        workshop_id: selectedWorkshop,
        ...formData
      });
      
      setSubmitMessage(t('submission_successful'));
      
      // Refresh submissions
      const subRes = await submissionsApi.getMine();
      setSubmissions(subRes.data);
      
      setTimeout(() => setSubmitMessage(''), 3000);
    } catch (err) {
      console.error("Failed to submit", err);
      alert(err.response?.data?.error || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionStatus = (wsId) => {
    const existing = submissions.find(s => s.workshop_id.toString() === wsId.toString());
    return existing ? true : false;
  };

  if (loading) return (
    <div className="leader-page-wrapper">
      <div className="premium-spinner" />
      <p style={{ color: 'var(--slate-400)', fontWeight: 'bold' }}>{t('loading')}...</p>
    </div>
  );

  return (
    <div className="leader-page-wrapper animate-in" style={{ paddingBottom: '5rem' }}>
      {/* Normalized Header Section */}
      <div className="admin-toolbar" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title">{t('workshop_submissions')}</h1>
          <p className="page-subtitle">{t('submit_workshop_files_desc')}</p>
        </div>
      </div>

      <div className="member-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Main: Submission Form */}
        <div className="member-grid-main">
          <div className="card-premium" style={{ padding: '3.5rem', borderRadius: '32px', boxShadow: 'var(--shadow-premium)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
              <div style={{ padding: '1rem', background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))', borderRadius: '20px', color: 'var(--primary-600)', boxShadow: 'var(--shadow-sm)' }}>
                <Send size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, color: 'var(--slate-900)' }}>{t('new_submission')}</h2>
                <p style={{ margin: 0, color: 'var(--slate-400)', fontWeight: 600 }}>{t('select_workshop_to_begin') || 'Select a workshop to start submitting your work'}</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div className="form-group">
                <label className="label-premium" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('select_workshop')}</label>
                <select 
                  className="input-premium shadow-sm" 
                  value={selectedWorkshop} 
                  onChange={handleWorkshopChange}
                  required
                  style={{ height: '4rem', fontSize: '1.1rem', padding: '0 1.5rem', borderRadius: '16px' }}
                >
                  <option value="">{t('choose_a_workshop')}</option>
                  {workshops.map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.title} {getSubmissionStatus(ws.id) ? `✓ (${t('finished')})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedWorkshop ? (
                <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div className="form-group">
                      <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                        <div style={{ color: 'var(--primary-500)' }}><Github size={20} /></div> {t('repo_link_label')}
                      </label>
                      <input 
                        type="url" 
                        className="input-premium" 
                        placeholder="https://github.com/..."
                        value={formData.repo_link}
                        onChange={e => setFormData({...formData, repo_link: e.target.value})}
                        style={{ height: '3.75rem', borderRadius: '14px' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                        <div style={{ color: 'var(--primary-500)' }}><Globe size={20} /></div> {t('web_app_link_label')}
                      </label>
                      <input 
                        type="url" 
                        className="input-premium" 
                        placeholder="https://..."
                        value={formData.web_app_link}
                        onChange={e => setFormData({...formData, web_app_link: e.target.value})}
                        style={{ height: '3.75rem', borderRadius: '14px' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <div style={{ color: 'var(--primary-500)' }}><FileText size={20} /></div> {t('pdf_link_label')}
                    </label>
                    <input 
                      type="url" 
                      className="input-premium" 
                      placeholder="https://..."
                      value={formData.pdf_link}
                      onChange={e => setFormData({...formData, pdf_link: e.target.value})}
                      style={{ height: '3.75rem', borderRadius: '14px' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'var(--slate-50)', borderRadius: '10px', color: 'var(--slate-500)', fontSize: '0.85rem', border: '1px solid var(--slate-100)' }}>
                      <CheckCircle size={14} className="text-success" />
                      {t('link_only_hint')}
                    </div>
                  </div>

                  {submitMessage && (
                    <div className="success-alert" style={{ position: 'relative', top: 0, left: 0, transform: 'none', width: '100%', padding: '1.25rem' }}>
                      <div className="success-alert-dot" />
                      {submitMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn-admin" 
                    style={{ height: '4.5rem', fontSize: '1.2rem', borderRadius: '18px', marginTop: '1rem', background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))' }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="premium-spinner" style={{ width: '1.5rem', height: '1.5rem', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', marginRight: '0.75rem' }} />
                        {t('submitting')}
                      </>
                    ) : (
                        <>
                          <ClipboardCheck size={22} style={{ marginRight: '0.75rem' }} />
                          {t('save_submission')}
                        </>
                    )}
                  </button>
                </div>
              ) : (
                <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'var(--slate-50)', borderRadius: '24px', border: '2px dashed var(--slate-200)' }}>
                  <BookOpen size={48} style={{ color: 'var(--slate-200)', marginBottom: '1.5rem' }} />
                  <p style={{ color: 'var(--slate-400)', fontWeight: 700, fontSize: '1.1rem' }}>{t('choose_a_workshop_hint') || 'Ready to show off? Pick a workshop from the list above!'}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar: Submission History */}
        <div className="member-grid-sidebar">
          <div style={{ position: 'sticky', top: '7rem' }}>
            <div className="section-header mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('your_submissions')}</h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-3">{submissions.length} {t('items_submitted') || 'Items Submitted'}</p>
            </div>
            
            {submissions.length === 0 ? (
              <div className="empty-state" style={{ padding: '6rem 2rem', background: '#fff', borderRadius: '32px', border: '1px solid var(--slate-100)', boxShadow: 'var(--shadow-sm)' }}>
                <CheckCircle size={48} style={{ color: 'var(--slate-200)', marginBottom: '1.5rem' }} />
                <p style={{ color: 'var(--slate-400)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}>
                  {t('no_submissions_yet')}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {submissions.map((sub, idx) => (
                  <div key={sub.id} className="animate-in" style={{ 
                    padding: '2rem', 
                    borderRadius: '24px', 
                    border: '1px solid var(--slate-100)',
                    background: 'white',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 'var(--shadow-sm)',
                    animationDelay: `${idx * 0.1}s`
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--primary-100)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--slate-100)'; }}
                  >
                    <div className="badge-premium badge-info mb-4" style={{ borderRadius: '8px', fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
                      {sub.workshop_title}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {sub.repo_link && (
                        <a href={sub.repo_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--slate-600)', fontSize: '0.9rem', fontWeight: 600 }}>
                          <div style={{ color: 'var(--primary-500)' }}><Github size={16} /></div> 
                          <span style={{ borderBottom: '1px solid var(--slate-200)' }}>{t('repo_link_label')}</span>
                        </a>
                      )}
                      
                      {sub.web_app_link && (
                        <a href={sub.web_app_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--slate-600)', fontSize: '0.9rem', fontWeight: 600 }}>
                          <div style={{ color: 'var(--primary-500)' }}><Globe size={16} /></div> 
                          <span style={{ borderBottom: '1px solid var(--slate-200)' }}>{t('web_app_link_label')}</span>
                        </a>
                      )}
                      
                      {sub.pdf_link && (
                        <a href={sub.pdf_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--slate-600)', fontSize: '0.9rem', fontWeight: 600 }}>
                          <div style={{ color: 'var(--primary-500)' }}><FileText size={16} /></div> 
                          <span style={{ borderBottom: '1px solid var(--slate-200)' }}>{t('pdf_link_label')}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Submissions;
