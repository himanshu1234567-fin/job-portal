'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, IconButton, Radio, Checkbox,
  TextField, Typography, Divider, Switch, FormControlLabel,
  FormControl, InputLabel, MenuItem, Select, Slider, CircularProgress, Alert,
  Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const QuestionBuilder = () => {
  const [questions, setQuestions] = useState([]);
  const [allowMultipleCorrect, setAllowMultipleCorrect] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  const defaultCategories = ['IT', 'BDE', 'Sales'];
  const difficulties = [
    { value: 'Easy', color: 'success' },
    { value: 'Medium', color: 'warning' },
    { value: 'Hard', color: 'error' }
  ];

  const [currentQuestion, setCurrentQuestion] = useState({
    title: '',
    category: '',
    difficulty: '',
    duration: 60,
    question: '',
    options: [{ text: '', isCorrect: false }],
    points: 1
  });

  useEffect(() => {
    setHasMounted(true);

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      setAuthToken(token);
      fetchSavedQuestions(token);
    }
  }, []);

  const fetchSavedQuestions = async (token) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://localhost:5000/api/questions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to fetch questions: ${res.status}`);
      }

      const data = await res.json();
      const fetchedQuestions = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.questions)
            ? data.questions
            : [];

      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const validateQuestion = () => {
    if (!currentQuestion.question.trim()) {
      setError('Question text is required');
      return false;
    }
    if (currentQuestion.options.length < 2) {
      setError('At least two options are required');
      return false;
    }
    const hasCorrectOption = currentQuestion.options.some(opt => opt.isCorrect);
    if (!hasCorrectOption) {
      setError('At least one correct option is required');
      return false;
    }
    if (!currentQuestion.category) {
      setError('Category is required');
      return false;
    }
    if (!currentQuestion.difficulty) {
      setError('Difficulty is required');
      return false;
    }
    return true;
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      [e.target.name]: e.target.value
    });
  };

  const handleDurationChange = (event, newValue) => {
    setCurrentQuestion({
      ...currentQuestion,
      duration: newValue
    });
  };

  const handleOptionChange = (index, e) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index].text = e.target.value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const handleCorrectChange = (index) => {
    const newOptions = [...currentQuestion.options];

    if (allowMultipleCorrect) {
      newOptions[index].isCorrect = !newOptions[index].isCorrect;
    } else {
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    }

    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: '', isCorrect: false }]
    });
  };

  const removeOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const addCustomCategory = () => {
    if (customCategory && !defaultCategories.includes(customCategory)) {
      defaultCategories.push(customCategory);
      setCurrentQuestion({
        ...currentQuestion,
        category: customCategory
      });
      setCustomCategory('');
    }
  };

  const saveQuestion = async () => {
    if (!validateQuestion()) return;

    setSaving(true);
    setError(null);

    try {
      if (!authToken) throw new Error('Authentication token missing');

      const res = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(currentQuestion),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || 'Failed to save question');
      }

      await fetchSavedQuestions(authToken);
      setCurrentQuestion({
        title: '',
        category: '',
        difficulty: '',
        duration: 60,
        question: '',
        options: [{ text: '', isCorrect: false }],
        points: 1
      });
      setSuccess('Question saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      if (!authToken) throw new Error('Authentication token missing');

      const res = await fetch(`http://localhost:5000/api/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to delete question');
      }

      await fetchSavedQuestions(authToken);
      setSuccess('Question deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete question');
    }
  };

  if (!hasMounted) return null;

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
          {error.includes('Session expired') && (
            <Button
              color="inherit"
              size="small"
              sx={{ ml: 2 }}
              onClick={() => window.location.href = '/login'}
            >
              Login
            </Button>
          )}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Question Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create New Question
          </Typography>

          <TextField
            fullWidth
            label="Question Title"
            name="title"
            value={currentQuestion.title}
            onChange={handleQuestionChange}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={currentQuestion.category}
                label="Category"
                onChange={handleQuestionChange}
                name="category"
              >
                {defaultCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Add Custom Category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={addCustomCategory}
                disabled={!customCategory || defaultCategories.includes(customCategory)}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={currentQuestion.difficulty}
                label="Difficulty"
                onChange={handleQuestionChange}
                name="difficulty"
              >
                {difficulties.map((diff) => (
                  <MenuItem key={diff.value} value={diff.value}>
                    <Chip
                      label={diff.value}
                      color={diff.color}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {diff.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Typography gutterBottom>
                Duration: {currentQuestion.duration} seconds
              </Typography>
              <Slider
                value={currentQuestion.duration}
                onChange={handleDurationChange}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={10}
                max={300}
              />
            </FormControl>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Question Text"
            name="question"
            value={currentQuestion.question}
            onChange={handleQuestionChange}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={allowMultipleCorrect}
                onChange={() => setAllowMultipleCorrect(!allowMultipleCorrect)}
              />
            }
            label="Allow multiple correct answers"
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle1" gutterBottom>
            Options:
          </Typography>

          {currentQuestion.options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {allowMultipleCorrect ? (
                <Checkbox
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                />
              ) : (
                <Radio
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                />
              )}

              <TextField
                fullWidth
                value={option.text}
                onChange={(e) => handleOptionChange(index, e)}
                sx={{ mx: 1 }}
              />

              <IconButton
                onClick={() => removeOption(index)}
                color="error"
                disabled={currentQuestion.options.length <= 1}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={addOption}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              onClick={saveQuestion}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
            >
              {saving ? 'Saving...' : 'Save Question'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Saved Questions */}
      <Typography variant="h6" gutterBottom>
        Saved Questions
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : questions.length === 0 ? (
        <Typography>No questions found</Typography>
      ) : (
        questions.map((q) => (
          <Card key={q._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">{q.title || 'Untitled Question'}</Typography>
                <IconButton
                  onClick={() => deleteQuestion(q._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Typography>{q.question}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Category: {q.category} | Difficulty: {q.difficulty} | Duration: {q.duration} seconds
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default QuestionBuilder;
