'use client';

import React from 'react';
import axios from 'axios'; // ✅ Import axios for API calls
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Link,
  Rating,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import HttpsIcon from '@mui/icons-material/Https';
import { useError } from '../context/ErrorContext'; // ✅ 1. Import the useError hook

// Utility function to load the Razorpay SDK script asynchronously
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


const PaymentPopup = ({ open, onClose }) => {
  const { showError } = useError(); // ✅ 2. Instantiate the hook
  const amount = '190.00'; // The amount for the initial 14-day access

  /**
   * ✅ 3. Refactor the payment logic to be secure and robust
   * This function now:
   * - Loads the Razorpay SDK safely.
   * - Creates a payment order on your server to prevent tampering.
   * - Verifies the payment on your server after completion.
   * - Uses the `showError` popup for all potential errors.
   */
  const displayRazorpay = async () => {
    // Load the Razorpay SDK
    const sdkReady = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!sdkReady) {
      showError('Failed to load payment gateway. Please check your connection.', 'SDK Error');
      return;
    }

    try {
      // Step 1: Create the payment order on your server
      const { data: order } = await axios.post(
        'http://localhost:5000/api/payment/create-order', // Replace with your actual endpoint
        { amount: parseFloat(amount) },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      // Step 2: Configure Razorpay checkout options with data from your server
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_PBUluwX3e15zwd',
        amount: order.amount, // Amount from the server (in paise)
        currency: order.currency,
        name: 'Your Company Name',
        description: '14-Day Full Access Plan',
        order_id: order.id, // Order ID from the server
        image: 'https://example.com/your_logo.png',

        // Step 3: Set up the payment handler for success
        handler: async function (response) {
          try {
            // Step 4: Verify the payment on your server
            const { data: verifyRes } = await axios.post(
              'http://localhost:5000/api/payment/verify', // Replace with your actual endpoint
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
            alert(verifyRes.message || 'Payment successful and verified!');
            onClose();
          } catch (err) {
            const errorMessage = err.response?.data?.message || 'Payment verification failed. Please contact support.';
            showError(errorMessage, 'Verification Failed');
          }
        },
        prefill: {
          name: 'J. Smith',
          email: 'jsmith@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Indore, Madhya Pradesh',
        },
        theme: {
          color: '#3399cc',
        },
      };

      // Step 5: Open the Razorpay payment modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Could not initiate payment. Please try again.';
      showError(errorMessage, 'Payment Error');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#f8f9fa',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onClose} sx={{ textTransform: 'none' }}>
          Previous page
        </Button>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
        <Box sx={{ bgcolor: 'white', p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Payment details:
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            14-day full access
          </Typography>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
              <Typography>14-day full access</Typography>
              <Typography>₹{amount}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
              <Typography fontWeight="bold">Total amount</Typography>
              <Typography fontWeight="bold">₹{amount}</Typography>
            </Box>
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LockIcon />}
            onClick={displayRazorpay} // The onClick now calls our new secure function
            sx={{
              mt: 4,
              py: 1.5,
              bgcolor: '#192a56',
              '&:hover': {
                bgcolor: '#101c3d',
              },
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Pay ₹{amount} with Razorpay
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 2, color: 'text.secondary' }}>
            <HttpsIcon fontSize="small" />
            <Typography variant="caption">
              Your payment is made via a secure 128-bit SSL connection.
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 3 }}>
          By clicking the purchase button above, you hereby agree to be charged INR {amount} now and accept our{' '}
          <Link href="#" underline="always" color="primary">Terms of Use and Rights of Cancellation</Link> and{' '}
          <Link href="#" underline="always" color="primary">Privacy Policy</Link>.
          You will be billed INR 2,990.00 after 14 days and every four weeks after that until your subscription ends, which you can cancel at any time.
        </Typography>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">OUR GUARANTEE</Typography>
            <Typography variant="body2" color="text.secondary">
                Try for 14 days and if you're not 100% satisfied, get your money back.
            </Typography>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Typography fontWeight="bold" color="#00b67a">★ Trustpilot</Typography>
            <Rating name="read-only" value={4.5} precision={0.5} readOnly />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            JobLeads is rated 4.5 out of 5.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPopup;