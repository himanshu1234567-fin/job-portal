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

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  signInEmail: '',
  signInPassword: '',
};

export default function SignPage() {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword)
      return setError('Please fill all fields.');

    if (password !== confirmPassword)
      return setError('Passwords do not match.');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
      });

      const { user, token } = res;
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      localStorage.setItem('justSignedIn', 'true');

      setFormData(initialForm);
      router.push('/');
    } catch (err) {
      setError(err?.message || 'Registration failed');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { signInEmail, signInPassword } = formData;

    if (!signInEmail || !signInPassword)
      return setError('Please enter both email and password.');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });

      const { user, token } = res;
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      localStorage.setItem('justSignedIn', 'true');

      setFormData(initialForm);
      router.push('/');
    } catch (err) {
      setError(err?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Box textAlign="center" mb={4}>
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
            name="signInEmail"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={formData.signInEmail}
            onChange={handleChange}
          />
          <TextField
            name="signInPassword"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={formData.signInPassword}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Sign In
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1 }}>
          <TextField
            name="fullName"
            margin="normal"
            required
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <TextField
            name="email"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="password"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            name="confirmPassword"
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Sign Up
          </Button>
        </Box>
      )}
    </Container>
  );
}
