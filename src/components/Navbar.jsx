'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, IconButton, Button, Typography, Box, Avatar,
  CircularProgress, Tooltip, Drawer, List, ListItem, ListItemButton,
  ListItemText, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Jobs', href: '/user/jobsearch' },
  { name: 'Resume', href: '/user/ResumeBuilder' },
  { name: 'Courses', href: '/user/courses' },
];

const ProfileAvatarWithProgress = ({ user, progress }) => {
  const getProgressColor = (value) => {
    if (value < 25) return '#d32f2f';
    if (value < 50) return '#fbc02d';
    if (value < 75) return '#ef6c00';
    return '#2e7d32';
  };

  const progressColor = getProgressColor(progress);

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', '&:hover .progress-percent': { opacity: 1 } }}>
      <Avatar
        alt={user.fullName}
        sx={{
          width: 36,
          height: 36,
          bgcolor: 'primary.main',
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
            sx={{
              color: '#e0e0e0',
              position: 'absolute',
              top: -3,
              left: -3,
              zIndex: 0,
            }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={42}
            thickness={4}
            sx={{
              color: progressColor,
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
              color: progressColor,
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

const Navbar = ({ currentUser, handleLogout, setShowLandingAuthPopup }) => {
  const [profileCompletePercent, setProfileCompletion] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const updateProfileProgress = () => {
      if (currentUser && typeof window !== 'undefined') {
        const storedProgress = localStorage.getItem('profileCompletePercent');
        const progress = parseInt(storedProgress, 10) || 0;
        setProfileCompletion(progress);
        setTooltipOpen(progress > 0 && progress < 75);
      } else {
        setProfileCompletion(0);
        setTooltipOpen(false);
      }
    };

    updateProfileProgress();
    window.addEventListener('storage', (e) => {
      if (e.key === 'profileCompletePercent') updateProfileProgress();
    });
    window.addEventListener('profileUpdated', updateProfileProgress);

    return () => {
      window.removeEventListener('storage', updateProfileProgress);
      window.removeEventListener('profileUpdated', updateProfileProgress);
    };
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
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
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

          {/* Navigation with animated active underline */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center', position: 'relative' }}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Box key={item.name} sx={{ position: 'relative' }}>
                  <Button
                    href={item.href}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      color: isActive ? 'primary.main' : 'text.primary',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      style={{
                        height: 3,
                        borderRadius: 2,
                        background: '#1976d2',
                        position: 'absolute',
                        bottom: 4,
                        left: 12,
                        right: 12,
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
                  onClose={() => {
                    if (!(profileCompletePercent > 0 && profileCompletePercent < 75)) {
                      setTooltipOpen(false);
                    }
                  }}
                  arrow
                  placement="bottom"
                >
                  <a href="/user/profile" style={{ textDecoration: 'none' }}>
                    <ProfileAvatarWithProgress user={currentUser} progress={profileCompletePercent} />
                  </a>
                </Tooltip>
                <Button
                  onClick={handleLogout}
                  color="error"
                  sx={{
                    ml: 1,
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 500
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowLandingAuthPopup(true)}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 500
                }}
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
        PaperProps={{
          sx: { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;