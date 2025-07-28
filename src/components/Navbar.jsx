'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, IconButton, Button, Typography, Box, Avatar,
  CircularProgress, Tooltip, Drawer, List, ListItem, ListItemButton,
  ListItemText, Divider, Skeleton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Jobs', href: '/user/jobsearch' },
  { name: 'Resume', href: '/user/ResumeBuilder' },
  { name: 'Courses', href: '/user/courses' },
];

// Skeleton component for the Navbar loading state
const NavbarSkeleton = () => (
  <AppBar
    position="static"
    color="transparent"
    elevation={1}
    sx={{ px: 2, py: 0.5 }}
  >
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: '8px' }} />
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
        <Skeleton variant="text" width={60} height={30} />
        <Skeleton variant="text" width={60} height={30} />
        <Skeleton variant="text" width={60} height={30} />
        <Skeleton variant="text" width={60} height={30} />
        <Skeleton variant="rounded" width={150} height={40} sx={{ ml: 2 }} />
      </Box>
      <Skeleton variant="circular" width={24} height={24} sx={{ display: { md: 'none' } }} />
    </Toolbar>
  </AppBar>
);


const ProfileAvatarWithProgress = ({ user, progress }) => {
  // This function determines the color of the progress ring based on the percentage
  const getProgressColor = (value) => {
    if (value < 25) return '#d32f2f'; // red
    if (value < 50) return '#fbc02d'; // yellow
    if (value < 75) return '#808000'; // olive
    return '#2e7d32'; // green
  };

  const progressColor = getProgressColor(progress);

  // ✅ NEW: State to hold the random avatar color.
  // The function runs only once on mount to generate a color.
  const [avatarColor] = useState(() => {
    const initialProgressColor = getProgressColor(progress);

    const generateRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    let newColor;
    // ✅ NEW LOGIC: Loop to ensure the avatar color is never the same as the progress color.
    do {
      newColor = generateRandomColor();
    } while (newColor.toLowerCase() === initialProgressColor.toLowerCase());

    return newColor;
  });

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', '&:hover .progress-percent': { opacity: 1 } }}>
      <Avatar
        alt={user.fullName}
        sx={{
          width: 36,
          height: 36,
          // Use the guaranteed unique random color from state
          bgcolor: avatarColor,
          fontSize: '0.875rem',
          boxShadow: 2
        }}
      >
        {user.fullName?.[0]}
      </Avatar>
      {progress < 100 && (
        <>
          <CircularProgress
            variant="determinate"
            value={100}
            size={42}
            thickness={4}
            sx={{ color: '#e0e0e0', position: 'absolute', top: -3, left: -3, zIndex: 0 }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={42}
            thickness={4}
            sx={{ color: progressColor, position: 'absolute', top: -3, left: -3, zIndex: 1 }}
          />
          <Box
            className="progress-percent"
            sx={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: progressColor, fontSize: '0.6rem', fontWeight: 'bold',
              opacity: 0, transition: 'opacity 0.3s',
            }}
          >
            {progress}%
          </Box>
        </>
      )}
    </Box>
  );
};

const Navbar = ({ currentUser, handleLogout, handleLoginSuccess, setShowLandingAuthPopup }) => {
  const [profileCompletePercent, setProfileCompletion] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setAuthLoading(false);
  }, []);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = async (credentials) => {
    setIsLoggingIn(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      handleLoginSuccess(data);

    } catch (error) {
      console.error('Error logging in:', error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      handleLogout();

    } catch (error) {
      console.error('Error logging out:', error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      if (!currentUser) {
        setProfileCompletion(0);
        setTooltipOpen(false);
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/candidates/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && typeof response.data.profileCompletion !== 'undefined') {
          const progress = response.data.profileCompletion;
          setProfileCompletion(progress);
          setTooltipOpen(progress > 0 && progress < 75);
        }
      } catch (error) {
        console.error("Failed to fetch profile completion:", error);
        setProfileCompletion(0);
      }
    };

    fetchProfileCompletion();
  }, [currentUser]);

  const drawerContent = (
    <Box sx={{ width: 260, py: 2 }} onClick={handleDrawerToggle}>
      <List>
        {navigation.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component="a" href={item.href}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      {currentUser ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/user/profile">
              <ListItemText primary={`Profile (${profileCompletePercent}%)`} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogoutClick} disabled={isLoggingOut}>
              <ListItemText primary={isLoggingOut ? 'Logging out...' : 'Logout'} />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setShowLandingAuthPopup(true)}>
              <ListItemText primary="Log in / Sign up" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );
  
  if (authLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={1}
        sx={{ px: 2, py: 0.5, backdropFilter: 'blur(6px)' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <img
              alt="Logo"
              src="https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg"
              height={40}
              style={{ borderRadius: '8px' }}
            />
          </a>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center', position: 'relative' }}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Box key={item.name} sx={{ position: 'relative' }}>
                  <Button
                    href={item.href}
                    sx={{
                      textTransform: 'none', fontWeight: 500, borderRadius: 2, px: 2, py: 1,
                      color: isActive ? 'primary.main' : 'text.primary',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                    }}
                  >
                    {item.name}
                  </Button>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      style={{
                        height: 3, borderRadius: 2, background: '#1976d2',
                        position: 'absolute', bottom: 4, left: 12, right: 12,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Box>
              );
            })}

            {currentUser ? (
              <>
                <Tooltip
                  title={`Your profile is ${profileCompletePercent}% complete`}
                  open={tooltipOpen}
                  onOpen={() => setTooltipOpen(true)}
                  onClose={() => { if (!(profileCompletePercent > 0 && profileCompletePercent < 75)) { setTooltipOpen(false); }}}
                  arrow
                  placement="bottom"
                >
                  <a href="/user/profile" style={{ textDecoration: 'none' }}>
                    <ProfileAvatarWithProgress user={currentUser} progress={profileCompletePercent} />
                  </a>
                </Tooltip>
                <Button
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut}
                  color="error"
                  sx={{ ml: 1, textTransform: 'none', borderRadius: 2, fontWeight: 500, minWidth: '90px' }}
                >
                  {isLoggingOut ? <CircularProgress size={24} color="inherit" /> : 'Logout'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowLandingAuthPopup(true)}
                variant="contained"
                sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 500 }}
              >
                Log in / Sign up
              </Button>
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

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;