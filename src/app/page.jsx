'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Container, Paper, Divider, Grid, Typography, Button, Card, CardMedia, CardContent, Checkbox, Chip, CardActions, Rating, Skeleton
} from '@mui/material';
import axios from 'axios';
import CompleteProfilePopup from '../components/PopupCard';
import LandingAuthPopup from '../components/LandingAuthPopup';
import Navbar from '../components/Navbar';
import { useError } from '../context/ErrorContext';

// ✅ NEW: Skeleton component for the main dashboard layout
const DashboardSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        {/* Welcome Banner Skeleton */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }}/>
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="rectangular" width={150} height={40} sx={{ mt: 2, borderRadius: 1 }} />
        </Paper>
        {/* Tasks List Skeleton */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Skeleton variant="text" width="30%" height={30} sx={{ mb: 2 }} />
          <Box>
            {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="50%" height={24} />
                <Skeleton variant="text" width="30%" height={18} />
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </Box>
        </Paper>
         {/* Quick Links Skeleton */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="text" width="70%" height={20} sx={{ mt: 1, mb: 2 }}/>
           {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Skeleton variant="rectangular" width={24} height={24} sx={{ mr: 1 }}/>
                <Skeleton variant="text" width="40%" height={24} />
              </Box>
            ))}
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="text" width="80%" height={35} sx={{ mb: 2 }} />
        {/* Course Cards Skeleton */}
        {[...Array(3)].map((_, i) => (
           <Card key={i} sx={{ mb: 3, boxShadow: 3 }}>
              <Skeleton variant="rectangular" height={120} />
              <CardContent>
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
              </CardContent>
              <CardActions sx={{p: 1.5, pt: 0, justifyContent: 'space-between'}}>
                 <Skeleton variant="text" width="30%" height={30} />
                 <Skeleton variant="rectangular" width={80} height={30} />
              </CardActions>
            </Card>
        ))}
      </Grid>
    </Grid>
  </Container>
);


