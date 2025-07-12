"use client";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "Swarup Choudhary",
    email: "admin@example.com",
    role: "Super Admin",
    avatar: "/admin-avatar.png",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedAdmin, setEditedAdmin] = useState({ ...admin });

  const handleChange = (e) => {
    setEditedAdmin({ ...editedAdmin, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setAdmin({ ...editedAdmin });
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Profile
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={admin.avatar}
                sx={{ width: 100, height: 100, bgcolor: deepPurple[500] }}
              />
            </Grid>
            <Grid item xs>
              {isEditing ? (
                <>
                  <TextField
                    name="name"
                    label="Name"
                    fullWidth
                    value={editedAdmin.name}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    value={editedAdmin.email}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <Typography variant="h6">{admin.name}</Typography>
                  <Typography variant="body1">{admin.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Role: {admin.role}
                  </Typography>
                </>
              )}
            </Grid>
            <Grid item>
              {isEditing ? (
                <Box>
                  <Button variant="contained" onClick={handleSave} sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4" color="primary">328</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Products Managed</Typography>
            <Typography variant="h4" color="secondary">147</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Orders Processed</Typography>
            <Typography variant="h4" color="success.main">89</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminProfile;
