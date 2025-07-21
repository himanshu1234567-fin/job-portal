"use client";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  LinearProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const blankEducation = {
  board10: "",
  percentage10: "",
  board12: "",
  percentage12: "",
  college: "",
  collegeDegree: "",
  branch: "",
  passingYear: "",
  cgpa: "",
};

const defaultProfile = {
  fullName: "",
  email: "",
  dob: "",
  phone: "",
  education: [blankEducation],
  skills: "",
  experience: "",
  desirableJob: "",
};

const Profile = () => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      return storedUser
        ? { ...defaultProfile, ...JSON.parse(storedUser) }
        : defaultProfile;
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

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("authToken");

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        if (!token) {
          setError("Authentication required. Please login.");
          setLoading(false);
          return;
        }

        // Get user ID
        const userIdRes = await axios.get(
          "http://localhost:5000/api/candidates/user-id",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (isMounted) setCurrentUserId(userIdRes.data.userId);

        // Get profile data
        const meRes = await axios.get(
          "http://localhost:5000/api/candidates/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const candidateData = meRes.data;
        setCandidateId(candidateData._id);

        // Parse date safely
        let dob = "";
        try {
          dob = candidateData.dob
            ? new Date(candidateData.dob).toISOString().split("T")[0]
            : "";
        } catch (e) {
          console.error("Date parsing error:", e);
        }

        setUser({
          ...user,
          ...candidateData,
          dob,
          education: Array.isArray(candidateData.education) &&
            candidateData.education.length > 0
            ? candidateData.education
            : [blankEducation],
          skills: Array.isArray(candidateData.skills)
            ? candidateData.skills.join(", ")
            : "",
        });
        setEditing(false);
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 404) {
            setError("Profile not found. Creating new profile...");
            setEditing(true);
          } else {
            setError(
              err.response?.data?.message ||
                "Failed to load profile. Please try again."
            );
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) fetchProfile();
    else setLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  const calculateCompletion = () => {
    const requiredFields = [
      user.fullName,
      user.email,
      user.phone,
      user.dob,
      user.desirableJob,
    ];

    // Check at least one education entry has college details
    const hasCollegeEducation = user.education.some(
      (education) => education.college && education.collegeDegree
    );

    const filledCount = [
      ...requiredFields,
      hasCollegeEducation,
      user.skills,
      user.experience,
    ].filter(Boolean).length;

    return Math.round((filledCount / 8) * 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      education: prev.education.map((education, i) =>
        i === index ? { ...education, [name]: value } : education
      ),
    }));
  };

  const addEducation = () => {
    setUser((prev) => ({
      ...prev,
      education: [...prev.education, { ...blankEducation }],
    }));
  };

  const removeEducation = (index) => {
    if (user.education.length <= 1) return;
    setUser((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication required. Please login.");
      return;
    }

    // Basic validation
    if (!user.fullName || !user.email || !user.phone || !user.desirableJob) {
      setError("Please fill in all required fields (*)");
      return;
    }

    // Education validation
const isEducationValid = user.education.every(
  (education) =>
    (!education.board10 || !isNaN(parseFloat(education.percentage10))) &&
    (!education.board12 || !isNaN(parseFloat(education.percentage12))) &&
    (!education.college ||
      (education.collegeDegree &&
        !isNaN(parseInt(education.passingYear)) &&
        !isNaN(parseFloat(education.cgpa))))
);


    if (!isEducationValid) {
      setError("Please enter valid education details");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Prepare education data with safe number conversion
      const preparedEducation = user.education.map((education) => ({
        ...education,
        percentage10: education.percentage10 ? parseFloat(education.percentage10) : null,
        percentage12: education.percentage12 ? parseFloat(education.percentage12) : null,
        passingYear: education.passingYear ? parseInt(education.passingYear) : null,
        cgpa: education.cgpa ? parseFloat(education.cgpa) : null,
      }));

      const payload = {
        fullName: user.fullName,
        email: user.email,
        dob: user.dob,
        phone: user.phone,
        education: preparedEducation,
        skills: user.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience: user.experience ? parseFloat(user.experience) : 0,
        desirableJob: user.desirableJob,
      };

      let response;
      if (candidateId) {
        response = await axios.put(
          `http://localhost:5000/api/candidates/${userId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/candidates",
          { ...payload, userId: currentUserId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCandidateId(response.data._id);
      }

      // Update UI state
      const savedData = response.data;
      setUser({
        ...savedData,
        skills: Array.isArray(savedData.skills)
          ? savedData.skills.join(", ")
          : "",
        education: savedData.education || [blankEducation],
      });

      // Update completion status
      const progress = calculateCompletion();
      localStorage.setItem("profileComplete", progress === 100);
      localStorage.setItem("profileProgress", progress);

      setEditing(false);
      setError("Profile saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

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
                              value={education[item.field]}
                              onChange={(e) => handleEducationChange(index, e)}
                              type={item.type || "text"}
                              inputProps={item.type ? { step: "0.01" } : {}}
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