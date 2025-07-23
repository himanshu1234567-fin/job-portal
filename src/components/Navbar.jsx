'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, IconButton, Button, Typography, Box, Avatar, CircularProgress, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Jobs', href: '/user/jobsearch' },
  { name: 'Resume', href: '/user/ResumeBuilder' },
  { name: 'Coaching', href: '#' },
];

const ProfileAvatarWithProgress = ({ user, progress }) => {
  // Determines the color of the progress bar based on the percentage
  const getProgressColor = (progressValue) => {
    if (progressValue < 25) return '#d32f2f'; // Red for progress under 25%
    if (progressValue < 50) return '#fbc02d'; // Yellow for progress between 25% and 50%
    if (progressValue < 75) return '#ef6c00'; // Orange for progress between 50% and 75%
    return '#2e7d32'; // Green for progress 75% and above
  };

  const progressColor = getProgressColor(progress);

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
          bgcolor: 'primary.main', // Set to a consistent theme color
          fontSize: '0.875rem',
        }}
      >
        {user.fullName?.[0]}
      </Avatar>
      {progress < 100 && (
        <>
          {/* Background track for the progress bar */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={38}
            thickness={4}
            sx={{
              color: '#e0e0e0',
              position: 'absolute',
              top: -3,
              left: -3,
              zIndex: 0,
            }}
          />
          {/* Foreground progress bar */}
          <CircularProgress
            variant="determinate"
            value={progress}
            size={38}
            thickness={4}
            sx={{
              color: progressColor, // Apply the dynamic color
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
              color: progressColor, // Apply the dynamic color to the text as well
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

const Navbar = ({ currentUser, handleLogout, handleDrawerToggle, setShowLandingAuthPopup }) => {
  const [profileCompletePercent, setProfileCompletion] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    // Function to update profile progress from localStorage
    const updateProfileProgress = () => {
      if (currentUser && typeof window !== 'undefined') {
        const storedProgress = localStorage.getItem('profileCompletePercent');
        const progress = parseInt(storedProgress, 10) || 0;
        setProfileCompletion(progress);
        // Set the initial state of the tooltip
        if (progress > 0 && progress < 75) {
          setTooltipOpen(true);
        } else {
          setTooltipOpen(false);
        }
      } else {
        // If there's no user, reset the progress and close the tooltip
        setProfileCompletion(0);
        setTooltipOpen(false);
      }
    };

    updateProfileProgress();

    // This event listener will trigger when localStorage is changed from another tab/window
    const handleStorageChange = (event) => {
        if (event.key === 'profileCompletePercent') {
            updateProfileProgress();
        }
    };

    window.addEventListener('storage', handleStorageChange);

    // To handle same-page updates, we can use a custom event.
    // The component that updates the localStorage should dispatch this event.
    // Example: window.dispatchEvent(new Event("profileUpdated"));
    window.addEventListener('profileUpdated', updateProfileProgress);

    // Cleanup the event listeners when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', updateProfileProgress);
    };
  }, [currentUser]); // Rerun this effect if the user logs in or out

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  const handleTooltipClose = () => {
    // Only close the tooltip on mouse leave if it's not in the "always open" state
    if (!(profileCompletePercent > 0 && profileCompletePercent < 75)) {
      setTooltipOpen(false);
    }
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none' }}><img
            alt="Logo"
            src="https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg"
            height={40}
          /></a>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
          {navigation.map((item) => (
            <Button key={item.name} href={item.href} color="inherit">{item.name}</Button>
          ))}

          {currentUser ? (
            <>
              <Tooltip
                title={`Your profile is ${profileCompletePercent}% complete`}
                open={tooltipOpen}
                onOpen={handleTooltipOpen}
                onClose={handleTooltipClose}
                arrow
                placement="bottom"
              >
                <a href="/user/profile" style={{ textDecoration: 'none' }}>
                  <ProfileAvatarWithProgress user={currentUser} progress={profileCompletePercent} />
                </a>
              </Tooltip>
              <Button onClick={handleLogout} color="error">Logout</Button>
            </>
          ) : (
            <>
              <Button onClick={() => setShowLandingAuthPopup(true)} variant="contained">
                Log in/Sign up
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
  );
};

export default Navbar;
