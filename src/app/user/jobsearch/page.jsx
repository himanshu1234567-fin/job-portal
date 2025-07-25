'use client';

import React, { useState, useEffect } from 'react';
import axios from '../../../lib/axiosInstance';
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
  Divider,
  Avatar,
  Fade,
  Grow,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Skeleton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BusinessIcon from '@mui/icons-material/Business';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import ApplyPopup from '../../../components/ApplyPopup';
import Navbar from '../../../components/Navbar';
import LandingAuthPopup from '../../../components/LandingAuthPopup';
import { useError } from '../../../context/ErrorContext';

const muiTheme = createTheme({
    palette: {
        primary: { main: '#00796b', light: '#48a999', dark: '#004c40' },
        secondary: { main: '#f9a825' },
        background: { default: '#f7f9fc', paper: '#ffffff' },
        text: { primary: '#1c2025', secondary: '#5a6470' },
    },
    typography: {
        fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
        h5: { fontWeight: 700 }, h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiPaper: { styleOverrides: { root: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } } },
        MuiButton: { styleOverrides: { contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } } } },
    },
});

// ✅ NEW: Skeleton component for the search filters
const SearchFilterSkeleton = () => (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12} md={3}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12} md={2}>
                 <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
        </Grid>
    </Paper>
);


const JobItemSkeleton = () => (
    <Box sx={{ mb: 2 }}>
        <Paper elevation={0} variant="outlined" sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                    <Skeleton variant="text" width={200} height={28} />
                    <Skeleton variant="text" width={120} height={20} />
                </Box>
                <Skeleton variant="circular" width={32} height={32} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={100} height={24} />
            </Box>
            <Skeleton variant="text" width={150} height={18} />
        </Paper>
    </Box>
);

