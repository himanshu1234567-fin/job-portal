'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, Typography, Radio, RadioGroup,
  FormControlLabel, Checkbox, LinearProgress, Divider
} from '@mui/material';

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

<<<<<<< HEAD
        const response = await fetch('http://localhost:5000/api/questions', {
=======
        const res = await fetch('http://localhost:3000/api/questions', {
>>>>>>> 4a26cca3acedecf4b8cae6193b84a40747bab4ec
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const json = await res.json();
        const fetchedQuestions = Array.isArray(json.data) ? json.data : [];

        setQuestions(fetchedQuestions);

        const totalDuration = fetchedQuestions.reduce((sum, q) => {
          const duration = Number(q.duration) || 60;
          return sum + duration;
        }, 0);

        const finalDuration = totalDuration > 0 ? totalDuration : 60;
        setTotalTime(finalDuration);
        setTimer(finalDuration);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0 && !showResult) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer <= 0 && !showResult && questions.length > 0) {
      submitTest();
    }
  }, [timer, showResult, questions]);

  const handleAnswerChange = (optionText) => {
    setUserAnswers({
      ...userAnswers,
      [questions[currentIndex]?.title]: optionText
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
<<<<<<< HEAD
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Test Completed!</Typography>
        <Typography variant="h6">Your Score: {score} / {questions.length}</Typography>
=======
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
>>>>>>> 33114b60ccb165df49454b4f721267ddac3a8900
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
