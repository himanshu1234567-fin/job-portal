import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Divider,
  Link,
  Rating,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import HttpsIcon from '@mui/icons-material/Https';

const PaymentPopup = ({ open, onClose }) => {
  const amount = '190.00';
  const amountInPaise = parseFloat(amount) * 100;

  const displayRazorpay = async () => {
    const options = {
      // --- MODIFICATION: Your test API key has been added ---
      key: 'rzp_test_PBUluwX3e15zwd', 
      amount: amountInPaise,
      currency: 'INR',
      name: 'Your Company Name',
      description: '14-Day Full Access Plan',
      image: 'https://example.com/your_logo.png',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        onClose();
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

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
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
            onClick={displayRazorpay}
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