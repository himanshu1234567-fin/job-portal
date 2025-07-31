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

// Rich helper to extract nested & formatted field values
const getValue = (user, key) => {
  if (!user) return '--';
  switch (key) {
    case 'name':
      return user.candidateId?.fullName || user.userId?.fullName || user.fullName || user.name || '--';
    case 'email':
      return user.candidateId?.email || user.userId?.email || user.email || '--';
    case 'position': {
      // Desirable job(s), show all as comma separated
      let arr = user.candidateId?.desirableJob ?? user.desirableJob;
      if (Array.isArray(arr) && arr.length > 0) return arr.join(', ');
      if (typeof arr === 'string') return arr;
      return '--';
    }
    case 'status':
      return user.status ?? '--';
    case 'testScore':
      return user.testScore?.points ?? '--';
    case 'paymentStatus':
      return user.paymentStatus ?? '--';
    case 'resumeStatus':
      return user.resumeStatus ?? '--';
    case 'experience': {
      // Prefer candidateId.experience, then top-level experience
      let expArr = user.candidateId?.experience || user.experience;
      if (Array.isArray(expArr) && expArr.length > 0) {
        // Summarize all jobs as "Role at Company (N years)" etc.
        return expArr
          .map(
            exp =>
              `${exp.role ?? '--'} at ${exp.companyName ?? '--'}${
                exp.years ? ' (' + exp.years + ' year' + (exp.years > 1 ? 's' : '') + ')' : ''
              }`
          )
          .join(', ');
      }
      // Fallback if a simple number
      if (typeof expArr === 'number' && !isNaN(expArr))
        return `${expArr} year${expArr > 1 ? 's' : ''}`;
      return '--';
    }
    case 'phone':
      return user.candidateId?.phone || user.userId?.phone || user.phone || '--';
    default:
      return '--';
  }
};

export default function UserDetailsModal({ isOpen, onClose, user }) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Name:</strong> {getValue(user, 'name')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Email:</strong> {getValue(user, 'email')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Position:</strong> {getValue(user, 'position')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Status:</strong> {getValue(user, 'status')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Test Score:</strong> {getValue(user, 'testScore')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Payment Status:</strong> {getValue(user, 'paymentStatus')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Resume Status:</strong> {getValue(user, 'resumeStatus')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Experience:</strong> {getValue(user, 'experience')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Phone:</strong> {getValue(user, 'phone')}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
