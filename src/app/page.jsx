'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import ProfileEdit from '../components/ProfilePopup';

export default function ResumeDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  // Fetch user data and resume
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const profileProgress = parseInt(localStorage.getItem('profileProgress') || '0', 10);
    const hasSeenPopup = localStorage.getItem('hasSeenProfilePopup') === 'true';

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setProgress(profileProgress);

      if (profileProgress <= 75 && !hasSeenPopup) {
        setShowPopup(true);
        localStorage.setItem('hasSeenProfilePopup', 'true');
      }

      // Example API: You should replace this with your actual API
      axios.get(`/api/resume/${user.id}`).then((res) => {
        setResumeData(res.data);
      }).catch((err) => {
        console.error('Failed to fetch resume:', err);
      });
    }
  }, []);

  const handleClosePopup = () => setShowPopup(false);

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      {currentUser && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            👋 Welcome, {currentUser.fullName || 'User'}!
          </Typography>
          <Typography color="textSecondary">
            Benefit from expert support and feedback during every step of your job search.
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Task Section */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tasks
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="textSecondary">
                Assessment
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                Continue job search assessment
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Learn how to improve your job search and get detailed feedback from a coach.
              </Typography>
              <Box mt={2} display="flex" alignItems="center">
                <Avatar
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Typography variant="body2">Susan Gray</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Resume
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                Expert resume review
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Get a free, confidential resume review.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Resume Summary Section */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resume Snapshot
              </Typography>
              <Divider sx={{ my: 2 }} />
              {resumeData ? (
                <Box>
                  <Typography><strong>Name:</strong> {resumeData.name}</Typography>
                  <Typography><strong>Email:</strong> {resumeData.email}</Typography>
                  <Typography><strong>Summary:</strong> {resumeData.summary}</Typography>
                </Box>
              ) : (
                <Typography color="textSecondary">Loading resume data...</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Circular Profile Progress */}
      {currentUser && (
        <Box mt={6} textAlign="center">
          <Typography variant="subtitle1" gutterBottom>
            Profile Completion: {progress}%
          </Typography>
          <Box display="inline-flex" position="relative">
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              thickness={5}
              sx={{ color: 'primary.main' }}
            />
            <Box
              position="absolute"
              top={0}
              bottom={0}
              left={0}
              right={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar
                src={currentUser.photoURL || ''}
                sx={{ width: 56, height: 56 }}
              >
                {currentUser.fullName?.[0]}
              </Avatar>
            </Box>
          </Box>
        </Box>
      )}

      {/* Popup if profile is incomplete */}
      <ProfileEdit open={showPopup} onClose={handleClosePopup} />
    </Container>
  );
}
