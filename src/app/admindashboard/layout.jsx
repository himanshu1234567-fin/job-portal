'use client';

import { Box, CssBaseline } from '@mui/material';
import Sidebar from './sidebar';
//import Topbar from './topbar';

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* <Topbar /> */}
        {children}
      </Box>
    </Box>
  );
}
