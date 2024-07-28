import styles from '../styles/HomeText.module.css';
import Marquee from "react-fast-marquee";

const HomeText = () => {

  return (
    <div className="textContainer">
      <div className={styles.descContainer}>
      <Marquee>
    <span className={styles.highlight}>** </span> Software Engineer <span className={styles.highlight}>** </span>
     Avid Learner <span className={styles.highlight}>** </span> Student <span className={styles.highlight}>** </span> 
     Software Engineer <span className={styles.highlight}>** </span> Avid Learner <span className={styles.highlight}>** </span> 
     Student <span className={styles.highlight}>** </span> Software Engineer <span className={styles.highlight}>** </span> Avid Learner 
     <span className={styles.highlight}>** </span> Student 
    </Marquee>
      </div>
      <header className={styles.nameContainer}> 
          <span className={styles.myName}>Antonio Balanzategui </span>
      </header>
    </div>
  );
};

export default HomeText;
