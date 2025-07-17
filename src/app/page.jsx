'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CompleteProfilePopup from '../components/PopupCard';

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
];

export default function ResumeBuilder() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const justSignedIn = localStorage.getItem('justSignedIn');
    const popupDismissed = localStorage.getItem('profilePopupDismissed');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);

      if (justSignedIn === 'true') {
        localStorage.removeItem('justSignedIn');
        localStorage.removeItem('profilePopupDismissed'); // reset dismissal
        setShowPopup(true);
      } else if (!popupDismissed) {
        setShowPopup(true);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('profilePopupDismissed');
    setCurrentUser(null);
    window.location.reload();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem('profilePopupDismissed', 'true');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <img
          alt="Logo"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          height={32}
        />
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navigation.map((item) => (
          <ListItem button key={item.name} component="a" href={item.href}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
        {currentUser ? (
          <>
            <ListItem>
              <Box position="relative" display="inline-flex" marginRight={2}>
                <CircularProgress
                  variant="determinate"
                  value={progress}
                  size={44}
                  thickness={4}
                  sx={{ color: 'primary.main' }}
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Avatar
                    alt={currentUser.fullName}
                    src={currentUser.photoURL || ''}
                    sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                  >
                    {currentUser.fullName?.[0]}
                  </Avatar>
                </Box>
              </Box>
              <ListItemText primary={currentUser.fullName} />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem button component="a" href="/sign">
            <ListItemText primary="Log in / Sign Up" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <a href="/">
              <img
                alt="Logo"
                src="https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg"
                height={40}
                className="w-16"
              />
            </a>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
            {navigation.map((item) => (
              <Button key={item.name} href={item.href} color="inherit">
                {item.name}
              </Button>
            ))}
            {currentUser ? (
              <>
                <Tooltip title={`${currentUser.fullName} (${progress}%)`}>
                  <Box position="relative" display="inline-flex">
                    <CircularProgress
                      variant="determinate"
                      value={progress}
                      size={40}
                      thickness={4}
                      sx={{ color: 'primary.main' }}
                    />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      position="absolute"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <a href="/user/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Avatar
                          alt={currentUser.fullName}
                          src={currentUser.photoURL || ''}
                          sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                        >
                          {currentUser.fullName?.[0]}
                        </Avatar>
                      </a>
                    </Box>
                  </Box>
                </Tooltip>
                <Button color="error" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button href="/sign" color="primary" variant="outlined">
                Log in / Sign Up
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
      >
        {drawer}
      </Drawer>

      <Container maxWidth="md" sx={{ mt: 12, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Start Your Career
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Build a Resume/CV in 5 minutes.
        </Typography>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          {!currentUser ? (
            <Button href="/sign" variant="contained" color="primary" size="large">
              Get started
            </Button>
          ) : (
            <Button href="/user/test" variant="contained" color="success" size="large">
              Take Test
            </Button>
          )}
          <Button href="#" color="inherit" size="large">
            Learn more →
          </Button>
        </Box>
      </Container>

      <CompleteProfilePopup open={showPopup} onClose={handleClosePopup} />
    </Box>
  );
}
