'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function CompleteProfilePopup({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Complete your profile</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          To get better job matches, please complete your profile.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button href="/user/profile" variant="contained" color="primary">
          Go to Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
}
