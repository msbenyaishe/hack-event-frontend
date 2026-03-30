import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { workshopsApi } from '../../api/workshopsApi';
import { submissionsApi } from '../../api/submissionsApi';
import { useTranslation } from 'react-i18next';
import { BookOpen, CheckCircle, Github, Globe, FileText, Send } from 'lucide-react';

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
      
      setSubmitMessage(t('submission_successful') || 'Submission saved successfully!');
      
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
      <p style={{ color: 'var(--slate-400)', fontWeight: 'bold' }}>{t('loading_data') || 'Loading data...'}</p>
    </div>
  );

  return (
    <div className="leader-page-wrapper">
      <div className="admin-toolbar">
        <div>
          <h1 className="page-title">{t('workshop_submissions') || 'Workshop Submissions'}</h1>
          <p className="page-subtitle">{t('submit_workshop_files_desc') || 'Submit your code, apps, and documents for the completed workshops.'}</p>
        </div>
      </div>

      <div className="admin-card animate-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Submission Form */}
          <div className="card-premium">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={20} className="color-primary" /> 
              {t('new_submission') || 'New Submission'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label-premium">{t('select_workshop') || 'Select Workshop'}</label>
                <select 
                  className="input-premium" 
                  value={selectedWorkshop} 
                  onChange={handleWorkshopChange}
                  required
                >
                  <option value="">{t('choose_a_workshop') || '-- Choose a workshop --'}</option>
                  {workshops.map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.title} {getSubmissionStatus(ws.id) ? '✓ (Submitted)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedWorkshop && (
                <div className="animate-in">
                  <div className="form-group">
                    <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Github size={16} /> {t('repository_link') || 'Repository Link'}
                    </label>
                    <input 
                      type="url" 
                      className="input-premium" 
                      placeholder="https://github.com/your-username/repo"
                      value={formData.repo_link}
                      onChange={e => setFormData({...formData, repo_link: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={16} /> {t('web_app_link') || 'Web App Link'}
                    </label>
                    <input 
                      type="url" 
                      className="input-premium" 
                      placeholder="https://your-app.vercel.app"
                      value={formData.web_app_link}
                      onChange={e => setFormData({...formData, web_app_link: e.target.value})}
                    />
                  </div>

                  <div className="form-group mb-8">
                    <label className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} /> {t('pdf_presentation_link') || 'PDF Presentation Link'}
                    </label>
                    <input 
                      type="url" 
                      className="input-premium" 
                      placeholder="https://drive.google.com/... or similar"
                      value={formData.pdf_link}
                      onChange={e => setFormData({...formData, pdf_link: e.target.value})}
                    />
                    <small style={{ color: 'var(--slate-400)', marginTop: '0.25rem', display: 'block' }}>
                      {t('link_only_hint') || '* Provide a public link to your document.'}
                    </small>
                  </div>

                  {submitMessage && (
                    <div className="success-alert" style={{ position: 'relative', marginBottom: '1.5rem', top: 0, left: 0, transform: 'none' }}>
                      <div className="success-alert-dot" />
                      {submitMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn-admin" 
                    style={{ width: '100%' }}
                    disabled={submitting}
                  >
                    {submitting ? (t('submitting') || 'Submitting...') : (t('save_submission') || 'Save Submission')}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Submission History / Status */}
          <div className="card-premium">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} className="color-primary" /> 
              {t('your_submissions') || 'Your Submissions'}
            </h3>
            
            {submissions.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem 1rem' }}>
                <CheckCircle size={32} style={{ color: 'var(--slate-300)', marginBottom: '1rem' }} />
                <p className="empty-text" style={{ fontSize: '1rem' }}>
                  {t('no_submissions_yet') || 'No submissions yet.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {submissions.map(sub => (
                  <div key={sub.id} style={{ 
                    padding: '1.25rem', 
                    borderRadius: '16px', 
                    border: '1px solid var(--slate-200)',
                    background: 'var(--slate-50)'
                  }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
                      {sub.workshop_title}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                      {sub.repo_link ? (
                        <a href={sub.repo_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)' }}>
                          <Github size={14} /> Repository
                        </a>
                      ) : <span style={{ color: 'var(--slate-400)' }}><Github size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> No Repo</span>}
                      
                      {sub.web_app_link ? (
                        <a href={sub.web_app_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)' }}>
                          <Globe size={14} /> Web App
                        </a>
                      ) : <span style={{ color: 'var(--slate-400)' }}><Globe size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> No Web App</span>}
                      
                      {sub.pdf_link ? (
                        <a href={sub.pdf_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)' }}>
                          <FileText size={14} /> PDF Link
                        </a>
                      ) : <span style={{ color: 'var(--slate-400)' }}><FileText size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> No PDF</span>}
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
