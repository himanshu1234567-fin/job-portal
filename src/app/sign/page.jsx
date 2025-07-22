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
import { useRouter } from 'next/navigation';
<<<<<<< HEAD

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  signInEmail: '',
  signInPassword: '',
};
=======
>>>>>>> 9033fb1ca8285e267fab1623bdb9d651252c828f

export default function SignPage() {
  const [tab, setTab] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      return setError('Please fill all fields.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { user, token } = data;

      if (!user || !token) {
        throw new Error('Invalid response from server.');
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      localStorage.setItem('justSignedIn', 'true');

      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!signInEmail || !signInPassword) {
      return setError('Please enter both email and password.');
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { user, token } = data;

      if (!user || !token) {
        throw new Error('Invalid response from server.');
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      localStorage.setItem('justSignedIn', 'true');

      setSignInEmail('');
      setSignInPassword('');

      router.push('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {tab === 0 ? (
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
