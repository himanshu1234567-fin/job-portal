'use client';

import React, { useState } from 'react';
import {
  Button,
  Divider,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PremiumPopup from './PremiumPopup'; // Import the new popup

const ApplyPopup = ({ open, handleClose }) => {
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  const handleSkip = () => {
    setShowPremiumPopup(true);
    handleClose(); // Close the current popup
  };

  const handleClosePremiumPopup = () => {
    setShowPremiumPopup(false);
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Increase your chances by 78% to get invited for an interview
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 3 }}>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              mb: 2, 
              py: 1.5,
              backgroundColor: '#166534', 
              '&:hover': {
                backgroundColor: '#14532d'
              }
            }}
            href='/user/ResumeBuilder'
          >
            Tailor your resume in minutes
          </Button>
          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">or</Typography>
          </Divider>
          <Button variant="outlined" fullWidth sx={{ py: 1.5 }} onClick={handleSkip}>
            Skip to application
          </Button>
        </DialogContent>
      </Dialog>
      <PremiumPopup open={showPremiumPopup} handleClose={handleClosePremiumPopup} />
    </>
  );
};

export default ApplyPopup;
