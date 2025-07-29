'use client';

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

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
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    location: '',
    zipCode: '',
    country: '',
    phone: '',
    email: '',
    linkedIn: '',
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
          phone: data.phone || '',
          education: data.education || [],
          skills: data.skills || [],
          experience: data.experience || [],
          internships: data.internships || [],
          projects: data.projects || [],
          desirableJob: data.desirableJob || '',
        });

        setContactInfo({
          firstName: data.fullName ? data.fullName.split(' ')[0] : '',
          lastName: data.fullName ? data.fullName.split(' ').slice(1).join(' ') : '',
          location: '',
          zipCode: '',
          country: '',
          phone: data.phone || '',
          email: data.email || '',
          linkedIn: '',
        });
        setJobTitle(data.desirableJob || '');
        setEducation(data.education || []);
        setWorkExperience(
          Array.isArray(data.experience) && data.experience.length > 0
            ? data.experience.map((exp) => ({
                company: exp.company || '',
                role: exp.role || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
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
        setIsFresher(data.experience?.length === 0);
        setMustHaveSkills(['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Java', 'SQL', 'Git', 'AWS']);
        setSelectedSkills(data.skills || []);
        setLanguages(['English (United States)', 'English (UK)', 'Spanish', 'French', 'German', 'Hindi', 'Chinese']);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response) {
          setError(
            `Failed to load profile data: ${error.response.status} ${error.response.statusText}${
              error.response.data?.message ? ` - ${error.response.data.message}` : ''
            }`
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

  const addEducation = () => setEducation((prev) => [...prev, { degree: '', institution: '', year: '' }]);
  const removeEducation = (index) => setEducation((prev) => prev.filter((_, i) => i !== index));
  const handleEducationChange = (index, field, value) => {
    setEducation((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    );
  };

  const addWorkExp = () =>
    setWorkExperience((prev) => [...prev, { company: '', role: '', startDate: '', endDate: '' }]);
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

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handlePreview = () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }
    setShowPreview(true);
  };

  const handleDownload = async () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }
    if (!selectedPlan) {
      setShowPlans(true);
      return;
    }
    alert('Download functionality is disabled. Please enable jsPDF and html2canvas for PDF generation.');
  };

  const handlePlanPayment = async () => {
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }
    alert(`Payment processed for ${selectedPlan.name}`);
    setShowPlans(false);
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
            }}
          >
            <Typography variant='h6' gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Please add your educational background
            </Typography>
            {education.map((edu, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  position: 'relative',
                  borderRadius: 2,
                }}
              >
                <IconButton
                  onClick={() => removeEducation(index)}
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    zIndex: 1,
                    backgroundColor: '#fff',
                    boxShadow: 1,
                    '&:hover': {
                      backgroundColor: '#fce4e4',
                    },
                  }}
                  aria-label='delete education'
                >
                  <DeleteIcon color='error' />
                </IconButton>
                <Box
                  sx={{
                    p: 2,
                    border: '1px dashed #ccc',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label='Degree'
                        fullWidth
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label='Institution'
                        fullWidth
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label='Year'
                        fullWidth
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            ))}
            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={addEducation}
              sx={{ mt: 2 }}
            >
              Add Education
            </Button>
          </Paper>
        );
      case 4:
        return (
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {isFresher ? 'Please add your internship details' : 'Please add your work experience'}
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
              <Box key={index} sx={{ position: 'relative', mb: 5 }}>
                <IconButton
                  onClick={() => (isFresher ? removeInternship(index) : removeWorkExp(index))}
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    zIndex: 2,
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    boxShadow: 1,
                  }}
                >
                  <DeleteIcon color='error' />
                </IconButton>
                <Box
                  sx={{
                    p: 2,
                    border: '1px dashed #ccc',
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
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
                    <Grid item xs={12} sm={6} md={4}>
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
                    <Grid item xs={12} sm={6} md={4}>
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
                    <Grid item xs={12} sm={6} md={4}>
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
                    {isFresher && (
                      <Grid item xs={12}>
                        <TextField
                          label='Description'
                          fullWidth
                          multiline
                          rows={3}
                          placeholder='Describe your responsibilities and achievements'
                          value={item.description}
                          onChange={(e) =>
                            handleInternshipChange(index, 'description', e.target.value)
                          }
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>
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
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography
              variant='h5'
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
                  backgroundColor: '#fafafa',
                }}
              >
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label='Project Link'
                      fullWidth
                      value={project.link}
                      onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                    <IconButton
                      onClick={() => removeProject(index)}
                      sx={{ mt: { xs: 2, sm: 0 } }}
                      color='error'
                      aria-label='delete project'
                    >
                      <DeleteIcon />
                    </IconButton>
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
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              Add Skills
            </Typography>
            <Grid container spacing={2}>
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
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </Paper>
        );
      case 7:
        return (
          <Box>
            <Typography variant='h5' gutterBottom>
              Choose Resume Template
            </Typography>
            <Grid container spacing={3}>
              {templates.map((template) => (
                <Grid item xs={12} md={6} key={template.id}>
                  <Card
                    onClick={() => setSelectedTemplate(template.id)}
                    sx={{
                      border:
                        selectedTemplate === template.id
                          ? '2px solid #1976d2'
                          : '1px solid #ccc',
                      cursor: 'pointer',
                    }}
                  >
                    <CardContent>
                      <Typography variant='h6' align='center'>
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
            <Box mt={4} display='flex' justifyContent='center' gap={2}>
              <Button
                variant='contained'
                onClick={handlePreview}
                disabled={!selectedTemplate}
              >
                Preview Resume
              </Button>
              <Button
                variant='contained'
                color='success'
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={!selectedTemplate}
              >
                Download Resume
              </Button>
            </Box>
          </Box>
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
            textAlign: isModern ? 'left' : 'center',
            borderBottom: isModern ? '3px solid #1976d2' : '2px solid #000',
            pb: 2,
            mb: 3,
          }}
        >
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
              color: isModern ? '0.555' : '#000',
              mt: isModern ? 1 : 0,
            }}
          >
            {contactInfo.email} | {contactInfo.phone}
            {contactInfo.linkedIn && ` | ${contactInfo.linkedIn}`}
            {contactInfo.location &&
              ` | ${contactInfo.location}${contactInfo.zipCode ? `, ${contactInfo.zipCode}` : ''}`}
            {contactInfo.country && `, ${contactInfo.country}`}
          </Typography>
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
                    <Typography sx={{ fontSize: '0.9rem', color: '#555' }}>
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
                    <Typography sx={{ fontSize: '0.9rem', color: '#555' }}>
                      {exp.startDate} - {exp.endDate}
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
                <Typography sx={{ fontSize: '0.9rem', color: '#555' }}>
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

        {education.length > 0 && (
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
            {education.map((edu, index) => (
              <Box key={index} sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {edu.degree} - {edu.institution}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#555' }}>
                  {edu.year}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  if (loading) return <Typography>Loading profile data...</Typography>;
  if (error)
    return (
      <Box>
        <Typography color='error'>{error}</Typography>
        <Button
          variant='contained'
          onClick={() => router.push('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );

  return (
    <Box p={4} bgcolor='#f5f5f5' minHeight='100vh'>
      <IconButton onClick={() => router.push('/user/Userdashboard')}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant='h6' ml={1}>
        Back to Dashboard
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mt: 4, mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {getStepContent(activeStep)}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button
            variant='contained'
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !resumeFile && !noResume) ||
              (activeStep === 3 && education.length === 0) ||
              (activeStep === 4 && !isFresher && workExperience.length === 0) ||
              (activeStep === 4 && isFresher && internships.length === 0) ||
              (activeStep === 5 && projects.length === 0) ||
              (activeStep === 6 && selectedSkills.length === 0)
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
      <Dialog open={showPlans} onClose={() => setShowPlans(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Select a Resume Plan</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {plans.map((plan) => (
              <Grid item xs={12} key={plan.id}>
                <Card
                  onClick={() => setSelectedPlan(plan)}
                  sx={{
                    p: 2,
                    border:
                      selectedPlan?.id === plan.id ? '2px solid #4caf50' : '1px solid #ddd',
                  }}
                >
                  <Typography>{plan.name}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button
            variant='contained'
            onClick={handlePlanPayment}
            disabled={!selectedPlan}
            sx={{ mt: 2 }}
          >
            Proceed to Pay
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}