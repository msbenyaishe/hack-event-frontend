import React from 'react';
import { Clock, MapPin, Tag, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WorkshopCard = ({ workshop, isAdmin = false, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="card-premium workshop-card animate-in">
      <div className="workshop-content">
        <div className="workshop-tags">
          <span className="tag tag-indigo">
            {workshop.technology || 'General'}
          </span>
          {workshop.duration && (
            <span className="tag tag-slate">
              {workshop.duration}
            </span>
          )}
        </div>
        <h3 className="workshop-title">
          {workshop.title}
        </h3>
      </div>

      <p className="card-description">
        {workshop.description || 'Join this session to learn and grow with other participants.'}
      </p>

      <div className="card-meta">
        <div className="meta-item">
          <div className="icon-wrapper bg-indigo-soft">
            <Clock size={14} />
          </div>
          <span>{new Date(workshop.startTime).toLocaleString()}</span>
        </div>
        <div className="meta-item">
          <div className="icon-wrapper bg-slate-soft">
            <MapPin size={14} />
          </div>
          <span>{workshop.location || 'Main Stage / Online'}</span>
        </div>
      </div>

      {isAdmin && (
        <div className="workshop-actions">
          <button 
            onClick={() => onEdit(workshop)}
            className="action-btn"
            title={t('edit')}
          >
            <Edit size={14} />
          </button>
          <button 
            onClick={() => onDelete(workshop.id)}
            className="action-btn action-btn-danger"
            title={t('delete')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkshopCard;
