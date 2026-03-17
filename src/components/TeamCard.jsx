import { Trophy, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TeamCard = ({ team, rank }) => {
  const { t } = useTranslation();

  return (
    <div className="card-premium team-card animate-in">
      <div 
        className="team-rank" 
        style={{ 
          backgroundColor: team.color || 'var(--primary-600)',
          color: 'white',
          boxShadow: `0 8px 16px -4px ${team.color}40`
        }}
      >
        #{rank.toString().padStart(2, '0')}
      </div>
      
      <div className="flex items-center gap-4 flex-1">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-premium border-4 border-white shrink-0"
          style={{ backgroundColor: team.color || 'var(--primary-600)' }}
        >
          {team.logo ? (
            <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            team.name?.charAt(0)
          )}
        </div>
        <div className="team-info">
          <h3 className="team-name" style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--slate-900)' }}>{team.name}</h3>
          <div className="team-stats">
            <Users size={16} />
            <span>{team.membersCount || 0} {t('members_label')}</span>
          </div>
        </div>
      </div>

      <div className="team-score-wrapper">
        <div className="team-score">
          {team.total_score || team.score || 0}
        </div>
        <p className="team-score-label">
          {t('points')}
        </p>
      </div>
    </div>
  );
};

export default TeamCard;
