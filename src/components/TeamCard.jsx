import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

const TeamCard = ({ team, rank, onViewMembers }) => {
  const { t } = useTranslation();

  return (
    <div className="ranking-list-item animate-in">
      {/* Rank Indicator */}
      <div className={`ranking-badge-minimal ${rank <= 3 ? 'top-rank' : ''}`}>
        {rank.toString().padStart(2, '0')}
      </div>
      
      {/* Logo Section */}
      <div 
        className="logo-frame-container"
        style={{ backgroundColor: !team.logo ? (team.color || 'var(--primary-600)') : 'var(--slate-100)' }}
      >
        {team.logo ? (
          <img 
            src={team.logo.startsWith('http') || team.logo.startsWith('/') ? team.logo : `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/uploads/events/${team.logo}`} 
            alt={team.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="font-black text-xl text-white drop-shadow-sm">
              {team.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Team Info Section */}
      <div className="flex-1">
         <h3 className="text-xl font-black text-slate-900 leading-tight">{team.name}</h3>
         <button 
           onClick={() => onViewMembers && onViewMembers(team)}
           className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-[10px] uppercase tracking-widest mt-1 transition-colors cursor-pointer"
           title="View Members"
         >
            <Users size={12} />
            <span>{team.membersCount || 0} Members</span>
         </button>
      </div>

      {/* Points Section */}
      <div className="text-right">
        <div className="text-2xl font-black text-primary leading-none">
          {team.total_score || team.score || 0}
        </div>
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
          {t('points')}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
