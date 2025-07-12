// components/ProfileEdit.jsx
"use client";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";

export default function ProfileEdit() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    experience: "",
    skills: "",
  });

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (savedProfile) setProfile(savedProfile);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile saved locally!");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Edit Profile</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Full Name" name="name" fullWidth value={profile.name} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Email" name="email" fullWidth value={profile.email} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Phone" name="phone" fullWidth value={profile.phone} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Location" name="location" fullWidth value={profile.location} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Headline (e.g. Frontend Developer)" name="headline" fullWidth value={profile.headline} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Experience" name="experience" fullWidth value={profile.experience} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Skills (comma separated)" name="skills" fullWidth value={profile.skills} onChange={handleChange} />
        </Grid>
      </Grid>
      <Button onClick={handleSave} variant="contained" sx={{ mt: 3 }}>Save Profile</Button>
    </Box>
  );
}
