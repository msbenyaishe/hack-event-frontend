import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Github, Mail, Laptop } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-simple">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6, fontSize: '0.875rem' }}>
        <p>© {currentYear} HackEvent. All rights reserved.</p>
        <p className="footer-simple-dash">Built for Innovation • v1.0.4</p>
      </div>
    </footer>
  );
};

export default Footer;
