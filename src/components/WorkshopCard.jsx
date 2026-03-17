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
            {workshop.technology || t('general_tech')}
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
        {workshop.responsible_admin_name && (
          <p className="workshop-admin" style={{fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.25rem'}}>
            {t('by_label')}: {workshop.responsible_admin_name}
          </p>
        )}
      </div>

      <p className="card-description">
        {workshop.description || t('join_to_learn')}
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
          <span>{workshop.location || t('location')}</span>
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
