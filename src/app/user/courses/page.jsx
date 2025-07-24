'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Card, CardMedia, CardContent, CardActions,
  Typography, Rating, Chip, Button, Grow, CircularProgress
} from '@mui/material';
import Navbar from '../../../components/Navbar'
import LandingAuthPopup from '../../../components/LandingAuthPopup'; // Assuming this is in components folder

// Course data for the page
const courses = [
    {
      title: 'The Complete Full-Stack Web Development Bootcamp',
      instructor: 'Dr. Angela Yu',
      rating: 4.8,
      reviews: '2,150',
      level: 'Beginner',
      price: '₹499',
      image: 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg',
    },
    {
      title: 'The Complete Python Pro Bootcamp for 2025',
      instructor: 'Jose Portilla',
      rating: 4.7,
      reviews: '1,830',
      level: 'All Levels',
      price: '₹529',
      image: 'https://img-c.udemycdn.com/course/480x270/567828_67d0.jpg',
    },
    {
      title: 'Advanced React and Redux: 2025 Edition',
      instructor: 'Stephen Grider',
      rating: 4.6,
      reviews: '985',
      level: 'Intermediate',
      price: '₹499',
      image: 'https://img-c.udemycdn.com/course/480x270/781532_8b4d_6.jpg',
    },
    {
      title: 'Machine Learning A-Z™: AI, Python & R',
      instructor: 'Kirill Eremenko',
      rating: 4.5,
      reviews: '15,830',
      level: 'All Levels',
      price: '₹499',
      image: 'https://img-c.udemycdn.com/course/480x270/950390_270f_3.jpg',
    },
    {
        title: 'The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert',
        instructor: 'Colt Steele',
        rating: 4.7,
        reviews: '12,450',
        level: 'All Levels',
        price: '₹549',
        image: 'https://img-c.udemycdn.com/course/480x270/1187016_51b3.jpg',
    },
    {
        title: 'AWS Certified Solutions Architect - Associate 2024',
        instructor: 'Stephane Maarek',
        rating: 4.7,
        reviews: '21,985',
        level: 'Intermediate',
        price: '₹499',
        image: 'https://img-c.udemycdn.com/course/480x270/364426_2991_6.jpg',
    },
];

const CoursesPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLandingAuthPopup, setShowLandingAuthPopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setCurrentUser(parsedUser);
        }
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
    setAuthLoading(false);
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.100' }}>
      <Navbar
        mobileOpen={mobileOpen}
        currentUser={currentUser}
        handleLogout={handleLogout}
        handleDrawerToggle={handleDrawerToggle}
        setShowLandingAuthPopup={setShowLandingAuthPopup}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Explore Our Courses
        </Typography>
        <Grid container spacing={4}>
          {courses.map((course, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={500 + index * 150}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', minHeight: '64px' }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      By {course.instructor}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                      <Typography variant="body2" component="span" fontWeight="bold" sx={{ color: '#b4690e', mr: 0.5 }}>
                        {course.rating}
                      </Typography>
                      <Rating name="read-only" value={course.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({course.reviews})
                      </Typography>
                    </Box>
                    <Chip label={course.level} size="small" variant="outlined" />
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight="bold">
                      {course.price}
                    </Typography>
                    <Button variant="contained" size="medium">
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>
      <LandingAuthPopup
        open={showLandingAuthPopup && !currentUser}
        onClose={() => setShowLandingAuthPopup(false)}
        onSuccess={() => {
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
            setShowLandingAuthPopup(false);
          }
        }}
      />
    </Box>
  );
};

export default CoursesPage;
