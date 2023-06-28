import React, { useState, useContext } from 'react';
import styles from '../styles/ContactForm.module.css';
import { GitHub, Linkedin, Mail, Send} from 'react-feather';
import Checkmark from './Checkmark';
import XMark from './xMark';
import { ThemeContext } from './ThemeContext';



const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state variable for submission status
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};

    if (!name.trim()) {
      formErrors.name = 'Please enter your name.';
    } else {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!name.match(nameRegex)) {
        formErrors.name = 'Name can only contain alphabetic letters and spaces.';
      }
    }

    if (!email.trim()) {
      formErrors.email = 'Please enter your email.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Please enter a valid email address.';
    }

    if (!message.trim()) {
      formErrors.message = 'Please enter a message.';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitDisabled(true);
      return;
    }

    // Send the form data to the serverless function
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});
      setIsSubmitted(true); // Set submission status to true
    } else {
      setIsError(true);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
    setIsSubmitDisabled(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    setIsSubmitDisabled(false);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, message: '' }));
    setIsSubmitDisabled(false);
  };

  const { isDarkMode } = useContext(ThemeContext);


  return (
    <section id="contact" className={styles.conSection}>
      <h1 className={styles.header}>‎ Contact ‎</h1>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.leftInnerContainer}>
              <h2>Let's Chat</h2>
              <p>Feel free to send me a message in the contact form</p>
              <br />
              <p>Or contact me on Linkedin or my Email below</p>
            </div>
            <div className={styles.iconContainer}>
              <a href="https://github.com/antbalanzategui" target="_blank" rel="noopener noreferrer">
                <div className={styles.iconHolder}>
                  <GitHub className={styles.icon} />
                </div>
              </a>
              <a href="https://www.linkedin.com/in/antbalanzategui/" target="_blank" rel="noopener noreferrer">
                <div className={styles.iconHolder}>
                  <Linkedin className={styles.icon} />
                </div>
              </a>
              <a href="mailto:antbalanzategui@vt.edu" target="_blank" rel="noopener noreferrer">
                <div className={styles.iconHolder}>
                  <Mail className={styles.icon} />
                </div>
              </a>
            </div>
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.rightInnerContainer}>
              <form onSubmit={handleSubmit}>
                <h2 className={styles.lgView}>
                  Contact <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {isDarkMode ? (
        <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="rgb(222, 49, 99)" />
        <stop offset="100%" stopColor="rgb(255, 182, 193)" />
        </linearGradient>
      ) : (
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="rgb(127, 0, 255)" />
        <stop offset="100%" stopColor="rgb(207, 159, 255)" />
      </linearGradient>
        )}
              <Send color="url(#gradient)" />
              </svg>
                </h2>
                <h3>Name</h3>
                <input
                  type="text"
                  placeholder="Name *"
                  value={name}
                  onChange={handleNameChange}
                  className={errors.name ? styles.error : ''}
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
                <h3>Email</h3>
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={handleEmailChange}
                  className={errors.email ? styles.error : ''}
                />
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                <h3>Message</h3>
                <textarea
                  rows="4"
                  placeholder="Message"
                  value={message}
                  onChange={handleMessageChange}
                  className={errors.message ? styles.error : ''}
                ></textarea>
                {errors.message && <p className={styles.errorText}>{errors.message}</p>}
                <button type="submit" className={`${styles.btn} ${isSubmitDisabled ? styles.disabled : ''}`} disabled={isSubmitDisabled}>
                <span>Submit</span>
                </button>
              </form>
              {isSubmitted && (
                <Checkmark/>
              )}
              {isError && <XMark/>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;