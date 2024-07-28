import React from 'react';
import styles from '../styles/About.module.css';

const About = () => {
  return (
    <section id="about">
    <div className={styles.aboutContainer}>
      <div className={styles.trueHead}>
      <h1 className={styles.header}>‎About‎</h1>

      <div className={styles.hDivider}>
      <div className={styles.shadow}></div>
      </div>
      </div>
    </div>
    </section>
  );
};

export default About;
