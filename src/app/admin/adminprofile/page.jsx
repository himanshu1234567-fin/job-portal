"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
<<<<<<< HEAD
  Paper,
  Divider,
=======
  IconButton,
>>>>>>> 5179fbaf5d8775956b4b494e2f2465524e80c8cc
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { PhotoCamera } from "@mui/icons-material";

const AdminProfile = () => {
  const fileInputRef = useRef(null);
  const [mounted, setMounted] = useState(false); // ✅ Avoid hydration error

  const defaultAvatar = "/admin-avatar.png";

  const [admin, setAdmin] = useState({
    name: "Swarup Choudhary",
    email: "admin@example.com",
    phone: "+91 ",
    role: "Super Admin",
    avatar: defaultAvatar,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedAdmin, setEditedAdmin] = useState({ ...admin });

  useEffect(() => {
    setMounted(true); // ✅ Ensure code below runs only on client
  }, []);

  const handleChange = (e) => {
    setEditedAdmin({ ...editedAdmin, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setAdmin({ ...editedAdmin });
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditedAdmin({ ...editedAdmin, avatar: imageUrl });
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  if (!mounted) return null; // ✅ Prevent mismatch during hydration

  return (
<<<<<<< HEAD
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
=======
    <Box sx={{   mt: 0, pt: 0, px: { xs: 2, md: 4 }, maxWidth: "1000px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Admin Profile
      </Typography>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box position="relative" display="inline-block">
                <Avatar
                  src={editedAdmin.avatar || defaultAvatar}
                  alt="Admin Avatar"
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: deepPurple[500],
                    fontSize: 40,
                  }}
                >
                  {editedAdmin.avatar === defaultAvatar &&
                    admin.name.charAt(0)}
                </Avatar>

                <IconButton
                  color="primary"
                  onClick={triggerFileSelect}
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    width: 28,
                    height: 28,
                  }}
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </Box>
            </Grid>

            <Grid item xs>
              {isEditing ? (
                <>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={editedAdmin.name}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={editedAdmin.email}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Phone Number"
                    name="phone"
                    fullWidth
                    value={editedAdmin.phone}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <Typography variant="h6">{admin.name}</Typography>
                  <Typography variant="body1">{admin.email}</Typography>
                  <Typography variant="body1">{admin.phone}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Role: {admin.role}
                  </Typography>
                </>
              )}
            </Grid>

            <Grid item>
              {isEditing ? (
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ mr: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </Grid>
>>>>>>> 5179fbaf5d8775956b4b494e2f2465524e80c8cc
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
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
<<<<<<< HEAD
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
=======
        {[
          { label: "Total Users", value: 328, color: "primary" },
          { label: "Products Managed", value: 147, color: "secondary" },
          { label: "Orders Processed", value: 89, color: "success.main" },
        ].map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderLeft: `6px solid`,
                borderColor: item.color,
                height: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {item.label}
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: item.color, fontWeight: "bold" }}
              >
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
>>>>>>> 5179fbaf5d8775956b4b494e2f2465524e80c8cc
      </Grid>
    </Box>
  );
};

export default AdminProfile;
