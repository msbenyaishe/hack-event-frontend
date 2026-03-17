import { Trophy, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TeamCard = ({ team, rank }) => {
  const { t } = useTranslation();

  return (
    <div className="card-premium team-card animate-in">
      <div className="team-rank">
        #{rank.toString().padStart(2, '0')}
      </div>
      
      <div className="team-info">
        <h3 className="team-name">{team.name}</h3>
        <div className="team-stats">
          <Users size={16} />
          <span>{team.membersCount || 0} {t('members_label')}</span>
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
