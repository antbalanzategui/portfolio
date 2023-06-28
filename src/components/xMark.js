import React from 'react';
import styles from '../styles/xMark.module.css';

const XMark = () => {
  return (
    <div className={styles.xmarkContainer}>
      <svg className={styles.xmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className={styles.xmark__circle} cx="26" cy="26" r="25" fill="none" />
        <path className={styles.xmark__cross} fill="none" d="M16 16 36 36 M36 16 16 36" />
      </svg>
      <p>Something went wrong... </p>
    </div>
  );
};

export default XMark;
