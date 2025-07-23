

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box, // Import Box for easier spacing
} from '@mui/material';

// Helper component for displaying user details neatly
const DetailItem = ({ label, value }) => (
  <Typography variant="body1" sx={{ mb: 1 }}>
    <Box component="span" sx={{ fontWeight: 'fontWeightMedium' }}>
      {label}:
    </Box>{' '}
    {value || 'N/A'}
  </Typography>
);

export default function UserDetailsModal({ isOpen, onClose, user }) {
  // We still return null if there's no user, to avoid errors on first render
  if (!user) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      // These props make the dialog look better on different screen sizes
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle variant="h5" sx={{ fontWeight: 'bold' }}>
        Candidate Details
      </DialogTitle>

      <DialogContent dividers> {/* 'dividers' adds a nice top/bottom border */}
        <DetailItem label="Name" value={user.name} />
        <DetailItem label="Email" value={user.email} />
        <DetailItem label="Applying For" value={user.desirableJob?.desirableJob} />
        <DetailItem label="Experience" value={user.experience?.years} />
        <DetailItem label="Test Score" value={user.testScore ? `${user.testScore.points}%` : null} />
        <DetailItem label="Resume Status" value={user.resumeStatus} />
        <DetailItem label="Payment Status" value={user.paymentStatus} />
        <DetailItem label="Hired" value={user.hired} />
      </DialogContent>

      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}