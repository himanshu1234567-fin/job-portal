'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Chip,
  Stack,
  Paper,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useSnackbar } from 'notistack';

export default function AddJobPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [jobData, setJobData] = useState({
    title: '',
    level: '',
    company: '',
    location: '',
    salary: '',
    recruiter: '',
    about: '',
    description: '',
    tags: {
      remote: false,
      onsite: false,
    },
    skills: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleTagChange = (e) => {
    const { name, checked } = e.target;
    setJobData((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      ...jobData,
      skillsArray: jobData.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    enqueueSnackbar('Job added successfully!', { variant: 'success' });

    // You can send finalData to your API
    console.log('Submitted Job:', finalData);

    setJobData({
      title: '',
      level: '',
      company: '',
      location: '',
      salary: '',
      recruiter: '',
      about: '',
      description: '',
      tags: { remote: false, onsite: false },
      skills: ''
    });
  };

  const parsedSkills = jobData.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Add New Job
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name="title" label="Job Title" value={jobData.title} onChange={handleChange} required />
            </Grid>

            {/* Level */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="level"
                label="Job Level"
                value={jobData.level}
                onChange={handleChange}
                required
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </TextField>
            </Grid>

            {/* Company */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name="company" label="Company Name" value={jobData.company} onChange={handleChange} required />
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name="location" label="Location" value={jobData.location} onChange={handleChange} required />
            </Grid>

            {/* Salary */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name="salary" label="Salary Range" value={jobData.salary} onChange={handleChange} required />
            </Grid>

            {/* Recruiter */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth name="recruiter" label="Recruiter Name" value={jobData.recruiter} onChange={handleChange} required />
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={jobData.tags.remote} onChange={handleTagChange} name="remote" />}
                label="Remote"
              />
              <FormControlLabel
                control={<Checkbox checked={jobData.tags.onsite} onChange={handleTagChange} name="onsite" />}
                label="Onsite"
              />
            </Grid>

            {/* Skills */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="skills"
                label="Skills Required (comma separated)"
                value={jobData.skills}
                onChange={handleChange}
              />
              {parsedSkills.length > 0 && (
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  {parsedSkills.map((skill, index) => (
                    <Chip key={index} label={skill} color="primary" />
                  ))}
                </Stack>
              )}
            </Grid>

            {/* Job Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Job Description"
                multiline
                rows={4}
                value={jobData.description}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* About */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="about"
                label="About the Company"
                multiline
                rows={3}
                value={jobData.about}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit Job
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* PREVIEW SECTION */}
<Box mt={6}>
  <Typography variant="h5" gutterBottom>
    Job Preview
  </Typography>
  <Paper elevation={2} sx={{ p: 3 }}>
    <Typography variant="h6">{jobData.title || 'Job Title'}</Typography>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {jobData.company || 'Company Name'} - {jobData.level || 'Level'}
    </Typography>

    {/* Tags */}
    <Stack direction="row" spacing={1} mt={1}>
      {jobData.tags.remote && <Chip label="Remote" color="success" />}
      {jobData.tags.onsite && <Chip label="Onsite" color="warning" />}
    </Stack>

    {/* Location & Salary */}
    <Typography variant="body2" mt={1}>
      📍 {jobData.location || 'Location'} | 💰 {jobData.salary || 'Salary'}
    </Typography>

    {/* Skills */}
    <Typography variant="subtitle2" mt={2}>
      Skills Required:
    </Typography>
    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
      {parsedSkills.length > 0 ? (
        parsedSkills.map((skill, idx) => (
          <Chip key={idx} label={skill} variant="outlined" color="primary" />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No skills added
        </Typography>
      )}
    </Stack>

    {/* Description */}
    <Typography variant="subtitle2" mt={3}>
      Job Description:
    </Typography>
    <Typography variant="body2" mt={1}>
      {jobData.description || 'Job description goes here...'}
    </Typography>

    {/* About */}
    <Typography variant="subtitle2" mt={3}>
      About Company:
    </Typography>
    <Typography variant="body2" mt={1}>
      {jobData.about || 'Company details...'}
    </Typography>

    {/* Recruiter */}
    <Typography variant="body2" mt={2} color="text.secondary">
      Recruiter: {jobData.recruiter || 'Recruiter Name'}
    </Typography>
  </Paper>
</Box>

      </Paper>
    </Box>
  );
}
