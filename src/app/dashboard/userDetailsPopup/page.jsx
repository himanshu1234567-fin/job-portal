'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from '@mui/material';

export default function UserDetailsModal({ isOpen, onClose, user }) {
  if (!user) return null;

  const getValue = (value) => {
    if (value == null) return '--';
    if (typeof value === 'object') return value.name ?? JSON.stringify(value);
    return value;
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Name:</strong> {getValue(user.name || user.fullName)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Email:</strong> {getValue(user.email)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Position:</strong> {getValue(user.desirableJob?.desirableJob)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Status:</strong> {getValue(user.status)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Test Score:</strong> {getValue(user.testScore?.points)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Payment Status:</strong> {getValue(user.paymentStatus)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Resume Status:</strong> {getValue(user.resumeStatus)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Experience:</strong> {getValue(user.experience)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Phone:</strong> {getValue(user.phone)}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
