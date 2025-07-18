'use client';

import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Box,
} from '@mui/material';
import React from 'react';

export default function CandidatesPage() {
  const candidates = [
    {
    id: "1",
    name: "Tushar Namdev",
    email: "tushar@example.com",
    position: "Frontend Developer",
    status: "Active",
    experience: "2 years",
    profileCompletion: 80,
    testAssigned: "React Test",
    testScore: "7/10",
    resumeStatus: "Uploaded",
    paymentStatus: "Paid",
    hired : "Yes",
  },
  {
    id: "2",
    name: "Rohit Verma",
    email: "rohit@example.com",
    position: "Backend Developer",
    status: "Inactive",
    experience: "1 year",
    profileCompletion: 60,
    testAssigned: "Node.js Test",
    testScore: "5/10",
    resumeStatus: "Not Uploaded",
    paymentStatus: "Pending",
    hired : "No",
  },
  {
      id: "3",
    name: "Anita Sharma",
    email: "anita@example.com",
    position: "HR",
    status: "Active",
    experience: "3 years",
    profileCompletion: 90,
    testAssigned: "HR Basics",
    testScore: "9/10",
    resumeStatus: "Uploaded",
    paymentStatus: "Paid",
    hired : "Yes",
  },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        👥 Candidates
      </Typography>

      <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={500} gutterBottom>
          User List 
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell>Assigned Test</TableCell>
                <TableCell>Test Score</TableCell>
                <TableCell>Profile Completion</TableCell>
                <TableCell>Resume Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell>{candidate.experience}</TableCell>
                  <TableCell>{candidate.testAssigned}</TableCell>
                  <TableCell>{candidate.testScore}</TableCell>
                  <TableCell>{candidate.profileCompletion}%</TableCell>
                  <TableCell>{candidate.resumeStatus}</TableCell>
                  <TableCell>
                    <Button 
                     size="small" 
                     variant="outlined"
                     onClick={() =>
                      alert(
                      `User ID: ${candidate.id}
                     Name: ${candidate.name}
                     Email: ${candidate.email}
                     Position: ${candidate.position}
                     Status: ${candidate.status}
                     Test Score: ${candidate.testScore}`
                     )
                    }
                    >
                    View
                   </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
