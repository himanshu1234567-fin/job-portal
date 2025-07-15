'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, IconButton, Radio, Checkbox,
  TextField, Typography, Divider, Switch, FormControlLabel,
  FormControl, InputLabel, MenuItem, Select, Slider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const QuestionBuilder = () => {
  const [questions, setQuestions] = useState([]);
  const [allowMultipleCorrect, setAllowMultipleCorrect] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState({
    title: '',
    category: '',
    difficulty: '',
    duration: 60,
    text: '',
    options: [{ text: '', isCorrect: false }],
    points: 1
  });

  // Fetch questions from API
  const fetchSavedQuestions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    fetchSavedQuestions();
  }, []);

  const handleFieldChange = (field, value) => {
    setCurrentQuestion({ ...currentQuestion, [field]: value });
  };

  const handleOptionChange = (index, e) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index].text = e.target.value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleCorrectChange = (index) => {
    const newOptions = currentQuestion.options.map((opt, i) => {
      if (allowMultipleCorrect) {
        return i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt;
      } else {
        return { ...opt, isCorrect: i === index };
      }
    });
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addOption = () => {
    if (currentQuestion.options.length >= 4) return;
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: '', isCorrect: false }]
    });
  };

  const removeOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  // Save new question via API
  const saveQuestion = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentQuestion)
      });

      if (response.ok) {
        fetchSavedQuestions();
        setCurrentQuestion({
          title: '',
          category: '',
          difficulty: '',
          duration: 60,
          text: '',
          options: [{ text: '', isCorrect: false }],
          points: 1
        });
        alert('Question saved to test!');
      } else {
        alert('Failed to save question.');
      }
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  // Delete question via API
  const deleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/test/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchSavedQuestions();
      } else {
        alert('Failed to delete question.');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Add New Question to Test</Typography>
      <Card>
        <CardContent>

          <TextField
            label="Title"
            value={currentQuestion.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Question Text"
            value={currentQuestion.text}
            onChange={(e) => handleFieldChange('text', e.target.value)}
            fullWidth
            multiline
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={
                ['IT', 'BDE', 'Frontend', 'Backend'].includes(currentQuestion.category)
                  ? currentQuestion.category
                  : 'Other'
              }
              onChange={(e) => {
                if (e.target.value === 'Other') {
                  handleFieldChange('category', '');
                } else {
                  handleFieldChange('category', e.target.value);
                }
              }}
              label="Category"
            >
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="BDE">BDE</MenuItem>
              <MenuItem value="Frontend">Frontend</MenuItem>
              <MenuItem value="Backend">Backend</MenuItem>
              <MenuItem value="Other">Other (Specify Below)</MenuItem>
            </Select>
          </FormControl>

          {currentQuestion.category === '' && (
            <TextField
              label="Enter Custom Category"
              value={currentQuestion.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          )}

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={currentQuestion.difficulty}
              onChange={(e) => handleFieldChange('difficulty', e.target.value)}
              label="Difficulty"
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>

          <Typography sx={{ mt: 3 }}>
            Duration: {currentQuestion.duration} seconds
          </Typography>
          <Slider
            value={currentQuestion.duration}
            onChange={(e, val) => handleFieldChange('duration', val)}
            min={10}
            max={600}
            step={10}
            valueLabelDisplay="auto"
            sx={{ mt: 1, mb: 3 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={allowMultipleCorrect}
                onChange={(e) => setAllowMultipleCorrect(e.target.checked)}
                color="primary"
              />
            }
            label={allowMultipleCorrect ? "Multiple Correct Answers Allowed" : "Single Correct Answer Mode"}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle1">Options (max 4, mark correct):</Typography>

          {currentQuestion.options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {allowMultipleCorrect ? (
                <Checkbox
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                  disabled={!option.text.trim()}
                />
              ) : (
                <Radio
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                  disabled={!option.text.trim()}
                />
              )}

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

          <Button
            startIcon={<AddIcon />}
            onClick={addOption}
            sx={{ mt: 2 }}
            disabled={currentQuestion.options.length >= 4}
          >
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

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>Current Saved Test</Typography>

      {questions.length === 0 ? (
        <Typography>No questions saved yet.</Typography>
      ) : (
        <Card>
          <CardContent>
            {questions.map((q, idx) => (
              <Box key={q.id || idx} sx={{ mb: 2, position: 'relative' }}>
                <IconButton
                  onClick={() => deleteQuestion(q.id)}
                  size="small"
                  sx={{ position: 'absolute', right: 0, top: 0 }}
                >
                  <DeleteIcon color="error" />
                </IconButton>

                <Typography variant="subtitle1">
                  {idx + 1}. {q.title} ({q.category || 'No Category'}) [{q.difficulty || 'Unknown'}]
                </Typography>
                <Typography variant="body2">{q.text}</Typography>
                <Typography variant="caption">
                  {q.options.map((opt, i) => (
                    <span key={i}>
                      {opt.text}{opt.isCorrect ? ' ✅' : ''}{i !== q.options.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default QuestionBuilder;
