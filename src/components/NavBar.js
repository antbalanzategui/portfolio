import React, { useContext, useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'react-feather';
import { ThemeContext } from './ThemeContext';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const contentContainer = document.querySelector('.contentContainer');
    const elements = document.querySelectorAll('*');
  
    if (isMenuOpen) {
      contentContainer.classList.add('blurEffect');
      elements.forEach((element) => {
        element.classList.add('hideScrollbar');
      });
    } else {
      contentContainer.classList.remove('blurEffect');
      elements.forEach((element) => {
        element.classList.remove('hideScrollbar');
      });
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (sectionId) => {
    scrollToSection(sectionId);
    toggleMenu();
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navClassName = `${styles.nav} ${isMenuOpen ? styles.menuOpen : ''}`;

  return (
    <nav className={navClassName}>
      <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
        {isMenuOpen ? (
          <X className={`${styles.themeIcon} ${styles.xIcon}`} />
        ) : (
          <Menu className={`${styles.themeIcon} ${styles.menuIcon}`} />
        )}
      </div>
      <div className={styles.logo} onClick={() => scrollToSection('home')}>
        <h1>Antonio Balanzategui</h1>
        <h1>Antonio Balanzategui</h1>
      </div>
      <ul className={styles.menu}>
        <div className={styles.navigation}>
          <li onClick={() => scrollToSection('about')}>
            <a>About</a>
          </li>
          <li onClick={() => scrollToSection('skills')}>
            <a>Skills</a>
          </li>
          <li onClick={() => scrollToSection('projects')}>
            <a>Projects</a>
          </li>
          <li onClick={() => scrollToSection('contact')}>
            <a>Contact</a>
          </li>
        </div>
        <li>
          <div onClick={toggleTheme} className={styles.iconContainer}>
            {isDarkMode ? (
              <Sun className={styles.themeIcon} />
            ) : (
              <Moon className={styles.themeIcon} />
            )}
          </div>
        </li>
      </ul>
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileUL}>
          <li onClick={() => handleMenuClick('home')}>
              <a>Home</a>
            </li>
            <li onClick={() => handleMenuClick('about')}>
              <a>About</a>
            </li>
            <li onClick={() => handleMenuClick('skills')}>
              <a>Skills</a>
            </li>
            <li onClick={() => handleMenuClick('projects')}>
              <a>Projects</a>
            </li>
            <li onClick={() => handleMenuClick('contact')}>
              <a>Contact</a>
            </li>
            <li>
              <div onClick={toggleTheme} className={styles.iconContainer}>
                {isDarkMode ? (
                  <Sun className={styles.mobileThemeIcon} />
                ) : (
                  <Moon className={styles.mobileThemeIcon} />
                )}
              </div>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
