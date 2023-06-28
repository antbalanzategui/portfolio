import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/ProjectCard.module.css';
import { GitHub } from 'react-feather';
import VanillaTilt from 'vanilla-tilt';

const ProjectCard = ({ image, title, description, technologies, link }) => {
  /** 
  const cardRef = useRef(null);

  useEffect(() => {
    VanillaTilt.init(cardRef.current, {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.3,
    });
  }, []);
  */

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardImageContainer}>
        <a className={styles.iconCon} href={link} target="_blank" rel="noopener noreferrer">
          <div className={styles.iconHolder}>
            <GitHub className={styles.icon} />
          </div>
        </a>
        <img src={image} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <p className={styles.description}>{description}</p>
        <div className={`${styles.circle} ${styles.top}`} >
        <div className={styles.technologies}>
          {technologies.map((tech, index) => (
            <span key={index} className={styles.technology}>
              {tech}
            </span>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
  link: PropTypes.string.isRequired,
};

export default ProjectCard;
