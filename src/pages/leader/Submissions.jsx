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
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'form'
  
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

  const handleSelectWorkshop = (ws) => {
    setSelectedWorkshop(ws);
    setViewMode('form');
    
    // Auto-fill existing submission if any
    const existing = submissions.find(s => s.workshop_id.toString() === ws.id.toString());
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
        workshop_id: selectedWorkshop.id,
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
    return submissions.some(s => s.workshop_id.toString() === wsId.toString());
  };

  if (loading) return (
    <div className="leader-page-wrapper">
      <div className="premium-spinner" />
      <p style={{ color: 'var(--slate-400)', fontWeight: 'bold' }}>{t('loading')}...</p>
    </div>
  );

  const submissionCount = submissions.filter(s => workshops.some(w => w.id === s.workshop_id)).length;
  const progressPercent = workshops.length > 0 ? (submissionCount / workshops.length) * 100 : 0;

  return (
    <div className="leader-page-wrapper animate-in" style={{ paddingBottom: '5rem' }}>
      {/* Header Section */}
      <div className="admin-toolbar" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <h1 className="page-title">{t('workshop_submissions')}</h1>
          <p className="page-subtitle">{t('submit_workshop_files_desc')}</p>
        </div>
        
        {/* Progress Card */}
        <div className="card-premium" style={{ padding: '1.25rem 2rem', minWidth: '300px', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'white' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-600)' }}>
              <span>{t('overall_progress')}</span>
              <span>{submissionCount}/{workshops.length}</span>
            </div>
            <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${progressPercent}%`, 
                background: 'linear-gradient(90deg, var(--primary-500), var(--primary-400))',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-600)' }}>
            {Math.round(progressPercent)}%
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="workshop-dashboard-grid animate-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {workshops.map((ws, idx) => {
            const hasSubmission = getSubmissionStatus(ws.id);
            const sub = submissions.find(s => s.workshop_id === ws.id);
            
            return (
              <div 
                key={ws.id} 
                className="card-premium animate-in"
                style={{ 
                  padding: '1.75rem', 
                  borderRadius: '20px', 
                  background: 'white',
                  cursor: 'pointer',
                  border: hasSubmission ? '1.5px solid var(--success-100)' : '1.5px solid transparent',
                  transition: 'all 0.3s ease',
                  animationDelay: `${idx * 0.05}s`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
                onClick={() => handleSelectWorkshop(ws)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-premium)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '42px', 
                    height: '42px', 
                    background: 'var(--slate-50)', 
                    borderRadius: '12px', 
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={22} />
                  </div>
                  {hasSubmission ? (
                    <div style={{ padding: '0.4rem 0.8rem', background: 'var(--success-50)', color: 'var(--success-700)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle size={14} /> {t('submitted')}
                    </div>
                  ) : (
                    <div style={{ padding: '0.4rem 0.8rem', background: 'var(--slate-50)', color: 'var(--slate-500)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {t('pending')}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>{ws.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--slate-400)', fontWeight: 600 }}>{ws.description?.substring(0, 80)}...</p>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--slate-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                    {hasSubmission ? t('update_submission') : t('add_submission')}
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
                    <Send size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="focused-submission-view animate-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
            onClick={() => setViewMode('grid')}
            style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', background: 'none', color: 'var(--slate-400)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--slate-400)'}
          >
            <Sparkles size={20} /> {t('back_to_dashboard')}
          </button>

          <div className="card-premium" style={{ padding: '2.5rem', borderRadius: '24px', background: 'white' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ 
                width: '52px', 
                height: '52px', 
                background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))', 
                borderRadius: '14px', 
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <BookOpen size={26} strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: 'var(--slate-900)' }}>{selectedWorkshop.title}</h2>
                <p style={{ margin: 0, color: 'var(--slate-400)', fontWeight: 600 }}>{t('submit_your_work_for_this_session')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="form-group">
                  <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Github size={18} className="text-primary" /> {t('repo_link_label')}
                  </label>
                  <input 
                    type="url" 
                    className="input-premium" 
                    placeholder="https://github.com/..."
                    value={formData.repo_link}
                    onChange={e => setFormData({...formData, repo_link: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Globe size={18} className="text-primary" /> {t('web_app_link_label')}
                  </label>
                  <input 
                    type="url" 
                    className="input-premium" 
                    placeholder="https://..."
                    value={formData.web_app_link}
                    onChange={e => setFormData({...formData, web_app_link: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={18} className="text-primary" /> {t('pdf_link_label')}
                </label>
                <input 
                  type="url" 
                  className="input-premium" 
                  placeholder="https://..."
                  value={formData.pdf_link}
                  onChange={e => setFormData({...formData, pdf_link: e.target.value})}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.5rem' }}>{t('link_only_hint')}</p>
              </div>

              {submitMessage && (
                <div className="success-alert animate-in" style={{ position: 'relative', top: 0, transform: 'none', width: '100%', left: 0 }}>
                  <CheckCircle size={18} /> {submitMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setViewMode('grid')}
                  className="btn-secondary"
                  style={{ flex: 1, height: '3.5rem', borderRadius: '14px' }}
                >
                  {t('cancel')}
                </button>
                <button 
                  type="submit" 
                  className="btn-admin" 
                  style={{ flex: 2, height: '3.5rem', borderRadius: '14px' }}
                  disabled={submitting}
                >
                  {submitting ? t('submitting') : t('save_submission')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;
