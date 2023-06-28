import React, { useEffect, useRef } from 'react';
import styles from '../styles/HomeText.module.css';

const HomeText = () => {
  const typedTextRef = useRef(null);
  const cursorRef = useRef(null);
  const textArray = [" a Software Engineer", " a Student", " an Avid Learner"];
  let textArrayIndex = 0;
  let charIndex = 0;

  const type = () => {
    const typedTextSpan = typedTextRef.current;
    const cursorSpan = cursorRef.current;

    if (charIndex < textArray[textArrayIndex].length) {
      if (!cursorSpan.classList.contains("typing")) {
        cursorSpan.classList.add("typing");
      }
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, 200);
    } else {
      cursorSpan.classList.remove("typing");
      setTimeout(erase, 2000);
    }
  };

  const erase = () => {
    const typedTextSpan = typedTextRef.current;
    const cursorSpan = cursorRef.current;

    if (charIndex > 0) {
      if (!cursorSpan.classList.contains("typing")) {
        cursorSpan.classList.add("typing");
      }
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, 100);
    } else {
      cursorSpan.classList.remove("typing");
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) {
        textArrayIndex = 0;
      }
      setTimeout(type, 200);
    }
  };

  useEffect(() => {
    type();
  }, []);

  return (
    <div className="textContainer">
      <header>
        <h1 className={styles.introHeader}>
          Hello, I am 
          <br></br>
          <span className={styles.myName}>Antonio Balanzategui </span>
          <br></br>
            and I am 
            <br></br>
            <span ref={typedTextRef} className={`typed-text ${styles.typingText}`}></span>
            <span ref={cursorRef} className={`cursor ${styles.cursor}`}>&nbsp;</span>
        </h1>
      </header>
    </div>
  );
};

export default HomeText;
