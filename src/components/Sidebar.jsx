import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  Users, 
  UserCog, 
  MonitorPlay, 
  Timer,
  UserPlus,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: t('events') },
    { to: '/admin/events/create', icon: <CalendarPlus size={20} />, label: t('create_event') },
    { to: '/admin/teams', icon: <Users size={20} />, label: t('teams') },
    { to: '/admin/members', icon: <UserCog size={20} />, label: t('members') },
    { to: '/admin/workshops', icon: <MonitorPlay size={20} />, label: t('workshops') },
    { to: '/admin/timer', icon: <Timer size={20} />, label: t('timer_control') },
  ];

  const leaderLinks = [
    { to: '/leader/team', icon: <Users size={20} />, label: t('my_team') },
    { to: '/leader/select-members', icon: <UserPlus size={20} />, label: t('find_members') || 'Find Members' },
  ];

  const links = role === 'admin' ? adminLinks : leaderLinks;

  return (
    <>
      <button 
        className={`sidebar-mobile-toggle ${isOpen ? 'sidebar-mobile-toggle-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          {role === 'admin' ? t('admin') : t('leader')}
        </h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'} 
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''}`
            }
            onClick={() => setIsOpen(false)}
          >
            <span className="nav-item-icon">
              {link.icon}
            </span>
            <span className="nav-item-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
