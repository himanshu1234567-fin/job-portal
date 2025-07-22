'use client';

import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Button, Typography, Box, Container, Drawer,
  Avatar, CircularProgress, Paper, Divider, Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CompleteProfilePopup from '../components/PopupCard';
import LandingAuthPopup from '../components/LandingAuthPopup';

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
];

export default function ResumeBuilder() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileProgress, setProfileProgress] = useState(0);
  const [showLandingAuthPopup, setShowLandingAuthPopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const progressValue = parseInt(localStorage.getItem('profileProgress'), 10);

    setProfileProgress(isNaN(progressValue) ? 0 : progressValue);

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

        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    if (currentUser) fetchTasks();
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
    localStorage.setItem('profilePopupDismissed', 'true');
  };

  if (authLoading) {
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
          <a href="/">
            <img
              alt="Logo"
              src="https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg"
              height={40}
            />
          </a>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {navigation.map((item) => (
              <Button key={item.name} href={item.href} color="inherit">{item.name}</Button>
            ))}

            {currentUser ? (
              <>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={profileProgress}
                    size={44}
                    thickness={4}
                    sx={{ color: 'primary.main' }}
                  />
                  <Box sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <a href="/user/profile" style={{ textDecoration: 'none' }}>
                      <Avatar
                        alt={currentUser.fullName}
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'primary.main',
                        }}
                      >
                        {currentUser.fullName?.[0]}
                      </Avatar>
                    </a>
                  </Box>
                </Box>
                <Button onClick={handleLogout} color="error">Logout</Button>
              </>
            ) : (
              <Button href="/sign" variant="outlined">Log in / Sign up</Button>
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

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}>
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ my: 2 }}>MENU</Typography>
          {navigation.map((item) => (
            <Button key={item.name} href={item.href} fullWidth>{item.name}</Button>
          ))}
          {currentUser ? (
            <Button onClick={handleLogout} fullWidth color="error">Logout</Button>
          ) : (
            <Button href="/sign" fullWidth>Log in / Sign up</Button>
          )}
        </Box>
      </Drawer>

      <Container maxWidth="lg" marginTop={4} sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {!currentUser ? (
          <Box sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh'
          }}>
            <Typography variant="h3" gutterBottom>Start Your Career</Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
              Build a Resume/CV in 5 minutes.
            </Typography>
            <Button href="/sign" variant="contained" size="large">
              Get Started
            </Button>
          </Box>
        ) : (
          <Paper sx={{
            p: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Grid container spacing={3} marginBottom={4} alignItems="stretch">
              {/* Welcome Box */}
              <Grid item xs={12} md={4}>
                <Paper sx={{
                  p: 2, bgcolor: '#003366', color: '#fff',
                  borderRadius: 2, height: '100%',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                  <Typography variant="h6" fontWeight="bold">
                    Land a better job faster!
                  </Typography>
                  <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
                    👋 Welcome, {currentUser.fullName}!
                  </Typography>
                  <Typography sx={{ mt: 1, fontSize: 14, color: '#cfd8dc' }}>
                    Benefit from expert support and feedback during every step of your job search.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: '#fff', color: '#003366', mt: 3, fontWeight: 'bold',
                      '&:hover': { bgcolor: '#e0e0e0' },
                    }}
                  >
                    Start your search
                  </Button>
                </Paper>
              </Grid>

              {/* Tasks Box */}
              <Grid item xs={12} md={4}>
                <Paper sx={{
                  p: 2, bgcolor: '#f5faff', borderRadius: 2,
                  display: 'flex', flexDirection: 'column', height: '100%'
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
                          <a href="/user/test" style={{ textDecoration: 'none' }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#003366' }}>
                              {task.question || task.title || 'Untitled Task'}
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

              {/* Coaching Box */}
              <Grid item xs={12} md={4}>
                <Paper sx={{
                  p: 2, bgcolor: '#f9f9f9', borderRadius: 2,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  height: '100%'
                }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#003366', mb: 2 }}>
                    Coaching
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Our coaches will provide you with step-by-step support to achieve your goal.
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                      alt="Coaching Thumbnail"
                      style={{ width: '8%', borderRadius: 8 }}
                    />
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                      Self-assessment
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Sharpen your focus on where you want to go.
                    </Typography>
                  </Box>
                  <Button variant="outlined" sx={{ mt: 2 }}>
                    Explore Classes
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>

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
