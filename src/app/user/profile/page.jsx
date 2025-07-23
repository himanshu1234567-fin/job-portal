"use client";
import {
<<<<<<< HEAD
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

const steps = [
  "Personal Details",
  "Education",
  "Experience",
  "Skills & Resume"
];

const initialEducationFull = {
  board10: "", percentage10: "",
  board12: "", percentage12: "",
  college: "", collegeDegree: "", branch: "", passingYear: "", cgpa: ""
};
const initialEducationCollege = {
  college: "", collegeDegree: "", branch: "", passingYear: "", cgpa: ""
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
    desirableJobInput: "",
  });
  const [candidateId, setCandidateId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const [error, setError] = useState("");

  // Image upload
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(pd => ({
        ...pd,
        profileImage: URL.createObjectURL(file)
      }));
    }
  };

  // Resume upload
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

  // Experience handlers
  const handleExperienceChange = (i, e) => {
    const { name, value } = e.target;
    setProfileData(pd => {
      const exp = [...pd.experience];
      exp[i] = { ...exp[i], [name]: value };
      return { ...pd, experience: exp };
    });
  };
  const addExperience = () => {
    setProfileData(pd => ({
      ...pd,
      experience: [...pd.experience, initialExperience]
    }));
  };
  const removeExperience = i => {
    setProfileData(pd => ({
      ...pd,
      experience: pd.experience.filter((_, idx) => idx !== i)
    }));
  };

  // Skills handlers
  const addSkill = () => {
    const sk = profileData.skillInput.trim();
    if (!sk) return;
    setProfileData(pd => ({
      ...pd,
      skills: [...pd.skills, sk],
      skillInput: ""
    }));
  };
  const removeSkill = i => {
    setProfileData(pd => ({
      ...pd,
      skills: pd.skills.filter((_, idx) => idx !== i)
    }));
  };

  // Desirable jobs handlers
  const addDesirableJob = () => {
    const job = profileData.desirableJobInput.trim();
    if (!job) return;
    setProfileData(pd => ({
      ...pd,
      desirableJobs: [...pd.desirableJobs, job],
      desirableJobInput: ""
    }));
  };
  const removeDesirableJob = i => {
    setProfileData(pd => ({
      ...pd,
      desirableJobs: pd.desirableJobs.filter((_, idx) => idx !== i)
    }));
  };

  // Calculate profile completion
  useEffect(() => {
    const filled =
      (profileData.fullName && profileData.email && profileData.contactNumber && profileData.address ? 1 : 0) +
      (profileData.education.length ? 1 : 0) +
      (profileData.isFresher || profileData.experience.length ? 1 : 0) +
      (profileData.skills.length || profileData.resume ? 1 : 0);
    setCompletion(filled * 25);
  }, [profileData]);

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // get userId
        const userRes = await axios.get(
          "http://localhost:5000/api/candidates/user-id",
          config
        );
        setCurrentUserId(userRes.data._id);

        // get candidate data
        const candRes = await axios.get(
          "http://localhost:5000/api/candidates/me",
          config
        );

        if (candRes.data) {
          setCandidateId(candRes.data._id);
          setProfileData({
            fullName:      candRes.data.fullName || "",
            email:         candRes.data.email || "",
            contactNumber: candRes.data.contact || "",
            dob:           candRes.data.dob?.substr(0,10) || "",
            address:       candRes.data.address || "",
            profileImage:  candRes.data.profileImage || "",
            resume:        candRes.data.resume || "",
            education:     candRes.data.education.length
              ? candRes.data.education.map((e, idx) =>
                  idx === 0
                    ? { ...initialEducationFull, ...e }
                    : { ...initialEducationCollege, ...e }
                )
              : [initialEducationFull],
            isFresher:     candRes.data.experience.length === 0,
            experience:    candRes.data.experience.length
              ? candRes.data.experience.map(exp => ({
                  companyName: exp.companyName,
                  role:        exp.role,
                  years:       String(exp.years)
                }))
              : [initialExperience],
            skills:        candRes.data.skills || [],
            desirableJobs: candRes.data.desirableJob || [],
            skillInput:    "",
            desirableJobInput: ""
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

  // Save handler (matches Mongoose schema exactly)
  const handleSave = async () => {
    try {
      setError("");
      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // fetch fresh userId
      const userRes = await axios.get(
        "http://localhost:5000/api/candidates/user-id",
        config
      );
      const userId = userRes.data.userId;
      setCurrentUserId(userId);

      // remap education & cast to Number
      const educationPayload = profileData.education.map(ed => ({
        board10:       ed.board10,
        percentage10:  Number(ed.percentage10),
        board12:       ed.board12,
        percentage12:  Number(ed.percentage12),
        college:       ed.college,
        collegeDegree: ed.collegeDegree,
        branch:        ed.branch,
        passingYear:   Number(ed.passingYear),
        cgpa:          Number(ed.cgpa),
      }));

      // remap experience & cast to Number
      const experiencePayload = profileData.isFresher
        ? []
        : profileData.experience.map(exp => ({
            companyName: exp.companyName,
            role:        exp.role,
            years:       Number(exp.years),
          }));

      // build payload (including address)
      const payload = {
        userId,
        fullName:     profileData.fullName,
        email:        profileData.email,
        dob:          profileData.dob,
        contact:      profileData.contactNumber,
        address:      profileData.address,
        education:    educationPayload,
        skills:       profileData.skills,
        experience:   experiencePayload,
        desirableJob: profileData.desirableJobs,
      };

      if (candidateId) {
        await axios.put(
          `http://localhost:5000/api/candidates/${candidateId}`,
          payload,
          config
        );
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/candidates",
          payload,
          config
        );
        setCandidateId(res.data._id);
      }

      alert("Profile saved!");
    } catch (e) {
      console.error(e);
      setError("Failed to save. Please try again.");
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
      <Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
        Back
      </Button>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mt: 2 }}>
        {/* Header: Avatar + Progress */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center">
            <Avatar src={profileData.profileImage} sx={{ width: 80, height: 80 }} />
            <label htmlFor="photo-upload">
              <input id="photo-upload" type="file" hidden onChange={handleImageUpload} />
              <IconButton component="span" sx={{ ml: -2, mt: 4 }}>
                <PhotoCamera />
              </IconButton>
            </label>
=======
  Box, Button, Grid, IconButton, Paper, TextField,
  Typography, LinearProgress, Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const blankEducation = { board10: "", percentage10: "", board12: "", percentage12: "", college: "", collegeDegree: "", branch: "", passingYear: "", cgpa: "" };
const defaultProfile = { fullName: "", email: "", dob: "", phone: "", education: [blankEducation], skills: "", experience: "", desirableJob: "" };

const Profile = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [candidateId, setCandidateId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const router = useRouter();

  // Fetch userId and existing candidate profile
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("authToken");
    if (!token) return setLoading(false);

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userIdRes = await axios.get("http://localhost:5000/api/candidates/user-id", { headers: { Authorization: `Bearer ${token}` } });
        if (isMounted) setCurrentUserId(userIdRes.data.userId);

        const meRes = await axios.get("http://localhost:5000/api/candidates/me", { headers: { Authorization: `Bearer ${token}` } });
        const data = meRes.data;
        setCandidateId(data._id);

        const dob = data.dob ? new Date(data.dob).toISOString().split("T")[0] : "";
        setUser({
          ...user,
          ...data,
          dob,
          education: Array.isArray(data.education) && data.education.length > 0 ? data.education : [blankEducation],
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
        });
        setEditing(false);
      } catch (err) {
        if (isMounted && err.response?.status === 404) {
          setError("Profile not found—creating new one...");
          setEditing(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  const calculateCompletion = () => {
    const required = [user.fullName, user.email, user.phone, user.dob, user.desirableJob];
    const hasCollege = user.education.some(e => e.college && e.collegeDegree);
    return Math.round(([...required, hasCollege, user.skills, user.experience].filter(Boolean).length / 8) * 100);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    setUser(prev => ({ ...prev, [name]: value }));
  };
  const handleEducationChange = (idx, e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      education: prev.education.map((ed, i) => i === idx ? { ...ed, [name]: value } : ed),
    }));
  };
  const addEducation = () => setUser(prev => ({ ...prev, education: [...prev.education, blankEducation] }));
  const removeEducation = idx => setUser(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));

  const saveProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Login required");
    if (!user.fullName || !user.email || !user.phone || !user.desirableJob) return setError("Fill required fields");

    const validEdu = user.education.every(ed => {
      if (ed.board10 || ed.percentage10) {
        const p = parseFloat(ed.percentage10);
        if (!ed.board10 || isNaN(p) || p < 0 || p > 100) return false;
      }
      if (ed.board12 || ed.percentage12) {
        const p = parseFloat(ed.percentage12);
        if (!ed.board12 || isNaN(p) || p < 0 || p > 100) return false;
      }
      if (ed.college || ed.collegeDegree || ed.branch) {
        const cg = parseFloat(ed.cgpa);
        const yr = parseInt(ed.passingYear);
        if (!ed.college || !ed.collegeDegree || isNaN(cg) || cg < 0 || cg > 10 || isNaN(yr)) return false;
      }
      return true;
    });
    if (!validEdu) return setError("Invalid education details");

    try {
      setLoading(true);
      setError("");
      const preparedEducation = user.education.map(ed => ({
        ...ed,
        percentage10: ed.percentage10 ? parseFloat(ed.percentage10) : undefined,
        percentage12: ed.percentage12 ? parseFloat(ed.percentage12) : undefined,
        passingYear: ed.passingYear ? parseInt(ed.passingYear) : undefined,
        cgpa: ed.cgpa ? parseFloat(ed.cgpa) : undefined,
      }));
      const payload = {
        fullName: user.fullName,
        email: user.email,
        dob: user.dob,
        phone: user.phone,
        education: preparedEducation,
        skills: user.skills.split(",").map(s => s.trim()).filter(Boolean),
        experience: user.experience ? parseFloat(user.experience) : 0,
        desirableJob: user.desirableJob,
      };

      console.log("Payload:", payload);

      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      let res;
      if (candidateId) {
        res = await axios.put(`http://localhost:5000/api/candidates/${candidateId}`, payload, { headers });
      } else {
        if (!currentUserId) return setError("User ID missing – reload!");
        res = await axios.post("http://localhost:5000/api/candidates", { ...payload, userId: currentUserId }, { headers });
        setCandidateId(res.data._id);
      }

      const saved = res.data;
      setUser({
        ...saved,
        skills: Array.isArray(saved.skills) ? saved.skills.join(", ") : "",
        education: saved.education || [blankEducation],
      });
      const prog = calculateCompletion();
      localStorage.setItem("profileComplete", prog === 100);
      localStorage.setItem("profileProgress", prog);
      setEditing(false);
      setError("Profile saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      const msg = err.response?.data?.message || err.response?.data?.error;
      if (msg?.includes("duplicate") || msg?.includes("dup")) setError("Phone number already exists!");
      else setError(msg || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" minHeight="100vh"><Typography>Loading...</Typography></Box>
  );

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
>>>>>>> 03055e9a809cc103a63e5d00db58914de178c94c
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
<<<<<<< HEAD

        {/* Step Content */}
        <Box mt={4}>
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Full Name" name="fullName" value={profileData.fullName} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Email" name="email" type="email" value={profileData.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Contact Number" name="contactNumber" value={profileData.contactNumber} onChange={handleChange} inputProps={{ maxLength: 10 }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Date of Birth" name="dob" type="date" InputLabelProps={{ shrink: true }} value={profileData.dob} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Address" name="address" multiline rows={2} value={profileData.address} onChange={handleChange} />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && profileData.education.map((ed, idx) => (
            <Box key={idx} mb={3}>
              <Typography variant="subtitle1">Education {idx + 1}</Typography>
              <Grid container spacing={2}>
                {idx === 0 && (
                  <>
                    <Grid item xs={6}><TextField fullWidth label="10th Board" name="board10" value={ed.board10} onChange={e => handleEducationChange(idx, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="10th %" name="percent10" value={ed.percentage10} onChange={e => handleEducationChange(idx, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="12th Board" name="board12" value={ed.board12} onChange={e => handleEducationChange(idx, e)} /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="12th %" name="percent12" value={ed.percentage12} onChange={e => handleEducationChange(idx, e)} /></Grid>
                  </>
                )}
                <Grid item xs={6}><TextField fullWidth label="College" name="college" value={ed.college} onChange={e => handleEducationChange(idx, e)} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Degree" name="collegeDegree" value={ed.collegeDegree} onChange={e => handleEducationChange(idx, e)} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Branch" name="branch" value={ed.branch} onChange={e => handleEducationChange(idx, e)} /></Grid>
                <Grid item xs={3}><TextField fullWidth label="Passing Year" name="passingYear" value={ed.passingYear} onChange={e => handleEducationChange(idx, e)} /></Grid>
                <Grid item xs={3}><TextField fullWidth label="CGPA" name="cgpa" value={ed.cgpa} onChange={e => handleEducationChange(idx, e)} /></Grid>
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
                      setProfileData(pd => ({
                        ...pd,
                        isFresher: e.target.checked
                      }))
                    }
                  />
                }
                label="I am a Fresher"
              />
              {!profileData.isFresher && profileData.experience.map((exp, idx) => (
                <Grid container spacing={2} key={idx} mt={1}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Company Name" name="companyName" value={exp.companyName} onChange={e => handleExperienceChange(idx, e)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Role" name="role" value={exp.role} onChange={e => handleExperienceChange(idx, e)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Years" name="years" value={exp.years} onChange={e => handleExperienceChange(idx, e)} />
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
                  <TextField fullWidth label="Add Skill" name="skillInput" value={profileData.skillInput} onChange={handleChange} />
                </Grid>
                <Grid item xs={4}>
                  <Button fullWidth onClick={addSkill}>Add Skill</Button>
                </Grid>
              </Grid>
              <Box mt={2}>
                {profileData.skills.map((sk, i) => (
                  <Chip key={i} label={sk} onDelete={() => removeSkill(i)} sx={{ m: 0.5 }} />
                ))}
              </Box>

              <Box mt={3}>
                <TextField fullWidth label="Desirable Job" name="desirableJobInput" value={profileData.desirableJobInput} onChange={handleChange} />
                <Button sx={{ mt: 1 }} onClick={addDesirableJob}>Add Desirable Job</Button>
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
          {activeStep > 0 && <Button onClick={() => setActiveStep(s => s - 1)}>Back</Button>}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={() => setActiveStep(s => s + 1)}>Next</Button>
          ) : (
            <Button color="success" variant="contained" onClick={handleSave}>Save Profile</Button>
          )}
=======
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

      {error && (
        <Alert
          severity={error.includes("successfully") ? "success" : "error"}
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto", border: "1px solid #ddd" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {editing ? (
              <>
                <TextField
                  label="Full Name *"
                  fullWidth
                  margin="dense"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Email *"
                  fullWidth
                  margin="dense"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  type="email"
                />
              </>
>>>>>>> 9033fb1ca8285e267fab1623bdb9d651252c828f
            ) : (
              <>
                <Typography variant="h5">{user.fullName || "No Name"}</Typography>
                <Typography color="text.secondary">{user.email || "No Email"}</Typography>
              </>
            )}
<<<<<<< HEAD
          </Box>
>>>>>>> 03055e9a809cc103a63e5d00db58914de178c94c
        </Box>
=======
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" mb={1}>
              Profile Completion: {calculateCompletion()}%
            </Typography>
            <LinearProgress variant="determinate" value={calculateCompletion()} />
          </Grid>

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
                    />
                  ) : (
                    <Typography>DOB: {user.dob || "Not Set"}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editing ? (
                    <TextField
                      fullWidth
                      label="Phone *"
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

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              {editing ? (
                <>
                  {user.education.map((education, index) => (
                    <Box key={index} sx={{ mb: 3, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Education {index + 1}
                        {user.education.length > 1 && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeEducation(index)}
                            sx={{ float: 'right' }}
                            disabled={user.education.length <= 1}
                          >
                            <span style={{ fontSize: '1rem' }}>&times;</span>
                          </IconButton>
                        )}
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          { field: "board10", label: "10th Board" },
                          { field: "percentage10", label: "10th Percentage", type: "number", min: 0, max: 100 },
                          { field: "board12", label: "12th Board" },
                          { field: "percentage12", label: "12th Percentage", type: "number", min: 0, max: 100 },
                          { field: "college", label: "College/University" },
                          { field: "collegeDegree", label: "Degree" },
                          { field: "branch", label: "Branch" },
                          { field: "passingYear", label: "Passing Year", type: "number", min: 1900, max: new Date().getFullYear() },
                          { field: "cgpa", label: "CGPA", type: "number", min: 0, max: 10, step: 0.01 },
                        ].map((item) => (
                          <Grid item xs={12} sm={6} key={item.field}>
                            <TextField
                              label={item.label}
                              fullWidth
                              name={item.field}
                              value={education[item.field]}
                              onChange={(e) => handleEducationChange(index, e)}
                              type={item.type || "text"}
                              inputProps={{ 
                                min: item.min,
                                max: item.max,
                                step: item.step || "0.01"
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))}
                  <Button variant="outlined" onClick={addEducation} sx={{ mt: 2 }}>
                    Add Another Education
                  </Button>
                </>
              ) : (
                user.education.map((education, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Education {index + 1}:</Typography>
                    {education.board10 && (
                      <Typography>
                        10th: {education.board10} ({education.percentage10}%)
                      </Typography>
                    )}
                    {education.board12 && (
                      <Typography>
                        12th: {education.board12} ({education.percentage12}%)
                      </Typography>
                    )}
                    {education.college && (
                      <Typography>
                        {education.collegeDegree} in {education.branch || "Unknown"}, {education.college} 
                        {education.passingYear && ` (${education.passingYear}, CGPA: ${education.cgpa})`}
                      </Typography>
                    )}
                  </Box>
                ))
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Skills</Typography>
              {editing ? (
                <TextField
                  fullWidth
                  label="Skills (comma separated)"
                  name="skills"
                  value={user.skills}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              ) : (
                <Typography>{user.skills || "Not Set"}</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Experience (Years)</Typography>
              {editing ? (
                <TextField
                  fullWidth
                  name="experience"
                  value={user.experience}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ min: 0, step: "0.1" }}
                />
              ) : (
                <Typography>
                  {user.experience || user.experience === 0
                    ? `${user.experience} years`
                    : "Not Set"}
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Desired Job *</Typography>
              {editing ? (
                <TextField
                  fullWidth
                  label="Desired Job Position"
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

          <Grid item xs={12} textAlign="right">
            {editing ? (
              <Button
                variant="contained"
                color="primary"
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
>>>>>>> 9033fb1ca8285e267fab1623bdb9d651252c828f
      </Paper>
    </Box>
  );
<<<<<<< HEAD
}
=======
};

export default Profile;
>>>>>>> 03055e9a809cc103a63e5d00db58914de178c94c
