"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  CircularProgress,
  Paper,
  Chip,
  Avatar,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";
import { PhotoCamera, ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";

const steps = ["Personal Details", "Education", "Experience", "Skills & Resume"];

const initialEducationFull = {
  board10: "",
  percent10: "",
  board12: "",
  percent12: "",
  college: "",
  collegeDegree: "",
  branch: "",
  passingYear: "",
  cgpa: "",
};
const initialEducationCollege = {
  college: "",
  collegeDegree: "",
  branch: "",
  passingYear: "",
  cgpa: "",
};

export default function ProfileForm() {
  const router = useRouter();
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
    experience: [],            // array of { companyName, role, years }
    isFresher: false,
    skills: [],
    skillInput: "",
    desirableJobs: [],
    desirableJobInput: "",
  });
  const [candidateId, setCandidateId] = useState("");
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const [error, setError] = useState("");

  // Fetch profile from /api/candidates/me
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data: cand } = await axios.get(
          "http://localhost:5000/api/candidates/me",
          config
        );
        setCandidateId(cand._id);
        setProfileData({
          fullName:        cand.fullName || "",
          email:           cand.email || "",
          contactNumber:   cand.contact || "",
          dob:             cand.dob?.split("T")[0] || "",
          address:         cand.address || "",
          profileImage:    cand.profileImage || "",
          resume:          cand.resume || "",
          education:       Array.isArray(cand.education) && cand.education.length
            ? cand.education.map((e, i) =>
                i === 0
                  ? { ...initialEducationFull,   ...e }
                  : { ...initialEducationCollege, ...e }
              )
            : [initialEducationFull],
          experience:      Array.isArray(cand.experience) ? cand.experience : [],
          isFresher:       !cand.experience || cand.experience.length === 0,
          skills:          Array.isArray(cand.skills) ? cand.skills : [],
          desirableJobs:   Array.isArray(cand.desirableJob) ? cand.desirableJob : [],
          skillInput:      "",
          desirableJobInput: ""
        });
      } catch {
        // no profile yet
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Compute completion % (25% per step)
  useEffect(() => {
    const filled =
      (profileData.fullName && profileData.email && profileData.contactNumber ? 1 : 0) +
      (profileData.education.length > 0 ? 1 : 0) +
      (profileData.isFresher || profileData.experience.length > 0 ? 1 : 0) +
      (profileData.skills.length > 0 || profileData.resume ? 1 : 0);
    setCompletion(filled * 25);
  }, [profileData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfileData(pd => ({ ...pd, [name]: value }));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) setProfileData(pd => ({ ...pd, profileImage: URL.createObjectURL(file) }));
  };

  const handleResumeUpload = e => {
    const file = e.target.files[0];
    if (file?.type !== "application/pdf") {
      setError("Only PDF resumes allowed");
      return;
    }
    setProfileData(pd => ({ ...pd, resume: file.name }));
  };

  // Education
  const handleEducationChange = (i, e) => {
    const { name, value } = e.target;
    setProfileData(pd => {
      const edu = [...pd.education]; edu[i][name] = value;
      return { ...pd, education: edu };
    });
  };
  const addEducation = () => setProfileData(pd => ({
    ...pd,
    education: [...pd.education, initialEducationCollege]
  }));
  const removeEducation = i => setProfileData(pd => ({
    ...pd,
    education: pd.education.filter((_, idx) => idx !== i)
  }));

  // Experience
  const addExperience = () => setProfileData(pd => ({
    ...pd,
    experience: [...pd.experience, { companyName: "", role: "", years: "" }]
  }));
  const handleExperienceChange = (i, e) => {
    const { name, value } = e.target;
    setProfileData(pd => {
      const xp = [...pd.experience]; xp[i][name] = value;
      return { ...pd, experience: xp };
    });
  };
  const removeExperience = i => setProfileData(pd => ({
    ...pd,
    experience: pd.experience.filter((_, idx) => idx !== i)
  }));

  // Skills
  const addSkill = () => {
    const s = profileData.skillInput.trim();
    if (s) setProfileData(pd => ({
      ...pd,
      skills: [...pd.skills, s],
      skillInput: ""
    }));
  };
  const removeSkill = i => setProfileData(pd => ({
    ...pd,
    skills: pd.skills.filter((_, idx) => idx !== i)
  }));

  // Desirable jobs
  const addDesirableJob = () => {
    const j = profileData.desirableJobInput.trim();
    if (j) setProfileData(pd => ({
      ...pd,
      desirableJobs: [...pd.desirableJobs, j],
      desirableJobInput: ""
    }));
  };
  const removeDesirableJob = i => setProfileData(pd => ({
    ...pd,
    desirableJobs: pd.desirableJobs.filter((_, idx) => idx !== i)
  }));

  // Save profile
  const handleSave = async () => {
    try {
      setError("");
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Login required");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        fullName:      profileData.fullName,
        email:         profileData.email,
        contact:       profileData.contactNumber,
        dob:           profileData.dob,
        address:       profileData.address,
        profileImage:  profileData.profileImage,
        resume:        profileData.resume,
        education:     profileData.education,
        experience:    profileData.isFresher ? [] : profileData.experience,
        skills:        profileData.skills,
        desirableJob:  profileData.desirableJobs,
      };

      if (candidateId) {
        await axios.put(
          `http://localhost:5000/api/candidates/${candidateId}`,
          payload, config
        );
      } else {
        const { data } = await axios.post(
          "http://localhost:5000/api/candidates",
          payload, config
        );
        setCandidateId(data._id);
      }
      alert("Profile saved!");
    } catch (err) {
      setError(err.message || "Save failed");
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={800} mx="auto">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center">
            <Avatar src={profileData.profileImage} sx={{ width: 80, height: 80 }} />
            <label htmlFor="photo-upload">
              <input id="photo-upload" type="file" hidden onChange={handleImageUpload} />
              <IconButton component="span" sx={{ ml: -2, mt: 4 }}>
                <PhotoCamera />
              </IconButton>
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
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
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

        {activeStep === 1 && (
          <>
            {profileData.education.map((ed, idx) => (
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
                  <Button color="error" sx={{ mt: 1 }} onClick={() => removeEducation(idx)}>
                    Remove
                  </Button>
                )}
              </Box>
            ))}
            <Button onClick={addEducation}>Add College Entry</Button>
          </>
        )}

        {activeStep === 2 && (
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={profileData.isFresher}
                  onChange={e => setProfileData(pd => ({ ...pd, isFresher: e.target.checked }))}
                />
              }
              label="I am a Fresher"
            />
            {!profileData.isFresher && (
              <>
                {profileData.experience.map((xp, i) => (
                  <Grid container spacing={2} key={i} mt={1}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        name="companyName"
                        value={xp.companyName}
                        onChange={e => handleExperienceChange(i, e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Role"
                        name="role"
                        value={xp.role}
                        onChange={e => handleExperienceChange(i, e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Years"
                        name="years"
                        type="number"
                        value={xp.years}
                        onChange={e => handleExperienceChange(i, e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Button color="error" onClick={() => removeExperience(i)}>
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                <Button sx={{ mt: 2 }} onClick={addExperience}>
                  Add Experience
                </Button>
              </>
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
                <Button fullWidth onClick={addSkill}>
                  Add Skill
                </Button>
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

        {/* Navigation Buttons */}
        <Box mt={4} display="flex" justifyContent="space-between">
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(s => s - 1)}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={() => setActiveStep(s => s + 1)}>
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
