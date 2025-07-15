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
<<<<<<< HEAD
          <Typography variant="body1" sx={{ mr: 2 }}>User</Typography>
=======
          <Typography variant="body1" sx={{ mr: 2 }}></Typography>
>>>>>>> 5144e0a8de1c3954db6a94ee384fc0c8bd536c5a
          <Avatar src="https://i.pravatar.cc/300" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
