"use client";

import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Typography, Grid, Stepper, Step,
  StepLabel, IconButton, CircularProgress, Paper, Chip, Avatar,
  FormControlLabel, Switch, Alert
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const steps = ["Personal Details", "Education", "Experience", "Skills & Resume"];

// Initial education entry: first has 10th/12th + college; subsequent only college
const initialEducationFull = {
  board10: "", percent10: "",
  board12: "", percent12: "",
  college: "", collegeDegree: "", branch: "", passingYear: "", cgpa: ""
};
const initialEducationCollege = {
  college: "", collegeDegree: "", branch: "", passingYear: "", cgpa: ""
};

export default function ProfileForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    dob: "",
    address: "",
    profileImage: "",
    resume: "",
    education: [initialEducationFull],
    isFresher: false,
    companyName: "",
    designation: "",
    yearsOfExperience: "",
    skills: [],
    skillInput: "",
    desirableJobs: [],
    desirableJobInput: "",
  });
  const [candidateId, setCandidateId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const [error, setError] = useState("");

  // Handle image upload
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(pd => ({
        ...pd,
        profileImage: URL.createObjectURL(file)
      }));
    }
  };

  // Handle resume upload (PDF only)
  const handleResumeUpload = e => {
    const file = e.target.files[0];
    if (file?.type !== "application/pdf") {
      setError("Only PDF resumes allowed");
      return;
    }
    setProfileData(pd => ({ ...pd, resume: file.name }));
  };

  // Generic field change
  const handleChange = e => {
    const { name, value } = e.target;
    setProfileData(pd => ({ ...pd, [name]: value }));
  };

  // Education handlers
  const handleEducationChange = (i, e) => {
    const { name, value } = e.target;
    setProfileData(pd => {
      const edu = [...pd.education];
      edu[i][name] = value;
      return { ...pd, education: edu };
    });
  };
  const addEducation = () => {
    setProfileData(pd => ({
      ...pd,
      education: [...pd.education, initialEducationCollege]
    }));
  };
  const removeEducation = i => {
    setProfileData(pd => ({
      ...pd,
      education: pd.education.filter((_, idx) => idx !== i)
    }));
  };

  // Desirable jobs
  const addDesirableJob = () => {
    const job = profileData.desirableJobInput.trim();
    if (job) {
      setProfileData(pd => ({
        ...pd,
        desirableJobs: [...pd.desirableJobs, job],
        desirableJobInput: ""
      }));
    }
  };
  const removeDesirableJob = i => {
    setProfileData(pd => ({
      ...pd,
      desirableJobs: pd.desirableJobs.filter((_, idx) => idx !== i)
    }));
  };

  // Skills (no years now)
  const addSkill = () => {
    const skill = profileData.skillInput.trim();
    if (skill) {
      setProfileData(pd => ({
        ...pd,
        skills: [...pd.skills, skill],
        skillInput: ""
      }));
    }
  };
  const removeSkill = i => {
    setProfileData(pd => ({
      ...pd,
      skills: pd.skills.filter((_, idx) => idx !== i)
    }));
  };

  // Save profile to backend
  const handleSave = async () => {
    try {
      setError("");
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.contactNumber,
        dob: profileData.dob,
        address: profileData.address,
        profileImage: profileData.profileImage,
        resume: profileData.resume,
        education: profileData.education,
        experience: profileData.isFresher ? 0 : parseFloat(profileData.yearsOfExperience) || 0,
        experienceInfo: profileData.isFresher ? {} : {
          companyName: profileData.companyName,
          designation: profileData.designation,
        },
        skills: profileData.skills,
        desirableJobs: profileData.desirableJobs,
        userId: currentUserId,
      };

      let res;
      if (candidateId) {
        res = await axios.put(`http://localhost:5000/api/candidates/${candidateId}`, payload, config);
      } else {
        res = await axios.post("http://localhost:5000/api/candidates", payload, config);
        setCandidateId(res.data._id);
      }
      alert("Profile saved!");
    } catch (e) {
      setError("Failed to save. Please try again.");
    }
  };

  // Compute completion % (25% per step)
  useEffect(() => {
    const filled =
      (profileData.fullName && profileData.email && profileData.contactNumber ? 1 : 0) +
      (profileData.education.length > 0 ? 1 : 0) +
      (profileData.isFresher || profileData.yearsOfExperience ? 1 : 0) +
      (profileData.skills.length > 0 || profileData.resume ? 1 : 0);
    setCompletion(filled * 25);
  }, [profileData]);

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userRes = await axios.get("http://localhost:5000/api/candidates/me", config);
        setCurrentUserId(userRes.data._id);

        const candRes = await axios.get(`http://localhost:5000/api/candidates/${userRes.data._id}`, config);
        if (candRes.data.experience) {
          setCandidateId(candRes.data._id);
          setProfileData({
            ...profileData,
            ...candRes.data,
            education: candRes.data.education.length
              ? candRes.data.education.map((e, idx) =>
                  idx === 0
                    ? { ...initialEducationFull, ...e }
                    : { ...initialEducationCollege, ...e }
                )
              : [initialEducationFull],
          });
        }
      } catch {
        // new user
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={800} mx="auto">
      <Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
        Back
      </Button>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mt: 2 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center">
            <Avatar src={profileData.profileImage} sx={{ width: 80, height: 80 }} />
            <label htmlFor="photo-upload">
              <input id="photo-upload" type="file" hidden onChange={handleImageUpload} />
              <IconButton component="span" sx={{ ml: -2, mt: 4 }}><PhotoCamera /></IconButton>
            </label>
          </Box>
          <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" value={completion} size={80} />
            <Box
              position="absolute"
              top={0} left={0} bottom={0} right={0}
              display="flex" alignItems="center" justifyContent="center"
            >
              <Typography variant="caption">{`${completion}%`}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box mt={4}>
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contactNumber"
                  value={profileData.contactNumber}
                  onChange={handleChange}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={profileData.dob}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={2}
                  value={profileData.address}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && profileData.education.map((ed, idx) => (
            <Box key={idx} mb={3}>
              <Typography variant="subtitle1">Education {idx + 1}</Typography>
              <Grid container spacing={2}>
                {idx === 0 && (
                  <>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="10th Board"
                        name="board10"
                        value={ed.board10}
                        onChange={e => handleEducationChange(idx, e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="10th %"
                        name="percent10"
                        value={ed.percent10}
                        onChange={e => handleEducationChange(idx, e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="12th Board"
                        name="board12"
                        value={ed.board12}
                        onChange={e => handleEducationChange(idx, e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="12th %"
                        name="percent12"
                        value={ed.percent12}
                        onChange={e => handleEducationChange(idx, e)}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="College"
                    name="college"
                    value={ed.college}
                    onChange={e => handleEducationChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Degree"
                    name="collegeDegree"
                    value={ed.collegeDegree}
                    onChange={e => handleEducationChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Branch"
                    name="branch"
                    value={ed.branch}
                    onChange={e => handleEducationChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Passing Year"
                    name="passingYear"
                    value={ed.passingYear}
                    onChange={e => handleEducationChange(idx, e)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="CGPA"
                    name="cgpa"
                    value={ed.cgpa}
                    onChange={e => handleEducationChange(idx, e)}
                  />
                </Grid>
              </Grid>
              {idx > 0 && (
                <Button
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => removeEducation(idx)}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          {activeStep === 1 && (
            <Button onClick={addEducation}>Add College Entry</Button>
          )}

          {activeStep === 2 && (
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileData.isFresher}
                    onChange={e =>
                      setProfileData(pd => ({
                        ...pd,
                        isFresher: e.target.checked
                      }))
                    }
                  />
                }
                label="I am a Fresher"
              />
              {!profileData.isFresher && (
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Previous Company"
                      name="companyName"
                      value={profileData.companyName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      name="designation"
                      value={profileData.designation}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Years of Experience"
                      name="yearsOfExperience"
                      value={profileData.yearsOfExperience}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Add Skill"
                    name="skillInput"
                    value={profileData.skillInput}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button fullWidth onClick={addSkill}>Add Skill</Button>
                </Grid>
              </Grid>
              <Box mt={2}>
                {profileData.skills.map((sk, i) => (
                  <Chip
                    key={i}
                    label={sk}
                    onDelete={() => removeSkill(i)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>

              <Box mt={3}>
                <TextField
                  fullWidth
                  label="Desirable Job"
                  name="desirableJobInput"
                  value={profileData.desirableJobInput}
                  onChange={handleChange}
                />
                <Button sx={{ mt: 1 }} onClick={addDesirableJob}>
                  Add Desirable Job
                </Button>
                <Box mt={1}>
                  {profileData.desirableJobs.map((jb, i) => (
                    <Chip
                      key={i}
                      label={jb}
                      onDelete={() => removeDesirableJob(i)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>

              <Box mt={3}>
                <Button variant="outlined" component="label">
                  Upload Resume
                  <input hidden type="file" onChange={handleResumeUpload} />
                </Button>
                {profileData.resume && (
                  <Typography mt={1}>{profileData.resume}</Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Navigation Buttons */}
        <Box mt={4} display="flex" justifyContent="space-between">
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(s => s - 1)}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setActiveStep(s => s + 1)}
            >
              Next
            </Button>
          ) : (
            <Button color="success" variant="contained" onClick={handleSave}>
              Save Profile
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
