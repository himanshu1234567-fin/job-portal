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
  Alert
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

const steps = ["Personal Details", "Education", "Experience", "Skills & Resume"];

const initialEducationFull = {
  board10: "",
  percentage10: "",
  board12: "",
  percentage12: "",
  college: "",
  collegeDegree: "",
  branch: "",
  passingYear: "",
  cgpa: ""
};
const initialEducationCollege = {
  college: "",
  collegeDegree: "",
  branch: "",
  passingYear: "",
  cgpa: ""
};
const initialExperience = { companyName: "", role: "", years: "" };

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
    experience: [initialExperience],
    skills: [],
    skillInput: "",
    desirableJobs: [],
    desirableJobInput: ""
  });
  const [candidateId, setCandidateId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(5);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((pd) => ({ ...pd, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((pd) => ({ ...pd, profileImage: URL.createObjectURL(file) }));
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type !== "application/pdf") {
      setError("Only PDF resumes allowed");
      return;
    }
    setProfileData((pd) => ({ ...pd, resume: file.name }));
  };

  const handleEducationChange = (i, e) => {
    const { name, value } = e.target;
    setProfileData((pd) => {
      const edu = [...pd.education];
      edu[i][name] = value;
      return { ...pd, education: edu };
    });
  };

  const addEducation = () =>
    setProfileData((pd) => ({
      ...pd,
      education: [...pd.education, initialEducationCollege]
    }));

  const removeEducation = (i) =>
    setProfileData((pd) => ({
      ...pd,
      education: pd.education.filter((_, idx) => idx !== i)
    }));

  const handleExperienceChange = (i, e) => {
    const { name, value } = e.target;
    setProfileData((pd) => {
      const exp = [...pd.experience];
      exp[i][name] = value;
      return { ...pd, experience: exp };
    });
  };

  const addExperience = () =>
    setProfileData((pd) => ({
      ...pd,
      experience: [...pd.experience, initialExperience]
    }));

  const removeExperience = (i) =>
    setProfileData((pd) => ({
      ...pd,
      experience: pd.experience.filter((_, idx) => idx !== i)
    }));

  const addSkill = () => {
    const sk = profileData.skillInput.trim();
    if (!sk) return;
    setProfileData((pd) => ({
      ...pd,
      skills: [...pd.skills, sk],
      skillInput: ""
    }));
  };

  const removeSkill = (i) =>
    setProfileData((pd) => ({
      ...pd,
      skills: pd.skills.filter((_, idx) => idx !== i)
    }));

  const addDesirableJob = () => {
    const job = profileData.desirableJobInput.trim();
    if (!job) return;
    setProfileData((pd) => ({
      ...pd,
      desirableJobs: [...pd.desirableJobs, job],
      desirableJobInput: ""
    }));
  };

  const removeDesirableJob = (i) =>
    setProfileData((pd) => ({
      ...pd,
      desirableJobs: pd.desirableJobs.filter((_, idx) => idx !== i)
    }));

  useEffect(() => {
    const checkFilled = (val) => val !== undefined && val !== null && String(val).trim() !== "";

    let filled = 0;
    let total = 0;

    const personalFields = ["fullName", "email", "contactNumber", "dob", "address"];
    personalFields.forEach((f) => {
      total++;
      if (checkFilled(profileData[f])) filled++;
    });

    const ed0 = profileData.education[0] || {};
    const educationFields = ["board10", "percentage10", "board12", "percentage12", "college", "collegeDegree", "branch", "passingYear", "cgpa"];
    educationFields.forEach((f) => {
      total++;
      if (checkFilled(ed0[f])) filled++;
    });

    if (!profileData.isFresher) {
      const ex0 = profileData.experience[0] || {};
      const experienceFields = ["companyName", "role", "years"];
      experienceFields.forEach((f) => {
        total++;
        if (checkFilled(ex0[f])) filled++;
      });
    }

    total++;
    if (profileData.skills.length > 0) filled++;

    total++;
    if (checkFilled(profileData.resume)) filled++;

  total++;
if (checkFilled(profileData.profileImage)) filled++;


let percent = Math.floor((filled / total) * 100);
setCompletion(percent);

  }, [profileData]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const userRes = await axios.get("http://localhost:5000/api/candidates/user-id", config);
        setCurrentUserId(userRes.data._id);

        const candRes = await axios.get("http://localhost:5000/api/candidates/me", config);
        if (candRes.data) {
          setCandidateId(candRes.data._id);
          setProfileData({
            fullName: candRes.data.fullName || "",
            email: candRes.data.email || "",
            contactNumber: candRes.data.contact || "",
            dob: candRes.data.dob?.substr(0, 10) || "",
            address: candRes.data.address || "",
            profileImage: candRes.data.profileImage || "",
            resume: candRes.data.resume || "",
            education: candRes.data.education.length
              ? candRes.data.education.map((e, idx) => (idx === 0 ? { ...initialEducationFull, ...e } : { ...initialEducationCollege, ...e }))
              : [initialEducationFull],
            isFresher: candRes.data.experience.length === 0,
            experience: candRes.data.experience.length
              ? candRes.data.experience.map((exp) => ({
                  companyName: exp.companyName,
                  role: exp.role,
                  years: String(exp.years)
                }))
              : [initialExperience],
            skills: candRes.data.skills || [],
            desirableJobs: candRes.data.desirableJob || [],
            skillInput: "",
            desirableJobInput: ""
          });
        }
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setError("");
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userRes = await axios.get("http://localhost:5000/api/candidates/user-id", config);
      const userId = userRes.data.userId;

      const educationPayload = profileData.education.map((ed) => ({
        board10: ed.board10,
        percentage10: Number(ed.percentage10),
        board12: ed.board12,
        percentage12: Number(ed.percentage12),
        college: ed.college,
        collegeDegree: ed.collegeDegree,
        branch: ed.branch,
        passingYear: Number(ed.passingYear),
        cgpa: Number(ed.cgpa)
      }));

      const experiencePayload = profileData.isFresher
        ? []
        : profileData.experience.map((exp) => ({
            companyName: exp.companyName,
            role: exp.role,
            years: Number(exp.years)
          }));

      const payload = {
        userId,
        fullName: profileData.fullName,
        email: profileData.email,
        contact: profileData.contactNumber,
        dob: profileData.dob,
        address: profileData.address,
        education: educationPayload,
        experience: experiencePayload,
        skills: profileData.skills,
        resume: profileData.resume,
        desirableJob: profileData.desirableJobs,
        profileCompletion: completion,
      };

      if (candidateId) {
        await axios.put(`http://localhost:5000/api/candidates/${candidateId}`, payload, config);
      } else {
        const res = await axios.post("http://localhost:5000/api/candidates", payload, config);
        setCandidateId(res.data._id);
      }
      alert("Profile saved!");
    } catch (e) {
      console.error(e);
      setError("Failed to save. Please try again.");
    }
  };

  if (loading) return (<Box textAlign="center" mt={8}><CircularProgress /></Box>);

  return (
    <Box p={3} maxWidth={800} mx="auto">
      <Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>Back</Button>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p:3, mt:2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center">
            <Avatar src={profileData.profileImage} sx={{ width:80, height:80 }} />
            <IconButton component="label" sx={{ ml:-2, mt:4 }}>
              <PhotoCamera />
              <input hidden type="file" onChange={handleImageUpload} />
            </IconButton>
            <Box ml={2}>
              <Typography variant="h6">{profileData.fullName}</Typography>
              <Typography variant="body2" color="textSecondary">{profileData.email}</Typography>
            </Box>
          </Box>
          <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" value={completion} size={80} />
            <Box position="absolute" top={0} left={0} bottom={0} right={0} display="flex" alignItems="center" justifyContent="center">
              <Typography variant="caption">{`${completion}%`}</Typography>
            </Box>
          </Box>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
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

          {activeStep === 1 &&
            profileData.education.map((ed, idx) => (
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
                          name="percentage10"
                          value={ed.percentage10}
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
                          name="percentage12"
                          value={ed.percentage12}
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
                      setProfileData(pd => ({ ...pd, isFresher: e.target.checked }))
                    }
                  />
                }
                label="I am a Fresher"
              />
              {!profileData.isFresher &&
                profileData.experience.map((exp, idx) => (
                  <Grid container spacing={2} key={idx} mt={1}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={exp.companyName}
                        onChange={e => handleExperienceChange(idx, e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Role"
                        name="role"
                        value={exp.role}
                        onChange={e => handleExperienceChange(idx, e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Years"
                        name="years"
                        value={exp.years}
                        onChange={e => handleExperienceChange(idx, e)}
                      />
                    </Grid>
                    {idx > 0 && (
                      <Grid item xs={12}>
                        <Button color="error" onClick={() => removeExperience(idx)}>
                          Remove
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                ))}
              {!profileData.isFresher && (
                <Button sx={{ mt: 1 }} onClick={addExperience}>
                  Add Another Company
                </Button>
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
                  <Chip key={i} label={sk} onDelete={() => removeSkill(i)} sx={{ m: 0.5 }} />
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
                    <Chip key={i} label={jb} onDelete={() => removeDesirableJob(i)} sx={{ m: 0.5 }} />
                  ))}
                </Box>
              </Box>

              <Box mt={3}>
                <Button variant="outlined" component="label">
                  Upload Resume
                  <input hidden type="file" onChange={handleResumeUpload} />
                </Button>
                {profileData.resume && <Typography mt={1}>{profileData.resume}</Typography>}
              </Box>
            </Box>
          )}
        </Box>
        <Box mt={4} display="flex" justifyContent="space-between">
          {activeStep>0 && <Button onClick={()=>setActiveStep(s=>s-1)}>Back</Button>}
          {activeStep<steps.length-1
            ? <Button variant="contained" onClick={()=>setActiveStep(s=>s+1)}>Next</Button>
            : <Button color="success" variant="contained" onClick={handleSave}>Save Profile</Button>
          }
        </Box>
      </Paper>
    </Box>
  );
}