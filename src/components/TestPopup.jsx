'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function TestPopup({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Congratulations!</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
            To get better job matches, Test yourself.<br />
            If you perform test your resume will be more attractive to employers.
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
