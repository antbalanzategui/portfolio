import React from 'react';
import styles from '../styles/RotatingImage.module.css';


const RotatingImage = ({ src, alt }) => {
  return (
    <div className={styles.container}>
      <div className={styles.border}>
        <div className={styles.background} />
        <img src={src} alt={alt} className={styles.image} />
      </div>
    </div>
  );
};

export default RotatingImage;
