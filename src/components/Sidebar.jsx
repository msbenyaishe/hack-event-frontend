import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  Users, 
  UserCog, 
  MonitorPlay, 
  Timer,
  UserPlus
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const { t } = useTranslation();

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
    { to: '/leader/invite', icon: <UserPlus size={20} />, label: t('invite_members') },
  ];

  const links = role === 'admin' ? adminLinks : leaderLinks;

  return (
    <aside className="sidebar">
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
          >
            <span className="nav-item-icon">
              {link.icon}
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
