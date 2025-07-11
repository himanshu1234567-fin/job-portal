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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
];

export default function ResumeBuilder() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.location.reload();
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
              <ListItemText primary={`Welcome, ${currentUser.fullName}`} />
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
            <img
              alt="Logo"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              height={40}
            />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {navigation.map((item) => (
              <Button key={item.name} href={item.href} color="inherit">
                {item.name}
              </Button>
            ))}
            {currentUser ? (
              <>
                <Typography variant="body2" color="textPrimary">
                  Welcome, {currentUser.fullName}
                </Typography>
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
          {!currentUser && (
            <Button
              href="/sign"
              variant="contained"
              color="primary"
              size="large"
            >
              Get started
            </Button>
          )}
          <Button href="#" color="inherit" size="large">
            Learn more →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
