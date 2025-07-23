'use client';

import React, { useState, useEffect } from 'react';
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
  Avatar,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Filled icon
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BusinessIcon from '@mui/icons-material/Business';
import { useRouter } from 'next/navigation';
import ApplyPopup from '../../../components/ApplyPopup';
import Navbar from '../../../components/Navbar'; // Import the Navbar
import LandingAuthPopup from '../../../components/LandingAuthPopup'; // Import for Navbar functionality

const initialJob = {
    id: 1,
    title: 'ROR Developer',
    premiumOnly: true,
    location: 'Indore',
    type: 'On-site',
    salary: 'INR 675,000 - 900,000',
    workModel: 'Full time',
    posted: '30+ days ago',
    summary: "An established industry player in the BPO sector is seeking a skilled Ruby on Rails developer to join their dynamic team in Indore. This role is pivotal in managing server-side logic and ensuring seamless data interchange between users and the server. You'll have the opportunity to work with cutting-edge technologies, tackle complex challenges, and contribute to the development of high-performance applications. If you are passionate about coding and eager to make a significant impact in a rapidly growing company, this position offers an exciting chance to elevate your career while working in a collaborative environment.",
    about: "We are a leading firm in the business process outsourcing industry with over 20 years of experience. Our company prides itself on innovation, efficiency, and a client-first approach. We have a global presence with offices in 5 countries and a team of over 5,000 dedicated professionals.",
    recruiter: {
        name: 'Jane Doe',
        title: 'Senior Technical Recruiter',
        bio: 'Jane has been with the company for 5 years, specializing in sourcing top talent for our technology departments. She is passionate about connecting skilled developers with exciting opportunities.'
    }
};


