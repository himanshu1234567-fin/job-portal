'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const UserTest = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch Questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/questions');
        const data = response.data.map(q => ({
          ...q,
          options: q.options_json ? JSON.parse(q.options_json) : []
        }));
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmit = () => {
    console.log('User Answers:', answers);
    alert('Test submitted! Check console for responses.');
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography>Loading Questions...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>User Test</Typography>

      {questions.length === 0 ? (
        <Typography>No questions available.</Typography>
      ) : (
        questions.map((question, index) => (
          <Card key={question.id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">
                {index + 1}. {question.question_text}
              </Typography>

              {question.options.length > 0 ? (
                <FormGroup>
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  >
                    {question.options.map((opt, optIndex) => (
                      <FormControlLabel
                        key={optIndex}
                        value={opt.text}
                        control={<Radio />}
                        label={opt.text}
                      />
                    ))}
                  </RadioGroup>
                </FormGroup>
              ) : (
                <Typography color="error">No options available for this question.</Typography>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {questions.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit Test
        </Button>
      )}
    </Box>
  );
};

export default UserTest;
