"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "/src/components/Sidebar";
import CreativeUserHeader from "./UserHeader/page";

import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Data constants
const mockLevels = ["easy", "medium", "hard"];

const expertArticles = [
  {
    title: "Master React.js in 30 Days",
    author: "👩‍💻 Aarti Sharma",
    desc: "Kickstart your front-end journey with this complete React series.",
  },
  {
    title: "Backend Secrets You Must Know",
    author: "👨‍💻 Rahul Verma",
    desc: "Master REST APIs, databases, and Node.js best practices.",
  },
  {
    title: "Ace Your Technical Interviews",
    author: "👩‍💼 Meenal Sinha",
    desc: "Top 50 questions and tips to crack your next interview.",
  },
];

const preparationKits = [
  { name: "Frontend Dev Kit", tools: ["React", "HTML", "CSS", "JS"] },
  { name: "Backend Dev Kit", tools: ["Node.js", "Express", "MongoDB"] },
  { name: "DSA & Coding Kit", tools: ["Leetcode", "Codeforces", "Cheat Sheets"] },
];

export default function UserDashboardPage() {
  const [showAlert, setShowAlert] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    try {
      const profileComplete = JSON.parse(localStorage.getItem("profileComplete") || "false");
      if (!profileComplete) setShowAlert(true);
    } catch (error) {
      console.error("Failed to read profileComplete from localStorage", error);
    }
  }, []);

  const handleStartTest = () => {
    if (difficulty) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.push(`/user/test?level=${difficulty}`);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, px: 4, py: 3 }}>
        {/* Incomplete Profile Snackbar */}
        <Snackbar
          open={showAlert}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="warning"
            action={
              <Button size="small" onClick={() => router.push("/user/profile")}>
                Update Now
              </Button>
            }
          >
            Your profile is incomplete. Please update it.
          </Alert>
        </Snackbar>

        <CreativeUserHeader />

        {/* 🧪 Mock Test Section */}
        <Box sx={{ mt: 5 }}>
          <Paper
            sx={{
              width: "50%" ,
              p: 3,
              
              borderRadius: 3,
              background: "#f1f6fb",
              mx: "auto",
            }}
          >
            <Typography variant="h6" fontWeight={600} textAlign="center" mb={2}>
              Mock Test 🎯
            </Typography>
            <Typography textAlign="center" mb={2}>
              Choose difficulty level:
            </Typography>
            <ToggleButtonGroup
              value={difficulty}
              exclusive
              onChange={(e, val) => setDifficulty(val)}
              sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}
            >
              {mockLevels.map((level) => (
                <ToggleButton
                  key={level}
                  value={level}
                  sx={{ textTransform: "capitalize", px: 3 }}
                >
                  {level}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {difficulty && (
              <Box textAlign="center" mt={3}>
                <Button variant="contained" onClick={handleStartTest}>
                  Start Test
                </Button>
              </Box>
            )}
          </Paper>
        </Box>

        {/* 📚 Expert Learning Section */}
        <Box component="section" sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Learn from the Experts 📚
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Top insights, tutorials, and tips from tech professionals.
          </Typography>

          <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 1 }}>
            {expertArticles.map((item, index) => (
              <Paper
                key={index}
                sx={{
                  minWidth: 280,
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ my: 1 }}>
                  {item.desc}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  By {item.author}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* 🎒 Preparation Kits Section */}
        <Box component="section" sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Preparation Kits 🎒
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Download kits designed for every skill path.
          </Typography>

          <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 1 }}>
            {preparationKits.map((kit, i) => (
              <Paper key={i} sx={{ minWidth: 260, p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  {kit.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Includes: {kit.tools.join(", ")}
                </Typography>
                <Button variant="outlined" size="small">
                  Download
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
