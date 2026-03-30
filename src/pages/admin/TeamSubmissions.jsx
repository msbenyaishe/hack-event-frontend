import React, { useEffect, useState, useMemo } from 'react';
import { submissionsApi } from '../../api/submissionsApi';
import { useTranslation } from 'react-i18next';
import { Filter, Search, Github, Globe, FileText, ExternalLink, BookOpen, LayoutDashboard, Calendar } from 'lucide-react';

const TeamSubmissions = () => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await submissionsApi.getAll();
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = useMemo(() => {
    if (!searchTerm) return submissions;
    const lower = searchTerm.toLowerCase();
    return submissions.filter(s => 
      s.team_name?.toLowerCase().includes(lower) || 
      s.workshop_title?.toLowerCase().includes(lower)
    );
  }, [submissions, searchTerm]);

  return (
    <div className="admin-page-container animate-in">
      <div className="admin-toolbar" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title">{t('team_submissions')}</h1>
          <p className="page-subtitle">{t('review_workshop_work')}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input 
              type="text" 
              placeholder={t('search_teams_workshops')}
              className="input-premium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3.5rem', height: '3.5rem', borderRadius: '16px', border: '1px solid var(--slate-200)', background: 'white', fontSize: '1rem' }}
            />
          </div>
          <button className="btn-secondary" style={{ width: '3.5rem', height: '3.5rem', padding: 0, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="card-premium" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-premium)', borderRadius: '32px' }}>
        {loading ? (
          <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>
            <div className="premium-spinner" style={{ width: '3.5rem', height: '3.5rem', margin: '0 auto 2rem' }} />
            <p style={{ color: 'var(--slate-400)', fontWeight: 700, fontSize: '1.1rem' }}>{t('loading')}...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="empty-state" style={{ padding: '10rem 2rem' }}>
            <div style={{ width: '6rem', height: '6rem', background: 'var(--slate-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--slate-200)' }}>
              <BookOpen size={48} />
            </div>
            <p className="empty-text" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-400)' }}>{t('no_submissions_found')}</p>
          </div>
        ) : (
          <div className="premium-table-wrapper" style={{ border: 'none' }}>
            <table className="premium-table">
              <thead>
                <tr style={{ background: 'var(--slate-50)' }}>
                  <th style={{ padding: '2rem' }}>{t('team')}</th>
                  <th style={{ padding: '2rem' }}>{t('workshop')}</th>
                  <th style={{ padding: '2rem' }}>{t('submitted_links')}</th>
                  <th style={{ padding: '2rem' }}>{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub, idx) => (
                  <tr key={sub.id} style={{ transition: 'all 0.2s', borderBottom: '1px solid var(--slate-50)' }}>
                    <td data-label={t('team')} style={{ padding: '1.75rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem' }}>
                          {sub.team_name?.charAt(0)}
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--slate-900)', fontSize: '1.1rem' }}>{sub.team_name}</div>
                      </div>
                    </td>
                    <td data-label={t('workshop')} style={{ padding: '1.75rem 2rem' }}>
                      <div className="badge-premium badge-info" style={{ borderRadius: '12px', fontSize: '0.85rem', padding: '0.5rem 1rem', fontWeight: 700 }}>
                        {sub.workshop_title}
                      </div>
                    </td>
                    <td data-label={t('submitted_links')} style={{ padding: '1.75rem 2rem' }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        {sub.repo_link ? (
                          <a href={sub.repo_link} target="_blank" rel="noopener noreferrer" className="btn-action-premium" title={t('repo_link_label')} style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', border: '1px solid var(--slate-100)', boxShadow: 'var(--shadow-sm)', color: '#24292e' }}>
                            <Github size={20} />
                          </a>
                        ) : (
                          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-200)' }}><Github size={20} /></div>
                        )}
                        
                        {sub.web_app_link ? (
                          <a href={sub.web_app_link} target="_blank" rel="noopener noreferrer" className="btn-action-premium" title={t('web_app_link_label')} style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', border: '1px solid var(--slate-100)', boxShadow: 'var(--shadow-sm)', color: '#0ea5e9' }}>
                            <Globe size={20} />
                          </a>
                        ) : (
                          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-200)' }}><Globe size={20} /></div>
                        )}
                        
                        {sub.pdf_link ? (
                          <a href={sub.pdf_link} target="_blank" rel="noopener noreferrer" className="btn-action-premium" title={t('pdf_link_label')} style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', border: '1px solid var(--slate-100)', boxShadow: 'var(--shadow-sm)', color: '#f43f5e' }}>
                            <FileText size={20} />
                          </a>
                        ) : (
                          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-200)' }}><FileText size={20} /></div>
                        )}
                      </div>
                    </td>
                    <td data-label={t('date')} style={{ padding: '1.75rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                        <Calendar size={16} style={{ opacity: 0.5 }} />
                        {new Date(sub.created_at).toLocaleDateString()}
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

export default TeamSubmissions;
