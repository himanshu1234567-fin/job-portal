'use client';

import React from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { useError } from '../context/ErrorContext'; // ✅ 1. Import the useError hook

// This function can be placed outside the component or in a utils file
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const plans = [
  {
    title: 'ESSENTIAL',
    price: '₹499',
    priceNum: 499,
    color: ['#00c6ff', '#0072ff'],
    features: [true, true, false, false, true, false],
  },
  {
    title: 'PROFESSIONAL',
    price: '₹899',
    priceNum: 899,
    color: ['#a044ff', '#6a3093'],
    features: [true, true, true, true, true, false],
  },
  {
    title: 'EXECUTIVE',
    price: '₹1499',
    priceNum: 1499,
    color: ['#ff4e50', '#f9d423'],
    features: [true, true, true, true, true, true],
  },
];

const featureLabels = [
  'Multiple Resume Templates',
  'PDF Download',
  'ATS-Friendly Formatting',
  'Cover Letter Builder',
  'Unlimited Edits',
  'Priority Customer Support',
];

const PricingPopup = ({ open, handleClose }) => {
  const { showError } = useError(); // ✅ 2. Instantiate the hook

  const handlePayment = async (plan) => {
    const amount = plan.priceNum;
    if (amount <= 0) {
      showError('Invalid plan price!', 'Configuration Error');
      return;
    }

    const sdkReady = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!sdkReady) {
      // ✅ 3. Replace alert with showError for a consistent UX
      showError('Failed to load payment gateway. Please check your internet connection and try again.', 'Network Error');
      return;
    }

    try {
      // Create the order on your server
      const { data: order } = await axios.post(
        'http://localhost:5000/api/admin-dashboard/make-payment',
        { amount: amount, currency: 'INR', receipt: `receipt_${Date.now()}` },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      // Setup Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_PBUluwX3e15zwd',
        amount: order.amount,
        currency: order.currency,
        name: 'Your Company Name', // Replace with your company name
        description: `${plan.title} Plan Payment`,
        order_id: order.id,
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userContact') || '',
        },
        notes: {
            plan_title: plan.title,
        },
        theme: {
            color: '#3399cc',
        },
        // Handler function called on successful payment
        handler: async (response) => {
          try {
            // Send only the fields required by the verifyPayment controller.
            const { data: verifyRes } = await axios.post(
              'http://localhost:5000/api/admin-dashboard/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
              }
            );
            console.log('Payment verification success');
            console.log('Payment verification response:', verifyRes);
            alert(verifyRes.message || 'Payment verified successfully!');
            handleClose(); // Close the popup on success
          } catch (error) {
            console.error('Error verifying payment:', error);
            // ✅ 4. Replace alert with showError in the verification catch block
            const errorMessage = error.response?.data?.message || 'Payment verification failed. Please contact support.';
            showError(errorMessage, 'Verification Failed');
          }
        },
      };

      // Open Razorpay checkout
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment Error:', error);
      // ✅ 5. Replace alert with showError in the main payment catch block
      const errorMessage = error.response?.data?.message || 'Could not initiate payment. Please try again later.';
      showError(errorMessage, 'Payment Error');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Choose Your Resume Plan
        </Typography>
        <IconButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{
                borderRadius: 3, boxShadow: 3, p: 3, textAlign: 'center',
                backgroundColor: '#fff', position: 'relative', overflow: 'hidden',
                height: '100%', display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box sx={{
                  position: 'absolute', top: 20, left: -40,
                  background: `linear-gradient(135deg, ${plan.color[0]}, ${plan.color[1]})`,
                  color: '#fff', px: 6, py: 1, transform: 'rotate(-45deg)',
                  fontWeight: 'bold', fontSize: '0.8rem'
                }}>
                  {plan.price}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                    {plan.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    PER MONTH
                  </Typography>
                  <List dense>
                    {featureLabels.map((label, i) => (
                      <ListItem key={i} disableGutters>
                        <ListItemIcon>
                          {plan.features[i] ?
                            <CheckCircleIcon color="success" fontSize="small" /> :
                            <CancelIcon color="error" fontSize="small" />
                          }
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body2" color="text.secondary">{label}</Typography>} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handlePayment(plan)}
                  sx={{
                    mt: 2,
                    background: `linear-gradient(to right, ${plan.color[0]}, ${plan.color[1]})`,
                    color: '#fff', borderRadius: '20px', textTransform: 'none',
                    fontWeight: 'bold', py: 1.5
                  }}
                >
                  GET STARTED
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            14-day money back guarantee • Cancel anytime
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PricingPopup;