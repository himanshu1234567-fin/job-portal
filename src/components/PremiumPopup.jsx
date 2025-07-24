'use client';

import React from 'react';
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
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (plan) => {
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const amountInPaise = plan.priceNum * 100;

    const options = {
      key: 'rzp_test_PBUluwX3e15zwd', // Your test API key
      amount: amountInPaise,
      currency: 'INR',
      name: 'Resume.io',
      description: `Purchase of ${plan.title} Plan`,
      image: 'https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg',
      
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        handleClose();
      },
      prefill: {
        name: 'Your Name',
        email: 'your@email.com',
        contact: '9999999999',
      },
      notes: {
        plan_title: plan.title,
      },
      theme: {
        color: '#3399cc',
      },
    };

    try {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    } catch (error) {
        console.error(error);
        alert("An error occurred while opening the payment gateway.");
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
                borderRadius: 3, 
                boxShadow: 3, 
                p: 3, 
                textAlign: 'center', 
                backgroundColor: '#fff', 
                position: 'relative', 
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ 
                  position: 'absolute', 
                  top: 20, 
                  left: -40, 
                  background: `linear-gradient(135deg, ${plan.color[0]}, ${plan.color[1]})`, 
                  color: '#fff', 
                  px: 6, 
                  py: 1, 
                  transform: 'rotate(-45deg)', 
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
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
                  onClick={() => displayRazorpay(plan)}
                  sx={{ 
                    mt: 2, 
                    background: `linear-gradient(to right, ${plan.color[0]}, ${plan.color[1]})`, 
                    color: '#fff', 
                    borderRadius: '20px', 
                    textTransform: 'none', 
                    fontWeight: 'bold',
                    py: 1.5
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