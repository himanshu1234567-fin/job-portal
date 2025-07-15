'use client';

import { useState } from 'react';
import { Box, CssBaseline, IconButton, Toolbar, AppBar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './sidebar';

export default function PageLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar controlled by hamburger */}
      <Sidebar open={sidebarOpen} onClose={handleToggleSidebar} />

      {/* Topbar with hamburger */}
      <Box sx={{ flexGrow: 1 }}>
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
            <IconButton edge="start" color="inherit" onClick={handleToggleSidebar}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={600}>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
