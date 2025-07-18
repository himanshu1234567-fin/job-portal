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

// Defines a blank education entry structure
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

// Default profile structure, education is now an array
const defaultProfile = {
  fullName: "",
  email: "",
  dob: "",
  phone: "",
  education: [], // Initialize as an empty array
  skills: "",
  experience: "",
  desirableJob: "",
};

const Profile = () => {
  const [user, setUser] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [candidateId, setCandidateId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const router = useRouter();

  // 🔄 Fetch profile from backend on mount
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("You are not logged in. Please log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        // 1️⃣ Fetch the logged-in user's ID from the token
        const userIdRes = await axios.get("http://localhost:5000/api/candidates/user-id", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUserId = userIdRes.data.userId;
        if (isMounted) {
          setCurrentUserId(fetchedUserId);
        }
        console.log("Logged-in user ID from /user-id:", fetchedUserId);

        // 2️⃣ Try to fetch the candidate profile for this user
        const meRes = await axios.get("http://localhost:5000/api/candidates/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!isMounted) return;

        const candidateData = meRes.data;
        console.log("Fetched candidate data:", candidateData);

        setCandidateId(candidateData._id);

        const mergedData = {
          ...defaultProfile,
          ...candidateData,
          // If education array is empty or not provided, add a blank one for the UI
          education: (Array.isArray(candidateData.education) && candidateData.education.length > 0)
            ? candidateData.education
            : [blankEducation], // Ensure at least one blank entry for editing
          skills: Array.isArray(candidateData.skills)
            ? candidateData.skills.join(", ")
            : "",
          dob: candidateData.dob ? new Date(candidateData.dob).toISOString().split('T')[0] : "",
        };

        setUser(mergedData);
        setEditing(false);

      } catch (err) {
        if (isMounted) {
          if (err.response && err.response.status === 404) {
            setError("No candidate profile found. Please create your profile.");
            setUser({ ...defaultProfile, education: [blankEducation] }); // Start with one blank education for creation
            setEditing(true);
          } else {
            setError(err.response?.data?.message || err.message || "Failed to load profile.");
          }
          console.error("Error fetching profile:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const calculateCompletion = () => {
    // Check if at least one education entry is complete
    const anyEducationComplete = user.education.some(edu =>
      edu.college && edu.collegeDegree && edu.passingYear && edu.cgpa
    );

    const fields = [
      user.fullName,
      user.email,
      user.dob,
      user.phone,
      anyEducationComplete, // Check if any education is complete
      user.skills,
      user.experience,
      user.desirableJob,
    ];

    // For each education entry, add its board and percentage fields to the completion check
    user.education.forEach(edu => {
        fields.push(edu.board10, edu.percentage10, edu.board12, edu.percentage12);
    });

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (!/^\d{0,10}$/.test(value)) return;
    }
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handles changes for a specific education entry by index
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = user.education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [name]: value };
      }
      return edu;
    });
    setUser((prev) => ({ ...prev, education: updatedEducation }));
  };

  // Adds a new blank education entry
  const addEducation = () => {
    setUser((prev) => ({
      ...prev,
      education: [...prev.education, { ...blankEducation }],
    }));
  };

  // Removes an education entry by index
  const removeEducation = (index) => {
    setUser((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please sign in.");
      return;
    }

    // Basic validation
    if (!user.fullName || !user.email || !user.phone || !user.dob || !user.desirableJob) {
      setError("Please fill in all basic required fields: Full Name, Email, Phone, Date of Birth, Desired Job.");
      return;
    }

    // Validate each education entry
    const isEducationValid = user.education.every(edu =>
      edu.college && edu.collegeDegree && edu.passingYear && edu.cgpa &&
      edu.board10 && edu.percentage10 !== "" && edu.board12 && edu.percentage12 !== ""
    );

    if (editing && !isEducationValid) {
        setError("Please ensure all required education fields are completed for each entry.");
        return;
    }


    try {
      setLoading(true);
      setError("");

      // Prepare education data: convert percentages/cgpa to numbers
      const preparedEducationArray = user.education.map(edu => ({
        ...edu,
        percentage10: edu.percentage10 ? Number(edu.percentage10) : 0,
        percentage12: edu.percentage12 ? Number(edu.percentage12) : 0,
        passingYear: edu.passingYear ? Number(edu.passingYear) : 0,
        cgpa: edu.cgpa ? Number(edu.cgpa) : 0,
      }));


      const preparedUser = {
        fullName: user.fullName,
        email: user.email,
        dob: user.dob,
        phone: user.phone,
        education: preparedEducationArray, // This is already an array
        skills: user.skills
          ? user.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        experience: user.experience ? Number(user.experience) : 0,
        desirableJob: user.desirableJob,
      };

      let res;
      if (candidateId) {
        console.log("Updating profile for candidate ID:", candidateId);
        res = await axios.put(
          `http://localhost:5000/api/candidates/${candidateId}`,
          preparedUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        if (!currentUserId) {
          setError("User ID not available for profile creation. Please log in again.");
          setLoading(false);
          return;
        }
        console.log("Creating new profile for user ID:", currentUserId);
        res = await axios.post(
          "http://localhost:5000/api/candidates",
          { ...preparedUser, userId: currentUserId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCandidateId(res.data.candidate._id);
      }

      // Update local state with response data, converting skills back to string
      const updatedUser = {
        ...(res.data.candidate || res.data),
        skills: Array.isArray(res.data.candidate?.skills || res.data.skills)
          ? (res.data.candidate?.skills || res.data.skills).join(", ")
          : "",
        dob: (res.data.candidate?.dob || res.data.dob) ? new Date(res.data.candidate?.dob || res.data.dob).toISOString().split('T')[0] : "",
        // Ensure education is an array and set it directly
        education: Array.isArray(res.data.candidate?.education || res.data.education)
          ? (res.data.candidate?.education || res.data.education)
          : [blankEducation] // Fallback to blank if somehow empty
      };

      setUser(updatedUser);

      const progress = calculateCompletion();
      localStorage.setItem("profileComplete", JSON.stringify(progress === 100));
      localStorage.setItem("profileProgress", JSON.stringify(progress));

      setEditing(false);
      setError("Profile saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to save profile"
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
      </Paper>
    </Box>
  );
};

export default Profile;