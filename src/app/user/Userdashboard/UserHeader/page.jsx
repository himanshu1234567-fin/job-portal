"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Badge,
  LinearProgress,
  Menu,
  Divider,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EditIcon from "@mui/icons-material/Edit";

export default function CreativeUserHeader() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileProgress, setProfileProgress] = useState(0);
  const [user, setUser] = useState({ name: "", email: "" });
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Fetch profile progress from localStorage
  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem("profileProgress")) || 0;
    setProfileProgress(progress);
  }, []);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/candidates/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setUser({
          name: data.fullName || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
          color: "#fff",
          p: 4,
          borderRadius: "20px",
          boxShadow: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Welcome back, {user.name || "User"} 👋
          </Typography>
          {profileProgress === 100 ? (
  <Typography variant="body1" mt={1}>
    🎉 Your profile is fully completed!
  </Typography>
) : (
  <Typography variant="body1" mt={1}>
    You are just {100 - profileProgress}% away from profile completion.
  </Typography>
)}

        </Box>

        <Box textAlign="right">
          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
            <Badge badgeContent={2} color="error">
              <NotificationsIcon sx={{ fontSize: 28, color: "#fff" }} />
            </Badge>
            <IconButton onClick={handleClick}>
              <Avatar sx={{ bgcolor: "#fff", color: "#1976d2" }}>
                {user.name ? user.name[0] : "U"}
              </Avatar>
            </IconButton>
          </Box>

          <Box mt={1} textAlign="right">
            <Typography variant="body2" sx={{ color: "#fff" }}>
              Profile Completion
            </Typography>
            <LinearProgress
              variant="determinate"
              value={profileProgress}
              sx={{
                width: 180,
                height: 8,
                borderRadius: 5,
                mt: 0.5,
                backgroundColor: "#90caf9",
              }}
              color={profileProgress === 100 ? "success" : "primary"}
            />
            <Typography variant="caption" fontWeight="bold" sx={{ color: "#fff" }}>
              {profileProgress}%
            </Typography>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ elevation: 4, sx: { width: 320, borderRadius: 2, p: 2 } }}
      >
        <Box display="flex" gap={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
            {user.name ? user.name[0] : "U"}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {user.name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email || "example@email.com"}
            </Typography>
          </Box>
        </Box>

        <Box mt={2}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Profile Completion
          </Typography>
          <LinearProgress
            variant="determinate"
            value={profileProgress}
            sx={{ height: 8, borderRadius: 4 }}
            color={profileProgress === 100 ? "success" : "primary"}
          />
          <Typography
            variant="body2"
            color="primary"
            mt={0.5}
            fontWeight="bold"
            textAlign="right"
          >
            {profileProgress}%
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Link href="/user/profile" passHref>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<EditIcon />}
            onClick={handleClose}
          >
            Edit Your Profile
          </Button>
        </Link>
      </Menu>
    </Box>
  );
}
