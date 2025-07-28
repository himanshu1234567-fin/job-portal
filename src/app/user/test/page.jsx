'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, Typography, Radio, RadioGroup,
  FormControlLabel, LinearProgress, Divider, CircularProgress, Paper
} from '@mui/material';
import axios from 'axios';

const TestPage = () => {
  // State for the entire test object and questions
  const [test, setTest] = useState(null);
  const questions = test?.questions || [];

  // State for test flow and UI
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Effect to fetch the assigned test for the user
  useEffect(() => {
    const fetchAssignedTest = async () => {
      setLoading(true);
      setError("");
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch the specific test assigned to the logged-in user
        const response = await axios.get('http://localhost:5000/api/tests', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.data.success && response.data.test) {
          const fetchedTest = response.data.test;
          setTest(fetchedTest);
          
          // Calculate total time from the questions in the fetched test
          const totalDuration = fetchedTest.questions.reduce((sum, q) => {
            return sum + (Number(q.duration) || 60); // Default to 60s
          }, 0);

          setTotalTime(totalDuration);
          setTimer(totalDuration);
        } else {
          // Handle cases where a test might not be assigned
          throw new Error(response.data.message || "No active test assigned to you.");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "An error occurred.";
        setError(errorMessage);
        setTest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTest();
  }, []);

  // Effect to manage the countdown timer
  useEffect(() => {
    if (timer > 0 && !showResult) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer <= 0 && !showResult && test) {
      // Automatically submit if the timer runs out
      submitTest();
    }
  }, [timer, showResult, test]);

  const handleAnswerChange = (optionText) => {
    setUserAnswers(prev => ({
      ...prev,
      [questions[currentIndex]?._id]: optionText
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      submitTest();
    }
  };
  
  // 2. Submit the completed test results to the backend
  const submitTest = async () => {
    if (submitting) return; // Prevent double submission
    setSubmitting(true);
    
    let calculatedScore = 0;
    questions.forEach((question) => {
      if (userAnswers[question._id] === question.options[question.correctOption]) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore); // Set score for immediate UI update

    const authToken = localStorage.getItem('authToken');
    try {
      await axios.post('http://localhost:5000/api/tests/submit', 
        {
          testId: test._id,
          answers: userAnswers,
          score: calculatedScore,
          timeTaken: totalTime - timer,
        },
        { headers: { 'Authorization': `Bearer ${authToken}` } }
      );
    } catch (err) {
      // Log error but show results anyway as the test is complete on the client-side
      console.error("Failed to submit test results:", err);
    } finally {
      setShowResult(true);
      setSubmitting(false);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Your Test...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ m: 4, textAlign: 'center', color: 'error.main' }} variant="h6">
        {error}
      </Typography>
    );
  }
  
  if (showResult) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, textAlign: 'center' }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom color="primary.main">Test Completed!</Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>Role: {test?.role}</Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Your Score: {score} / {questions.length}
          </Typography>
          <LinearProgress variant="determinate" value={(score / questions.length) * 100} sx={{ height: 10, borderRadius: 5, mb: 3 }} />
          <Button variant="contained" href="/" size="large">Go to Home</Button>
        </Paper>
      </Box>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography variant="h6" color={timer <= 10 ? 'error' : 'text.primary'}>
          Time Remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </Typography>
        <LinearProgress variant="determinate" value={((totalTime - timer) / totalTime) * 100} sx={{ height: 8, borderRadius: 4, mt: 1 }} />
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="body2" color="text.secondary">Question {currentIndex + 1} of {questions.length}</Typography>
          <Typography variant="h6" sx={{ my: 2 }}>{currentQuestion.question}</Typography>
          <Divider sx={{ mb: 2 }} />

          <RadioGroup value={userAnswers[currentQuestion._id] || ''} onChange={(e) => handleAnswerChange(e.target.value)}>
            {currentQuestion.options.map((option, idx) => (
              <FormControlLabel key={idx} value={option} control={<Radio />} label={option} sx={{ display: 'block', mb: 1 }} />
            ))}
          </RadioGroup>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" onClick={handleNext} disabled={!userAnswers[currentQuestion._id] || submitting}>
              {submitting && currentIndex + 1 === questions.length 
                ? <CircularProgress size={24} color="inherit" />
                : (currentIndex + 1 === questions.length ? 'Submit Test' : 'Next')
              }
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestPage;