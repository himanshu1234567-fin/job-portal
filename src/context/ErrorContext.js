'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button, Box, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';

// Create the context that will be shared across components
const ErrorContext = createContext(undefined);

/**
 * The provider component that wraps your app. It manages the error state
 * and renders the popup when an error is set.
 */
export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  // A function that components can call to show an error popup
  const showError = useCallback((message, title = 'An Error Occurred') => {
    setError({ message, title });
  }, []);

  // Function to close the popup
  const handleClose = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <ErrorPopup
        open={!!error}
        title={error?.title || ''}
        message={error?.message || ''}
        handleClose={handleClose}
      />
    </ErrorContext.Provider>
  );
};

/**
 * A custom hook that components will use to easily access the showError function.
 */
export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

/**
 * The actual UI for the error popup dialog.
 */
const ErrorPopup = ({ open, handleClose, title, message }) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, y: -30, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 30, scale: 0.95 },
            transition: { duration: 0.3 },
            sx: { borderRadius: '16px', maxWidth: '450px', width: '100%' }
          }}
          BackdropProps={{ sx: { backdropFilter: 'blur(3px)' } }}
        >
          <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ErrorOutlineIcon color="error" sx={{ fontSize: '2rem' }} />
              <Typography variant="h6" component="div" fontWeight="bold">
                {title}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <Typography gutterBottom>
              {message}
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} variant="contained" color="primary" sx={{ borderRadius: '8px' }}>
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
