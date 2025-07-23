'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';

const features = [
    {
        icon: <TrackChangesIcon color="primary" />,
        title: 'JobTracker',
        description: 'Never miss a relevant job with over 4,00,000 sources available',
        subDescription: 'Access every job from 46,018+ headhunters'
    },
    {
        icon: <PeopleIcon color="primary" />,
        title: 'Headhunter',
        description: 'Connect with all relevant headhunters in your field'
    },
    {
        icon: <SchoolIcon color="primary" />,
        title: 'Coaching',
        description: 'Access all Job-seeker MasterClasses created by career experts',
        subDescription: 'Attend all webinars to learn about every aspect of a successful job search'
    },
    {
        icon: <ArticleIcon color="primary" />,
        title: 'Career Guides',
        description: 'Unlimited access to guides, workbooks, and powerful templates'
    }
];

const PremiumPopup = ({ open, handleClose }) => {
  const [selectedValue, setSelectedValue] = React.useState('190');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Become a Premium Member to get instant access to all features
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
          14-day full access
        </Typography>
        <RadioGroup value={selectedValue} onChange={handleChange}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              borderColor: selectedValue === '190' ? 'primary.main' : 'grey.300',
              borderWidth: 2,
            }}
            onClick={() => setSelectedValue('190')}
          >
            <FormControlLabel
              value="190"
              control={<Radio />}
              label={
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ₹190.00
                </Typography>
              }
            />
            <Box>
                <Chip label="MOST POPULAR" color="warning" size="small" sx={{ mr: 1, fontWeight: 'bold' }} />
                <Typography variant="body2" component="span">14-day full access</Typography>
            </Box>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              borderColor: selectedValue === '6490' ? 'primary.main' : 'grey.300',
              borderWidth: 2,
            }}
            onClick={() => setSelectedValue('6490')}
          >
            <FormControlLabel
              value="6490"
              control={<Radio />}
              label={
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ₹6,490.00
                </Typography>
              }
            />
            <Typography variant="body2">3-month access</Typography>
          </Paper>
        </RadioGroup>
        <Button variant="contained" fullWidth sx={{ py: 1.5, mb: 2, backgroundColor: '#2e7d32', '&:hover': {backgroundColor: '#1b5e20'} }}>
          Continue
        </Button>
        <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f5f5f5', textAlign: 'center', mb: 3 }}>
            <Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>OUR GUARANTEE</Typography>
            <Typography variant="body2">Try for 14 days and if you're not 100% satisfied, get your money back.</Typography>
        </Paper>

        <Grid container spacing={3}>
            {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{display: 'flex', alignItems: 'start'}}>
                        <Box sx={{mr: 1.5, mt: 0.5}}>{feature.icon}</Box>
                        <Box>
                            <Typography sx={{fontWeight: 'bold'}}>{feature.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                            {feature.subDescription && <Typography variant="caption" color="text.secondary">{feature.subDescription}</Typography>}
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>

        <Button variant="contained" fullWidth sx={{ py: 1.5, mt: 3, backgroundColor: '#2e7d32', '&:hover': {backgroundColor: '#1b5e20'} }}>
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumPopup;
