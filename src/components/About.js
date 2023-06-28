import React from 'react';
import styles from '../styles/About.module.css';

const About = () => {
  return (
    <section id="about">
    <div className={styles.aboutContainer}>
      <h1 className={styles.header}>‎ About Me ‎</h1>
      <p className={styles.text}> 
      My name is Antonio, and I&apos;m a Computer Science student at Virginia Tech&apos;s Engineering program.
I&apos;ve always been fascinated by Math and Engineering, which naturally led me to pursue Computer Science.
I love the logic and problem-solving aspects of programming, and I enjoy creating innovative solutions.
Although I&apos;ve gained experience in various areas of Computer Science, including algorithms,
data structures, software development, and artificial intelligence. My main focus in Software Development is creating APIs
with NodeJS and Express and creating Frontend with React/NextJs.

      </p>
    </div>
    </section>
  );
};

export default About;
