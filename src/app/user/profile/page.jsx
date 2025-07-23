"use client";
import {
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
            ) : (
              <>
                <Typography variant="h5">{user.fullName || "No Name"}</Typography>
                <Typography color="text.secondary">{user.email || "No Email"}</Typography>
              </>
            )}
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
      </Paper>
    </Box>
  );
};

export default Profile;