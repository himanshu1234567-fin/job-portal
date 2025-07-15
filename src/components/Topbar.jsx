"use client"
import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";

export default function Topbar() {
  return (
    <AppBar position="static" color="primary" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          User Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 2 }}>Sonalika</Typography>
          <Avatar src="https://i.pravatar.cc/300" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
