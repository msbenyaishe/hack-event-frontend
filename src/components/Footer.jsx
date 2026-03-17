import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Github, Mail, Laptop } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-simple">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6, fontSize: '0.875rem' }}>
        <p>© {currentYear} HackEvent. {t('rights_reserved')}</p>
        <p className="footer-simple-dash">{t('built_for_innovation')} • v1.0.4</p>
      </div>
    </footer>
  );
};

export default Footer;
