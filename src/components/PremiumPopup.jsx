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
    title: 'BASIC',
    price: '₹599',
    priceNum: 599,
    color: ['#00c6ff', '#0072ff'],
    features: [true, false, true, false, true, false],
  },
  {
    title: 'STANDART',
    price: '₹699',
    priceNum: 699,
    color: ['#a044ff', '#6a3093'],
    features: [true, false, true, true, true, true],
  },
  {
    title: 'PREMIUM',
    price: '₹999',
    priceNum: 999,
    color: ['#ff4e50', '#f9d423'],
    features: [true, true, true, true, true, true],
  },
];

const featureLabels = [
  'Lorem ipsum dolor sit amet',
  'Consectetur adipiscing elit',
  'Euismod tincidunt ut',
  'Ut wisi enim ad minim',
  'Lorem ipsum dolor sit amet',
  'Consectetur adipiscing elit',
];


const PricingPopup = ({ open, handleClose }) => {

  // --- MODIFICATION: Helper function to dynamically load the Razorpay script ---
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
    // Load the script
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
      name: 'Your Company Name',
      description: `Purchase of ${plan.title} Plan`,
      image: 'https://example.com/your_logo.png',
      
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        handleClose();
      },
      prefill: {
        name: 'J. Smith',
        email: 'jsmith@example.com',
        contact: '9999999999',
      },
      notes: {
        plan_title: plan.title,
        address: 'Indore, Madhya Pradesh',
      },
      theme: {
        color: '#3399cc',
      },
    };

    // --- MODIFICATION: Ensure window.Razorpay exists before using it ---
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
          Choose Your Plan
        </Typography>
        <IconButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ borderRadius: 3, boxShadow: 3, p: 3, textAlign: 'center', backgroundColor: '#fff', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 20, left: -40, background: `linear-gradient(135deg, ${plan.color[0]}, ${plan.color[1]})`, color: '#fff', px: 6, py: 1, transform: 'rotate(-45deg)', fontWeight: 'bold' }}>
                  {plan.price}
                </Box>
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
                        {plan.features[i] ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="body2" color="text.secondary">{label}</Typography>} />
                    </ListItem>
                  ))}
                </List>
                <Button fullWidth variant="contained" onClick={() => displayRazorpay(plan)}
                  sx={{ mt: 2, background: `linear-gradient(to right, ${plan.color[0]}, ${plan.color[1]})`, color: '#fff', borderRadius: '20px', textTransform: 'none', fontWeight: 'bold' }}
                >
                  ORDER NOW
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PricingPopup;