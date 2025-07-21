'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, Typography, Radio, RadioGroup,
  FormControlLabel, Checkbox, LinearProgress, Divider, CircularProgress,
  Alert
} from '@mui/material';

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found in localStorage');
        }

        const response = await fetch('http://localhost:5000/api/questions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setApiResponse(response); // Store response for debugging

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || 
            `API request failed with status ${response.status}`
          );
        }

        const responseData = await response.json();
        console.log('Full API response:', responseData); // Debug log

        // Handle different response structures
        let fetchedQuestions = [];
        if (Array.isArray(responseData)) {
          fetchedQuestions = responseData;
        } else if (Array.isArray(responseData.data)) {
          fetchedQuestions = responseData.data;
        } else if (responseData.questions) {
          fetchedQuestions = Array.isArray(responseData.questions) 
            ? responseData.questions 
            : [];
        }

        // Validate question structure
        fetchedQuestions = fetchedQuestions.map(question => ({
          ...question,
          title: question.title || 'Untitled Question',
          question: question.question || question.title || 'No question text provided',
          duration: Number(question.duration) || 60,
          options: Array.isArray(question.options) 
            ? question.options.map(opt => ({
                text: opt.text || 'Unlabeled option',
                isCorrect: Boolean(opt.isCorrect)
              }))
            : [],
          allowMultipleCorrect: Boolean(question.allowMultipleCorrect)
        }));

        if (fetchedQuestions.length === 0) {
          console.warn('API returned empty questions array');
        }

        setQuestions(fetchedQuestions);

        // Calculate total test duration
        const totalDuration = fetchedQuestions.reduce(
          (sum, q) => sum + q.duration, 
          0
        );
        setTotalTime(totalDuration);
        setTimer(totalDuration);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0 && !showResult && questions.length > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer <= 0 && !showResult && questions.length > 0) {
      submitTest();
    }
  }, [timer, showResult, questions]);

  const handleAnswerChange = (optionText) => {
    setUserAnswers(prev => ({
      ...prev,
      [questions[currentIndex]?.title]: optionText
    }));
  };

  const handleMultipleAnswerChange = (optionText) => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    
    const key = currentQuestion.title;
    const previousAnswers = Array.isArray(userAnswers[key]) 
      ? userAnswers[key] 
      : [];

    setUserAnswers(prev => ({
      ...prev,
      [key]: previousAnswers.includes(optionText)
        ? previousAnswers.filter(ans => ans !== optionText)
        : [...previousAnswers, optionText]
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = () => {
    let calculatedScore = 0;

    questions.forEach((question) => {
      const correctAnswers = question.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.text);

      const userAnswer = userAnswers[question.title];

      if (question.allowMultipleCorrect) {
        const isCorrect = Array.isArray(userAnswer) &&
          userAnswer.length === correctAnswers.length &&
          userAnswer.every(ans => correctAnswers.includes(ans));
        if (isCorrect) calculatedScore += 1;
      } else {
        if (correctAnswers.includes(userAnswer)) {
          calculatedScore += 1;
        }
      }
    });

    setScore(calculatedScore);
    setShowResult(true);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading test questions...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Error Loading Test</Typography>
          {error}
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          API Response Status: {apiResponse?.status || 'N/A'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (questions.length === 0 && !loading) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Alert severity="warning">
          <Typography variant="h6">No Questions Available</Typography>
          <Typography>
            The test contains no questions. Please contact your instructor.
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (showResult) {
    return (
      <Box sx={{ 
        maxWidth: 600, 
        mx: 'auto', 
        p: 4, 
        textAlign: 'center',
        boxShadow: 3,
        borderRadius: 2,
        mt: 4
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
          Test Completed!
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Your Score: {score} / {questions.length}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {score === questions.length ? 'Perfect score! 🎉' : ''}
          {score >= questions.length * 0.7 ? 'Well done!' : ''}
        </Typography>
         <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#fff', color: '#003366', mt: 3, fontWeight: 'bold',
            '&:hover': { bgcolor: '#e0e0e0' },
          }}
          href='/'
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const progressValue = totalTime > 0 
    ? ((totalTime - timer) / totalTime) * 100 
    : 0;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 1, sm: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1
        }}>
          <Typography variant="body1" fontWeight="bold">
            Question {currentIndex + 1} of {questions.length}
          </Typography>
          <Typography 
            variant="body1" 
            fontWeight="bold"
            color={timer <= 10 ? 'error.main' : 'text.primary'}
          >
            Time Remaining: {timer} sec
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            }
          }}
        />
      </Box>

      <Card sx={{ 
        borderRadius: 2, 
        boxShadow: 3,
        mb: 3
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {currentQuestion.question}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {currentQuestion.allowMultipleCorrect ? (
            currentQuestion.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Checkbox
                    checked={(userAnswers[currentQuestion.title] || []).includes(option.text)}
                    onChange={() => handleMultipleAnswerChange(option.text)}
                    color="primary"
                  />
                }
                label={<Typography variant="body1">{option.text}</Typography>}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  mb: 1,
                  ml: 0.5
                }}
              />
            ))
          ) : (
            <RadioGroup
              value={userAnswers[currentQuestion.title] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              {currentQuestion.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option.text}
                  control={<Radio color="primary" />}
                  label={<Typography variant="body1">{option.text}</Typography>}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    mb: 1,
                    ml: 0.5
                  }}
                />
              ))}
            </RadioGroup>
          )}

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mt: 3,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            {currentIndex > 0 && (
              <Button
                variant="outlined"
                onClick={() => setCurrentIndex(prev => prev - 1)}
                sx={{ textTransform: 'none' }}
              >
                Previous
              </Button>
            )}
            
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                textTransform: 'none',
                ml: 'auto',
                minWidth: 120
              }}
              disabled={
                currentQuestion.allowMultipleCorrect
                  ? !userAnswers[currentQuestion.title]?.length
                  : !userAnswers[currentQuestion.title]
              }
            >
              {currentIndex + 1 === questions.length ? 'Submit Test' : 'Next Question'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestPage;