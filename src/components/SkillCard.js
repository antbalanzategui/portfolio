import React, { useState } from 'react';
import styles from '../styles/SkillCard.module.css';

const SkillCard = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleHoverLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className={styles.skillCardContainer}>
      <div className={styles.iconContainer}>
        <div className={styles.sIconContainer}>
        <img className={`${styles.cardIcon} ${isHovered ? styles.hovered : ''}`}src={icon} alt="Skill Icon" />
        </div>
      </div>

      {/* Add the event handlers to the .cardContent div */}
      <div
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverLeave}
        className={`${styles.cardContent} ${isHovered ? styles.hovered : ''}`}
      >
        <h3 className={styles.skillCardTitle}>{title}</h3>
        <p className={styles.skillCardDescription}>{description}</p>
      </div>
    </div>
  );
};

export default SkillCard;
