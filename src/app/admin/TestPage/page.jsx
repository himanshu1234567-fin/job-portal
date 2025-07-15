"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import axios from "axios";

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
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [role, setRole] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [success, setSuccess] = useState("");

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
        setSuccess("✅ Test assigned successfully!");
        setTitle("");
        setSkills([]);
        setNumQuestions(5);
        setRole("");
      } else {
        setSuccess("❌ Failed to assign test.");
      }
    } catch (error) {
      console.error("Error assigning test:", error);
      setSuccess("❌ Server error while assigning test.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Assign AI-Generated Test
      </Typography>

      {/* Test Title */}
      <TextField
        label="Test Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      {/* Skills Selection */}
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

      {/* Number of Questions */}
      <TextField
        label="Number of Questions"
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(Number(e.target.value))}
        fullWidth
        sx={{ mb: 3 }}
        inputProps={{ min: 1, max: 20 }}
      />

      {/* Job Role Selection */}
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

      {/* Submit Button */}
      <Button
        variant="contained"
        onClick={handleAssignTest}
        disabled={assigning}
      >
        {assigning ? "Assigning..." : "Assign Test"}
      </Button>

      {/* Success/Error Message */}
      {success && (
        <Typography
          sx={{ mt: 2 }}
          color={success.includes("✅") ? "success.main" : "error.main"}
        >
          {success}
        </Typography>
      )}
    </Box>
  );
};

export default AdminAssignTest;
