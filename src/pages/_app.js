import React from 'react';
import NavBar from '../components/NavBar';
import { ThemeProvider } from '../components/ThemeContext';
import Home from '../components/Home';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import '../styles/Global.css';

const App = () => {
  return (
    <ThemeProvider>
      <div className="container">
        <NavBar />
        <div className="backgroundGradient"></div>
        <div className="contentContainer">
          <Home />
          <About />
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
