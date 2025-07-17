'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, sleek, and modern layout suited for tech roles.',
    preview: '/preview-modern.png',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout ideal for government or academic jobs.',
    preview: '/preview-classic.png',
  },
];

const plans = [
  { id: 'plan1', name: '₹99 - 5 Resumes (14 Days)', price: 9900, limit: 5, validityDays: 14 },
  { id: 'plan2', name: '₹199 - 10 Resumes (28 Days)', price: 19900, limit: 10, validityDays: 28 },
  { id: 'plan3', name: '₹499 - 50 Resumes (6 Months)', price: 49900, limit: 50, validityDays: 180 },
  { id: 'plan4', name: '₹999 - Unlimited Resumes (1 Year)', price: 99900, limit: Infinity, validityDays: 365 },
];

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const testScore = 80;

  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      router.push('/user/profile');
    }
  }, []);

  useEffect(() => {
    if (profile && testScore < 75) {
      router.push('/user/profile');
    }
  }, [profile]);

  const handlePreview = () => {
    if (!selectedTemplate) return alert('Select a template');
    setShowPreview(true);
  };

  const handleDownload = () => {
    if (!selectedTemplate) return alert('Please select a template first');
    setShowPlans(true);
  };

  const handlePlanPayment = async () => {
    if (!selectedPlan) return alert('Please select a plan');

    try {
      const { data } = await axios.post('/api/payment', { amount: selectedPlan.price });

      const options = {
        key: 'RAZORPAY_KEY', // Replace with your actual Razorpay key
        amount: data.amount,
        currency: 'INR',
        name: 'AI Resume Builder',
        description: selectedPlan.name,
        order_id: data.id,
        handler: function (response) {
          setIsPaid(true);
          alert('Payment Successful! Resume is downloading...');
          window.open(`/api/download?template=${selectedTemplate}`, '_blank');
          setShowPlans(false);
        },
        prefill: {
          name: profile?.name || '',
          email: profile?.email || '',
          contact: profile?.phone || '',
        },
        theme: {
          color: '#1976d2',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  if (!profile) return <Typography>Loading Profile...</Typography>;

  return (
    <Box p={4}>
      {/* Back Button */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => router.push('/user/Userdashboard')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" ml={1}>
          Back to Dashboard
        </Typography>
      </Box>

      {/* Template Selection */}
      <Typography variant="h4" gutterBottom>
        Choose Resume Template
      </Typography>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} key={template.id}>
            <Card
              onClick={() => setSelectedTemplate(template.id)}
              sx={{
                border: selectedTemplate === template.id ? '2px solid #1976d2' : '1px solid #ccc',
                cursor: 'pointer',
                transition: '0.3s',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={template.preview}
                alt={template.name}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  {template.name}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  {template.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Button variant="outlined" onClick={handlePreview} sx={{ mr: 2 }}>
          Preview Resume
        </Button>
        <Button variant="contained" color="success" onClick={handleDownload}>
          Download Resume
        </Button>
      </Box>

      {/* Resume Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Resume Preview</DialogTitle>
        <DialogContent dividers>
          <Box p={2}>
            <Typography variant="h5">{profile.name}</Typography>
            <Typography>
              {profile.email} | {profile.phone}
            </Typography>
            <Typography>DOB: {profile.dob}</Typography>

            <Box mt={2}>
              <Typography variant="h6">Education</Typography>
              <Typography>
                10th: {profile.education.tenth_board} - {profile.education.tenth}%
              </Typography>
              <Typography>
                12th: {profile.education.twelfth_board} - {profile.education.twelfth}%
              </Typography>
              <Typography>
                Graduation: {profile.education.graduation.Graducation} in{' '}
                {profile.education.graduation.branch} from{' '}
                {profile.education.graduation.collage_name} (
                {profile.education.graduation.year}) - CGPA:{' '}
                {profile.education.graduation.CGPA}
              </Typography>
            </Box>

            <Box mt={2}>
              <Typography variant="h6">Skills</Typography>
              <Typography>{profile.skills?.join(', ') || 'None'}</Typography>
            </Box>

            <Box mt={2}>
              <Typography variant="h6">Experience</Typography>
              <Typography>{profile.experience || 'Not Provided'}</Typography>
            </Box>

            <Box mt={2}>
              <Typography variant="h6">Desired Jobs</Typography>
              <Typography>{profile.desiredJobs?.join(', ') || 'Not Set'}</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Plan Selection Dialog */}
      <Dialog open={showPlans} onClose={() => setShowPlans(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select a Resume Plan</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {plans.map((plan) => (
              <Grid item xs={12} key={plan.id}>
                <Card
                  onClick={() => setSelectedPlan(plan)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedPlan?.id === plan.id ? '2px solid #1976d2' : '1px solid #ccc',
                  }}
                >
                  <Typography variant="subtitle1">{plan.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {plan.limit === Infinity
                      ? 'Unlimited Resumes'
                      : `${plan.limit} Resume Downloads`}{' '}
                    | Valid for {plan.validityDays} days
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={handlePlanPayment} disabled={!selectedPlan}>
              Proceed to Pay
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
