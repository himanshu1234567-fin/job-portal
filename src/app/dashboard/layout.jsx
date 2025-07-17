'use client';

import { useState } from 'react';
import {
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  AppBar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';

const drawerWidth = 240;

export default function PageLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar with toggle width */}
      <Sidebar open={sidebarOpen} />

      {/* Topbar */}
      <AppBar
        position="fixed"
        sx={{
          background: '#fff',
          color: '#000',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleToggleSidebar} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: sidebarOpen ? `${drawerWidth}px` : '0px',
          transition: 'margin 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
