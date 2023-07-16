import React, { useEffect, useState } from 'react';
import styles from '../styles/Skills.module.css';
import SkillCard from './SkillCard';

const Skills = () => {

  return (
    <section className={styles.skills} id="skills">
      <h2 className={styles['skill-header']}>‎ Skills ‎</h2>

     

      <div className={styles['skills-wrapper']}>

      <SkillCard
      icon="./icons8-node-js.svg"
      title="Node.js"
      description="Building APIs with NodeJS and Express"
      />
       <SkillCard
      icon="./icons8-react-native.svg"
      title="React"
      description="Building user interfaces with React"
      />
       <SkillCard
      icon="./icons8-mysql.svg"
      title="MySQL"
      description="Integrating MySQL with server-side frameworks"
      />
       <SkillCard
      icon="./icons8-python.svg"
      title="Python"
      description="Utilized to automate the process of data gathering"
      />
       <SkillCard
      icon="./icons8-java.svg"
      title="Java"
      description="Object Oriented Programming and Algorithms"
      />
       <SkillCard
      icon="./icons8-git.svg"
      title="Git"
      description="Building APIs with NodeJS and Express"
      />

        
      </div>
    </section>
  );
};

export default Skills;
