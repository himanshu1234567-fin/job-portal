'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    IconButton,
    TextField,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Stepper,
    Step,
    StepLabel,
    FormHelperText,
    Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import Navbar from '../../../components/Navbar'; // Assumed path to your Navbar component

const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean, sleek, and modern layout suited for tech roles.', preview: '/preview-modern.png' },
    { id: 'classic', name: 'Classic', description: 'Traditional layout ideal for government or academic jobs.', preview: '/preview-classic.png' },
];

const plans = [
    { id: 'plan1', name: '₹99 - 5 Resumes (14 Days)', price: 9900, limit: 5, validityDays: 14 },
    { id: 'plan2', name: '₹199 - 10 Resumes (30 Days)', price: 19900, limit: 10, validityDays: 30 },
    { id: 'plan3', name: '₹499 - 50 Resumes (6 Months)', price: 49900, limit: 50, validityDays: 180 },
    { id: 'plan4', name: '₹999 - Unlimited Resumes (1 Year)', price: 99900, limit: Infinity, validityDays: 365 },
];

const steps = ['Upload Resume', 'Contact Information', 'Job Title', 'Educational Background', 'Work Experience', 'Project Details', 'Skills', 'Choose Template'];

export default function ResumeBuilderPage() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLandingAuthPopup, setShowLandingAuthPopup] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showPlans, setShowPlans] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contactInfo, setContactInfo] = useState({
        firstName: '', lastName: '', location: '', zipCode: '',
        country: '', phone: '', email: '', linkedIn: '',
    });
    const [jobTitle, setJobTitle] = useState('');
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('English (United States)');
    const [education, setEducation] = useState([]);
    const [workExperience, setWorkExperience] = useState([]);
    const [internships, setInternships] = useState([]);
    const [isFresher, setIsFresher] = useState(false);
    const [projects, setProjects] = useState([]);
    const [mustHaveSkills, setMustHaveSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [customSkill, setCustomSkill] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [noResume, setNoResume] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    setCurrentUser(JSON.parse(storedUser));
                }
                if (!token) {
                    setError('No authentication token found. Please log in.');
                    router.push('/login');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/candidates/getmyprofileId', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                setProfile({
                    fullName: data.fullName || '', email: data.email || '', phone: data.phone || '',
                    education: data.education || [], skills: data.skills || [], experience: data.experience || [],
                    internships: data.internships || [], projects: data.projects || [], desirableJob: data.desirableJob || '',
                });
                setContactInfo({
                    firstName: data.fullName ? data.fullName.split(' ')[0] : '',
                    lastName: data.fullName ? data.fullName.split(' ').slice(1).join(' ') : '',
                    location: '', zipCode: '', country: '', phone: data.phone || '', email: data.email || '', linkedIn: '',
                });
                setJobTitle(data.desirableJob || '');
                setEducation(data.education || []);
                setWorkExperience(
                    Array.isArray(data.experience) && data.experience.length > 0
                        ? data.experience.map((exp) => ({ company: exp.company || '', role: exp.role || '', startDate: exp.startDate || '', endDate: exp.endDate || '' }))
                        : []
                );
                setInternships(
                    Array.isArray(data.internships) && data.internships.length > 0
                        ? data.internships.map((intern) => ({ company: intern.company || '', role: intern.role || '', startDate: intern.startDate || '', endDate: intern.endDate || '', description: intern.description || '' }))
                        : []
                );
                setProjects(
                    Array.isArray(data.projects) && data.projects.length > 0
                        ? data.projects.map((proj) => ({ title: proj.title || '', description: proj.description || '', techStack: proj.techStack || '', link: proj.link || '' }))
                        : []
                );
                setIsFresher(!data.experience || data.experience.length === 0);
                setMustHaveSkills(['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Java', 'SQL', 'Git', 'AWS']);
                setSelectedSkills(data.skills || []);
                setLanguages(['English (United States)', 'English (UK)', 'Spanish', 'French', 'German', 'Hindi', 'Chinese']);
            } catch (error) {
                console.error('Error fetching profile:', error);
                if (error.response) {
                    setError(`Failed to load profile data: ${error.response.status} ${error.response.statusText}${error.response.data?.message ? ` - ${error.response.data.message}` : ''}`);
                } else if (error.request) {
                    setError('Failed to load profile data: Unable to connect to the server.');
                } else {
                    setError(`Failed to load profile data: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    const handleContactChange = (field, value) => setContactInfo((prev) => ({ ...prev, [field]: value }));
    const addEducation = () => setEducation((prev) => [...prev, { degree: '', institution: '', year: '' }]);
    const removeEducation = (index) => setEducation((prev) => prev.filter((_, i) => i !== index));
    const handleEducationChange = (index, field, value) => setEducation((prev) => prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)));
    const addWorkExp = () => setWorkExperience((prev) => [...prev, { company: '', role: '', startDate: '', endDate: '' }]);
    const removeWorkExp = (index) => setWorkExperience((prev) => prev.filter((_, i) => i !== index));
    const handleWorkExpChange = (index, field, value) => setWorkExperience((prev) => prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)));
    const addInternship = () => setInternships((prev) => [...prev, { company: '', role: '', startDate: '', endDate: '', description: '' }]);
    const removeInternship = (index) => setInternships((prev) => prev.filter((_, i) => i !== index));
    const handleInternshipChange = (index, field, value) => setInternships((prev) => prev.map((intern, i) => (i === index ? { ...intern, [field]: value } : intern)));
    const handleProjectChange = (index, field, value) => setProjects((prev) => prev.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj)));
    const addProject = () => setProjects((prev) => [...prev, { title: '', description: '', techStack: '', link: '' }]);
    const removeProject = (index) => setProjects((prev) => prev.filter((_, i) => i !== index));
    const handleSkillToggle = (skill) => setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
    const addCustomSkill = () => {
        if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
            setSelectedSkills((prev) => [...prev, customSkill.trim()]);
            setCustomSkill('');
        }
    };
    const handleFileChange = (event) => setResumeFile(event.target.files[0]);
    const handlePreview = () => { if (!selectedTemplate) { alert('Please select a template first'); return; } setShowPreview(true); };
    const handleDownload = async () => { if (!selectedTemplate) { alert('Please select a template first'); return; } if (!selectedPlan) { setShowPlans(true); return; } alert('Download functionality is disabled.'); };
    const handlePlanPayment = async () => { if (!selectedPlan) { alert('Please select a plan'); return; } alert(`Payment processed for ${selectedPlan.name}`); setShowPlans(false); };
    
    const handleLogout = useCallback(() => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        router.push('/');
    }, [router]);

    const getStepContent = (step) => {
        switch (step) {
            case 0: return (
                <Paper sx={{ p: 2, mb: 3, maxWidth: 500, mx: 'auto', borderRadius: 2, boxShadow: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.01)' } }}>
                    <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1rem' }}>Upload your resume</Typography>
                    <Typography variant='body2' gutterBottom sx={{ color: '#555', mb: 2 }}>We’ll customize it for your application regardless of its shape.</Typography>
                    <Box sx={{ mt: 1, p: 3, border: '2px dashed #1976d2', borderRadius: 2, textAlign: 'center', backgroundColor: '#f5f5f5', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', '&:hover': { backgroundColor: '#e3f2fd' } }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length > 0) handleFileChange({ target: { files: e.dataTransfer.files } }); }}>
                        <Typography variant='subtitle1' sx={{ mb: 1, color: '#1976d2', fontSize: '0.95rem' }}>Drag and drop your resume here</Typography>
                        <Typography variant='caption' sx={{ mb: 2, color: '#666' }}>or (up to 20MB)</Typography>
                        <Button variant='contained' component='label' sx={{ mb: 2, fontSize: '0.8rem', py: 0.5, px: 2 }}>Select file <input type='file' hidden onChange={handleFileChange} /></Button>
                        <Typography variant='caption' sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setNoResume(true)}>I don’t have a resume</Typography>
                        {(resumeFile || noResume) && (<Button variant='contained' onClick={handleNext} sx={{ mt: 2, backgroundColor: '#4caf50', fontSize: '0.8rem', '&:hover': { backgroundColor: '#388e3c' } }} disabled={!resumeFile && !noResume}>Continue</Button>)}
                    </Box>
                </Paper>
            );
            case 1: return (
                <Paper sx={{ p: 3, mb: 4, maxWidth: 800, mx: 'auto', borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>Your Contact Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, border: '2px dashed #1976d2', borderRadius: 2, textAlign: 'center', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', '&:hover': { backgroundColor: '#e3f2fd' } }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length > 0) { setProfileImage(e.dataTransfer.files[0]); } }}>
                                <Typography variant='subtitle1' sx={{ mb: 1, color: '#1976d2' }}>{profileImage ? 'Profile Image Selected' : 'Upload Profile Image (optional)'}</Typography>
                                {profileImage && <Typography variant='caption' sx={{ mb: 1, color: '#666' }}>{profileImage.name}</Typography>}
                                <Button variant='contained' component='label' sx={{ mb: 2, fontSize: '0.8rem', py: 0.5, px: 2 }}>Select Image <input type='file' hidden accept='image/*' onChange={(e) => setProfileImage(e.target.files[0])} /></Button>
                                <Typography variant='caption' sx={{ color: '#666' }}>Recommended size: 150x150px (JPG, PNG, up to 5MB)</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}><TextField label='First Name' fullWidth size='small' value={contactInfo.firstName} onChange={(e) => handleContactChange('firstName', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label='Last Name' fullWidth size='small' value={contactInfo.lastName} onChange={(e) => handleContactChange('lastName', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label='Location' fullWidth size='small' value={contactInfo.location} onChange={(e) => handleContactChange('location', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label='ZIP Code (optional)' fullWidth size='small' value={contactInfo.zipCode} onChange={(e) => handleContactChange('zipCode', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label='Country (optional)' fullWidth size='small' value={contactInfo.country} onChange={(e) => handleContactChange('country', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label='Phone' fullWidth size='small' value={contactInfo.phone} onChange={(e) => handleContactChange('phone', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label='Email' fullWidth size='small' value={contactInfo.email} onChange={(e) => handleContactChange('email', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label='LinkedIn (optional)' fullWidth size='small' value={contactInfo.linkedIn} onChange={(e) => handleContactChange('linkedIn', e.target.value)} /></Grid>
                    </Grid>
                    <FormControl fullWidth sx={{ mt: 3 }} size='small'><InputLabel>Choose Language</InputLabel><Select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} label='Choose Language'>{languages.map((lang) => (<MenuItem key={lang} value={lang}>{lang}</MenuItem>))}</Select><FormHelperText>This will help us optimize your resume accordingly</FormHelperText></FormControl>
                </Paper>
            );
            // ... other cases for the stepper ...
            default: return <Typography>Step not found</Typography>;
        }
    };
    
    const ModernResume = () => { /* ... resume preview component ... */ };

    if (loading) return <Typography>Loading profile data...</Typography>;
    if (error) return (<Box><Typography color='error'>{error}</Typography><Button variant='contained' onClick={() => router.push('/user/profile')} sx={{ mt: 2 }}>Profile Complete</Button></Box>);

    return (
        <Box bgcolor='#f5f5f5' minHeight='100vh'>
            <Navbar
                currentUser={currentUser}
                handleLogout={handleLogout}
                setShowLandingAuthPopup={setShowLandingAuthPopup}
            />
            <Container sx={{ py: 4 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
                </Stepper>
                {getStepContent(activeStep)}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                    {activeStep < steps.length - 1 && (
                        <Button variant='contained' onClick={handleNext} disabled={(activeStep === 0 && !resumeFile && !noResume) || (activeStep === 3 && education.length === 0) || (activeStep === 4 && !isFresher && workExperience.length === 0) || (activeStep === 4 && isFresher && internships.length === 0) || (activeStep === 5 && projects.length === 0) || (activeStep === 6 && selectedSkills.length === 0)}>Continue</Button>
                    )}
                </Box>
                <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth='md' fullWidth>
                    <DialogTitle>Resume Preview - {templates.find((t) => t.id === selectedTemplate)?.name || 'Template'}</DialogTitle>
                    <DialogContent><ModernResume /></DialogContent>
                </Dialog>
                <Dialog open={showPlans} onClose={() => setShowPlans(false)} maxWidth='sm' fullWidth>
                    <DialogTitle>Select a Resume Plan</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>{plans.map((plan) => (<Grid item xs={12} key={plan.id}><Card onClick={() => setSelectedPlan(plan)} sx={{ p: 2, border: selectedPlan?.id === plan.id ? '2px solid #4caf50' : '1px solid #ddd' }}><Typography>{plan.name}</Typography></Card></Grid>))}</Grid>
                        <Button variant='contained' onClick={handlePlanPayment} disabled={!selectedPlan} sx={{ mt: 2 }}>Proceed to Pay</Button>
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
}