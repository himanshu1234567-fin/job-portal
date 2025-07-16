'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function CompleteProfilePopup({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Congratulations!</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
            To get better job matches, Test yourself.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button href="/user/test" variant="contained" color="primary">
          Take Test
        </Button>
      </DialogActions>
    </Dialog>
  );
}
