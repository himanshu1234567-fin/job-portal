"use client";

import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Typography, Grid, Stepper,
  Step, StepLabel, IconButton, CircularProgress, Paper,
  Chip, Switch, FormControlLabel
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const steps = ["Personal Details", "Education", "Experience", "Skills & Resume"];

const getStoredData = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("userProfile");
    return data ? JSON.parse(data) : {};
  }
  return {};
};

const calculateCompletion = (data) => {
  const fields = [
    "name", "email", "dob", "contact", "address",
    "tenth", "tenthBoard",
    "twelfth", "twelfthBoard",
    "college",
    "passingYear", "degree", "branch",
    "cgpa", "skillsList", "desirableJobs", "resume"
  ];

  if (!data.isFresher) {
    fields.push("companyname", "role", "yearofexperience");
  }

  const filled = fields.filter((f) => {
    const val = data[f];
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "number") return true;
    return val !== undefined && val !== null && val !== "";
  });

  return (filled.length / fields.length) * 100;
};

const ProfileForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    photo: "",
    name: "",
    email: "",
    dob: "",
    contact: "",
    address: "",
    tenth: "",
    tenthBoard: "",
    twelfth: "",
    twelfthBoard: "",
    college: "",
    passingYear: "",
    degree: "",
    branch: "",
    cgpa: "",
    companyname: "",
    role: "",
    yearofexperience: "",
    desirableJobs: [],
    desirableJobInput: "",
    skillsList: [],
    skillInput: "",
    resume: "",
    isFresher: false,
  });

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stored = getStoredData();
    if (stored) {
      setFormData(prev => ({
        ...prev,
        ...stored,
        desirableJobs: stored.desirableJobs || [],
        skillsList: stored.skillsList || [],
      }));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify(formData));
      localStorage.setItem("profileCompletePercent", calculateCompletion(formData));
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result });
      if (files?.[0]) reader.readAsDataURL(files[0]);
    } else if (name === "resume") {
      setFormData({ ...formData, resume: files?.[0]?.name || "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddJob = () => {
    const trimmed = formData.desirableJobInput.trim();
    if (trimmed && !formData.desirableJobs.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        desirableJobs: [...prev.desirableJobs, trimmed],
        desirableJobInput: "",
      }));
    }
  };

  const handleRemoveJob = (index) => {
    const updated = [...formData.desirableJobs];
    updated.splice(index, 1);
    setFormData({ ...formData, desirableJobs: updated });
  };

  const handleAddSkill = () => {
    const trimmed = formData.skillInput.trim();
    if (trimmed && !formData.skillsList.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skillsList: [...prev.skillsList, trimmed],
        skillInput: "",
      }));
    }
  };

  const handleRemoveSkill = (index) => {
    const updated = [...formData.skillsList];
    updated.splice(index, 1);
    setFormData({ ...formData, skillsList: updated });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid item xs={12}><TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Contact" name="contact" value={formData.contact} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} /></Grid>
          </>
        );
      case 1:
        return (
          <>
            <Grid item xs={6}><TextField fullWidth label="10th %" name="tenth" value={formData.tenth} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth placeholder="10th Board" name="tenthBoard" value={formData.tenthBoard} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="12th %" name="twelfth" value={formData.twelfth} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth placeholder="12th Board" name="twelfthBoard" value={formData.twelfthBoard} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="College" name="college" value={formData.college} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Degree" name="degree" value={formData.degree} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Branch" name="branch" value={formData.branch} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Passing Year" name="passingYear" value={formData.passingYear} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} /></Grid>
          </>
        );
      case 2:
        return (
          <>
            <Grid item xs={12}><FormControlLabel control={<Switch checked={formData.isFresher} onChange={(e) => setFormData({ ...formData, isFresher: e.target.checked })} />}  label={formData.isFresher ? "I am a Fresher" : "I have Experience"} /></Grid>
            {!formData.isFresher && (
              <>
                <Grid item xs={12}><TextField fullWidth label="Company Name" name="companyname" value={formData.companyname} onChange={handleChange} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Role" name="role" value={formData.role} onChange={handleChange} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Years of Experience" name="yearofexperience" value={formData.yearofexperience} onChange={handleChange} /></Grid>
              </>
            )}
            <Grid item xs={9}><TextField fullWidth label="Add Desirable Job" value={formData.desirableJobInput} onChange={(e) => setFormData({ ...formData, desirableJobInput: e.target.value })} /></Grid>
            <Grid item xs={3}><Button variant="contained" fullWidth sx={{ height: "100%" }} onClick={handleAddJob}>Add</Button></Grid>
            <Grid item xs={12}>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.desirableJobs.map((job, i) => (
                  <Chip key={i} label={job} onDelete={() => handleRemoveJob(i)} color="primary" variant="outlined" />
                ))}
              </Box>
            </Grid>
          </>
        );
      case 3:
        return (
          <>
            <Grid item xs={9}><TextField fullWidth label="Add Skill" value={formData.skillInput} onChange={(e) => setFormData({ ...formData, skillInput: e.target.value })} /></Grid>
            <Grid item xs={3}><Button variant="contained" fullWidth sx={{ height: "100%" }} onClick={handleAddSkill}>Add</Button></Grid>
            <Grid item xs={12}>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.skillsList.map((skill, i) => (
                  <Chip key={i} label={skill} onDelete={() => handleRemoveSkill(i)} color="success" variant="outlined" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload Resume
                <input hidden type="file" name="resume" onChange={handleChange} />
              </Button>
              {formData.resume && (
                <Typography variant="body2" sx={{ mt: 1 }}>Uploaded: {formData.resume}</Typography>
              )}
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
<<<<<<< HEAD
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Button onClick={() => router.push("/user/Userdashboard")} startIcon={<ArrowBackIcon />} variant="" sx={{ mb: 2, mr: 4, color: "#1976d2", borderColor: "#1976d2", "&:hover": { backgroundColor: "#e3f2fd", borderColor: "#1565c0" } }}></Button>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ position: "relative", width: 80, height: 80 }}>
              <img src={formData.photo || "/default-avatar.png"} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid #1976d2" }} />
              <input accept="image/*" type="file" id="photo-upload" name="photo" onChange={handleChange} style={{ display: "none" }} />
              <label htmlFor="photo-upload">
                <IconButton component="span" sx={{ position: "absolute", bottom: -10, right: -10, backgroundColor: "white", boxShadow: 1, border: "1px solid #ccc" }}>
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </label>
            </Box>
            <Box>
              <Typography variant="h6">Hello, {formData.name || "Candidate"}</Typography>
              {formData.email && <Typography variant="body2" color="text.secondary">{formData.email}</Typography>}
            </Box>
          </Box>
          <Box sx={{ position: "relative", display: "inline-flex", mr: 2 }}>
            <CircularProgress variant="determinate" value={calculateCompletion(formData)} size={80} thickness={4} />
            <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="caption" color="text.secondary">{`${Math.round(calculateCompletion(formData))}%`}</Typography>
            </Box>
          </Box>
        </Box>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>{renderStepContent(activeStep)}</Grid>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)}>Next</Button>
=======
    <Box p={2} bgcolor="#f5f5f5" minHeight="100vh">
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => router.push("/user/Userdashboard")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" ml={1}>
          Back to Dashboard
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto", border: "1px solid #ddd" }}>
        <Grid container spacing={3}>
          {/* Name & Email */}
          <Grid item xs={12}>
            {editing ? (
              <>
                <TextField
                  label="Full Name"
                  fullWidth
                  margin="dense"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="dense"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  type="email"
                />
              </>
>>>>>>> 33114b60ccb165df49454b4f721267ddac3a8900
            ) : (
              <Button variant="contained" onClick={() => alert("Profile completed!")}>Save</Button>
            )}
<<<<<<< HEAD
          </Box>
        </Box>
=======
          </Grid>

          {/* Profile Completion */}
          <Grid item xs={12}>
            <Typography variant="body2" mb={1}>
              Profile Completion: {calculateCompletion()}%
            </Typography>
            <LinearProgress variant="determinate" value={calculateCompletion()} />
          </Grid>

          {/* Personal Details */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Personal Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {editing ? (
                    <TextField
                      fullWidth
                      type="date"
                      label="Date of Birth"
                      name="dob"
                      value={user.dob}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  ) : (
                    <Typography>DOB: {user.dob || "Not Set"}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editing ? (
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      inputProps={{ maxLength: 10 }}
                      required
                    />
                  ) : (
                    <Typography>Phone: {user.phone || "Not Set"}</Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Education - Mapped for multiple entries */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              {editing ? (
                <>
                  {user.education.map((edu, index) => (
                    <Box key={index} sx={{ mb: 3, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Degree {index + 1}
                        {user.education.length > 1 && ( // Only show remove if more than one entry
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeEducation(index)}
                            sx={{ float: 'right' }}
                          >
                            <span style={{ fontSize: '1rem' }}>&times;</span> {/* Simple 'x' icon */}
                          </IconButton>
                        )}
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          { field: "board10", label: "10th Board" },
                          { field: "percentage10", label: "10th Percentage", type: "number" },
                          { field: "board12", label: "12th Board" },
                          { field: "percentage12", label: "12th Percentage", type: "number" },
                          { field: "college", label: "College/University" },
                          { field: "collegeDegree", label: "Degree" },
                          { field: "branch", label: "Branch" },
                          { field: "passingYear", label: "Passing Year", type: "number" },
                          { field: "cgpa", label: "CGPA", type: "number" },
                        ].map((item) => (
                          <Grid item xs={12} sm={6} key={item.field}>
                            <TextField
                              label={item.label}
                              fullWidth
                              name={item.field}
                              value={edu[item.field] || ""}
                              onChange={(e) => handleEducationChange(index, e)}
                              type={item.type || "text"}
                              required={["college", "collegeDegree", "passingYear", "cgpa", "board10", "percentage10", "board12", "percentage12"].includes(item.field)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))}
                  <Button variant="outlined" onClick={addEducation} sx={{ mt: 2 }}>
                    Add Another Degree
                  </Button>
                </>
              ) : (
                <>
                  {user.education.length === 0 ? (
                    <Typography>No education details added.</Typography>
                  ) : (
                    user.education.map((edu, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Degree {index + 1}:</Typography>
                        <Typography>
                          10th: {edu.board10 || "Not Set"} ({edu.percentage10 || "Not Set"}%)
                        </Typography>
                        <Typography>
                          12th: {edu.board12 || "Not Set"} ({edu.percentage12 || "Not Set"}%)
                        </Typography>
                        <Typography>
                          Graduation: {edu.collegeDegree || "Degree"} in {edu.branch || "Branch"} from {edu.college || "College"} (
                          {edu.passingYear || "Year"}, CGPA: {edu.cgpa || "N/A"})
                        </Typography>
                      </Box>
                    ))
                  )}
                </>
              )}
            </Paper>
          </Grid>

          {/* Skills */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Skills</Typography>
              {editing ? (
                <TextField
                  fullWidth
                  label="Skills (comma-separated)"
                  name="skills"
                  value={user.skills}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, Node.js, MongoDB"
                  required
                />
              ) : (
                <Typography>{user.skills || "Not Set"}</Typography>
              )}
            </Paper>
          </Grid>

          {/* Experience */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Experience</Typography>
              {editing ? (
                <TextField
                  fullWidth
                  label="Experience (Years)"
                  name="experience"
                  value={user.experience}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ min: 0 }}
                  required
                />
              ) : (
                <Typography>{user.experience || "0"} years</Typography>
              )}
            </Paper>
          </Grid>

          {/* Desired Job */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Desired Job</Typography>
              {editing ? (
                <TextField
                  fullWidth
                  label="Desired Job"
                  name="desirableJob"
                  value={user.desirableJob}
                  onChange={handleChange}
                  required
                />
              ) : (
                <Typography>{user.desirableJob || "Not Set"}</Typography>
              )}
            </Paper>
          </Grid>

          {/* Edit/Save Button */}
          <Grid item xs={12} textAlign="right">
            {editing ? (
              <Button
                variant="contained"
                color="success"
                onClick={saveProfile}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Grid>
        </Grid>
>>>>>>> 33114b60ccb165df49454b4f721267ddac3a8900
      </Paper>
    </Box>
  );
};

export default ProfileForm;