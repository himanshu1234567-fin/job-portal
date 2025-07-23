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
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BusinessIcon from '@mui/icons-material/Business';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import ApplyPopup from '../../../components/ApplyPopup';
import Navbar from '../../../components/Navbar';
import LandingAuthPopup from '../../../components/LandingAuthPopup';

// Helper function to remove HTML tags from the description
const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

// Main component for the Job Search Page
const JobSearchPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [detailTab, setDetailTab] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  // API State
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User-specific State
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [notInterestedJobs, setNotInterestedJobs] = useState([]);

  // Auth & Navbar State
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLandingAuthPopup, setShowLandingAuthPopup] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Effect to check for logged-in user
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

  // Fetch Data from Remotive API (No Key Needed)
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      const url = 'https://remotive.com/api/remote-jobs?limit=50';
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data.jobs);
        if (data.jobs && data.jobs.length > 0) {
          setSelectedJob(data.jobs[0]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // All original handlers are restored below
  const handleSelectJob = (job) => {
    setSelectedJob(job);
  };
  
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };
  
  const handleTabChange = (event, newIndex) => {
    handleAuthRequiredClick(() => {
        setTabIndex(newIndex);
    }, newIndex === 0);
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

  // --- UPDATED Not Interested Handler ---
  const handleToggleNotInterested = (jobToToggle) => {
    handleAuthRequiredClick(() => {
      const isAlreadyNotInterested = notInterestedJobs.some(job => job.id === jobToToggle.id);

      if (isAlreadyNotInterested) {
        // ---- Move it BACK to the main jobs list ----
        setNotInterestedJobs(prev => prev.filter(job => job.id !== jobToToggle.id));
        setJobs(prev => [jobToToggle, ...prev]);
        // If the right panel was showing this job, keep it selected
        if (selectedJob && selectedJob.id === jobToToggle.id) {
            // No change needed, it's still the selected job
        }
      } else {
        // ---- Move it TO the not interested list (original behavior) ----
        setNotInterestedJobs(prev => [jobToToggle, ...prev]);
        setJobs(prev => prev.filter(job => job.id !== jobToToggle.id));
        setBookmarkedJobs(prev => prev.filter(job => job.id !== jobToToggle.id));

        // If the job being hidden is the currently selected one, select the next available job
        if (selectedJob && selectedJob.id === jobToToggle.id) {
            const currentJobs = jobs.filter(job => job.id !== jobToToggle.id);
            setSelectedJob(currentJobs.length > 0 ? currentJobs[0] : null);
        }
      }
    });
  };
  
  const renderJobList = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Alert severity="error">Failed to load jobs: {error}</Alert>;
    }
    
    let jobListToRender = [];
    let message = "No results found.";
    
    // Logic to select the correct list based on the active tab
    switch (tabIndex) {
        case 0:
            jobListToRender = jobs;
            break;
        case 1:
            jobListToRender = bookmarkedJobs;
            message = "You haven't bookmarked any jobs yet.";
            break;
        case 2:
            jobListToRender = appliedJobs;
            message = "You haven't applied for any jobs yet.";
            break;
        case 3:
            jobListToRender = notInterestedJobs;
            message = "No jobs marked as not interested.";
            break;
        default:
            jobListToRender = jobs;
    }
    
    if (jobListToRender.length === 0) {
        return <Paper elevation={2} sx={{ p: 3, borderRadius: '12px', textAlign: 'center' }}><Typography color="text.secondary">{message}</Typography></Paper>;
    }

    return jobListToRender.map(job => {
        const isBookmarked = bookmarkedJobs.some(bm => bm.id === job.id);
        const isSelected = selectedJob && selectedJob.id === job.id;
        
        return (
             <Paper 
                key={job.id} 
                elevation={isSelected ? 6 : 2} 
                sx={{ p: 2, mb: 2, borderRadius: '12px', border: '2px solid', borderColor: isSelected ? 'primary.main' : 'transparent', cursor: 'pointer', '&:hover': { borderColor: 'primary.light' } }}
                onClick={() => handleSelectJob(job)}
             >
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <Typography variant="h6" fontWeight="bold">{job.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{job.company_name}</Typography>
                    </div>
                    <Box>
                        {tabIndex !== 3 && ( // Don't show bookmark icon in "not interested" tab for simplicity
                           <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleBookmark(job); }}>
                               {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                           </IconButton>
                        )}
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleNotInterested(job); }}>
                            <VisibilityOffIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
                    <Chip label={job.candidate_required_location} size="small" />
                    <Chip label={job.job_type.replace(/_/g, ' ')} size="small" />
                    <Chip label="Remote" size="small" variant="outlined" color="success" />
                </Box>
                <Typography variant="caption" color="text.secondary">
                    Posted {formatDistanceToNow(new Date(job.publication_date), { addSuffix: true })}
                </Typography>
            </Paper>
        );
    });
  };

  const isCurrentJobBookmarked = selectedJob && bookmarkedJobs.some(job => job.id === selectedJob.id);
  const showRightPanel = !loading && !error && selectedJob;

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
          {/* Search Filters Section Restored */}
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

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="job search tabs">
              <Tab label="Search" />
              <Tab label={`Bookmarked (${bookmarkedJobs.length})`} />
              <Tab label={`Applied jobs (${appliedJobs.length})`} />
              <Tab label={`Not interested (${notInterestedJobs.length})`} />
            </Tabs>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={showRightPanel ? 5 : 12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">{!loading && `${jobs.length} results`}</Typography>
              </Box>
              {renderJobList()}
            </Grid>

            {showRightPanel && (
              <Grid item xs={12} md={7}>
                 <Paper elevation={2} sx={{ p: 3, borderRadius: '12px', position: 'sticky', top: '20px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" fontWeight="bold">{selectedJob.title}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleToggleBookmark(selectedJob)}>
                              {isCurrentJobBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                            </IconButton>
                            <Button variant="contained" color="primary" onClick={handleOpenPopup}>Apply now</Button>
                        </Box>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{selectedJob.company_name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
                        <Chip label={selectedJob.candidate_required_location} />
                        <Chip label={selectedJob.job_type.replace(/_/g, ' ')} />
                        {selectedJob.salary && <Chip label={selectedJob.salary} />}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Posted {formatDistanceToNow(new Date(selectedJob.publication_date), { addSuffix: true })}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />

                    {/* Generate Resume Promo Section Restored */}
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

                    <Box>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={detailTab} onChange={handleDetailTabChange} aria-label="job detail tabs">
                                <Tab label="Job description" sx={{textTransform: 'none'}} />
                                <Tab label="About the company" sx={{textTransform: 'none'}} />
                                <Tab label="Recruiter" sx={{textTransform: 'none'}} />
                            </Tabs>
                        </Box>
                        <Box sx={{ pt: 3, maxHeight: '400px', overflowY: 'auto' }}>
                            {detailTab === 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                  {stripHtml(selectedJob.description)}
                                </Typography>
                            )}
                            {detailTab === 1 && (
                                <Box>
                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                        <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.light' }} src={selectedJob.company_logo}>
                                            <BusinessIcon />
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="bold">{selectedJob.company_name}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {`Category: ${selectedJob.category}`}
                                    </Typography>
                                </Box>
                            )}
                            {detailTab === 2 && (
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    Recruiter information is not available from this API source.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                 </Paper>
              </Grid>
            )}
          </Grid>
          
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