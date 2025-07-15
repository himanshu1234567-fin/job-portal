"use client";

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

const users = [
  {
    id: "1",
    name: "Tushar Namdev",
    email: "tushar@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Rohit Verma",
    email: "rohit@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Anita Sharma",
    email: "anita@example.com",
    role: "HR",
    status: "Active",
  },
];

export default function Profile() {
  return (
    <div style={{ background: "#f6f8fa", minHeight: "100vh", padding: "32px" }}>
      {/* Dashboard Header */}
      <Paper elevation={0} sx={{ mb: 4, p: 3, borderRadius: 3, background: "#fff" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Candidate Management
        </Typography>
      </Paper>

      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: "Total Candidates",
            value: users.length.toString(),
            growth: `+${users.length * 5}%`,
            icon: "👤",
            bg: "#1976d2",
          },
          {
            label: "Active Positions",
            value: users.filter(user => user.status === "Active").length.toString(),
            growth: `+${users.filter(user => user.status === "Active").length * 2}%`,
            icon: "💼",
            bg: "#7c3aed",
          },

          {
            label: "Hired This Month",
            value: "0",
            growth: "+2",
            icon: "🧑‍💼",
            bg: "#22c55e",
          },
          {
            label: "Interviews Today",
            value: "12",
            icon: "📅",
            bg: "#f97316",
          },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background: "#fff",
              }}
            >
              <Avatar sx={{ bgcolor: stat.bg, mx: "auto", mb: 1 }}>
                <span role="img" aria-label="icon">
                  {stat.icon}
                </span>
              </Avatar>
              <Typography variant="h6">{stat.label}</Typography>
              <Typography variant="h4" fontWeight={700}>
                {stat.value}
              </Typography>
              {stat.growth && (
                <Typography variant="body2" color="success.main">
                  {stat.growth}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* User List Table with light heading & style */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: "#fff", mb: 4 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{ color: "#6b7280" }}
        >
          👥 User List
        </Typography>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ color: "#374151", fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: "#374151", fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: "#374151", fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ color: "#374151", fontWeight: 600 }}>Status</TableCell>
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
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: user.status === "Active" ? "green" : "red",
                        fontWeight: 500,
                      }}
                    >
                      {user.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent Activity */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: "#fff", mb: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          📌 Recent Activity
        </Typography>
        <Grid container spacing={2}>
          {[
            {
              title: "New candidate applied",
              subtitle: "Senior Frontend Developer · 2 minutes ago",
            },
            {
              title: "Interview scheduled",
              subtitle: "Product Manager · 15 minutes ago",
            },
            {
              title: "Candidate moved to final round",
              subtitle: "Data Scientist · 1 hour ago",
            },
            {
              title: "New position created",
              subtitle: "DevOps Engineer · 2 hours ago",
            },
            {
              title: "Offer sent",
              subtitle: "UX Designer · 3 hours ago",
            },
          ].map((item, i) => (
            <Grid item xs={12} key={i}>
              <Typography variant="body1" fontWeight={500}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.subtitle}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Candidate Pipeline */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: "#fff" }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          🧭 Candidate Pipeline
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: "Applied" },
            { label: "Screening", color: "info" },
            { label: "Interview", color: "warning" },
            { label: "Final Round", color: "secondary" },
            { label: "Offer", color: "success" },
          ].map((stage, i) => (
            <Grid item key={i}>
              <Button
                variant="outlined"
                color={stage.color || "primary"}
                sx={{ borderRadius: 2 }}
              >
                {stage.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
}
