'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

  // showError now accepts an optional 'action' object.
  const showError = useCallback((message, title = 'An Error Occurred', action = null) => {
    setError({ message, title, action });
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
        action={error?.action || null}
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
const ErrorPopup = ({ open, handleClose, title, message, action }) => {
  // This handler executes the custom action's onClick function.
  const handleActionClick = () => {
    if (action && typeof action.onClick === 'function') {
      action.onClick();
    }
    handleClose(); // Also close the dialog after the action is performed
  };

  // ✅ MODIFICATION: Conditionally show the icon based on the title.
  const showIcon = title !== 'Profile Not Found';

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
              {/* ✅ MODIFICATION: Icon is now rendered conditionally */}
              {showIcon && <ErrorOutlineIcon color="error" sx={{ fontSize: '2rem' }} />}
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
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              {action && (
                <Button onClick={handleActionClick} variant="contained" color="primary" sx={{ borderRadius: '8px' }}>
                  {action.text}
                </Button>
              )}
              <Button 
                onClick={handleClose} 
                variant={action ? "outlined" : "contained"} 
                color="secondary" 
                sx={{ borderRadius: '8px' }}
              >
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};