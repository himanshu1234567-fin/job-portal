'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tabs,
  Tab,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Fab,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BusinessIcon from '@mui/icons-material/Business';

// Main component for the Job Search Page
const JobSearchPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [detailTab, setDetailTab] = useState(0); // State for the new tabs
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleDetailTabChange = (event, newIndex) => {
    setDetailTab(newIndex);
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Search Filters Section */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                defaultValue="Frontend engineer"
                placeholder="Job title or keyword"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                   endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
               <TextField
                fullWidth
                variant="outlined"
                defaultValue="Indore District"
                placeholder="Location or zip code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src="https://flagcdn.com/w20/in.png" width="20" alt="India Flag"/>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <Select defaultValue="on-site" IconComponent={ArrowDropDownIcon}>
                  <MenuItem value="on-site">On-site</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <Select defaultValue="" displayEmpty IconComponent={ArrowDropDownIcon}>
                  <MenuItem value="" disabled>Salary range</MenuItem>
                  <MenuItem value="1">₹3L - ₹6L</MenuItem>
                  <MenuItem value="2">₹6L - ₹10L</MenuItem>
                  <MenuItem value="3">₹10L - ₹15L</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="primary" sx={{ flexGrow: 1, py: 1.5 }} aria-label="search">
                  <SearchIcon />
                </Button>
                <IconButton sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px' }} aria-label="filters">
                  <TuneIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="job search tabs">
            <Tab label="Search" />
            <Tab label="Bookmarked (1)" />
            <Tab label="Applied jobs (0)" />
            <Tab label="Not interested (0)" />
          </Tabs>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column: Job List */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">1 results | <Button variant="text" size="small" sx={{textTransform: 'none'}}>Save search</Button></Typography>
                <Button variant="text" size="small" sx={{textTransform: 'none'}}>Saved searches (1)</Button>
            </Box>
            <Paper elevation={2} sx={{ p: 2, borderRadius: '12px', border: '2px solid', borderColor: 'primary.main' }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <Typography variant="h6" fontWeight="bold">ROR Developer</Typography>
                        <Typography variant="body2" color="text.secondary">For Premium Members only</Typography>
                    </div>
                    <Box>
                        <IconButton size="small"><BookmarkBorderIcon /></IconButton>
                        <IconButton size="small"><VisibilityOffIcon /></IconButton>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
                    <Chip label="Indore" size="small" />
                    <Chip label="On-site" size="small" />
                    <Chip label="INR 675,000 - 900,000" size="small" />
                    <Chip label="Full time" size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">30+ days ago</Typography>
            </Paper>
          </Grid>

          {/* Right Column: Job Details, Resume Promo, and Tabbed Info */}
          <Grid item xs={12} md={7}>
             <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
                {/* Job Details Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold">ROR Developer</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small"><BookmarkBorderIcon /></IconButton>
                        <Button variant="contained" color="primary">Apply now</Button>
                    </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>For Premium Members only</Typography>
                <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
                    <Chip label="Indore" />
                    <Chip label="On-site" />
                    <Chip label="INR 675,000 - 900,000" />
                    <Chip label="Full time" />
                </Box>
                <Typography variant="body2" color="text.secondary">30+ days ago</Typography>
                
                <Divider sx={{ my: 3 }} />

                {/* Generate Resume Promo Section */}
                <Box sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f0f4ff' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                               <img src="https://i.imgur.com/H40p0tV.png" alt="Resume icon" width={64} height={64} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" fontWeight="bold">Generate a tailored resume in minutes</Typography>
                            <Typography variant="body2">Land an interview and earn more. <Button variant="text" size="small" sx={{textTransform: 'none', p:0}}>Learn more</Button></Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ textAlign: isMobile ? 'center' : 'right' }}>
                            <Button variant="outlined">Generate a resume</Button>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Tabbed Info Section */}
                <Box>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={detailTab} onChange={handleDetailTabChange} aria-label="job detail tabs">
                            <Tab label="Job summary" sx={{textTransform: 'none'}} />
                            <Tab label="About the company" sx={{textTransform: 'none'}} />
                            <Tab label="Recruiter" sx={{textTransform: 'none'}} />
                        </Tabs>
                    </Box>

                    {/* Tab Content */}
                    <Box sx={{ pt: 3 }}>
                        {detailTab === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                              An established industry player in the BPO sector is seeking a skilled Ruby on Rails developer to join their dynamic team in Indore. This role is pivotal in managing server-side logic and ensuring seamless data interchange between users and the server. You'll have the opportunity to work with cutting-edge technologies, tackle complex challenges, and contribute to the development of high-performance applications. If you are passionate about coding and eager to make a significant impact in a rapidly growing company, this position offers an exciting chance to elevate your career while working in a collaborative environment.
                            </Typography>
                        )}
                        {detailTab === 1 && (
                            <Box>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.light' }}>
                                        <BusinessIcon />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold">BPO Sector Leader Inc.</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    We are a leading firm in the business process outsourcing industry with over 20 years of experience. Our company prides itself on innovation, efficiency, and a client-first approach. We have a global presence with offices in 5 countries and a team of over 5,000 dedicated professionals.
                                </Typography>
                            </Box>
                        )}
                        {detailTab === 2 && (
                             <Box>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <Avatar sx={{ width: 56, height: 56, mr: 2 }} alt="Recruiter Name" src="/static/images/avatar/1.jpg" />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Jane Doe</Typography>
                                        <Typography variant="body2" color="text.secondary">Senior Technical Recruiter</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    Jane has been with the company for 5 years, specializing in sourcing top talent for our technology departments. She is passionate about connecting skilled developers with exciting opportunities.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Floating Feedback Button */}
        <Fab 
            color="primary" 
            aria-label="feedback" 
            sx={{ 
                position: 'fixed', 
                bottom: 40, 
                right: isMobile? 16 : 40,
                transform: 'rotate(-90deg)',
                transformOrigin: 'bottom right',
                borderRadius: '8px 8px 0 0',
                height: 'auto',
                width: 'auto',
                px: 2,
                py: 1
            }}
        >
            <MessageIcon sx={{transform: 'rotate(90deg)', mr: 1}}/>
            <Typography sx={{textTransform: 'none'}}>Feedback</Typography>
        </Fab>
      </Container>
    </Box>
  );
};

export default JobSearchPage;
