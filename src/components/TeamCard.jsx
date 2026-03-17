import { Trophy, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TeamCard = ({ team, rank }) => {
  const { t } = useTranslation();

  return (
    <div className="card-premium team-card animate-in flex items-center p-6 mb-4">
      {/* Left Metric Group: Rank + Points */}
      <div className="flex flex-col items-center gap-3 mr-8 min-w-[70px] shrink-0">
        <div 
          className="team-ranking-badge" 
          style={{ 
            background: rank <= 3 ? (rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32') : 'var(--slate-100)',
            color: rank <= 3 ? 'white' : 'var(--slate-400)'
          }}
        >
          {rank}
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-primary leading-none">
            {team.total_score || team.score || 0}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
            {t('points')}
          </div>
        </div>
      </div>
      
      {/* Logo Section */}
      <div className="logo-frame-container mr-6">
        {team.logo ? (
          <img 
            src={team.logo.startsWith('http') || team.logo.startsWith('/') ? team.logo : `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/uploads/events/${team.logo}`} 
            alt={team.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="logo-frame-dashed">
            <span className="font-black text-lg">{team.name?.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Team Info Section */}
      <div className="flex-1">
         <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{team.name}</h3>
         <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <Users size={14} />
            <span>{team.membersCount || 0} {t('members_label')}</span>
         </div>
      </div>
    </div>
  );
};

export default TeamCard;