export default function ResumeBuilder() {
  const { showError } = useError();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLandingAuthPopup, setShowLandingAuthPopup] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true); // Start as true

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
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setCurrentUser(parsedUser);
          setShowLandingAuthPopup(false);
        }
      } catch {
        localStorage.removeItem('currentUser');
        setShowLandingAuthPopup(true);
      }
    } else {
      setShowLandingAuthPopup(true);
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || !currentUser) {
          setLoadingProfile(false); // Stop loading if no user/token
          return;
      }
      setLoadingProfile(true);
      try {
        const response = await axios.get('http://localhost:5000/api/candidates/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        
        if (data && typeof data.profileCompletion !== 'undefined') {
          setShowPopup(data.profileCompletion < 100);
        } else {
          setShowPopup(true);
        }

      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Could not fetch your profile details. Please try again later.';
        showError(errorMessage, 'Profile Error');
      } finally {
        setLoadingProfile(false);
      }
    };
    if (currentUser) {
      fetchCandidateProfile();
    } else {
        setLoadingProfile(false); // Ensure loading stops if there's no user
    }
  }, [currentUser, showError]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || !currentUser) return;
      setLoadingTasks(true);
      try {
        const response = await axios.get('http://localhost:5000/api/questions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        let fetchedTasks = [];
        if (Array.isArray(data)) fetchedTasks = data;
        else if (Array.isArray(data.data)) fetchedTasks = data.data;
        else if (data.questions) fetchedTasks = data.questions;

        const transformedTasks = fetchedTasks.map(task => ({
          title: task.title || task.question || 'Untitled Task',
          question: task.question || task.title || 'No question text provided',
          duration: task.duration || 60,
          options: task.options || [],
          _id: task._id
        }));
        setTasks(transformedTasks);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load your tasks. Please refresh the page.';
        showError(errorMessage, 'Task Loading Error');
      } finally {
        setLoadingTasks(false);
      }
    };

    if (currentUser) {
      fetchTasks();
      const intervalId = setInterval(fetchTasks, 30000);
      return () => clearInterval(intervalId);
    }
  }, [currentUser, showError]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setShowLandingAuthPopup(true);
    setShowPopup(false);
  };
  const handleClosePopup = () => setShowPopup(false);

  // ✅ MODIFICATION: Use the new Skeleton component during the loading state
  if (authLoading || loadingProfile) {
    return (
       <Box sx={{ flexGrow: 1 }}>
         <DashboardSkeleton />
       </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar
        mobileOpen={mobileOpen}
        currentUser={currentUser}
        handleLogout={handleLogout}
        handleDrawerToggle={handleDrawerToggle}
        setShowLandingAuthPopup={setShowLandingAuthPopup}
      />

      {!currentUser ? (
        <Box sx={{ background: 'linear-gradient(to bottom, #ffffff, #f5f9ff)', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                  Land a better job.<br />
                  <Box component="span" sx={{ color: 'primary.main' }}>faster!</Box>
                </Typography>
                <Box sx={{ mb: 4 }}>
                  {['Get more headhunter contacts', 'Targeted guidance', 'Confidence'].map((text, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%', mr: 2 }} />
                      <Typography variant="body1">{text}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button onClick={() => setShowLandingAuthPopup(true)} variant="contained" size="large" sx={{ px: 6, py: 1.5, fontSize: '1.1rem', mb: 3 }}>
                  Sign up for free
                </Button>
                <Typography variant="body2" color="textSecondary">
                  Free Resume Review
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ borderRadius: 4, height: '400px', overflow: 'hidden' }}>
                  <img
                    src="https://images.pexels.com/photos/6837641/pexels-photo-6837641.jpeg"
                    alt="Person finding jobs"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Land a better job faster!
                </Typography>
                <Typography variant="body1" paragraph>
                  Welcome, {currentUser.fullName}!<br />
                  Benefit from expert support and feedback during every step of your job search.
                </Typography>
                <Button variant="contained" size="large" sx={{ mt: 2 }} href='/user/jobsearch'>
                  Start your search
                </Button>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: '#f5faff', borderRadius: 2, display: 'flex', flexDirection: 'column', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#003366', mb: 2 }}>
                  Tasks
                </Typography>
                {loadingTasks ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ mt: 2 }}>Loading tasks...</Typography>
                  </Box>
                ) : tasks.length === 0 ? (
                  <Typography sx={{ py: 4, textAlign: 'center' }}>
                    No tasks available.
                  </Typography>
                ) : (
                  <Box sx={{ overflowY: 'auto', maxHeight: '250px' }}>
                    {tasks.map((task, idx) => (
                      <Box key={task._id || idx} sx={{ mb: 2 }}>
                        <a href={`/user/test?taskId=${task._id}`} style={{ textDecoration: 'none' }}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#003366' }}>
                            {task.title}
                          </Typography>
                        </a>
                        <Typography variant="body2" color="text.secondary">
                          {task.duration ? `Time Limit: ${task.duration} seconds` : 'No time limit'}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>

              <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Quick links
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Important links related to your searches and bookmarks.
                </Typography>
                {['New job search', 'Previous job searches (1)', 'Saved searches (0)'].map((text, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                     <Checkbox checked={i > 0} />
                    <Typography>{text}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recommended Courses
              </Typography>
              <Grid container spacing={3}>
                {courses.map((course, index) => (
                  <Grid item key={index} xs={12} sm={6} md={12}>
                    <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
                      <CardMedia component="img" height="120" image={course.image} alt={course.title} />
                      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          By {course.instructor}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: '#b4690e', mr: 0.5 }}>
                            {course.rating}
                          </Typography>
                          <Rating name="read-only" value={course.rating} precision={0.1} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                            ({course.reviews})
                          </Typography>
                        </Box>
                        <Chip label={course.level} size="small" variant="outlined" />
                      </CardContent>
                      <CardActions sx={{ p: 1.5, pt: 0, justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="bold">{course.price}</Typography>
                        <Button variant="contained" size="small">Add to Cart</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      )}

      <CompleteProfilePopup open={showPopup} onClose={handleClosePopup} />
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
}