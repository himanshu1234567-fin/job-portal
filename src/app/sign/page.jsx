'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignPage() {
  const [tab, setTab] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();

  // Sign Up state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });

      const { user, token } = res.data;

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      localStorage.setItem('justSignedIn', 'true');

      setError('');
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email: signInEmail,
        password: signInPassword,
      });

      const { user, token } = res.data;

      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      localStorage.setItem('justSignedIn', 'true');

      router.push('/');
    } catch (err) {
      console.log('Login Error:', err.response?.data);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {tab === 0 ? 'Sign In' : 'Sign Up'}
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {tab === 0 ? (
        // Sign In Form
        <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
            Sign In
          </Button>
        </Box>
      ) : (
        // Sign Up Form
        <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
            Sign Up
          </Button>
        </Box>
      )}
    </Container>
  );
}
