"use client";

import { Typography, Grid, Paper, Avatar, Button } from "@mui/material";

export default function Profile() {
  return (
    <div style={{ background: '#f6f8fa', minHeight: '100vh', padding: '32px' }}>
      <Paper elevation={0} sx={{ mb: 4, p: 3, borderRadius: 3, background: '#fff' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Candidate Management
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: '#fff' }}>
            <Avatar sx={{ bgcolor: '#1976d2', mx: 'auto', mb: 1 }}>
              <span role="img" aria-label="candidates">👤</span>
            </Avatar>
            <Typography variant="h6">Total Candidates</Typography>
            <Typography variant="h4" fontWeight={700}>248</Typography>
            <Typography variant="body2" color="success.main">+12.5%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: '#fff' }}>
            <Avatar sx={{ bgcolor: '#7c3aed', mx: 'auto', mb: 1 }}>
              <span role="img" aria-label="positions">💼</span>
            </Avatar>
            <Typography variant="h6">Active Positions</Typography>
            <Typography variant="h4" fontWeight={700}>15</Typography>
            <Typography variant="body2" color="success.main">+3</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: '#fff' }}>
            <Avatar sx={{ bgcolor: '#22c55e', mx: 'auto', mb: 1 }}>
              <span role="img" aria-label="hired">🧑‍💼</span>
            </Avatar>
            <Typography variant="h6">Hired This Month</Typography>
            <Typography variant="h4" fontWeight={700}>8</Typography>
            <Typography variant="body2" color="success.main">+2</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: '#fff' }}>
            <Avatar sx={{ bgcolor: '#f97316', mx: 'auto', mb: 1 }}>
              <span role="img" aria-label="interviews">📅</span>
            </Avatar>
            <Typography variant="h6">Interviews Today</Typography>
            <Typography variant="h4" fontWeight={700}>12</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: '#fff', mb: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Recent Activity
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight={500}>New candidate applied</Typography>
            <Typography variant="body2" color="text.secondary">Senior Frontend Developer · 2 minutes ago</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight={500}>Interview scheduled</Typography>
            <Typography variant="body2" color="text.secondary">Product Manager · 15 minutes ago</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight={500}>Candidate moved to final round</Typography>
            <Typography variant="body2" color="text.secondary">Data Scientist · 1 hour ago</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight={500}>New position created</Typography>
            <Typography variant="body2" color="text.secondary">DevOps Engineer · 2 hours ago</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" fontWeight={500}>Offer sent</Typography>
            <Typography variant="body2" color="text.secondary">UX Designer · 3 hours ago</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: '#fff' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Candidate Pipeline
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="outlined" sx={{ borderRadius: 2 }}>Applied</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="info" sx={{ borderRadius: 2 }}>Screening</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="warning" sx={{ borderRadius: 2 }}>Interview</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" sx={{ borderRadius: 2 }}>Final Round</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="success" sx={{ borderRadius: 2 }}>Offer</Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
