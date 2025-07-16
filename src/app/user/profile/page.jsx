"use client";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  Paper,
  TextField,
  Typography,
  Chip,
  LinearProgress,
  Stack,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // or useNavigate() from react-router-dom

const defaultProfile = {
  image: "/user.png",
  name: "",
  email: "",
  dob: "",
  phone: "",
  education: {
    tenth: "",
    twelfth: "",
    graduation: {
      collage_name: "",
      Graducation: "",
      branch: "",
      year: "",
      CGPA: "",
    },
  },
  skills: [],
  experience: "",
  desiredJobs: [],
  resume: "",
};

const Profile = () => {
  const [user, setUser] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [inputSkill, setInputSkill] = useState("");
  const [inputJob, setInputJob] = useState("");
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null); 
  const router = useRouter(); // back arrow navigation

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) setUser(JSON.parse(storedProfile));
  }, []);

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(user));
  }, [user]);

  const calculateCompletion = () => {
    const graduationComplete =
      user.education.graduation.collage_name &&
      user.education.graduation.branch &&
      user.education.graduation.year;

    const fields = [
      user.name,
      user.email,
      user.dob,
      user.phone,
      user.education.tenth,
      user.education.twelfth,
      graduationComplete,
      user.skills.length > 0,
      user.experience,
      user.desiredJobs.length > 0,
      user.resume.length>0,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

const handleChange = (e) => {
  const { name, value } = e.target;

  // Live validation but still allow user to type
  if (name === "email") {
    setUser((prev) => ({ ...prev, [name]: value }));
    return;
  }

  if (name === "phone") {
    if (!/^\d{0,10}$/.test(value)) return; // Only allow up to 10 digits
  }

  setUser((prev) => ({ ...prev, [name]: value }));
};

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    const gradFields = ["collage_name", "Graducation", "branch", "year", "CGPA"];
    if (gradFields.includes(name)) {
      setUser((prev) => ({
        ...prev,
        education: {
          ...prev.education,
          graduation: {
            ...prev.education.graduation,
            [name]: value,
          },
        },
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        education: {
          ...prev.education,
          [name]: value,
        },
      }));
    }
  };

  const addSkill = () => {
    if (inputSkill.trim()) {
      setUser((prev) => ({ ...prev, skills: [...prev.skills, inputSkill.trim()] }));
      setInputSkill("");
    }
  };

  const removeSkill = (index) => {
    const updated = [...user.skills];
    updated.splice(index, 1);
    setUser({ ...user, skills: updated });
  };

  const addJob = () => {
    if (inputJob.trim()) {
      setUser((prev) => ({
        ...prev,
        desiredJobs: [...prev.desiredJobs, inputJob.trim()],
      }));
      setInputJob("");
    }
  };

  const removeJob = (index) => {
    const updated = [...user.desiredJobs];
    updated.splice(index, 1);
    setUser({ ...user, desiredJobs: updated });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const removeImage = () => {
    setUser((prev) => ({ ...prev, image: "/user.png" }));
  };

  const progress = calculateCompletion();

  const handleResumeUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setUser((prev) => ({ ...prev, resume: file.name }));
  }
};

