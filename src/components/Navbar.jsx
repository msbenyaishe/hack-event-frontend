import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Globe, Menu, X, Home, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import laptopLogo from '../assets/laptop.svg';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar glass sticky-top ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/" className="brand-link" onClick={() => setIsMenuOpen(false)}>
              <div className="brand-logo">
                <img src={laptopLogo} alt="HackEvent" className="brand-logo-img" />
              </div>
              <span className="brand-name">HackEvent</span>
            </Link>
          </div>

          <div className="navbar-actions-desktop">
            <Link to="/scoreboard" className="nav-link-desktop">Home</Link>
            {user && (user.role === 'admin' || user.role === 'leader') && (
              <Link to={user.role === 'admin' ? "/admin" : "/leader/team"} className="nav-link-desktop">
                Dashboard
              </Link>
            )}

            {user ? (
              <div className="user-profile">
                <div className="user-info">
                  <div className="user-name">{user.email?.split('@')[0] || 'User'}</div>
                  <div className="user-role">{user.role}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="logout-btn"
                  title={t('logout')}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="auth-actions">
                <Link to="/login" className="login-link">{t('member_login')}</Link>
                <Link to="/admin/login" className="btn-admin">{t('admin_access')}</Link>
              </div>
            )}

            <div className="lang-switcher">
              <button className="lang-btn">
                <Globe size={18} className="icon-slate" />
                <span className="lang-code">{i18n.language}</span>
              </button>
              <div className="lang-dropdown">
                {['en', 'fr', 'ar'].map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => toggleLanguage(lang)} 
                    className={`lang-option ${i18n.language === lang ? 'active' : ''}`}
                  >
                    <span>{lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}</span>
                    {i18n.language === lang && <div className="active-dot" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <Link to="/scoreboard" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            <Home size={20} />
            <span>Home</span>
          </Link>

          {user && (user.role === 'admin' || user.role === 'leader') && (
            <Link 
              to={user.role === 'admin' ? "/admin" : "/leader/team"} 
              className="mobile-nav-item" 
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          )}
          
          {!user ? (
            <>
              <Link to="/login" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
                <span>{t('member_login')}</span>
              </Link>
              <Link to="/admin/login" className="mobile-btn-admin" onClick={() => setIsMenuOpen(false)}>
                <span>{t('admin_access')}</span>
              </Link>
            </>
          ) : (
            <>
              <div className="mobile-user-info">
                <span className="user-name">{user.email}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <button onClick={handleLogout} className="mobile-nav-item logout">
                <LogOut size={20} />
                <span>{t('logout')}</span>
              </button>
            </>
          )}

          <div className="mobile-lang-switcher">
            <p className="mobile-menu-label">{t('select_language') || 'Language'}</p>
            <div className="mobile-lang-options">
              {['en', 'fr', 'ar'].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => { toggleLanguage(lang); setIsMenuOpen(false); }}
                  className={`mobile-lang-btn ${i18n.language === lang ? 'active' : ''}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
