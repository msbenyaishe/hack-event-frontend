import React from 'react';
import { Trophy, Users } from 'lucide-react';

const TeamCard = ({ team, rank }) => {
  return (
    <div className="card-premium team-card animate-in">
      <div className="team-rank">
        #{rank.toString().padStart(2, '0')}
      </div>
      
      <div className="team-info">
        <h3 className="team-name">{team.name}</h3>
        <div className="team-stats">
          <Users size={16} />
          <span>{team.membersCount || 0} Members</span>
        </div>
      </div>

      <div className="team-score-wrapper">
        <div className="team-score">
          {team.total_score || team.score || 0}
        </div>
        <p className="team-score-label">
          Points
        </p>
      </div>
    </div>
  );
};

export default TeamCard;
