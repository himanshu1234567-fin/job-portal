"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

// Skill options available to assign in test
const skillOptions = [
  "Communication",
  "Technical",
  "Teamwork",
  "Problem-Solving",
  "Leadership",
  "Time Management",
  "Emotional Intelligence",
];

// Roles to which tests can be assigned
const jobRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "HR / Manager",
];

const AdminAssignTest = () => {
  // Test creation states
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [role, setRole] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [success, setSuccess] = useState("");

  // Candidate assignment states
  const [assignedTestId, setAssignedTestId] = useState(null);
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [assigningCandidate, setAssigningCandidate] = useState(false);
  const [candidateError, setCandidateError] = useState("");

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAssignTest = async () => {
    if (!title || skills.length === 0 || !numQuestions || !role) {
      setSuccess("Please fill in all fields before assigning.");
      return;
    }

    setAssigning(true);
    setSuccess("");

    try {
      const response = await axios.post("/api/admin/assign-test", {
        title,
        skills,
        numQuestions,
        role,
      });

      if (response.status === 200) {
        setSuccess("✅ Test created successfully! Now assign candidates.");
        setAssignedTestId(response.data.testId);
      } else {
        setSuccess("❌ Failed to create test.");
      }
    } catch (error) {
      console.error("Error creating test:", error);
      setSuccess("❌ Server error while creating test.");
    } finally {
      setAssigning(false);
    }
  };

  const handleAssignCandidate = async () => {
    if (!candidateEmail) {
      setCandidateError("Please enter an email address");
      return;
    }

    if (!validateEmail(candidateEmail)) {
      setCandidateError("Please enter a valid email address");
      return;
    }

    if (candidates.some((c) => c.email === candidateEmail)) {
      setCandidateError("Candidate already added");
      return;
    }

    setAssigningCandidate(true);
    setCandidateError("");

    try {
      // Add candidate to local state immediately
      const newCandidate = {
        email: candidateEmail,
        status: "assigning",
        id: Date.now().toString(),
      };
      setCandidates([...candidates, newCandidate]);

      // Simulate API call to backend
      await axios.post("/api/admin/assign-candidate", {
        testId: assignedTestId,
        email: candidateEmail,
      });

      // Update candidate status on success
      setCandidates(
        candidates.map((c) =>
          c.id === newCandidate.id ? { ...c, status: "assigned" } : c
        )
      );
      setCandidateEmail("");
    } catch (error) {
      console.error("Error assigning candidate:", error);
      // Update candidate status on error
      setCandidates(
        candidates.map((c) =>
          c.id === newCandidate.id ? { ...c, status: "error" } : c
        )
      );
      setCandidateError("❌ Failed to assign candidate");
    } finally {
      setAssigningCandidate(false);
    }
  };

  const handleRemoveCandidate = (id) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
  };

  const handleCreateNewTest = () => {
    setAssignedTestId(null);
    setTitle("");
    setSkills([]);
    setNumQuestions(5);
    setRole("");
    setCandidates([]);
    setSuccess("");
  };

  // Clear error when email changes
  useEffect(() => {
    if (candidateEmail) {
      setCandidateError("");
    }
  }, [candidateEmail]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {assignedTestId ? "Assign Candidates to Test" : "Create AI-Generated Test"}
      </Typography>

      {!assignedTestId ? (
        // Test Creation Form
        <>
          <TextField
            label="Test Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Skills</InputLabel>
            <Select
              multiple
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              input={<OutlinedInput label="Select Skills" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {skillOptions.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Number of Questions"
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            fullWidth
            sx={{ mb: 3 }}
            inputProps={{ min: 1, max: 20 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Job Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              input={<OutlinedInput label="Select Job Role" />}
            >
              {jobRoles.map((roleOption) => (
                <MenuItem key={roleOption} value={roleOption}>
                  {roleOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleAssignTest}
            disabled={assigning}
          >
            {assigning ? "Creating Test..." : "Create Test"}
          </Button>

          {success && (
            <Typography
              sx={{ mt: 2 }}
              color={success.includes("✅") ? "success.main" : "error.main"}
            >
              {success}
            </Typography>
          )}
        </>
      ) : (
        // Candidate Assignment Section
        <>
          <Box bgcolor="#f5f5f5" p={3} borderRadius={2} mb={3}>
            <Typography variant="h6" gutterBottom>
              Test Details
            </Typography>
            <Typography>
              <strong>Title:</strong> {title}
            </Typography>
            <Typography>
              <strong>Skills:</strong> {skills.join(", ")}
            </Typography>
            <Typography>
              <strong>Questions:</strong> {numQuestions}
            </Typography>
            <Typography>
              <strong>Role:</strong> {role}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            Assign Candidates
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <TextField
              label="Candidate Email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              fullWidth
              error={!!candidateError}
              helperText={candidateError}
              disabled={assigningCandidate}
            />
            <Button
              variant="contained"
              onClick={handleAssignCandidate}
              disabled={assigningCandidate || !candidateEmail}
            >
              {assigningCandidate ? "Assigning..." : "Assign"}
            </Button>
          </Box>

          {candidates.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Assigned Candidates
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell align="right">
                          {candidate.status === "assigned" ? (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="Assigned"
                              color="success"
                              size="small"
                            />
                          ) : candidate.status === "error" ? (
                            <Chip
                              icon={<ErrorIcon />}
                              label="Failed"
                              color="error"
                              size="small"
                            />
                          ) : (
                            <Chip
                              label="Assigning..."
                              color="info"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleRemoveCandidate(candidate.id)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={handleCreateNewTest}
              disabled={assigningCandidate}
            >
              Create New Test
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={candidates.length === 0 || assigningCandidate}
            >
              Finish Assignment
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminAssignTest;