import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  IconButton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function Form() {
  const [activeTab, setActiveTab] = useState('signIn');
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      router.push('/');
    }
  }, [router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (signUpPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      await axios.post('http://localhost:5000/api/register', {
        fullName,
        email: signUpEmail,
        password: signUpPassword,
      });

      localStorage.setItem('currentUser', JSON.stringify({ fullName, email: signUpEmail }));
      setError('');
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email: signInEmail,
        password: signInPassword,
      });

      localStorage.setItem('currentUser', JSON.stringify(res.data.user));
      setError('');
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8, position: 'relative' }}>
      {/* Back Arrow */}
      <IconButton
        onClick={() => router.push('/')}
        sx={{ position: 'absolute', top: 16, left: 16 }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Sign In" value="signIn" />
          <Tab label="Sign Up" value="signUp" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {activeTab === 'signIn' && (
          <Box component="form" onSubmit={handleSignIn} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              fullWidth
              required
            />
            <Button variant="contained" type="submit" fullWidth>
              Sign In
            </Button>
          </Box>
        )}

        {activeTab === 'signUp' && (
          <Box component="form" onSubmit={handleSignUp} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
            />
            <Button variant="contained" type="submit" fullWidth>
              Sign Up
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
