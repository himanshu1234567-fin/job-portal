'use client';

import { useParams } from 'next/navigation';
import { Box, Typography, Paper } from '@mui/material';
import React from 'react';

const dummyCandidates = [
  {
    id: '1',
    name: 'Tushar Namdev',
    email: 'tushar@example.com',
    position: 'Frontend Developer',
    status: 'Active',
    experience: '2 years',
    profileCompletion: 80,
    testAssigned: 'React Test',
    testScore: '7/10',
    resumeStatus: 'Uploaded',
    paymentStatus: 'Paid',
    hired: 'Yes',
  },
  {
    id: '2',
    name: 'Rohit Verma',
    email: 'rohit@example.com',
    position: 'Backend Developer',
    status: 'Inactive',
    experience: '1 year',
    profileCompletion: 60,
    testAssigned: 'Node.js Test',
    testScore: '5/10',
    resumeStatus: 'Not Uploaded',
    paymentStatus: 'Pending',
    hired: 'No',
  },
  // ...other candidates
];

export default function CandidateDetailsPage() {
  const params = useParams();
  const candidateId = params.id;
  const candidate = dummyCandidates.find((c) => c.id === candidateId);

  if (!candidate) {
    return <Typography>User not found</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        🧑‍💼 Candidate Details
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 3 }}>
        <Typography variant="h6">{candidate.name}</Typography>
        <Typography>Email: {candidate.email}</Typography>
        <Typography>Role: {candidate.position}</Typography>
        <Typography>Status: {candidate.status}</Typography>
        <Typography>Experience: {candidate.experience}</Typography>
        <Typography>Profile Completion: {candidate.profileCompletion}%</Typography>
        <Typography>Test Assigned: {candidate.testAssigned}</Typography>
        <Typography>Test Score: {candidate.testScore}</Typography>
        <Typography>Resume Status: {candidate.resumeStatus}</Typography>
        <Typography>Payment Status: {candidate.paymentStatus}</Typography>
        <Typography>Hired: {candidate.hired}</Typography>
      </Paper>
    </Box>
  );
}
