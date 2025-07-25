'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Tabs, Tab, Alert,
  Dialog, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function LandingAuthPopup({ open, onSuccess, onClose }) {
  const [tab, setTab] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  useEffect(() => {
    if (open) {
      setTab(0);
      setError('');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSignInEmail('');
      setSignInPassword('');
    }
  }, [open]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const completeLogin = () => {
    onSuccess();
    onClose();
    // Refresh the current route to reflect the new login state
    router.refresh();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword)
      return setError('Please fill all fields.');

    if (password !== confirmPassword)
      return setError('Passwords do not match.');

    try {
      // ✅ Use axios.post for a cleaner API call
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });

      const { user, token } = res.data; // Data is already parsed by axios
      if (!user || !token) throw new Error('Invalid response from server.');

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      completeLogin();
    } catch (err) {
      // ✅ Axios provides a more detailed error object
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!signInEmail || !signInPassword)
      return setError('Please enter both email and password.');

    try {
      // ✅ Use axios.post for a cleaner API call
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: signInEmail,
        password: signInPassword,
      });

      const { user, token } = res.data; // Data is already parsed by axios
      if (!user || !token) throw new Error('Invalid response from server.');

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      completeLogin();
    } catch (err) {
      // ✅ Axios provides a more detailed error object
      setError(err.response?.data?.message || err.message || 'Login failed.');
    }
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6" align="center">
          {tab === 0 ? 'Sign In' : 'Sign Up'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {tab === 0 ? (
          <Box component="form" onSubmit={handleSignIn} sx={{ mt: 2 }}>
            <TextField fullWidth label="Email" type="email" margin="normal"
              value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} />
            <TextField fullWidth label="Password" type="password" margin="normal"
              value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Sign In
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSignUp} sx={{ mt: 2 }}>
            <TextField fullWidth label="Full Name" margin="normal"
              value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <TextField fullWidth label="Email" type="email" margin="normal"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField fullWidth label="Password" type="password" margin="normal"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <TextField fullWidth label="Confirm Password" type="password" margin="normal"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}