import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  createTheme,
  ThemeProvider,
  Divider
} from '@mui/material';
import { GitHub } from 'react-feather';
import { ThemeContext } from './ThemeContext';
import styles from '../styles/ProjectCard.module.css';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const titleFontFamily = 'Arvo, Arial, sans-serif';
const bodyFontFamily = 'Inconsolata, Arial, sans-serif';

// Create a custom theme based on the dark theme
const customDarkTheme = createTheme(darkTheme, {
  typography: {
    h5: {
      fontFamily: titleFontFamily,
    },
    fontFamily: bodyFontFamily,
  },
});

// Create a custom theme based on the light theme
const customLightTheme = createTheme(lightTheme, {
  typography: {
    h5: {
      fontFamily: titleFontFamily,
    },
    fontFamily: bodyFontFamily,
  },
});


const ProjectCard = ({ image, title, description, technologies, link }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <ThemeProvider theme={isDarkMode ? customDarkTheme : customLightTheme}>
    <Card variant="outlined" className={styles.card}
    sx={{
      backgroundColor: isDarkMode ? 'rgb(22, 25, 28)' : '#e3dff2',
      transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
      borderRadius:'20px',
      '&:hover': {
        backgroundColor: isDarkMode ? 'rgb(17, 20, 23)' : 'rgb(232, 228, 247)',
        '& .MuiChip-root': {
          background: isDarkMode ? 'linear-gradient(45deg, #FD9745, #FD9745)' : 'linear-gradient(45deg, #a388ee, #a388ee)',
          color: 'white',
          transition: 'background 0.3s, color 0.3s'
        },
      },
    }}>
      <CardHeader
        sx={{ height: '60px', overflow: 'hidden'}}
        title={
          <Typography variant="h5" color={isDarkMode ? 'white' : 'black'}
          sx={{fontSize: 'clamp(1rem, 1.75vw, 2rem)'}}
          className={styles.title}>
            {title}
          </Typography>
        }
        action={
          <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.githubLink}
              >
                <div className={styles.iconHolder}>
                <GitHub className={styles.icon} />
                </div>
              </a>
        }
      />
      <div className={styles.cMedia}>
        <CardMedia
          className={styles.img}
          component="img"
          src={image}
          alt={title}
          style={{ width: '90%', aspectRatio: '16/9', objectFit: 'fill',borderRadius:'4px'}}
        />
      </div>
      <CardContent>
      <Divider style={{ margin: '10px 0' }} />
        <Typography style={{textAlign:'center'}} variant="body2" color={isDarkMode ? 'white' : 'black'}
        sx ={{fontSize: {
          lg: '100%',
          md: '1.2vw',
          sm: '1.5vw',
          xs: '2.5vw'
        }}}>
          {description}
        </Typography>
        <Divider style={{ margin: '10px 0' }} />
        <div style={{ textAlign: 'center'}}>
          {technologies.map((tech, index) => (
            <Chip style={{}}
              key={index}
              label={tech}
              size="small"
              variant={isDarkMode ? 'outlined' : 'outlined'}
              sx={{margin: '1px',
              transition: 'color 0.3s',
              transition: 'background 0.3s',}}
            />
          ))}
        </div>
      </CardContent>
    </Card>
    </ThemeProvider>
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
