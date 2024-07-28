import React from 'react';
import styles from '../styles/Home.module.css';
import HomeText from '../components/HomeText';

const Home = () => {
  return (
    <section id="home">
      <div className={styles.homeContainer}>
        <div className={styles.content}>
          <div className={styles.textContainer}>
            <HomeText />
          </div>
          {/*
          <div className={styles.imageContainer}>
            <RotatingImage src="./profileImage.jpg" alt="My Image" />
          </div>
          */}
        </div>
      </div>
      
    </section>
  );
};

export default Home;
