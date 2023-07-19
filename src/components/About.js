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
      <div className={styles.pCon}>
      <p className={styles.text}> 
      My name is Antonio, and I&apos;m a <span className={styles.highlight}>Computer Science</span> student at <span className={styles.highlight}>Virginia Tech&apos;s</span> Engineering program.
I&apos;ve always been fascinated by Math and Engineering, which naturally led me to pursue <span className={styles.highlight}>Computer Science</span>.
I love the logic and problem-solving aspects of programming, and I enjoy creating innovative solutions.
Although I&apos;ve gained experience in various areas of <span className={styles.highlight}>Computer Science</span>, including <span className={styles.highlight}>Algorithms</span>,
<span className={styles.highlight}> Data structures</span>, <span className={styles.highlight}>Software development</span>, and <span className={styles.highlight}>Artificial Intelligence</span>. My main focus is in <span className={styles.highlight}>Software Development </span> 
and creating <span className={styles.highlight}>APIs </span>
with <span className={styles.highlight}>NodeJS</span> and <span className={styles.highlight}>Express</span> and creating Frontends with <span className={styles.highlight}>React/NextJs</span>.

      </p>
      </div>
    </div>
    </section>
  );
};

export default About;
