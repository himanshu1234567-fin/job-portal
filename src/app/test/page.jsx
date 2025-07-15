'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, IconButton, Radio,
  TextField, Typography, Divider,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const QuestionBuilder = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: [{ text: '', isCorrect: false }],
    points: 1
  });

  const [userResults, setUserResults] = useState([]);

  const fetchUserResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/results');
      setUserResults(response.data);
    } catch (error) {
      console.error('Failed to fetch user results:', error);
    }
  };

  useEffect(() => {
    fetchUserResults();
  }, []);

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, text: e.target.value });
  };

  const handleOptionChange = (index, e) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index].text = e.target.value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleCorrectChange = (index) => {
    const newOptions = currentQuestion.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: '', isCorrect: false }]
    });
  };

  const removeOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const saveQuestion = async () => {
    try {
      await axios.post('http://localhost:5000/api/questions', currentQuestion);
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        text: '',
        options: [{ text: '', isCorrect: false }],
        points: 1
      });
      alert('Question saved to database!');
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Error saving question.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Question Builder */}
      <Typography variant="h5" gutterBottom>Add New Question</Typography>
      <Card>
        <CardContent>
          <TextField
            label="Question Text"
            value={currentQuestion.text}
            onChange={handleQuestionChange}
            fullWidth
            multiline
            margin="normal"
            required
          />

          <TextField
            label="Points"
            type="number"
            value={currentQuestion.points}
            onChange={(e) => setCurrentQuestion({
              ...currentQuestion,
              points: Math.max(1, parseInt(e.target.value) || 1)
            })}
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Options (mark correct):</Typography>

          {currentQuestion.options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Radio
                checked={option.isCorrect}
                onChange={() => handleCorrectChange(index)}
                disabled={!option.text.trim()}
              />
              <TextField
                value={option.text}
                onChange={(e) => handleOptionChange(index, e)}
                fullWidth
                placeholder={`Option ${index + 1}`}
              />
              {currentQuestion.options.length > 1 && (
                <IconButton onClick={() => removeOption(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              )}
            </Box>
          ))}

          <Button startIcon={<AddIcon />} onClick={addOption} sx={{ mt: 2 }}>
            Add Option
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={saveQuestion}
            sx={{ mt: 3, float: 'right' }}
          >
            Save Question
          </Button>
        </CardContent>
      </Card>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Admin Test Results Section */}
      <Typography variant="h5" gutterBottom>Test Results (All Users)</Typography>
      <Card>
        <CardContent>
          {userResults.length === 0 ? (
            <Typography>No test results available.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Total Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userResults.map((result) => (
                  <TableRow key={result.userId}>
                    <TableCell>{result.userId}</TableCell>
                    <TableCell>{result.userName}</TableCell>
                    <TableCell>{result.totalScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuestionBuilder;
