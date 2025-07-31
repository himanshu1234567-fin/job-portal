'use client';

import React, { useEffect, useState, useRef } from 'react';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PricingPopup from '../../../components/PremiumPopup';
import Navbar from '../../../components/Navbar'; // Assumed path to your Navbar component

const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean, sleek, and modern layout suited for tech roles.', preview: '/preview-modern.png' },
    { id: 'classic', name: 'Classic', description: 'Traditional layout ideal for government or academic jobs.', preview: '/preview-classic.png' },
];

const steps = ['Upload Resume', 'Contact Information', 'Job Title', 'Educational Background', 'Work Experience', 'Project Details', 'Skills', 'Certificates', 'Interests', 'Choose Template'];

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTwelfthOrDiploma, setShowTwelfthOrDiploma] = useState(false);
  const [showBachelor, setShowBachelor] = useState(false);
  const [showMaster, setShowMaster] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    location: '',
    zipCode: '',
    country: '',
    phone: '',
    email: '',
    linkedIn: '',
    github: '',
    portfolio: '',
    dob: '',
  });
  const [jobTitle, setJobTitle] = useState('');
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English (United States)');
  const [education, setEducation] = useState({
    tenth: { school: '', board: '', startYear: '', passingYear: '', percentage: '' },
    twelfthOrDiploma: { type: '12th', board: '', institution: '', startYear: '', passingYear: '', percentage: '' },
    bachelor: { degree: '', branch: '', institution: '', startYear: '', passingYear: '', cgpa: '' },
    master: { degree: '', branch: '', institution: '', startYear: '', passingYear: '', cgpa: '' },
  });
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
  const [certificates, setCertificates] = useState([]);
  const [interests, setInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState('');
  const resumeRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
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
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.contact || '',
          dob: data.dob?.substr(0, 10) || '',
          education: data.education || [],
          skills: data.skills || [],
          experience: data.experience || [],
          internships: data.internships || [],
          projects: data.projects || [],
          desirableJob: data.desirableJob || [],
          interests: data.interests || [],
        });

        const educationData = data.education || [];
        const tenthData = educationData[0] || {};
        const twelfthData = educationData[0] || {};
        const bachelorData = educationData.find(ed => ed.collegeDegree) || {};
        const masterData = educationData.find(ed => ed.collegeDegree && ed !== bachelorData) || {};

        setContactInfo({
          firstName: data.fullName ? data.fullName.split(' ')[0] : '',
          lastName: data.fullName ? data.fullName.split(' ').slice(1).join(' ') : '',
          location: '',
          zipCode: '',
          country: '',
          phone: data.contact || '',
          email: data.email || '',
          linkedIn: '',
          github: '',
          portfolio: '',
          dob: data.dob?.substr(0, 10) || '',
        });

        setJobTitle(data.desirableJob && data.desirableJob.length > 0 ? data.desirableJob[0] : '');
        setEducation({
          tenth: {
            school: tenthData.school || '',
            board: tenthData.board10 || '',
            startYear: tenthData.startYear || '',
            passingYear: tenthData.passingYear ? String(tenthData.passingYear) : '',
            percentage: tenthData.percentage10 ? String(tenthData.percentage10) : '',
          },
          twelfthOrDiploma: {
            type: '12th',
            board: twelfthData.board12 || '',
            institution: twelfthData.institution || '',
            startYear: twelfthData.startYear || '',
            passingYear: twelfthData.passingYear ? String(twelfthData.passingYear) : '',
            percentage: twelfthData.percentage12 ? String(twelfthData.percentage12) : '',
          },
          bachelor: {
            degree: bachelorData.collegeDegree || '',
            branch: bachelorData.branch || '',
            institution: bachelorData.college || '',
            startYear: bachelorData.startYear || '',
            passingYear: bachelorData.passingYear ? String(bachelorData.passingYear) : '',
            cgpa: bachelorData.cgpa ? String(bachelorData.cgpa) : '',
          },
          master: {
            degree: masterData.collegeDegree || '',
            branch: masterData.branch || '',
            institution: masterData.college || '',
            startYear: masterData.startYear || '',
            passingYear: masterData.passingYear ? String(masterData.passingYear) : '',
            cgpa: masterData.cgpa ? String(masterData.cgpa) : '',
          },
        });

        setShowTwelfthOrDiploma(!!twelfthData.board12 || !!twelfthData.institution);
        setShowBachelor(!!bachelorData.collegeDegree);
        setShowMaster(!!masterData.collegeDegree);

        setWorkExperience(
          Array.isArray(data.experience) && data.experience.length > 0
            ? data.experience.map((exp) => ({
              company: exp.companyName || '',
              role: exp.role || '',
              startDate: '',
              endDate: '',
              description: '',
            }))
            : []
        );
        setInternships(
          Array.isArray(data.internships) && data.internships.length > 0
            ? data.internships.map((intern) => ({
              company: intern.company || '',
              role: intern.role || '',
              startDate: intern.startDate || '',
              endDate: intern.endDate || '',
              description: intern.description || '',
            }))
            : []
        );
        setProjects(
          Array.isArray(data.projects) && data.projects.length > 0
            ? data.projects.map((proj) => ({
              title: proj.title || '',
              description: proj.description || '',
              techStack: proj.techStack || '',
              link: proj.link || '',
            }))
            : []
        );
        setInterests(data.interests || []);
        setIsFresher(data.experience?.length === 0);
        setMustHaveSkills(['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Java', 'SQL', 'Git', 'AWS']);
        setSelectedSkills(data.skills || []);
        setLanguages(['English (United States)', 'English (UK)', 'Spanish', 'French', 'German', 'Hindi', 'Chinese']);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response) {
          setError(
            `Failed to load profile data: ${error.response.status} ${error.response.statusText}${error.response.data?.message ? ` - ${error.response.data.message}` : ''}`
          );
        } else if (error.request) {
          setError('Failed to load profile data: Unable to connect to the server. Please check if the server is running.');
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

  const handleContactChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (section, field, value) => {
    setEducation((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleTwelfthOrDiplomaTypeChange = (value) => {
    setEducation((prev) => ({
      ...prev,
      twelfthOrDiploma: { ...prev.twelfthOrDiploma, type: value, board: '', institution: '', startYear: '', passingYear: '', percentage: '' },
    }));
  };

  const addWorkExp = () =>
    setWorkExperience((prev) => [...prev, { company: '', role: '', startDate: '', endDate: '', description: '' }]);
  const removeWorkExp = (index) => setWorkExperience((prev) => prev.filter((_, i) => i !== index));
  const handleWorkExpChange = (index, field, value) => {
    setWorkExperience((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  const addInternship = () =>
    setInternships((prev) => [...prev, { company: '', role: '', startDate: '', endDate: '', description: '' }]);
  const removeInternship = (index) => setInternships((prev) => prev.filter((_, i) => i !== index));
  const handleInternshipChange = (index, field, value) => {
    setInternships((prev) =>
      prev.map((intern, i) => (i === index ? { ...intern, [field]: value } : intern))
    );
  };

  const handleProjectChange = (index, field, value) => {
    setProjects((prev) =>
      prev.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj))
    );
  };

  const addProject = () =>
    setProjects((prev) => [...prev, { title: '', description: '', techStack: '', link: '' }]);
  const removeProject = (index) => setProjects((prev) => prev.filter((_, i) => i !== index));

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const removeSkill = (index) => {
    setSelectedSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests((prev) => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const removeInterest = (index) => {
    setInterests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setShowPreview(true);
  };

  const handleDownload = async () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }
    setShowPremiumPopup(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPremiumPopup(false);
    try {
      const resumeElement = resumeRef.current;
      if (!resumeElement) {
        alert('Error: Resume element not found.');
        return;
      }

      const canvas = await html2canvas(resumeElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${contactInfo.firstName}_${contactInfo.lastName}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              maxWidth: 500,
              mx: 'auto',
              borderRadius: 2,
              boxShadow: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.01)' },
            }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1rem' }}
            >
              Upload your resume
            </Typography>
            <Typography variant='body2' gutterBottom sx={{ color: '#555', mb: 2 }}>
              We’ll customize it for your application regardless of its shape.
            </Typography>
            <Box
              sx={{
                mt: 1,
                p: 3,
                border: '2px dashed #1976d2',
                borderRadius: 2,
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': { backgroundColor: '#e3f2fd' },
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0) handleFileChange({ target: { files: e.dataTransfer.files } });
              }}
            >
              <Typography variant='subtitle1' sx={{ mb: 1, color: '#1976d2', fontSize: '0.95rem' }}>
                Drag and drop your resume here
              </Typography>
              <Typography variant='caption' sx={{ mb: 2, color: '#666' }}>
                or (up to 20MB)
              </Typography>
              <Button
                variant='contained'
                component='label'
                sx={{ mb: 2, fontSize: '0.8rem', py: 0.5, px: 2 }}
              >
                Select file
                <input type='file' hidden onChange={handleFileChange} />
              </Button>
              <Typography
                variant='caption'
                sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setNoResume(true)}
              >
                I don’t have a resume
              </Typography>
              {(resumeFile || noResume) && (
                <Button
                  variant='contained'
                  onClick={handleNext}
                  sx={{
                    mt: 2,
                    backgroundColor: '#4caf50',
                    fontSize: '0.8rem',
                    '&:hover': { backgroundColor: '#388e3c' },
                  }}
                  disabled={!resumeFile && !noResume}
                >
                  Continue
                </Button>
              )}
            </Box>
          </Paper>
        );
      case 1:
        return (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              maxWidth: 800,
              mx: 'auto',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
            >
              Your Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    border: '2px dashed #1976d2',
                    borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '&:hover': { backgroundColor: '#e3f2fd' },
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files.length > 0) {
                      setProfileImage(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <Typography variant='subtitle1' sx={{ mb: 1, color: '#1976d2' }}>
                    {profileImage ? 'Profile Image Selected' : 'Upload Profile Image (optional)'}
                  </Typography>
                  {profileImage && (
                    <Typography variant='caption' sx={{ mb: 1, color: '#666' }}>
                      {profileImage.name}
                    </Typography>
                  )}
                  <Button
                    variant='contained'
                    component='label'
                    sx={{ mb: 2, fontSize: '0.8rem', py: 0.5, px: 2 }}
                  >
                    Select Image
                    <input
                      type='file'
                      hidden
                      accept='image/*'
                      onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                  </Button>
                  <Typography variant='caption' sx={{ color: '#666' }}>
                    Recommended size: 150x150px (JPG, PNG, up to 5MB)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='First Name'
                  fullWidth
                  size='small'
                  value={contactInfo.firstName}
                  onChange={(e) => handleContactChange('firstName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Last Name'
                  fullWidth
                  size='small'
                  value={contactInfo.lastName}
                  onChange={(e) => handleContactChange('lastName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Date of Birth'
                  type='date'
                  fullWidth
                  size='small'
                  InputLabelProps={{ shrink: true }}
                  value={contactInfo.dob}
                  onChange={(e) => handleContactChange('dob', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Location'
                  fullWidth
                  size='small'
                  value={contactInfo.location}
                  onChange={(e) => handleContactChange('location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='ZIP Code (optional)'
                  fullWidth
                  size='small'
                  value={contactInfo.zipCode}
                  onChange={(e) => handleContactChange('zipCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Country (optional)'
                  fullWidth
                  size='small'
                  value={contactInfo.country}
                  onChange={(e) => handleContactChange('country', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Phone'
                  fullWidth
                  size='small'
                  value={contactInfo.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Email'
                  fullWidth
                  size='small'
                  value={contactInfo.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='LinkedIn (optional)'
                  fullWidth
                  size='small'
                  value={contactInfo.linkedIn}
                  onChange={(e) => handleContactChange('linkedIn', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='GitHub Profile (optional)'
                  fullWidth
                  size='small'
                  value={contactInfo.github}
                  onChange={(e) => handleContactChange('github', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Portfolio Website (optional)'
                  fullWidth
                  size='small'
                  value={contactInfo.portfolio}
                  onChange={(e) => handleContactChange('portfolio', e.target.value)}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mt: 3 }} size='small'>
              <InputLabel>Choose Language</InputLabel>
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                label='Choose Language'
              >
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>This will help us optimize your resume accordingly</FormHelperText>
            </FormControl>
          </Paper>
        );
      case 2:
        return (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              maxWidth: 600,
              mx: 'auto',
              boxShadow: 2,
              backgroundColor: '#fafafa',
            }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              What job are you applying for?
            </Typography>
            <TextField
              label='Job Title'
              variant='outlined'
              fullWidth
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder='e.g., Frontend Developer'
              sx={{ mt: 2 }}
            />
            <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
              Please provide a job title so we can tailor your resume to the desired role.
            </Typography>
          </Paper>
        );
      case 3:
        return (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Educational Background
            </Typography>
            {/* 10th Board - Always visible */}
            <Box sx={{ mb: 3, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
              <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 'bold' }}>
                10th Board
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='School'
                    fullWidth
                    value={education.tenth.school}
                    onChange={(e) => handleEducationChange('tenth', 'school', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Board'
                    fullWidth
                    value={education.tenth.board}
                    onChange={(e) => handleEducationChange('tenth', 'board', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Start Year'
                    fullWidth
                    value={education.tenth.startYear}
                    onChange={(e) => handleEducationChange('tenth', 'startYear', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Passing Year'
                    fullWidth
                    value={education.tenth.passingYear}
                    onChange={(e) => handleEducationChange('tenth', 'passingYear', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label='Percentage'
                    fullWidth
                    value={education.tenth.percentage}
                    onChange={(e) => handleEducationChange('tenth', 'percentage', e.target.value)}
                  />
                </Grid>
              </Grid>
              {/* Add Education Button for 12th/Diploma */}
              {!showTwelfthOrDiploma && (
                <Button
                  variant='outlined'
                  startIcon={<AddIcon />}
                  onClick={() => setShowTwelfthOrDiploma(true)}
                  sx={{ mt: 2 }}
                >
                  Add Education
                </Button>
              )}
            </Box>
            {/* 12th/Diploma Section */}
            {showTwelfthOrDiploma && (
              <Box sx={{ mb: 3, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 'bold' }}>
                  12th / Diploma
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={education.twelfthOrDiploma.type}
                    onChange={(e) => handleTwelfthOrDiplomaTypeChange(e.target.value)}
                    label='Type'
                  >
                    <MenuItem value='12th'>12th Board</MenuItem>
                    <MenuItem value='Diploma'>Diploma</MenuItem>
                  </Select>
                </FormControl>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={education.twelfthOrDiploma.type === '12th' ? 'Board' : 'Institution'}
                      fullWidth
                      value={education.twelfthOrDiploma.type === '12th' ? education.twelfthOrDiploma.board : education.twelfthOrDiploma.institution}
                      onChange={(e) => handleEducationChange('twelfthOrDiploma', education.twelfthOrDiploma.type === '12th' ? 'board' : 'institution', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Start Year'
                      fullWidth
                      value={education.twelfthOrDiploma.startYear}
                      onChange={(e) => handleEducationChange('twelfthOrDiploma', 'startYear', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Passing Year'
                      fullWidth
                      value={education.twelfthOrDiploma.passingYear}
                      onChange={(e) => handleEducationChange('twelfthOrDiploma', 'passingYear', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Percentage'
                      fullWidth
                      value={education.twelfthOrDiploma.percentage}
                      onChange={(e) => handleEducationChange('twelfthOrDiploma', 'percentage', e.target.value)}
                    />
                  </Grid>
                </Grid>
                {/* Add Education Button for Bachelor's */}
                {showTwelfthOrDiploma && !showBachelor && (
                  <Button
                    variant='outlined'
                    startIcon={<AddIcon />}
                    onClick={() => setShowBachelor(true)}
                    sx={{ mt: 2 }}
                  >
                    Add Education
                  </Button>
                )}
              </Box>
            )}
            {/* Bachelor's Section */}
            {showBachelor && (
              <Box sx={{ mb: 3, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 'bold' }}>
                  Bachelor’s Degree
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Degree'
                      fullWidth
                      value={education.bachelor.degree}
                      onChange={(e) => handleEducationChange('bachelor', 'degree', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Branch'
                      fullWidth
                      value={education.bachelor.branch}
                      onChange={(e) => handleEducationChange('bachelor', 'branch', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Institution'
                      fullWidth
                      value={education.bachelor.institution}
                      onChange={(e) => handleEducationChange('bachelor', 'institution', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label='Start Year'
                      fullWidth
                      value={education.bachelor.startYear}
                      onChange={(e) => handleEducationChange('bachelor', 'startYear', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label='Passing Year'
                      fullWidth
                      value={education.bachelor.passingYear}
                      onChange={(e) => handleEducationChange('bachelor', 'passingYear', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label='CGPA'
                      fullWidth
                      value={education.bachelor.cgpa}
                      onChange={(e) => handleEducationChange('bachelor', 'cgpa', e.target.value)}
                    />
                  </Grid>
                </Grid>
                {/* Add Education Button for Master's */}
                {showBachelor && !showMaster && (
                  <Button
                    variant='outlined'
                    startIcon={<AddIcon />}
                    onClick={() => setShowMaster(true)}
                    sx={{ mt: 2 }}
                  >
                    Add Education
                  </Button>
                )}
              </Box>
            )}
            {/* Master's Section */}
            {showMaster && (
              <Box sx={{ mb: 3, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 'bold' }}>
                  Master’s Degree
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Degree'
                      fullWidth
                      value={education.master.degree}
                      onChange={(e) => handleEducationChange('master', 'degree', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Branch'
                      fullWidth
                      value={education.master.branch}
                      onChange={(e) => handleEducationChange('master', 'branch', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Institution'
                      fullWidth
                      value={education.master.institution}
                      onChange={(e) => handleEducationChange('master', 'institution', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label='Start Year'
                      fullWidth
                      value={education.master.startYear}
                      onChange={(e) => handleEducationChange('master', 'startYear', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label='Passing Year'
                      fullWidth
                      value={education.master.passingYear}
                      onChange={(e) => handleEducationChange('master', 'passingYear', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label='CGPA'
                      fullWidth
                      value={education.master.cgpa}
                      onChange={(e) => handleEducationChange('master', 'cgpa', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        );
      case 4:
        return (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              {isFresher ? 'Internship Details' : 'Work Experience'}
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isFresher}
                  onChange={(e) => setIsFresher(e.target.checked)}
                  color='primary'
                />
              }
              label='I am a fresher (no full-time work experience)'
              sx={{ mb: 3 }}
            />

            {(isFresher ? internships : workExperience).map((item, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2,
                  border: '1px dashed #ccc',
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={() => (isFresher ? removeInternship(index) : removeWorkExp(index))}
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    boxShadow: 1,
                  }}
                >
                  <DeleteIcon color='error' />
                </IconButton>

                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 'bold' }}>
                  {isFresher ? `Internship ${index + 1}` : `Experience ${index + 1}`}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Company'
                      fullWidth
                      value={item.company}
                      onChange={(e) =>
                        isFresher
                          ? handleInternshipChange(index, 'company', e.target.value)
                          : handleWorkExpChange(index, 'company', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Role'
                      fullWidth
                      value={item.role}
                      onChange={(e) =>
                        isFresher
                          ? handleInternshipChange(index, 'role', e.target.value)
                          : handleWorkExpChange(index, 'role', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Start Date'
                      type='date'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={item.startDate}
                      onChange={(e) =>
                        isFresher
                          ? handleInternshipChange(index, 'startDate', e.target.value)
                          : handleWorkExpChange(index, 'startDate', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='End Date'
                      type='date'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={item.endDate}
                      onChange={(e) =>
                        isFresher
                          ? handleInternshipChange(index, 'endDate', e.target.value)
                          : handleWorkExpChange(index, 'endDate', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label='Description'
                      fullWidth
                      multiline
                      rows={3}
                      placeholder='Describe your responsibilities and achievements'
                      value={item.description}
                      onChange={(e) =>
                        isFresher
                          ? handleInternshipChange(index, 'description', e.target.value)
                          : handleWorkExpChange(index, 'description', e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={isFresher ? addInternship : addWorkExp}
              sx={{ mt: 2 }}
            >
              {isFresher ? 'Add Internship' : 'Add Work Experience'}
            </Button>
          </Paper>


        );
      case 5:
        return (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              Project Details
            </Typography>

            {projects.map((project, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2,
                  border: '1px dashed #ccc',
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={() => removeProject(index)}
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    boxShadow: 1,
                  }}
                  color='error'
                  aria-label='delete project'
                >
                  <DeleteIcon />
                </IconButton>

                <Typography
                  variant='subtitle1'
                  sx={{ mb: 2, fontWeight: 'bold' }}
                >
                  {`Project ${index + 1}`}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Project Title'
                      fullWidth
                      value={project.title}
                      onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Tech Stack'
                      fullWidth
                      value={project.techStack}
                      onChange={(e) => handleProjectChange(index, 'techStack', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label='Project Description'
                      fullWidth
                      multiline
                      rows={3}
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label='Project Link'
                      fullWidth
                      value={project.link}
                      onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={addProject}
              sx={{ mt: 2 }}
            >
              Add Project
            </Button>
          </Paper>
        );

      case 6:
        return (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              Add Skills
            </Typography>

            <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 'bold' }}>
              Must-Have Skills
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {mustHaveSkills.map((skill) => (
                <Grid item xs={12} sm={6} md={4} key={skill}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        color='primary'
                      />
                    }
                    label={skill}
                  />
                </Grid>
              ))}
            </Grid>

            {selectedSkills.some(skill => !mustHaveSkills.includes(skill)) && (
              <>
                <Typography variant='subtitle1' sx={{ mb: 2, fontWeight: 'bold' }}>
                  Custom Skills
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {selectedSkills.map((skill, index) => (
                    !mustHaveSkills.includes(skill) && (
                      <Grid item xs={12} sm={6} md={4} key={skill}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography>{skill}</Typography>
                          <IconButton
                            onClick={() => removeSkill(index)}
                            color='error'
                            aria-label='delete skill'
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    )
                  ))}
                </Grid>
              </>
            )}

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' },
              }}
            >
              <TextField
                label='Add Custom Skill'
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                fullWidth
              />
              <Button
                variant='contained'
                onClick={addCustomSkill}
                disabled={!customSkill.trim()}
                sx={{ whiteSpace: 'nowrap', mt: { xs: 1, sm: 0 } }}
              >
                Add Skill
              </Button>
            </Box>
          </Paper>
        );

      case 7:
        return (
          <Paper
            sx={{
              p: 3,
              mb: 4,
              maxWidth: 800,
              mx: 'auto',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
            >
              Certificates
            </Typography>
            {certificates.map((cert, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 3,
                  p: 2,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  backgroundColor: '#fafafa',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="Certificate Name"
                      fullWidth
                      size="small"
                      value={cert.name}
                      onChange={(e) => {
                        const updated = [...certificates];
                        updated[idx].name = e.target.value;
                        setCertificates(updated);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ fontSize: '0.8rem' }}
                    >
                      {cert.file ? cert.file.name : 'Select Certificate File'}
                      <input
                        type="file"
                        hidden
                        accept="application/pdf,image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const updated = [...certificates];
                            updated[idx].file = file;
                            setCertificates(updated);
                          }
                        }}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setCertificates(certificates.filter((_, i) => i !== idx))}
                      size="small"
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="contained"
                onClick={() =>
                  setCertificates([...certificates, { name: '', file: null }])
                }
              >
                + Add Certificate
              </Button>
            </Box>
          </Paper>
        );
      case 8:
        return (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              Add Interests
            </Typography>

            {interests.length > 0 && (
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {interests.map((interest, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{interest}</Typography>
                      <IconButton
                        onClick={() => removeInterest(index)}
                        color='error'
                        aria-label='delete interest'
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' },
              }}
            >
              <TextField
                label='Add Interest'
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                fullWidth
              />
              <Button
                variant='contained'
                onClick={addCustomInterest}
                disabled={!customInterest.trim()}
                sx={{ whiteSpace: 'nowrap', mt: { xs: 1, sm: 0 } }}
              >
                Add Interest
              </Button>
            </Box>
          </Paper>
        );

      case 9:
        return (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: '#fafafa',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Typography
              variant='h6'
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              Choose Resume Template
            </Typography>

            <Grid container spacing={3}>
              {templates.map((template) => (
                <Grid item xs={12} md={6} key={template.id}>
                  <Card
                    onClick={() => handleTemplateSelect(template.id)}
                    sx={{
                      height: '100%',
                      minHeight: 130, // Ensures all cards align
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      border:
                        selectedTemplate === template.id
                          ? '2px solid #1976d2'
                          : '1px solid #ccc',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 3,
                      },
                      backgroundColor:
                        selectedTemplate === template.id ? '#e3f2fd' : 'inherit',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant='h6'
                        align='center'
                        sx={{ fontWeight: 'bold' }}
                      >
                        {template.name}
                      </Typography>
                      <Typography
                        variant='body2'
                        align='center'
                        color='text.secondary'
                      >
                        {template.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {selectedTemplate && (
              <Box mt={4} display='flex' justifyContent='center'>
                <Button
                  variant='contained'
                  color='success'
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                >
                  Download Resume
                </Button>
              </Box>
            )}
          </Paper>
        );

      default:
        return <Typography>Step not found</Typography>;
    }
  };

  const ModernResume = () => {
    const isModern = selectedTemplate === 'modern';

    return (
      <Box
        id='resume'
        ref={resumeRef}
        sx={{
          p: isModern ? 4 : 3,
          maxWidth: '800px',
          margin: 'auto',
          bgcolor: 'white',
          boxShadow: 3,
          border: isModern ? '1px solid #e0e0e0' : 'none',
          fontFamily: isModern ? "'Roboto', sans-serif" : "'Times New Roman', Times, serif",
          color: '#333',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: profileImage ? 'row' : 'column',
            alignItems: profileImage ? 'flex-start' : isModern ? 'flex-start' : 'center',
            gap: profileImage ? 2 : 0,
            borderBottom: isModern ? '3px solid #1976d2' : '2px solid #000',
            pb: 2,
            mb: 3,
            textAlign: profileImage ? 'left' : isModern ? 'left' : 'center',
          }}
        >
          {profileImage && (
            <Box
              component='img'
              src={typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage)}
              alt='Profile'
              sx={{
                width: '120px',
                height: '120px',
                borderRadius: isModern ? '50%' : '0',
                objectFit: 'cover',
                border: isModern ? '2px solid #e0e0e0' : '1px solid #000',
              }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant='h3'
              sx={{
                fontWeight: isModern ? 'bold' : 'normal',
                fontSize: isModern ? '2.5rem' : '2rem',
                color: isModern ? '#1976d2' : '#000',
              }}
            >
              {contactInfo.firstName} {contactInfo.lastName}
            </Typography>
            <Typography
              variant='body1'
              sx={{
                fontSize: isModern ? '1rem' : '0.9rem',
                color: isModern ? 'text.secondary' : '#000',
                mt: isModern ? 1 : 0,
              }}
            >
              {contactInfo.email} | {contactInfo.phone}
              {contactInfo.dob && ` | DOB: ${contactInfo.dob}`}
              {contactInfo.linkedIn && ` | ${contactInfo.linkedIn}`}
              {contactInfo.github && ` | ${contactInfo.github}`}
              {contactInfo.portfolio && ` | ${contactInfo.portfolio}`}
              {contactInfo.location &&
                ` | ${contactInfo.location}${contactInfo.zipCode ? `, ${contactInfo.zipCode}` : ''}`}
              {contactInfo.country && `, ${contactInfo.country}`}
            </Typography>
          </Box>
        </Box>
        {jobTitle && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='h5'
              sx={{
                fontWeight: isModern ? 'bold' : 'normal',
                fontSize: isModern ? '1.25rem' : '1.1rem',
                color: isModern ? '#1976d2' : '#000',
                borderBottom: isModern ? '2px solid #e0e0e0' : '1px solid #000',
                pb: 0.5,
              }}
            >
              {isModern ? 'Career Objective' : 'Objective'}
            </Typography>
            <Typography sx={{ mt: 1, fontSize: '0.95rem' }}>
              Seeking a position as a {jobTitle} to leverage my skills and experience in a dynamic environment.
            </Typography>
          </Box>
        )}
        {selectedSkills.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='h5'
              sx={{
                fontWeight: isModern ? 'bold' : 'normal',
                fontSize: isModern ? '1.25rem' : '1.1rem',
                color: isModern ? '#1976d2' : '#000',
                borderBottom: isModern ? '2px solid #e0e0e0' : '1px solid #000',
                pb: 0.5,
              }}
            >
              Skills
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 1,
              }}
            >
              {selectedSkills.map((skill, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: '0.95rem',
                    backgroundColor: isModern ? '#e3f2fd' : 'transparent',
                    borderRadius: isModern ? '12px' : 'none',
                    padding: isModern ? '4px 12px' : '0',
                    display: 'inline-block',
                  }}
                >
                  {skill}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
        {(education.tenth.board || (showTwelfthOrDiploma && (education.twelfthOrDiploma.board || education.twelfthOrDiploma.institution)) || (showBachelor && education.bachelor.degree) || (showMaster && education.master.degree)) && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='h5'
              sx={{
                fontWeight: isModern ? 'bold' : 'normal',
                fontSize: isModern ? '1.25rem' : '1.1rem',
                color: isModern ? '#1976d2' : '#000',
                borderBottom: isModern ? '2px solid #e0e0e0' : '1px solid #000',
                pb: 0.5,
              }}
            >
              Education
            </Typography>
            {education.tenth.board && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  10th Board - {education.tenth.school}, {education.tenth.board}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                  {education.tenth.startYear} - {education.tenth.passingYear} | Percentage: {education.tenth.percentage}%
                </Typography>
              </Box>
            )}
            {showTwelfthOrDiploma && (education.twelfthOrDiploma.board || education.twelfthOrDiploma.institution) && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {education.twelfthOrDiploma.type === '12th' ? '12th Board' : 'Diploma'} - {education.twelfthOrDiploma.type === '12th' ? education.twelfthOrDiploma.board : education.twelfthOrDiploma.institution}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                  {education.twelfthOrDiploma.startYear} - {education.twelfthOrDiploma.passingYear} | Percentage: {education.twelfthOrDiploma.percentage}%
                </Typography>
              </Box>
            )}
            {showBachelor && education.bachelor.degree && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {education.bachelor.degree} ({education.bachelor.branch}) - {education.bachelor.institution}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                  {education.bachelor.startYear} - {education.bachelor.passingYear} | CGPA: {education.bachelor.cgpa}
                </Typography>
              </Box>
            )}
            {showMaster && education.master.degree && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {education.master.degree} ({education.master.branch}) - {education.master.institution}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                  {education.master.startYear} - {education.master.passingYear} | CGPA: {education.master.cgpa}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {(workExperience.length > 0 || internships.length > 0) && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='h5'
              sx={{
                fontWeight: isModern ? 'bold' : 'normal',
                fontSize: isModern ? '1.25rem' : '1.1rem',
                color: isModern ? '#1976d2' : '#000',
                borderBottom: isModern ? '2px solid #e0e0e0' : '1px solid #000',
                pb: 0.5,
              }}
            >
              {isFresher ? 'Internships' : 'Work Experience'}
            </Typography>
            {isFresher
              ? internships.map((intern, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {intern.role} - {intern.company}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                    {intern.startDate} - {intern.endDate}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', mt: 1 }}>
                    {intern.description}
                  </Typography>
                </Box>
              ))
              : workExperience.map((exp, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {exp.role} - {exp.company}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                    {exp.startDate} - {exp.endDate}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', mt: 1 }}>
                    {exp.description}
                  </Typography>
                </Box>
              ))}
          </Box>
        )}
        {projects.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='h5'
              sx={{
                fontWeight: isModern ? 'bold' : 'normal',
                fontSize: isModern ? '1.25rem' : '1.1rem',
                color: isModern ? '#1976d2' : '#000',
                borderBottom: isModern ? '2px solid #e0e0e0' : '1px solid #000',
                pb: 0.5,
              }}
            >
              Projects
            </Typography>
            {projects.map((project, index) => (
              <Box key={index} sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {project.title}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                  Tech Stack: {project.techStack}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', mt: 1 }}>
                  {project.description}
                </Typography>
                {project.link && (
                  <Typography sx={{ fontSize: '0.9rem', color: '#1976d2', mt: 0.5 }}>
                    <a href={project.link} target='_blank' rel='noopener noreferrer'>
                      {project.link}
                    </a>
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
        {certificates.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='h5'
              sx={{
                fontWeight: isModern ? 'bold' : 'normal',
                fontSize: isModern ? '1.25rem' : '1.1rem',
                color: isModern ? '#1976d2' : '#000',
                borderBottom: isModern ? '2px solid #e0e0e0' : '1px solid #000',
                pb: 0.5,
              }}
            >
              Certificates
            </Typography>
            {certificates.map((cert, index) => (
              <Box key={index} sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {cert.name}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        {interests.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant='h5'
              sx={{
                fontWeight: isModern ? 'bold' : 'normal',
                fontSize: isModern ? '1.25rem' : '1.1rem',
                color: isModern ? '#1976d2' : '#000',
                borderBottom: isModern ? '2px solid #e0e0e0' : '1px solid #000',
                pb: 0.5,
              }}
            >
              Interests
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 1,
              }}
            >
              {interests.map((interest, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: '0.95rem',
                    backgroundColor: isModern ? '#e3f2fd' : 'transparent',
                    borderRadius: isModern ? '12px' : 'none',
                    padding: isModern ? '4px 12px' : '0',
                    display: 'inline-block',
                  }}
                >
                  {interest}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  };


  return (
    <Box p={{ xs: 2, sm: 4 }} bgcolor='#f5f5f5' minHeight='100vh'>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => router.push('/')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h6'>
          Back to Dashboard
        </Typography>
      </Box>
      <Box sx={{ overflowX: 'auto', mb: 4, '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2', borderRadius: '4px' } }}>
        <Stepper activeStep={activeStep} sx={{ minWidth: { xs: '800px', sm: 'auto' } }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: { xs: '0.8rem', sm: '1rem' } } }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {getStepContent(activeStep)}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Button
          variant='outlined'
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button
            variant='contained'
            onClick={handleNext}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            disabled={
              (activeStep === 0 && !resumeFile && !noResume)
            }
          >
            Continue
          </Button>
        )}
      </Box>
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth='md' fullWidth>
        <DialogTitle>
          Resume Preview - {templates.find((t) => t.id === selectedTemplate)?.name || 'Template'}
        </DialogTitle>
        <DialogContent>
          <ModernResume />
        </DialogContent>
      </Dialog>
      <PricingPopup open={showPremiumPopup} handleClose={handlePaymentSuccess} />
    </Box>
  );
}