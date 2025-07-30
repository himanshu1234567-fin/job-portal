"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Autocomplete,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack, // For button layout
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For marking the correct answer
import axios from "axios";
import { useError } from "../../../context/ErrorContext"; // ✅ IMPORT: Import the useError hook

// A small component to render success messages
const StatusMessage = ({ success }) => {
  if (success) return <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>;
  return null;
};


const AdminMCQGenerator = () => {
  const { showError } = useError(); // ✅ HOOK: Instantiate the error handler

  // State to manage the current step in the wizard UI
  const [currentStep, setCurrentStep] = useState('generate'); // 'generate', 'review', 'assign'

  // State for MCQ Generation
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [generatedMCQs, setGeneratedMCQs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for Candidate fetching and Test Assignment
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState("");

  // Fetch candidates only once when the component mounts
  useEffect(() => {
    const fetchCandidates = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        showError("Authentication token not found. Please log in again.", "Auth Error");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/candidates/", {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setCandidates(response.data.candidates || []);
      } catch (err) {
        // ✅ ERROR HANDLING: Use the popup for API errors
        const errorMessage = err.response?.data?.message || "Failed to fetch candidates.";
        showError(errorMessage, "Data Fetch Error");
      }
    };
    fetchCandidates();
  }, [showError]);

  const handleReset = () => {
    setCurrentStep('generate');
    setRole('');
    setDifficulty('medium');
    setCount(5);
    setGeneratedMCQs([]);
    setLoading(false);
    setSelectedCandidate(null);
    setAssignLoading(false);
    setAssignSuccess('');
  };

  const handleGenerateMCQs = async () => {
    if (!role || !difficulty || !count) {
      showError("Please fill in all fields to generate questions.", "Input Required");
      return;
    }
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      showError("Authentication error. Please log in again.", "Auth Error");
      return;
    }

    setLoading(true);
    setGeneratedMCQs([]);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/mcq/generate",
        { role, count, difficulty },
        { headers: { 'Authorization': `Bearer ${authToken}` } }
      );
      if (response.data.success) {
        setGeneratedMCQs(response.data.data || []);
        setCurrentStep('review'); // Move to the next step
      } else {
        // Handle non-2xx success=false responses
        showError(response.data.message || "An unknown error occurred.", "Generation Failed");
      }
    } catch (err) {
      // ✅ ERROR HANDLING: Use the popup for API errors
      const errorMessage = err.response?.data?.message || "A server error occurred.";
      showError(errorMessage, "Generation Error");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTest = async () => {
    if (!selectedCandidate) {
      showError("Please select a candidate to assign the test.", "Input Required");
      return;
    }
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      showError("Authentication error. Please log in again.", "Auth Error");
      return;
    }

    setAssignLoading(true);
    setAssignSuccess("");

    try {
      const questionIds = generatedMCQs.map(mcq => mcq._id);
      const response = await axios.post(
        "http://localhost:5000/api/tests/assign",
        {
          candidateId: selectedCandidate._id,
          questionIds,
          role
        },
        { headers: { 'Authorization': `Bearer ${authToken}` } }
      );

      if (response.data.success) {
        setAssignSuccess(response.data.message || "Test assigned successfully!");
      } else {
        showError(response.data.message || "Failed to assign test.", "Assignment Failed");
      }
    } catch (err) {
      // ✅ ERROR HANDLING: Use the popup for API errors
      const errorMessage = err.response?.data?.message || "A server error occurred during assignment.";
      showError(errorMessage, "Assignment Error");
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        AI-Powered Test Generator
      </Typography>

      {/* STEP 1: GENERATE QUESTIONS */}
      {currentStep === 'generate' && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Step 1: Generate Questions</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mt: 2 }}>
            <TextField label="Job Role" value={role} onChange={(e) => setRole(e.target.value)} fullWidth placeholder="e.g., Frontend Developer"/>
            <TextField select SelectProps={{ native: true }} label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} fullWidth>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </TextField>
            <TextField label="Number of Questions" type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} fullWidth inputProps={{ min: 1, max: 20 }}/>
          </Box>
          <Button variant="contained" onClick={handleGenerateMCQs} disabled={loading} sx={{ mt: 3 }}>
            {loading ? <CircularProgress size={24} /> : "Generate & Review Questions"}
          </Button>
        </Paper>
      )}

      {/* STEP 2: REVIEW QUESTIONS */}
      {currentStep === 'review' && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Step 2: Review Questions ({role})</Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Options</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {generatedMCQs.map((mcq, questionIndex) => (
                  <TableRow key={mcq._id}>
                    <TableCell sx={{ verticalAlign: 'top', fontWeight: 'bold' }}>
                      {`${questionIndex + 1}. ${mcq.question}`}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      <Chip label={mcq.category} size="small" />
                    </TableCell>
                    <TableCell>
                      <List dense>
                        {mcq.options.map((option, index) => (
                          <ListItem key={index} disablePadding>
                            {index === mcq.correctOption && (
                              <ListItemIcon sx={{ minWidth: '32px' }}>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                            )}
                            <ListItemText
                              primary={`${index + 1}. ${option}`}
                              sx={{
                                fontWeight: index === mcq.correctOption ? 'bold' : 'normal',
                                color: index === mcq.correctOption ? 'success.main' : 'text.primary',
                                marginLeft: index !== mcq.correctOption ? '32px' : 0,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" onClick={() => setCurrentStep('assign')}>Proceed to Assign</Button>
            <Button variant="outlined" onClick={handleReset}>Start Over</Button>
          </Stack>
        </Paper>
      )}

      {/* STEP 3: ASSIGN TEST */}
      {currentStep === 'assign' && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Step 3: Assign Test</Typography>
          
          {assignSuccess ? (
            <Box>
              <StatusMessage success={assignSuccess} />
              <Button variant="contained" onClick={handleReset} sx={{ mt: 2 }}>
                Create Another Test
              </Button>
            </Box>
          ) : (
            <>
              <Autocomplete
                options={candidates}
                getOptionLabel={(option) => option.fullName || ""}
                value={selectedCandidate}
                onChange={(event, newValue) => setSelectedCandidate(newValue)}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option._id}>
                    {option.fullName} ({option.email})
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Select a Candidate" />
                )}
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleAssignTest} disabled={!selectedCandidate || assignLoading}>
                  {assignLoading ? <CircularProgress size={24} /> : `Assign Test to ${selectedCandidate?.fullName || 'Candidate'}`}
                </Button>
                <Button variant="outlined" onClick={() => setCurrentStep('review')}>Back to Review</Button>
                <Button variant="outlined" color="error" onClick={handleReset}>Start Over</Button>
              </Stack>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AdminMCQGenerator;