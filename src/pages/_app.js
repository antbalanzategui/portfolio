import React from 'react';
import NavBar from '../components/NavBar';
import { ThemeProvider } from '../components/ThemeContext';
import Home from '../components/Home';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import AboutMe from '../components/AboutMe';
import '../styles/Global.css';

const App = () => {
  return (
    <ThemeProvider>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Luckiest+Guy&family=Tiny5&display=swap" rel="stylesheet"></link>
      <div className="container">
        <div className="backgroundGradient"></div>
        <NavBar />
        <div className="contentContainer">
          <Home />
          <AboutMe/>
          <Skills />
          <Projects />
          <ContactForm/>
          <Footer/>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
