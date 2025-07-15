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
  Paper,
  Divider,
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
    <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Admin Profile
      </Typography>

      <Card sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={3} sx={{ textAlign: "center" }}>
            <Avatar
              src={admin.avatar}
              sx={{ width: 120, height: 120, mx: "auto", bgcolor: deepPurple[500] }}
            />
            <Typography variant="body2" color="text.secondary" mt={1}>
              {admin.role}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={editedAdmin.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editedAdmin.email}
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                <Typography variant="h6">{admin.name}</Typography>
                <Typography variant="body1" mb={1}>{admin.email}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {admin.role}
                </Typography>
              </>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
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
      </Card>

      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Total Users
            </Typography>
            <Typography variant="h4" color="primary">328</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Products Managed
            </Typography>
            <Typography variant="h4" color="secondary">147</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Orders Processed
            </Typography>
            <Typography variant="h4" color="success.main">89</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminProfile;
