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
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function UserDashboardPage() {
  const [showAlert, setShowAlert] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const profileComplete = JSON.parse(localStorage.getItem("profileComplete"));
    if (!profileComplete) setShowAlert(true);
  }, []);

  const handleStartTest = () => {
    if (difficulty) router.push(`/user/mock-test?level=${difficulty}`);
  };

  const pricingPlans = [
    {
      title: "Personal Plan",
      subtitle: "For you",
      price: "₹500 per month",
      features: [
        "Access to 26,000+ top courses",
        "Certification prep",
      ],
      buttonText: "Start subscription",
    },
    {
      title: "Team Plan",
      subtitle: "For your team (2 to 20 people)",
      price: "₹2,000 a month per user",
      features: [
        "Access to 13,000+ top courses",
        "Certification prep",
        "Goal-focused recommendations",
        "AI-powered coding exercises",
        "Analytics and adoption reports",
      ],
      buttonText: "Start subscription",
    },
    {
      title: "Enterprise Plan",
      subtitle: "More than 20 people",
      price: "Contact sales for pricing",
      features: [
        "Access to 30,000+ top courses",
        "Certification prep",
        "Goal-focused recommendations",
        "AI-powered coding exercises",
        "Advanced analytics and insights",
        "Dedicated customer success team",
        "International course collection featuring 15 languages",
        "Customizable content",
        "Hands-on tech training with add-on",
        "Strategic implementation services with add-on",
      ],
      buttonText: "Request a demo",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, px: 4, py: 3 }}>
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

        {/* Top Section: Mock Test + Pricing Dropdown */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
            mt: 5,
            flexWrap: "nowrap",
            alignItems: "flex-start",
          }}
        >
          {/* Mock Test */}
          <Paper sx={{ width: "50%", p: 3, borderRadius: 3, background: "#f1f6fb" }}>
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
              {["easy", "medium", "hard"].map((level) => (
                <ToggleButton key={level} value={level} sx={{ textTransform: "capitalize" }}>
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

          {/* Pricing Plans Dropdown */}
          <Box sx={{ width: "60%", display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" fontWeight={600} textAlign="center">
              Choose a plan for success
            </Typography>

            <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#fafafa" }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {pricingPlans[0].title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pricingPlans[0].subtitle}
              </Typography>
              <Typography variant="h6" mt={1}>
                {pricingPlans[0].price}
              </Typography>
              <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                {pricingPlans[0].features.map((feat, i) => (
                  <li key={i}>
                    <Typography variant="body2">{feat}</Typography>
                  </li>
                ))}
              </ul>
              <Box mt={2}>
                <Button variant="contained" fullWidth>
                  {pricingPlans[0].buttonText}
                </Button>
              </Box>

              <Box mt={1} textAlign="center">
                <Button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  endIcon={dropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  {dropdownOpen ? "Hide other plans" : "Show other plans"}
                </Button>
              </Box>

              <Collapse in={dropdownOpen}>
                {pricingPlans.slice(1).map((plan, idx) => (
                  <Paper
                    key={idx}
                    sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: "#f0f0f0" }}
                  >
                    <Typography variant="subtitle1" fontWeight={700}>
                      {plan.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.subtitle}
                    </Typography>
                    <Typography variant="h6" mt={1}>
                      {plan.price}
                    </Typography>
                    <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                      {plan.features.map((feat, i) => (
                        <li key={i}>
                          <Typography variant="body2">{feat}</Typography>
                        </li>
                      ))}
                    </ul>
                    <Box mt={2}>
                      <Button variant="contained" fullWidth>
                        {plan.buttonText}
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Collapse>
            </Paper>
          </Box>
        </Box>

        {/* Learn from the Experts */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Learn from the Experts 📚
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Top insights, tutorials, and tips from tech professionals.
          </Typography>

          <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 1 }}>
            {[
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
            ].map((item, index) => (
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

        {/* Preparation Kits */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Preparation Kits 🎒
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Download kits designed for every skill path.
          </Typography>

          <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 1 }}>
            {[
              { name: "Frontend Dev Kit", tools: ["React", "HTML", "CSS", "JS"] },
              { name: "Backend Dev Kit", tools: ["Node.js", "Express", "MongoDB"] },
              { name: "DSA & Coding Kit", tools: ["Leetcode", "Codeforces", "Cheat Sheets"] },
            ].map((kit, i) => (
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
