'use client';

import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Button, Typography, Box, Container, Drawer,
  Avatar, CircularProgress, Paper, Divider, Grid, Checkbox, Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CompleteProfilePopup from '../components/PopupCard';
import LandingAuthPopup from '../components/LandingAuthPopup';

const navigation = [
  { name: 'Jobs', href: '#' },
  { name: 'Headhunters', href: '#' },
  { name: 'Resume', href: '#' },
  { name: 'Coaching', href: '#' },
];

const ProfileAvatarWithProgress = ({ user, progress }) => {
  return (
    <Box sx={{ 
      position: 'relative', 
      display: 'inline-flex',
      '&:hover': {
        '& .progress-percent': {
          opacity: 1,
        }
      }
    }}>
      <Avatar
        alt={user.fullName}
        sx={{
          width: 32,
          height: 32,
          bgcolor: 'primary.main',
          fontSize: '0.875rem',
        }}
      >
        {user.fullName?.[0]}
      </Avatar>
      {progress < 100 && (
        <>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={38}
            thickness={4}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              top: -3,
              left: -3,
              zIndex: 1,
            }}
          />
          <Box
            className="progress-percent"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
          >
            {progress}%
          </Box>
        </>
      )}
    </Box>
  );
};

export default function ResumeBuilder() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLandingAuthPopup, setShowLandingAuthPopup] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;

    const fieldsToCheck = [
      'fullName', 'email', 'dob', 'phone',
      'education', 'skills', 'experience', 'desirableJob'
    ];

    let completedFields = 0;

    fieldsToCheck.forEach(field => {
      if (profile[field]) {
        if (Array.isArray(profile[field])) {
          if (profile[field].length > 0) completedFields++;
        } else {
          completedFields++;
        }
      }
    });

    if (profile.education && profile.education.length > 0) {
      const edu = profile.education[0];
      const eduFields = [
        'college', 'collegeDegree', 'branch',
        'passingYear', 'cgpa',
        'board10', 'percentage10', 'board12', 'percentage12'
      ];
      
      eduFields.forEach(field => {
        if (edu[field] !== undefined && edu[field] !== null && edu[field] !== '') {
          completedFields++;
        }
      });
    }

    const totalFields = fieldsToCheck.length + 10;
    return Math.round((completedFields / totalFields) * 100);
  };

  const isProfileComplete = (profile) => {
    return calculateProfileCompletion(profile) === 100;
  };

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
      if (!token) return;

      setLoadingProfile(true);
      try {
        const response = await fetch('http://localhost:5000/api/candidates/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        const completion = calculateProfileCompletion(data);
        setProfileCompletion(completion);
        setShowPopup(completion === 0);
      } catch (err) {
        console.error('Error fetching candidate profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (currentUser) {
      fetchCandidateProfile();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      setLoadingTasks(true);
      try {
        const response = await fetch('http://localhost:5000/api/questions', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        let fetchedTasks = [];

        if (Array.isArray(data)) fetchedTasks = data;
        else if (Array.isArray(data.data)) fetchedTasks = data.data;
        else if (data.questions) fetchedTasks = data.questions;

        // Transform the API data to match our expected task structure
        const transformedTasks = fetchedTasks.map(task => ({
          title: task.title || task.question || 'Untitled Task',
          question: task.question || task.title || 'No question text provided',
          duration: task.duration || 60,
          options: task.options || []
        }));

        setTasks(transformedTasks);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    if (currentUser) {
      fetchTasks();
      // Set up polling to fetch tasks every 30 seconds
      const intervalId = setInterval(fetchTasks, 30000);
      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setShowLandingAuthPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (authLoading || loadingProfile) {
    return (
      <Box sx={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            jobMyleads
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {navigation.map((item) => (
              <Button key={item.name} href={item.href} color="inherit">{item.name}</Button>
            ))}

            {currentUser ? (
              <>
                <a href="/user/profile" style={{ textDecoration: 'none' }}>
                  <ProfileAvatarWithProgress user={currentUser} progress={profileCompletion} />
                </a>
                <Button onClick={handleLogout} color="error">Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setShowLandingAuthPopup(true)} variant="outlined">
                  Sign up now
                </Button>
                <Button onClick={() => setShowLandingAuthPopup(true)} variant="contained">
                  Log in
                </Button>
              </>
            )}
          </Box>

          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {!currentUser ? (
        <Box sx={{
          background: 'linear-gradient(to bottom, #ffffff, #f5f9ff)',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          py: 8
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h1" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}>
                  Land a better job.<br />
                  <Box component="span" sx={{ color: 'primary.main' }}>faster!</Box>
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%', mr: 2 }} />
                    <Typography variant="body1">Get more headhunter contacts</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%', mr: 2 }} />
                    <Typography variant="body1">Targeted guidance</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%', mr: 2 }} />
                    <Typography variant="body1">Confidence</Typography>
                  </Box>
                </Box>
                
                <Button 
                  onClick={() => setShowLandingAuthPopup(true)} 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    px: 6,
                    py: 1.5,
                    fontSize: '1.1rem',
                    mb: 3
                  }}
                >
                  Sign up for free
                </Button>
                
                <Typography variant="body2" color="textSecondary">
                  Free Resume Review
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  borderRadius: 4,
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img 
                    src="https://images.pexels.com/photos/6837641/pexels-photo-6837641.jpeg?_gl=1*1ba1y4d*_ga*MjEyMjIxMDExNC4xNzUzMDk3MTc3*_ga_8JE65Q40S6*czE3NTMwOTcxNzYkbzEkZzEkdDE3NTMwOTcxODIkajU0JGwwJGgw" 
                    alt="Person finding jobs"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      ) : (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* Welcome Section */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Land a better job faster!
                </Typography>
                <Typography variant="body1" paragraph>
                  Welcome, {currentUser.fullName}!<br />
                  Benefit from expert support and feedback during every step of your job search.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Start your search
                </Button>
              </Paper>

              {/* Tasks Section (Original Layout) */}
              <Paper sx={{
                p: 2, bgcolor: '#f5faff', borderRadius: 2,
                display: 'flex', flexDirection: 'column', height: '50%'
              }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#003366', mb: 2 }}>
                  Tasks
                </Typography>

                {loadingTasks ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading tasks...</Typography>
                  </Box>
                ) : tasks.length === 0 ? (
                  <Typography>No tasks available.</Typography>
                ) : (
                  <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '250px' }}>
                    {tasks.map((task, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <a href={`/user/test?taskId=${task._id || idx}`} style={{ textDecoration: 'none' }}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#003366' }}>
                            {task.title || task.question || 'Untitled Task'}
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
            </Grid>

            {/* Coaching Section */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Coaching
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Our coaches will provide you with step-by-step support to achieve your goal. You don't have to do it alone.
                </Typography>

                <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">MasterClasses</Typography>
                  <Chip label="Free" size="small" sx={{ mt: 1 }} />
                </Box>

                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">MasterClass</Typography>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>Self-assessment</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Sharpen your focus on where you want to go
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {/* Quick Links */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick links
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Important links related to your searches and bookmarks.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Checkbox />
              <Typography>New job search</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Checkbox checked />
              <Typography>Previous job searches (1)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox checked />
              <Typography>Saved searches (0)</Typography>
            </Box>
          </Paper>
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