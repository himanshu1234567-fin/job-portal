'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, Typography, Radio, RadioGroup,
  FormControlLabel, Checkbox, LinearProgress, Divider
} from '@mui/material';
import axios from 'axios';  

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('authToken'); 

        const res = await axios.get('http://localhost:3000/api/questions', {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });

        const fetchedQuestions = Array.isArray(res.data.data) ? res.data.data : [];

        setQuestions(fetchedQuestions); // Set the questions data

        const totalDuration = fetchedQuestions.reduce((sum, q) => {
          const duration = Number(q.duration) || 60;
          return sum + duration;
        }, 0);

        const finalDuration = totalDuration > 0 ? totalDuration : 60;
        setTotalTime(finalDuration);
        setTimer(finalDuration);  // Set the total time and initialize the timer
      } catch (error) {
        console.error('Failed to fetch questions:', error); // Log any error in fetching questions
      }
    };

    fetchQuestions();  // Call the function to fetch questions
  }, []);  // Empty dependency array so it runs once on component mount

  useEffect(() => {
    if (timer > 0 && !showResult) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);  // Decrease timer by 1 every second
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer <= 0 && !showResult && questions.length > 0) {
      submitTest();  // Submit test if time is up
    }
  }, [timer, showResult, questions]);

  const handleAnswerChange = (optionText) => {
    setUserAnswers({
      ...userAnswers,
      [questions[currentIndex]?.title]: optionText  // Store user answers
    });
  };

  const handleMultipleAnswerChange = (optionText) => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    const key = currentQuestion.title;
    const previousAnswers = userAnswers[key] || [];

    if (previousAnswers.includes(optionText)) {
      setUserAnswers({
        ...userAnswers,
        [key]: previousAnswers.filter(ans => ans !== optionText)
      });
    } else {
      setUserAnswers({
        ...userAnswers,
        [key]: [...previousAnswers, optionText]
      });
    }
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
        ?.filter(opt => opt.isCorrect)
        ?.map(opt => opt.text) || [];

      const userAnswer = userAnswers[question.title];

      if (question.allowMultipleCorrect) {
        const correct = Array.isArray(userAnswer)
          && userAnswer.length === correctAnswers.length
          && userAnswer.every(ans => correctAnswers.includes(ans));
        if (correct) calculatedScore += 1;
      } else {
        if (userAnswer === correctAnswers[0]) {
          calculatedScore += 1;
        }
      }
    });

    setScore(calculatedScore);
    setShowResult(true);
  };

  if (questions.length === 0) {
    return (
      <Typography sx={{ m: 4 }} variant="h6">
        No Questions Found. Please add questions first.
      </Typography>
    );
  }

  if (showResult) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Test Completed!</Typography>
        <Typography variant="h6">Your Score: {score} / {questions.length}</Typography>
      </Box>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" fontWeight="bold" textAlign="center" color={timer <= 10 ? 'error' : 'text.primary'}>
          Time Remaining: {timer} sec
        </Typography>
        <LinearProgress
          variant="determinate"
          value={((totalTime - timer) / totalTime) * 100}
          sx={{ height: 10, borderRadius: 5, mt: 1 }}
        />
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentQuestion.question}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {currentQuestion.allowMultipleCorrect ? (
            currentQuestion.options.map((option, idx) => (
              <FormControlLabel
                key={idx}
                control={
                  <Checkbox
                    checked={(userAnswers[currentQuestion.title] || []).includes(option.text)}
                    onChange={() => handleMultipleAnswerChange(option.text)}
                  />
                }
                label={option.text}
                sx={{ display: 'block', mb: 1 }}
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
                  control={<Radio />}
                  label={option.text}
                  sx={{ display: 'block', mb: 1 }}
                />
              ))}
            </RadioGroup>
          )}

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              float: 'right',
              bgcolor: '#1a73e8',
              textTransform: 'none',
              '&:hover': { bgcolor: '#1558b0' }
            }}
            disabled={
              (currentQuestion.allowMultipleCorrect
                ? (userAnswers[currentQuestion.title] || []).length === 0
                : !userAnswers[currentQuestion.title])
            }
          >
            {currentIndex + 1 === questions.length ? 'Submit' : 'Next'}
          </Button>
        </CardContent>
      </Card>

      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}
      >
        Question {currentIndex + 1} of {questions.length}
      </Typography>
    </Box>
  );
};

export default TestPage;
