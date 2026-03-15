import React from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';

const EventCard = ({ event }) => {
  return (
    <div className="card-premium event-card animate-in">
      <div className="card-header">
        <h3 className="card-title">{event.name}</h3>
        <span className={`badge ${
          event.status === 'active' || event.status === 'current' 
          ? 'badge-success' 
          : 'badge-neutral'
        }`}>
          {event.status || 'Upcoming'}
        </span>
      </div>
      <p className="card-description">
        {event.description || 'No description provided.'}
      </p>
      
      <div className="card-meta">
        <div className="meta-item">
          <div className="icon-wrapper bg-indigo-soft">
            <Calendar size={16} />
          </div>
          <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
        </div>
        <div className="meta-item">
          <div className="icon-wrapper bg-slate-soft">
            <MapPin size={16} />
          </div>
          <span>{event.location || 'Online / TBD'}</span>
        </div>
        <div className="meta-item">
          <div className="icon-wrapper bg-amber-soft">
            <Users size={16} />
          </div>
          <span>{event.maxTeams ? `Up to ${event.maxTeams} Teams` : 'Standard Enrollment'}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
