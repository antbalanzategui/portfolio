import React, { useEffect, useState } from 'react';
import styles from '../styles/Skills.module.css';

const Skills = () => {

  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconHover = (icon) => {
    setHoveredIcon(icon);
  };


  return (
    <section className={styles.skills} id="skills">
      <h2 className={styles['skill-header']}>‎ Skills ‎</h2>

      <div className={styles['skills-wrapper']}>
        <div className={styles['icon-card']}
        onMouseEnter={() => handleIconHover('Node.js')}
        onMouseLeave={() => handleIconHover(null)}>
          <img
            src="./icons8-node-js.svg"
            alt=""
            loading="lazy"
            className={styles.icon}
          />
          {hoveredIcon === 'Node.js' && (
            <div className={styles.tooltip}>
              <h3>Node.js</h3>
              <p>Building APIs with NodeJS and Express</p>
            </div>
          )}

        </div>
        <div className={styles['icon-card']}
        onMouseEnter={() => handleIconHover('React')}
        onMouseLeave={() => handleIconHover(null)}>
          <img
            src="./icons8-react-native.svg"
            alt=""
            loading="lazy"
            className={styles.icon}
          />
          {hoveredIcon === 'React' && (
            <div className={styles.tooltip}>
              <h3>React</h3>
              <p>Building user interfaces with React</p>
            </div>
          )}
        </div>
        <div className={styles['icon-card']}
        onMouseEnter={() => handleIconHover('MySQL')}
        onMouseLeave={() => handleIconHover(null)}>
          <img
            src="./icons8-mysql.svg"
            alt=""
            loading="lazy"
            className={styles.icon}
          />
          {hoveredIcon === 'MySQL' && (
            <div className={styles.tooltip}>
              <h3>MySQL</h3>
              <p>Integrating MySQL with server-side frameworks</p>
            </div>
          )}
        </div>
        <div className={styles['icon-card']}
        onMouseEnter={() => handleIconHover('Java')}
        onMouseLeave={() => handleIconHover(null)}>
          <img
            src="./icons8-java.svg"
            alt=""
            loading="lazy"
            className={styles.icon}
          />
          {hoveredIcon === 'Java' && (
            <div className={styles.tooltip}>
              <h3>Java</h3>
              <p>Knowledge of Object Oriented Programming and Algorithms</p>
            </div>
          )}
        </div>
        <div className={styles['icon-card']}
        onMouseEnter={() => handleIconHover('Python')}
        onMouseLeave={() => handleIconHover(null)}>
          <img
            src="./icons8-python.svg"
            alt=""
            loading="lazy"
            className={styles.icon}
          />
          {hoveredIcon === 'Python' && (
            <div className={styles.tooltip}>
              <h3>Python</h3>
              <p>Utilized to automate the process of data gathering</p>
            </div>
          )}
        </div>
        <div className={styles['icon-card']}
        onMouseEnter={() => handleIconHover('Git')}
        onMouseLeave={() => handleIconHover(null)}>
          <img
            src="./icons8-git.svg"
            alt=""
            loading="lazy"
            className={styles.icon}
          />
          {hoveredIcon === 'Git' && (
            <div className={styles.tooltip}>
              <h3>Git</h3>
              <p>Utilized Git within both team settings and individually</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
