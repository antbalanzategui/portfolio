import React from 'react';
import styles from '../styles/Home.module.css';
import HomeText from '../components/HomeText';
import RotatingImage from '../components/RotatingImage';
import { GitHub, Linkedin, Download } from 'react-feather';


const Home = () => {

  return (
    <section id="home">
    <div className={styles.homeContainer}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <HomeText />
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
              <a href="./updatedANTBALANZATEGUIRES.pdf"
                target="_blank"
                rel="noopener noreferrer">
                <div className={styles.iconHolder}>
                <Download className={styles.icon}/>
                </div>
                
              </a>
        </div>
        </div>
        <div className={styles.imageContainer}>
        <RotatingImage src="./profileImage.jpg" alt="My Image" />
        </div>
      </div>
    </div>
    </section>
  );
};

export default Home;
