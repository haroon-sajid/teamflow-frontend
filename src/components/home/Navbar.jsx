/* ==================== NAVBAR.JSX ==================== */


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">TeamFlow</span>
        </div>

        <ul className="navbar-menu">
          <li><a href="#features">Features</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#resources">Resources</a></li>
        </ul>

        <div className="navbar-actions">
          <button className="navbar-btn-secondary">Sign in</button>
          <button className="navbar-btn-primary">Get started</button>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div 
          className="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
          <a href="#solutions" onClick={() => setIsMobileMenuOpen(false)}>Solutions</a>
          <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
          <a href="#resources" onClick={() => setIsMobileMenuOpen(false)}>Resources</a>
          <div className="mobile-menu-actions">
            <button className="navbar-btn-secondary">Sign in</button>
            <button className="navbar-btn-primary">Get started</button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

