// ProjectSection.js

import React, { useContext } from 'react';
import ProjectCard from './ProjectCard';
import { ThemeContext } from './ThemeContext';
import styles from '../styles/Projects.module.css';

const projects = [
  {
    title: "Umineko API",
    description: `This project is a Web API that returns information about visual novel series - Umineko When They Cry. Python was used to utilize various APIs, scripts, and webscraping to
    automate the process of data gathering. This data is hosted within a MySQL database which is used with Express to allow users to perform complex queries to gather highly specific data about the series.
    Within the backend, I've implemented a query validation and query handling process, which allows for the quick construction of Middleware routes via query schemas. This system returns highly specific error messages 
    to the user based on each routes' individual query schema, in hopes of creating an easy to use and robust API.
    `,
    technologies: ['React', 'CSS', 'Material-UI', 'Express', 'MySQL', 'Python', 'WebScrapper', 'API'],
    darkImageSrc: './darkMode/darkUminekoAPI.png',
    lightImageSrc: './lightMode/lightUminekoAPI.png',
    link: 'https://github.com/antbalanzategui/UminekoAPI',
  },
    {
      title: 'Google Statistics Dashboard',
      description: `This program creates a visualized dashboard based on json data about a particular programming language's popularity, in this case it was Java, Python, and JavaScript. 
      Instead of fetching the data directly from the file, I used mongoImport to put our json data within a Mongo Atlas Database. A backend server was then created using Mongoose and Express to
      allow for our Frontend to fetch the previously mentioned json data. The Frontend was built using React and the JavaScript library D3.js, along with CSS to make it completely reponsive. Using React I implemented the
      ability to allow for users to interact with a DataGrid from Material UI to highlight which particular points the user selected from the grid. `,
      technologies: ['React', 'CSS', 'Material-UI', 'Express', 'Mongoose', 'MongoDB'],
      darkImageSrc: './darkMode/d3js.png',
      lightImageSrc: './lightMode/lightModeD3JS.png',
      link: 'https://github.com/antbalanzategui/MERN-SearchDisplay',
    },
    {
      title: 'Isotherm Plotter Program',
      description:  `This program provided two things, one being the ability to calculate densities for particular substances using four seperate equations of state. The second
      being calculating and plotting isotherms for the same substance. The first portion of the program dealing with the four equations of state allowed the user to use a slider
      to adjust both the temperature and pressure values of a substance, which would update it's density, this change would then be shown to the user in a bar chart orientation. 
      The second portion of the program allows the user to plot the same isotherm, allowing for customization via textboxes for the following settings: Number of Isotherms, Temperature Interval, and Start/End Pressure`,
      technologies: ['Python', 'MatPlotLib', 'Pandas', 'Numpy', 'Object-Oriented', 'Chemical Engineering'],
      darkImageSrc: './darkMode/darkModeIsotherm.png',
      lightImageSrc: './lightMode/isothermPlot.png',
      link: 'https://github.com/antbalanzategui/speciesCalculator',
    },
    {
      title: 'Influencer Sorting Program',
      description:  `This project utilized Java Object-Oriented Programming, knowledge of Data Structures, and Swing to create a dashboard to sort various Influencers by
      traditional engagement and reach engagement. It takes in a file to create Influencer objects and uses a comparator and a Linked List Insertion sort to accomplish this. This 
      was completed within a small team setting utilizing Git for version control. I myself was responsible for the structure of classes and design of the program, which composed a large portion of the 
      backend functionality
      `,
      technologies: ['Java', 'Swing', 'Git', 'Linked List', 'Objected-Oriented'],
      darkImageSrc: './darkMode/darkModeSMV - Copy.png',
      lightImageSrc: './lightMode/socialMediaVisual.png',
      link: 'https://github.com/antbalanzategui/SocialMediaVisualization',
    },
    {
        title: 'Tower Of Hanoi',
        description:  `Tower of Hanoi is a Java project that demonstrates the principles of Object-Oriented Programming and Data Structures. 
        It utilizes Java's Swing framework to create an interactive visualization 
        of the famous puzzle game Tower of Hanoi.
        It implements a recursive algorithm to solve the Tower of Hanoi puzzle efficiently. 
        The Stack data structure plays a crucial role in the algorithm's implementation, enabling the manipulation of disks on the towers. Throughout the development process, 
        JUnit tests were employed to ensure the correctness and reliability of the code. These tests served to aid the development process.`,
        technologies: ['Java', 'Swing', 'Recursion', 'Stack', 'Object-Oriented'],
        darkImageSrc: './darkMode/darkModeTOH.png',
        lightImageSrc: './lightMode/towerofhanoi.png',
        link: 'https://github.com/antbalanzategui/TowerOfHanoi',
      },
      {
        title: "Password Cracking Program",
        description: `This program used Python to evaulate various passwords to determine how long it would take to "crack" them using a recursive dictionary attack. 
        It allowed for user inputs up to 3 words from the given dictionary. The user can enter any amount of words in which they want. When the user "exits" the program
        the data of the time it took to "crack" each password is displayed using MatPlotLib. The plot also allows for the user to switch between respective SHA256 and SHA512 Algorithms
        to see the differences in time between the two. `,
        technologies: ['Python', 'Recursion', 'MatPlotLib', 'Deque', 'Combinatorics', 'Hashing'],
        darkImageSrc: './darkMode/darkModePS.png',
        lightImageSrc: './lightMode/passwordSecurity.png',
        link: 'https://github.com/antbalanzategui/PasswordSecurity',
      },
  ];
  
  const Projects = () => {
    const { isDarkMode } = useContext(ThemeContext);
  
    return (
    <section id="projects" className={styles.sectionContainer}>
    <h1 className={styles.header}>‎ Projects ‎</h1>
      <div className={styles.projectSection}>
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            image={isDarkMode ? project.darkImageSrc : project.lightImageSrc}
            backgroundColor={project.backgroundColor}
            title={project.title}
            description={project.description}
            technologies={project.technologies}
            link={project.link}
          />
        ))}
      </div>
      </section>
    );
  };
  
  export default Projects;
