'use client';

import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";

// Static user list (you can later replace with dynamic DB values)
const users = [
  {
    id: "1",
    name: "Tushar Namdev",
    email: "tushar@example.com",
    position: "Frontend Developer",
    status: "Active",
    experience: "2 years",
    profileCompletion: 80,
    testAssigned: "React Test",
    testScore: "7/10",
    resumeStatus: "Uploaded",
    paymentStatus: "Paid",
    hired : "Yes",
  },
  {
    id: "2",
    name: "Rohit Verma",
    email: "rohit@example.com",
    position: "Backend Developer",
    status: "Inactive",
    experience: "1 year",
    profileCompletion: 60,
    testAssigned: "Node.js Test",
    testScore: "5/10",
    resumeStatus: "Not Uploaded",
    paymentStatus: "Pending",
    hired : "No",
  },
  {
      id: "3",
    name: "Anita Sharma",
    email: "anita@example.com",
    position: "HR",
    status: "Active",
    experience: "3 years",
    profileCompletion: 90,
    testAssigned: "HR Basics",
    testScore: "9/10",
    resumeStatus: "Uploaded",
    paymentStatus: "Paid",
    hired : "Yes",
  },
  
    
];

export default function Profile() {
  const router = useRouter();
  const [testScore, setTestScore] = useState(null);

  useEffect(() => {
    const score = localStorage.getItem("testScore");
    if (score) {
      setTestScore(JSON.parse(score));
    }
  }, []);

  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh", padding: "32px" }}>
      {/* Dashboard Header */}
      <Paper elevation={0} sx={{ mb: 4, p: 3, borderRadius: 3, background: "#fff" }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" fontWeight={700}>
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Candidate Management
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => router.push("/admin/test")}>
              Add test
            </Button>
          </Grid>
        </Grid>
      </Paper>

      
      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: "Total Users",
            value: users.length.toString(),
            // growth: `+${users.length * 5}%`,
            icon: "👤",
            bg: "#0a0b0bff",
          },
          {
            label: "Resume generated",
            value: users.filter(user => user.resumeStatus === "Uploaded").length.toString(),
            // growth: `+${users.filter(user => user.resumeStatus === "Uploaded").length * 2}%`,
            icon: "💼",
            bg: "#0a0b0bff",
          },
          {
            label: "Payments completed",
            value: users.filter(user => user.paymentStatus === "Paid").length.toString(),
            // growth: "+2",
            icon: "💰",
            bg: "#0a0b0bff",
          },
          {
            label: "Pending payments",
            value: users.filter(user => user.paymentStatus === "Pending").length.toString(),
            icon: "⏳",
            bg: "#0a0b0bff",
          },
          {
            label: "Hired Candidates",
            value: users.filter(user => user.hired === "Yes").length.toString(),
            icon: "✅",
            bg: "#0a0b0bff",
          },  
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: "center", background: "#fff" }}>
              <Avatar sx={{ bgcolor: stat.bg, mx: "auto", mb: 1 }}>
                <span position="img" aria-label="icon">{stat.icon}</span>
              </Avatar>
              <Typography variant="h6">{stat.label}</Typography>
              <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
              {stat.growth && (
                <Typography variant="body2" color="success.main">{stat.growth}</Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* User List Table */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: "#fff", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#6b7280" }}>
          👥 User List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Test Score</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={user.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                    "&:hover": { backgroundColor: "#f3f4f6" },
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>
                    <Typography sx={{ color: user.status === "Active" ? "green" : "red", fontWeight: 500 }}>
                      {user.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {/* ✅ Show score for 1st user only as example */}
                    {user.id === "1" && testScore
                      ? `${testScore.score} / ${testScore.total}`
                      : "--"}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => alert(`User ID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\nPosition: ${user.position}\nStatus: ${user.status}\nTest Score: ${user.id === "1" && testScore ? `${testScore.score} / ${testScore.total}` : "--"}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

            {/* Active Positions Table */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: "#fff" }}>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#6b7280" }}>
          📌 Active Positions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Number of Active Users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...new Set(users
                .filter(user => user.status === "Active")
                .map(user => user.position)
              )].map((position, idx) => {
                const count = users.filter(user => user.status === "Active" && user.position === position).length;
                return (
                  <TableRow key={idx}>
                    <TableCell>{position}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

    </div>
  );
}