const JobDetailSkeleton = () => (
    <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 4 }, position: 'sticky', top: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rounded" width={100} height={40} />
            </Box>
        </Box>
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }}/>
        <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
            <Skeleton variant="rounded" width={100} height={32} />
            <Skeleton variant="rounded" width={80} height={32} />
        </Box>
        <Divider sx={{ my: 3 }} />
        <Skeleton variant="rounded" width="100%" height={100} sx={{ mb: 3 }} />
        <Divider sx={{ my: 3 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
    </Paper>
);


const JobSearchPage = () => {
    const { showError } = useError();
    const [tabIndex, setTabIndex] = useState(0);
    const [detailTab, setDetailTab] = useState(0);
    const [openPopup, setOpenPopup] = useState(false);
    const [pendingApplyJob, setPendingApplyJob] = useState(null);
    const router = useRouter();
    const [allJobs, setAllJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [workType, setWorkType] = useState('all');
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [notInterestedJobs, setNotInterestedJobs] = useState([]);
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

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const url = 'https://remotive.com/api/remote-jobs?limit=100';
            try {
                const response = await axios.get(url);
                const data = response.data;
                const jobsWithDates = data.jobs.map((j) => ({
                    ...j,
                    publication_date_obj: new Date(j.publication_date),
                }));
                setAllJobs(jobsWithDates);
                setJobs(jobsWithDates);
                if (jobsWithDates.length > 0) setSelectedJob(jobsWithDates[0]);
            } catch (err) {
                const errorMessage = err.message || 'Something went wrong while fetching jobs';
                showError(errorMessage, 'Job Fetch Error');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [showError]);

    useEffect(() => {
        if (!allJobs.length) return;
        const storedApplied = localStorage.getItem('appliedJobs') || '[]';
        try {
            const appliedJobIds = JSON.parse(storedApplied);
            const appliedFullJobs = allJobs.filter((job) => appliedJobIds.includes(job.id));
            setAppliedJobs(appliedFullJobs);
        } catch {
            setAppliedJobs([]);
        }
    }, [allJobs]);

    const handlePopupExited = () => {
        if (pendingApplyJob) {
            setAppliedJobs((prev) => {
                if (prev.some((j) => j.id === pendingApplyJob.id)) return prev;
                const updated = [...prev, pendingApplyJob];
                localStorage.setItem('appliedJobs', JSON.stringify(updated.map((j) => j.id)));
                return updated;
            });
            setPendingApplyJob(null);
        }
    };

    useEffect(() => {
        let filtered = [...allJobs];
        if (searchQuery) {
            filtered = filtered.filter((job) =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (locationQuery) {
            filtered = filtered.filter((job) =>
                job.candidate_required_location.toLowerCase().includes(locationQuery.toLowerCase())
            );
        }
        if (workType !== 'all') {
            filtered = workType === 'remote' ? filtered : [];
        }
        setJobs(filtered);
        if (!filtered.some((job) => job.id === selectedJob?.id)) {
            setSelectedJob(filtered.length > 0 ? filtered[0] : null);
        }
    }, [searchQuery, locationQuery, workType, allJobs, selectedJob?.id]);

    const handleSelectJob = (job) => setSelectedJob(job);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        setCurrentUser(null);
    };

    const handleTabChange = (_, newIndex) => handleAuthRequiredClick(() => {
        setTabIndex(newIndex);
        if (newIndex !== 0) setJobs(allJobs);
    }, newIndex === 0);

    const handleDetailTabChange = (_, newIndex) => setDetailTab(newIndex);

    const handleAuthRequiredClick = (action, bypassAuth = false) => {
        if (currentUser || bypassAuth) {
            if (action) action();
        } else {
            setShowLandingAuthPopup(true);
        }
    };

    const handleOpenPopup = () => handleAuthRequiredClick(() => setOpenPopup(true));
    const handleClosePopup = () => setOpenPopup(false);
    const handleGenerateResumeClick = () => handleAuthRequiredClick(() => router.push('/user/ResumeBuilder'));

    const handleToggleBookmark = (jobToToggle) => {
        handleAuthRequiredClick(() => {
            setBookmarkedJobs((prev) =>
                prev.some((job) => job.id === jobToToggle.id)
                    ? prev.filter((job) => job.id !== jobToToggle.id)
                    : [...prev, jobToToggle]
            );
        });
    };

    const handleToggleNotInterested = (jobToToggle) => {
        handleAuthRequiredClick(() => {
            const isNotInterested = notInterestedJobs.some((job) => job.id === jobToToggle.id);
            if (isNotInterested) {
                setNotInterestedJobs((prev) => prev.filter((job) => job.id !== jobToToggle.id));
                setAllJobs((prev) => [jobToToggle, ...prev]);
            } else {
                setNotInterestedJobs((prev) => [jobToToggle, ...prev]);
                setAllJobs((prev) => prev.filter((job) => job.id !== jobToToggle.id));
                setBookmarkedJobs((prev) => prev.filter((job) => job.id !== jobToToggle.id));
            }
        });
    };

    const handleApplyConfirm = (job) => {
        setPendingApplyJob(job);
        setOpenPopup(false);
    };

    const renderJobList = () => {
        if (loading) {
            return (
                <Box>
                    {[...Array(5)].map((_, i) => <JobItemSkeleton key={i} />)}
                </Box>
            );
        }
        
        let jobListToRender = [];
        let message = "No results match your search criteria. ✨";
        switch (tabIndex) {
            case 0: jobListToRender = jobs; break;
            case 1: jobListToRender = bookmarkedJobs; message = "You haven't bookmarked any jobs yet. 🔖"; break;
            case 2: jobListToRender = appliedJobs; message = "You haven't applied for any jobs yet. 📄"; break;
            case 3: jobListToRender = notInterestedJobs; message = "No jobs marked as not interested. 👀"; break;
            default: jobListToRender = jobs;
        }

        if (jobListToRender.length === 0) {
            return (
                <Paper elevation={0} variant="outlined" sx={{ p: 4, textAlign: 'center', backgroundColor: 'transparent' }}>
                    <Typography color="text.secondary">{message}</Typography>
                </Paper>
            );
        }

        return jobListToRender.map((job, index) => {
            const isBookmarked = bookmarkedJobs.some((bm) => bm.id === job.id);
            const isSelected = selectedJob?.id === job.id;
            return (
                <Grow key={job.id} in timeout={index * 100}>
                    <Box onClick={() => handleSelectJob(job)} sx={{ mb: 2, cursor: 'pointer' }}>
                        <Paper
                            elevation={0}
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                backgroundColor: isSelected ? '#e0f2f1' : 'background.paper',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.07)',
                                    borderColor: 'primary.light',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="600">{job.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{job.company_name}</Typography>
                                </Box>
                                <Box>
                                    {tabIndex !== 3 && (
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
                                {job.candidate_required_location && <Chip label={job.candidate_required_location} size="small" variant="outlined" />}
                                {job.job_type && <Chip label={job.job_type.replace(/_/g, ' ')} size="small" variant="outlined" />}
                                <Chip label="Remote" size="small" variant="outlined" color="success" />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                Posted {formatDistanceToNow(job.publication_date_obj, { addSuffix: true })}
                            </Typography>
                        </Paper>
                    </Box>
                </Grow>
            );
        });
    };

    const isCurrentJobBookmarked = selectedJob && bookmarkedJobs.some((job) => job.id === selectedJob.id);
    const isCurrentJobApplied = selectedJob && appliedJobs.some((job) => job.id === selectedJob.id);
    const showRightPanel = selectedJob || loading;

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }}>
                <Navbar />
                <Box sx={{ py: 4 }}>
                    <Container maxWidth="xl">
                        {/* ✅ MODIFICATION: Conditionally render skeleton for search bar */}
                        {loading ? <SearchFilterSkeleton /> : (
                            <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 4, backgroundColor: 'background.paper' }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth variant="outlined" placeholder="Job title or keyword" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth variant="outlined" placeholder="Location (e.g. USA, Europe)" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><img src="https://flagcdn.com/w20/us.png" width="20" alt="World Flag" /></InputAdornment> }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <FormControl fullWidth variant="outlined">
                                            <Select value={workType} onChange={(e) => setWorkType(e.target.value)} IconComponent={ArrowDropDownIcon}>
                                                <MenuItem value="all">On-site / Remote</MenuItem>
                                                <MenuItem value="remote">Remote</MenuItem>
                                                <MenuItem value="on-site">On-site</MenuItem>
                                                <MenuItem value="hybrid">Hybrid</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <FormControl fullWidth variant="outlined">
                                            <Select defaultValue="" displayEmpty IconComponent={ArrowDropDownIcon}>
                                                <MenuItem value="" disabled>Salary (any)</MenuItem>
                                                <MenuItem value="1" disabled>₹3L - ₹6L</MenuItem>
                                                <MenuItem value="2" disabled>₹6L - ₹10L</MenuItem>
                                                <MenuItem value="3" disabled>₹10L - ₹15L</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button variant="contained" color="primary" sx={{ flexGrow: 1, py: '14px' }} aria-label="search"><SearchIcon /></Button>
                                            <IconButton sx={{ border: '1px solid', borderColor: 'divider' }} aria-label="filters"><TuneIcon /></IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}

                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="job search tabs">
                                <Tab label="All Jobs" />
                                <Tab label={`Bookmarked (${bookmarkedJobs.length})`} />
                                <Tab label={`Applied (${appliedJobs.length})`} />
                                <Tab label={`Hidden (${notInterestedJobs.length})`} />
                            </Tabs>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={showRightPanel ? 5 : 12}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                                    <Typography variant="body1" fontWeight="500">
                                        {loading ? <Skeleton width={120} /> : `${jobs.length} results found`}
                                    </Typography>
                                </Box>
                                {renderJobList()}
                            </Grid>

                            {showRightPanel && (
                                <Fade in={showRightPanel}>
                                    <Grid item xs={12} md={7}>
                                        {loading ? <JobDetailSkeleton /> : selectedJob && (
                                            <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, md: 4 }, position: 'sticky', top: '20px', backgroundColor: 'background.paper' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="h5" fontWeight="bold">{selectedJob?.title}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <IconButton size="medium" onClick={() => handleToggleBookmark(selectedJob)}>
                                                            {isCurrentJobBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                                                        </IconButton>
                                                        <Button variant="contained" color="primary" disabled={isCurrentJobApplied} onClick={handleOpenPopup}>
                                                            {isCurrentJobApplied ? 'Applied' : 'Apply now'}
                                                        </Button>
                                                    </Box>
                                                </Box>
                                                <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>{selectedJob?.company_name}</Typography>
                                                <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
                                                    {selectedJob?.candidate_required_location && <Chip label={selectedJob.candidate_required_location} />}
                                                    {selectedJob?.job_type && <Chip label={selectedJob.job_type.replace(/_/g, ' ')} />}
                                                    {selectedJob?.salary && <Chip label={selectedJob.salary} />}
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Posted {selectedJob && formatDistanceToNow(selectedJob.publication_date_obj, { addSuffix: true })}
                                                </Typography>

                                                <Divider sx={{ my: 3 }} />

                                                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'primary.main', color: 'white' }}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item>
                                                            <img src="https://cdn-icons-png.freepik.com/512/12287/12287042.png" alt="Resume icon" width={56} height={56} />
                                                        </Grid>
                                                        <Grid item xs>
                                                            <Typography variant="h6" fontWeight="bold">Generate a tailored resume</Typography>
                                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>Land an interview faster with an AI-powered resume.</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button variant="contained" sx={{ backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: '#e0f2f1' } }} onClick={handleGenerateResumeClick}>Generate</Button>
                                                        </Grid>
                                                    </Grid>
                                                </Box>

                                                <Divider sx={{ my: 3 }} />

                                                <Box>
                                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                        <Tabs value={detailTab} onChange={handleDetailTabChange} aria-label="job detail tabs">
                                                            <Tab label="Job description" />
                                                            <Tab label="About the company" />
                                                            <Tab label="Recruiter" />
                                                        </Tabs>
                                                    </Box>
                                                    <Box sx={{ pt: 3, maxHeight: '400px', overflowY: 'auto', pr: 2 }}>
                                                        {detailTab === 0 && (
                                                            <Typography variant="body2" component="div" color="text.secondary" sx={{ lineHeight: 1.8, '& p, & li, & ul': { mb: 1.5 } }}>
                                                                <div dangerouslySetInnerHTML={{ __html: selectedJob?.description || '' }} />
                                                            </Typography>
                                                        )}
                                                        {detailTab === 1 && selectedJob && (
                                                            <Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontStyle: 'italic' }}>
                                                                Recruiter information is not available for this job.
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        )}
                                    </Grid>
                                </Fade>
                            )}
                        </Grid>

                        <ApplyPopup
                            open={openPopup}
                            handleClose={handleClosePopup}
                            job={selectedJob}
                            onApplyConfirm={() => handleApplyConfirm(selectedJob)}
                            TransitionProps={{ onExited: handlePopupExited }}
                        />

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
        </ThemeProvider>
    );
};

export default JobSearchPage;