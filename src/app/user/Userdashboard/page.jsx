"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreativeUserHeader from "./UserHeader/page";
import Sidebar from "/src/components/Sidebar";

import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Button,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from "@mui/material";

export default function UserDashboardPage() {
  const [showAlert, setShowAlert] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const router = useRouter();

  useEffect(() => {
    const profileComplete = JSON.parse(localStorage.getItem("profileComplete"));
    const progress = JSON.parse(localStorage.getItem("profileProgress")) || 0;

    if (profileComplete === false || profileComplete === null) {
      setShowAlert(true);
    }

    setProfileProgress(progress);
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const goToProfile = () => {
    router.push("/user/profile");
  };

  const handleStartTest = () => {
    if (difficulty) {
      router.push(`/user/mock-test?level=${difficulty}`);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, px: 4, py: 3 }}>
        {/* Alert */}
        <Snackbar
          open={showAlert}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="warning"
            sx={{ width: "100%" }}
            action={
              <Button color="inherit" size="small" onClick={goToProfile}>
                Update Now
              </Button>
            }
          >
            Your profile is incomplete. Please update it.
          </Alert>
        </Snackbar>

        {/* Header */}
        <CreativeUserHeader />

        {/* Profile Progress */}
        {/* <Box my={3}>
          <Typography variant="subtitle1" gutterBottom>
            Profile Completion: {profileProgress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={profileProgress}
            sx={{ height: 10, borderRadius: 5 }}
            color={profileProgress === 100 ? "success" : "primary"}
          />
        </Box> */}

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
          <Link href="/dashboard/preferences" passHref>
            <Typography sx={{ cursor: "pointer", fontWeight: 500 }}>
              Preferences
            </Typography>
          </Link>
          <Link href="/dashboard/saved-jobs" passHref>
            <Typography sx={{ cursor: "pointer", fontWeight: 500 }}>
              Saved Jobs
            </Typography>
          </Link>
          <Link href="/dashboard/applications" passHref>
            <Typography sx={{ cursor: "pointer", fontWeight: 500 }}>
              Applications
            </Typography>
          </Link>
          <Link href="/dashboard/settings" passHref>
            <Typography sx={{ cursor: "pointer", fontWeight: 500 }}>
              Settings
            </Typography>
          </Link>
        </Box>
{/* 👇 Stylish Mock Test Blog Section */}
{/* 👇 Stylish Mock Test Blog Section (Left Aligned) */}
<Paper
  elevation={3}
  sx={{
    mt: 4,
    p: 3,
    borderRadius: 4,
    maxWidth: 400,
    ml: 2, 
    backgroundColor: "#f5f9ff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.48)",
  }}
>
  <Typography
    variant="h6"
    gutterBottom
    sx={{ fontWeight: 600, color: "#333", textAlign: "center" }}
  >
   Mock Test 🎯
  </Typography>

  <Typography
    variant="body1"
    sx={{ textAlign: "center", mb: 2, color: "#666" }}
  >
    Choose difficulty level:
  </Typography>

  <ToggleButtonGroup
    color="primary"
    value={difficulty}
    exclusive
    onChange={(e, newDiff) => setDifficulty(newDiff)}
    sx={{
      display: "flex",
      justifyContent: "center",
      gap: 1,
      flexWrap: "wrap",
    }}
  >
    {["easy", "medium", "hard"].map((level) => (
      <ToggleButton
        key={level}
        value={level}
        sx={{
          borderRadius: "20px",
          textTransform: "capitalize",
          px: 3,
          py: 1,
          fontWeight: 500,
          border: `1px solid #ccc`,
          "&.Mui-selected": {
            backgroundColor: "#4caf50",
            color: "#fff",
            borderColor: "#4caf50",
          },
        }}
      >
        {level}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>

  {difficulty && (
    <Box mt={3} textAlign="center">
      <Button
        variant="contained"
        color="success"
        onClick={handleStartTest}
        sx={{
          px: 4,
          py: 1,
          borderRadius: "20px",
          textTransform: "capitalize",
          fontWeight: "bold",
          boxShadow: "0 3px 6px rgba(0, 128, 0, 0.3)",
          transition: "0.3s",
          "&:hover": {
            backgroundColor: "#388e3c",
          },
        }}
      >
        Start
      </Button>
    </Box>
  )}
</Paper>


      </Box>
    </Box>
  );
}