// Main component for the Job Search Page
const JobSearchPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [detailTab, setDetailTab] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const [jobs, setJobs] = useState([initialJob]); // Represents search results
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [notInterestedJobs, setNotInterestedJobs] = useState([]);


  // State and logic from ResumeBuilder for Navbar functionality
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLandingAuthPopup, setShowLandingAuthPopup] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setCurrentUser(parsedUser);
        }
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };
  
  // Handlers for JobSearchPage specific functionality
  const handleTabChange = (event, newIndex) => {
    handleAuthRequiredClick(() => {
        setTabIndex(newIndex);
    }, newIndex === 0); // Allow search tab without auth
  };

  const handleDetailTabChange = (event, newIndex) => {
    setDetailTab(newIndex);
  };
  
  const handleAuthRequiredClick = (action, bypassAuth = false) => {
    if (currentUser || bypassAuth) {
      if (action) {
        action();
      }
    } else {
      setShowLandingAuthPopup(true);
    }
  };
  
  const handleOpenPopup = () => {
    handleAuthRequiredClick(() => {
      setOpenPopup(true);
    });
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleGenerateResumeClick = () => {
    handleAuthRequiredClick(() => {
      router.push('/user/ResumeBuilder');
    });
  };

  const handleToggleBookmark = (jobToToggle) => {
    handleAuthRequiredClick(() => {
        setBookmarkedJobs(prev => {
            const isBookmarked = prev.some(job => job.id === jobToToggle.id);
            if (isBookmarked) {
                return prev.filter(job => job.id !== jobToToggle.id);
            } else {
                return [...prev, jobToToggle];
            }
        });
    });
  };

  const handleToggleNotInterested = (jobToHide) => {
    handleAuthRequiredClick(() => {
        // Add to not interested list if not already there
        if (!notInterestedJobs.some(job => job.id === jobToHide.id)) {
            setNotInterestedJobs(prev => [...prev, jobToHide]);
        }
        // Remove from main jobs list and bookmarked list
        setJobs(prev => prev.filter(job => job.id !== jobToHide.id));
        setBookmarkedJobs(prev => prev.filter(job => job.id !== jobToHide.id));
    });
  };

  const renderJobList = (jobList) => {
    if (jobList.length === 0) {
        let message = "No results found.";
        if (tabIndex === 1) message = "You haven't bookmarked any jobs yet.";
        if (tabIndex === 2) message = "You haven't applied for any jobs yet.";
        if (tabIndex === 3) message = "No jobs marked as not interested.";

        return (
            <Paper elevation={2} sx={{ p: 3, borderRadius: '12px', textAlign: 'center' }}>
                <Typography color="text.secondary">{message}</Typography>
            </Paper>
        );
    }

    return jobList.map(job => {
        const isBookmarked = bookmarkedJobs.some(bm => bm.id === job.id);
        return (
            <Paper key={job.id} elevation={2} sx={{ p: 2, mb: 2, borderRadius: '12px', border: '2px solid', borderColor: 'primary.main' }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <Typography variant="h6" fontWeight="bold">{job.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{job.premiumOnly ? "For Premium Members only" : ""}</Typography>
                    </div>
                    <Box>
                        <IconButton size="small" onClick={() => handleToggleBookmark(job)}>
                            {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                        </IconButton>
                        <IconButton size="small" onClick={() => handleToggleNotInterested(job)}>
                            <VisibilityOffIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
                    <Chip label={job.location} size="small" />
                    <Chip label={job.type} size="small" />
                    <Chip label={job.salary} size="small" />
                    <Chip label={job.workModel} size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">{job.posted}</Typography>
            </Paper>
        );
    });
  };

  const isCurrentJobBookmarked = bookmarkedJobs.some(job => job.id === initialJob.id);
  
  const showRightPanel = 
    (tabIndex === 0 && jobs.length > 0) ||
    (tabIndex === 1 && bookmarkedJobs.length > 0) ||
    (tabIndex === 2 && appliedJobs.length > 0) ||
    (tabIndex === 3 && notInterestedJobs.length > 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar 
        currentUser={currentUser}
        profileCompletion={profileCompletion}
        handleLogout={handleLogout}
        handleDrawerToggle={handleDrawerToggle}
        setShowLandingAuthPopup={setShowLandingAuthPopup}
      />
      <Box sx={{ backgroundColor: '#f8f9fa', py: 4 }}>
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
              <Tab label={`Bookmarked (${bookmarkedJobs.length})`} />
              <Tab label={`Applied jobs (${appliedJobs.length})`} />
              <Tab label={`Not interested (${notInterestedJobs.length})`} />
            </Tabs>
          </Box>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Left Column: Job List */}
            <Grid item xs={12} md={showRightPanel ? 5 : 12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">1 results | <Button variant="text" size="small" sx={{textTransform: 'none'}} onClick={() => handleAuthRequiredClick()}>Save search</Button></Typography>
                  <Button variant="text" size="small" sx={{textTransform: 'none'}} onClick={() => handleAuthRequiredClick()}>Saved searches (1)</Button>
              </Box>
              {tabIndex === 0 && renderJobList(jobs)}
              {tabIndex === 1 && renderJobList(bookmarkedJobs)}
              {tabIndex === 2 && renderJobList(appliedJobs)}
              {tabIndex === 3 && renderJobList(notInterestedJobs)}
            </Grid>

            {/* Right Column: Job Details, Resume Promo, and Tabbed Info */}
            {showRightPanel && (
              <Grid item xs={12} md={7}>
                 <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
                    {/* Job Details Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" fontWeight="bold">{initialJob.title}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleToggleBookmark(initialJob)}>
                              {isCurrentJobBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                            </IconButton>
                            <Button variant="contained" color="primary" onClick={handleOpenPopup}>Apply now</Button>
                        </Box>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{initialJob.premiumOnly ? "For Premium Members only" : ""}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
                        <Chip label={initialJob.location} />
                        <Chip label={initialJob.type} />
                        <Chip label={initialJob.salary} />
                        <Chip label={initialJob.workModel} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">{initialJob.posted}</Typography>
                    
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
                                <Button variant="outlined" onClick={handleGenerateResumeClick}>Generate a resume</Button>
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
                                  {initialJob.summary}
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
                                        {initialJob.about}
                                    </Typography>
                                </Box>
                            )}
                            {detailTab === 2 && (
                                 <Box>
                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                        <Avatar sx={{ width: 56, height: 56, mr: 2 }} alt={initialJob.recruiter.name} src="/static/images/avatar/1.jpg" />
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">{initialJob.recruiter.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{initialJob.recruiter.title}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {initialJob.recruiter.bio}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>
              </Grid>
            )}
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
          
          <ApplyPopup open={openPopup} handleClose={handleClosePopup} />
          
          <LandingAuthPopup
            open={showLandingAuthPopup && !currentUser}
            onClose={() => setShowLandingAuthPopup(false)}
            onSuccess={() => {
              const storedUser = localStorage.getItem('currentUser');
              if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
                setShowLandingAuthPopup(false);
              }
            }}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default JobSearchPage;
