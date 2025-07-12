'use client';

import { AppBar, Toolbar, Typography } from '@mui/material';

export default function Topbar() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Candidate Life Cycle Admin Panel
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
