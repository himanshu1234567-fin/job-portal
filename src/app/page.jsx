'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Container, CircularProgress, Paper, Divider, Grid, Checkbox, Chip, Typography, Button
} from '@mui/material';
import CompleteProfilePopup from '../components/PopupCard'; // Assuming this is your popup component
import LandingAuthPopup from '../components/LandingAuthPopup';
import Navbar from '../components/Navbar';

export default function ResumeBuilder() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLandingAuthPopup, setShowLandingAuthPopup] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  /**
   * Checks if the user's profile is complete based on the backend schema.
   * @param {object} profile - The candidate profile object from the API.
   * @returns {boolean} - True if all required fields are filled, false otherwise.
   */
  const isProfileComplete = (profile) => {
    // 1. If the profile object itself is missing, it's incomplete.
    if (!profile) return false;

    // 2. Define required fields from the schema.
    const topLevelRequiredFields = ['fullName', 'email', 'dob', 'phone', 'desirableJob'];
    const educationRequiredFields = [
      'college', 'collegeDegree', 'passingYear', 'cgpa',
      'board10', 'percentage10', 'board12', 'percentage12'
    ];

    // 3. Check top-level string/date fields.
    for (const field of topLevelRequiredFields) {
      if (!profile[field]) return false; // Checks for null, undefined, or empty string
    }

    // 4. Check 'experience' field specifically (0 is a valid value).
    if (profile.experience === null || profile.experience === undefined) {
        return false;
    }

    // 5. Check that required arrays exist and are not empty.
    if (!Array.isArray(profile.skills) || profile.skills.length === 0) {
      return false;
    }
    if (!Array.isArray(profile.education) || profile.education.length === 0) {
      return false;
    }

    // 6. Check the nested fields in the first education record.
    const educationRecord = profile.education[0];
    for (const field of educationRequiredFields) {
        // A value of 0 is valid for number fields, so check for null/undefined.
        // An empty string is falsy, so !educationRecord[field] works for strings.
      if (educationRecord[field] === null || educationRecord[field] === undefined || educationRecord[field] === '') {
        return false;
      }
    }

    // ✅ If all checks pass, the profile is complete.
    return true;
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
      if (!token || !currentUser) return; // Ensure currentUser is available

      setLoadingProfile(true);
      try {
        const response = await fetch('http://localhost:5000/api/candidates/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        const isComplete = isProfileComplete(data);
        
        // Show the popup if the profile is NOT complete
        setShowPopup(!isComplete);
        
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
      if (!token || !currentUser) return;

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

        const transformedTasks = fetchedTasks.map(task => ({
          title: task.title || task.question || 'Untitled Task',
          question: task.question || task.title || 'No question text provided',
          duration: task.duration || 60,
          options: task.options || [],
          _id: task._id // Keep track of ID for links
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
    setShowPopup(false); // Hide the popup immediately on logout
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
      <Navbar 
        currentUser={currentUser}
        handleLogout={handleLogout}
        handleDrawerToggle={handleDrawerToggle}
        setShowLandingAuthPopup={setShowLandingAuthPopup}
      />

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
            {/* Main Content Column */}
            <Grid item xs={12} md={8}>
              {/* Welcome Section */}
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
                  href='/user/jobsearch'
                >
                  Start your search
                </Button>
              </Paper>

              {/* Tasks Section */}
              <Paper sx={{
                p: 2,
                bgcolor: '#f5faff',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                mb: 3
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
            </Grid>

            {/* Coaching Section (Sidebar) */}
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
        </Container>
      )}

      {/* The CompleteProfilePopup will now open if the profile is incomplete */}
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