const removeResume = () => {
  setUser((prev) => ({ ...prev, resume: "" }));
};

  return (
    <Box p={2} bgcolor="#f5f5f5" minHeight="100vh">
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => router.push("/user/Userdashboard")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" ml={1}>
          Back to Dashboard
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto", border: "1px solid #ddd" }}>
        <Grid container spacing={3}>
          {/* Profile Image */}
          <Grid item xs={12} sm={3} textAlign="center">
            <Avatar
              src={user.image !== "/user.png" ? user.image : undefined}
              alt="Profile"
              sx={{ width: 100, height: 100, mx: "auto", fontSize: 32 }}
            >
              {user.image === "/user.png"
                ? user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "U"
                : ""}
            </Avatar>
            {editing && (
              <>
                <Button size="small" onClick={() => fileInputRef.current.click()}>
                  Upload
                </Button>
                <Button size="small" color="error" onClick={removeImage}>
                  Remove
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </>
            )}
          </Grid>

          {/* Name & Email */}
          <Grid item xs={12} sm={9}>
            {editing ? (
              <>
                <TextField
                  label="Full Name"
                  fullWidth
                  margin="dense"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Email (@gmail.com)"
                  fullWidth
                  margin="dense"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </>
            ) : (
              <>
                <Typography variant="h5">{user.name || "No Name"}</Typography>
                <Typography color="text.secondary">{user.email || "No Email"}</Typography>
              </>
            )}
          </Grid>

          {/* Progress */}
          <Grid item xs={12}>
            <Typography variant="body2" mb={1}>
              Profile Completion: {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
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
                    />
                  ) : (
                    <Typography>Phone: {user.phone || "Not Set"}</Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Education */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              {editing ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="10th %"
                      fullWidth
                      name="tenth"
                      value={user.education.tenth}
                      onChange={handleEducationChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="12th %"
                      fullWidth
                      name="twelfth"
                      value={user.education.twelfth}
                      onChange={handleEducationChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="College"
                      name="collage_name"
                      fullWidth
                      value={user.education.graduation.collage_name}
                      onChange={handleEducationChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Degree"
                      name="Graducation"
                      fullWidth
                      value={user.education.graduation.Graducation}
                      onChange={handleEducationChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Branch"
                      name="branch"
                      fullWidth
                      value={user.education.graduation.branch}
                      onChange={handleEducationChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Passing Year"
                      name="year"
                      fullWidth
                      value={user.education.graduation.year}
                      onChange={handleEducationChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="CGPA / Percentage"
                      name="CGPA"
                      fullWidth
                      value={user.education.graduation.CGPA}
                      onChange={handleEducationChange}
                    />
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Typography>10th: {user.education.tenth || "Not Set"}</Typography>
                  <Typography>12th: {user.education.twelfth || "Not Set"}</Typography>
                  <Typography>
                    Graduation: {user.education.graduation.Graducation || "Degree"} in{" "}
                    {user.education.graduation.branch || "Branch"} from{" "}
                    {user.education.graduation.collage_name || "College"} (
                    {user.education.graduation.year || "Year"}, CGPA:{" "}
                    {user.education.graduation.CGPA || "N/A"})
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>

          {/* Skills */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {user.skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    onDelete={editing ? () => removeSkill(idx) : undefined}
                    color="primary"
                    sx={{ my: 0.5 }}
                  />
                ))}
              </Stack>
              {editing && (
                <Stack direction="row" spacing={2} mt={2}>
                  <TextField
                    label="Add Skill"
                    value={inputSkill}
                    onChange={(e) => setInputSkill(e.target.value)}
                  />
                  <Button variant="contained" onClick={addSkill}>
                    Add
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* Experience */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Experience
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="experience"
                  value={user.experience}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{user.experience || "Not Set"}</Typography>
              )}
            </Paper>
          </Grid>

          {/* Desired Jobs */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Desired Jobs
              </Typography>
              <Stack spacing={1}>
                {user.desiredJobs.map((job, idx) => (
                  <Box key={idx} display="flex" alignItems="center">
                    <Typography>{job}</Typography>
                    {editing && (
                      <IconButton size="small" onClick={() => removeJob(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Stack>
              {editing && (
                <Stack direction="row" spacing={2} mt={2}>
                  <TextField
                    label="Add Job"
                    value={inputJob}
                    onChange={(e) => setInputJob(e.target.value)}
                  />
                  <Button variant="contained" onClick={addJob} color="success">
                    Add
                  </Button>
                </Stack>
              )}
            </Paper>
          </Grid>
          {/* Resume Upload */}
<Grid item xs={12}>
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Resume</Typography>

    {user.resume ? (
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography>{user.resume}</Typography>
        {editing && (
          <Button color="error" onClick={removeResume}>Remove</Button>
        )}
      </Box>
    ) : (
      editing && (
        <>
          <input
            type="file"
            ref={resumeInputRef}
            hidden
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />
          <Button variant="outlined" onClick={() => resumeInputRef.current.click()}>
            Upload Resume
          </Button>
        </>
      )
    )}
  </Paper>
</Grid>


          {/* Edit/Save Button */}
          <Grid item xs={12} textAlign="right">
            <Button
              variant="contained"
              color={editing ? "success" : "primary"}
              onClick={() => {
                if (editing) {
                  const progress = calculateCompletion();
                  localStorage.setItem("profileComplete", JSON.stringify(progress === 100));
                  localStorage.setItem("profileProgress", JSON.stringify(progress));
                  setEditing(false);
                } else {
                  setEditing(true);
                }
              }}
            >
              {editing ? "Save" : "Edit Profile"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
