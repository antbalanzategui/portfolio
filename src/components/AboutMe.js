import React from 'react';
import styles from '../styles/Home.module.css'; // Assuming you have a corresponding CSS module file
import { GitHub, Linkedin, Download, Box } from 'react-feather';

const AboutMe = () => {
    const currentDate = new Date().toLocaleDateString();
    return (
      <div className={styles.container}>
        <div className={styles.aboutMeContent}>
        <div className={styles.header}>
          <Box className={styles.boxIcon} />
          <span className={styles.date}>{currentDate}</span>
        </div>
        <h2>
            <span className= {styles.nameOutline}>
            Antonio Balanzategui
        </span>
        </h2>
          <div className={styles.pCon}>
      <p className={styles.text}> 
      <span className={styles.highlight}>ABOUT * </span>My name is Antonio, and I&apos;m a <span className={styles.highlight}>Computer Science</span> student at <span className={styles.highlight}>Virginia Tech&apos;s</span> Engineering program.
I&apos;ve always been fascinated by Math and Engineering, which naturally led me to pursue <span className={styles.highlight}>Computer Science</span>.
I love the logic and problem-solving aspects of programming, and I enjoy creating innovative solutions.
Although I&apos;ve gained experience in various areas of <span className={styles.highlight}>Computer Science</span>, including <span className={styles.highlight}>Algorithms</span>,
<span className={styles.highlight}> Data structures</span>, <span className={styles.highlight}>Software development</span>, and <span className={styles.highlight}>Artificial Intelligence</span>. My main focus is in <span className={styles.highlight}>Software Development </span> 
and creating <span className={styles.highlight}>APIs </span>
with <span className={styles.highlight}>NodeJS</span> and <span className={styles.highlight}>Express</span> and creating Frontends with <span className={styles.highlight}>React/NextJs</span>.
      </p>
      </div>
        </div>
        <div className={styles.iconContainer}>
          <a
            href="https://github.com/antbalanzategui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.iconHolder}>
              <GitHub className={styles.icon} />
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/antbalanzategui/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.iconHolder}>
              <Linkedin className={styles.icon} />
            </div>
          </a>
          <a
            href="./updatedANTBALANZATEGUIRES.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.iconHolder}>
              <Download className={styles.icon} />
            </div>
          </a>
        </div>
      </div>
    );
  };

export default AboutMe;
