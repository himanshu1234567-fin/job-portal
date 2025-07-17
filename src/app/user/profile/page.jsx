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

const defaultProfile = {
  fullName: "",
  email: "",
  dob: "",
  phone: "",
  education: {
    board10: "",
    percentage10: "",
    board12: "",
    percentage12: "",
    college: "",
    collegeDegree: "",
    branch: "",
    passingYear: "",
    cgpa: "",
  },
  skills: "",
  experience: "",
  desirableJob: "",
};

const Profile = () => {
  const [user, setUser] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔄 Fetch profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not logged in.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/candidates", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fill missing fields if needed
        setUser({ ...defaultProfile, ...res.data });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const calculateCompletion = () => {
    const educationComplete =
      user.education.college &&
      user.education.collegeDegree &&
      user.education.branch &&
      user.education.passingYear &&
      user.education.cgpa;

    const fields = [
      user.fullName,
      user.email,
      user.dob,
      user.phone,
      user.education.board10,
      user.education.percentage10,
      user.education.board12,
      user.education.percentage12,
      educationComplete,
      user.skills,
      user.experience,
      user.desirableJob,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && value && !/^[0-9]{0,10}$/.test(value)) return;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value,
      },
    }));
  };

const saveProfile = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    setError("No authentication token found. Please sign in.");
    return;
  }

  // Basic validation (optional but recommended)
  if (!user.fullName || !user.email || !user.phone) {
    setError("Please fill in required fields: name, email, phone.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    // Prepare and convert types where necessary
    const preparedUser = {
      ...user,
      skills: user.skills
        ? user.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      experience: Number(user.experience),
      education: {
        ...user.education,
        percentage10: Number(user.education.percentage10),
        percentage12: Number(user.education.percentage12),
        cgpa: Number(user.education.cgpa),
        passingYear: Number(user.education.passingYear),
      },
    };

    console.log("Prepared data:", preparedUser);

    // API call
     const res = await axios.put("http://localhost:5000/api/candidates", preparedUser, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Server response:", res.data);

    // Set updated user state
    setUser({ ...defaultProfile, ...res.data });

    // Optionally store profile completion flag
    localStorage.setItem("profileComplete", JSON.stringify(calculateCompletion() === 100));
    setEditing(false);
  } catch (err) {
    console.error("PUT request failed:");
    if (err.response) {
      console.error("Response error:", JSON.stringify(err.response.data, null, 2));

      // console.error("Response error:", err.response.data);
      setError(err.response.data.error || "Failed to save profile");
    } else if (err.request) {
      console.error("No response received:", err.request);
      setError("No response from server");
    } else {
      console.error("General error:", err.message);
      setError("Something went wrong");
    }
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
                />
              </>
            ) : (
              <>
                <Typography variant="h5">{user.fullName || "No Name"}</Typography>
                <Typography color="text.secondary">{user.email || "No Email"}</Typography>
              </>
            )}
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
                  {["board10", "percentage10", "board12", "percentage12", "college", "collegeDegree", "branch", "passingYear", "cgpa"].map((field, i) => (
                    <Grid item xs={6} key={field}>
                      <TextField
                        label={field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                        fullWidth
                        name={field}
                        value={user.education[field] || ""}
                        onChange={handleEducationChange}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <>
                  <Typography>
                    10th: {user.education.board10 || "Not Set"} ({user.education.percentage10 || "Not Set"}%)
                  </Typography>
                  <Typography>
                    12th: {user.education.board12 || "Not Set"} ({user.education.percentage12 || "Not Set"}%)
                  </Typography>
                  <Typography>
                    Graduation: {user.education.collegeDegree || "Degree"} in {user.education.branch || "Branch"} from {user.education.college || "College"} (
                    {user.education.passingYear || "Year"}, CGPA: {user.education.cgpa || "N/A"})
                  </Typography>
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
                  placeholder="e.g., JavaScript,Node.js,MongoDB"
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
                />
              ) : (
                <Typography>{user.experience || "Not Set"} years</Typography>
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
                />
              ) : (
                <Typography>{user.desirableJob || "Not Set"}</Typography>
              )}
            </Paper>
          </Grid>

          {/* Edit/Save Button */}
          <Grid item xs={12} textAlign="right">
            <Button
              variant="contained"
              color={editing ? "success" : "primary"}
              onClick={editing ? saveProfile : () => setEditing(true)}
              disabled={loading}
            >
              {loading ? "Saving..." : editing ? "Save" : "Edit Profile"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
