import React, { useEffect, useState, useMemo } from 'react';
import { submissionsApi } from '../../api/submissionsApi';
import { useTranslation } from 'react-i18next';
import { Filter, Search, Github, Globe, FileText, ExternalLink, BookOpen } from 'lucide-react';

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
    <div className="admin-page-container">
      <div className="admin-toolbar">
        <div>
          <h1 className="page-title">{t('team_submissions') || 'Team Submissions'}</h1>
          <p className="page-subtitle">{t('review_workshop_work') || 'Review repository, web app, and presentation links submitted by teams.'}</p>
        </div>
      </div>

      <div className="admin-card animate-in">
        <div className="members-toolbar mb-6" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--slate-200)', borderRadius: '12px', padding: '0.5rem 1rem' }}>
            <Search size={20} className="color-slate-400" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder={t('search_teams_workshops') || 'Search teams or workshops...'}
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} />
            {t('filter') || 'Filter'}
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center color-slate-400">{t('loading') || 'Loading...'}</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen size={40} />
            </div>
            <p className="empty-text">{t('no_submissions_found') || 'No submissions found.'}</p>
          </div>
        ) : (
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>{t('team')}</th>
                  <th>{t('workshop')}</th>
                  <th>{t('submitted_links') || 'Submitted Links'}</th>
                  <th>{t('date') || 'Date'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map(sub => (
                  <tr key={sub.id}>
                    <td data-label={t('team')}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{sub.team_name}</div>
                    </td>
                    <td data-label={t('workshop')}>
                      <div className="badge-premium badge-info">{sub.workshop_title}</div>
                    </td>
                    <td data-label={t('submitted_links') || 'Submitted Links'}>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {sub.repo_link ? (
                          <a href={sub.repo_link} target="_blank" rel="noopener noreferrer" className="btn-action-premium" title="Repository">
                            <Github size={16} /> <ExternalLink size={12} style={{marginLeft: '2px', opacity: 0.5}}/>
                          </a>
                        ) : (
                          <span style={{ color: 'var(--slate-300)', padding: '0.5rem' }}><Github size={16} /></span>
                        )}
                        
                        {sub.web_app_link ? (
                          <a href={sub.web_app_link} target="_blank" rel="noopener noreferrer" className="btn-action-premium" title="Web App">
                            <Globe size={16} /> <ExternalLink size={12} style={{marginLeft: '2px', opacity: 0.5}}/>
                          </a>
                        ) : (
                          <span style={{ color: 'var(--slate-300)', padding: '0.5rem' }}><Globe size={16} /></span>
                        )}
                        
                        {sub.pdf_link ? (
                          <a href={sub.pdf_link} target="_blank" rel="noopener noreferrer" className="btn-action-premium" title="PDF Presentation">
                            <FileText size={16} /> <ExternalLink size={12} style={{marginLeft: '2px', opacity: 0.5}}/>
                          </a>
                        ) : (
                          <span style={{ color: 'var(--slate-300)', padding: '0.5rem' }}><FileText size={16} /></span>
                        )}
                      </div>
                    </td>
                    <td data-label={t('date') || 'Date'}>
                      {new Date(sub.created_at).toLocaleDateString()}
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
