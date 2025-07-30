'use client';

import React, { useEffect, useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import UserDetailsModal from '../userDetailsPopup/page.jsx';

// Helper function for all deeply nested property access
const getValue = (user, key) => {
  if (!user) return '--';
  switch (key) {
    case 'name':
      return user.candidateId?.fullName || user.userId?.fullName || user.fullName || user.name || '--';
    case 'email':
      return user.candidateId?.email || user.userId?.email || user.email || '--';
    case 'role':
      // Show full desirableJob if it's an array (comma separated), or as-is if string
      if (Array.isArray(user.candidateId?.desirableJob) && user.candidateId.desirableJob.length > 0) {
        return user.candidateId.desirableJob.join(', ');
      } else if (typeof user.candidateId?.desirableJob === 'string') {
        return user.candidateId.desirableJob;
      } else if (Array.isArray(user.desirableJob) && user.desirableJob.length > 0) {
        return user.desirableJob.join(', ');
      } else if (typeof user.desirableJob === 'string') {
        return user.desirableJob;
      } else {
        return '--';
      }
    case 'experience':
  if (Array.isArray(user.candidateId?.experience) && user.candidateId.experience.length > 0) {
    return user.candidateId.experience[0].years ?? '--';
  } else if (Array.isArray(user.experience) && user.experience.length > 0) {
    return user.experience[0].years ?? '--';
  }
  return '--';

      case 'profileCompletion':
      if (user.candidateId?.profileCompletion !== undefined) return user.candidateId.profileCompletion;
      if (user.profileCompletion !== undefined) return user.profileCompletion;
      return undefined;
    case 'testScore':
      return user.testScore?.points;
    case 'resumeStatus':
      return user.resumeStatus ?? '--';
    default:
      return '--';
  }
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          'http://localhost:5000/api/getAllUsers',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCandidates(response.data.dashboards || []);
      } catch (err) {
        console.error('Error fetching candidates:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

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
                <TableCell>Profile Completion</TableCell>
                <TableCell>Test Score</TableCell>
                <TableCell>Resume Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map(candidate => {
                const name = getValue(candidate, 'name');
                const email = getValue(candidate, 'email');
                const role = getValue(candidate, 'role');
                const experienceVal = getValue(candidate, 'experience');
                const experience =  typeof experienceVal === 'number'
                 ? `${experienceVal} year${experienceVal > 1 ? 's' : ''}`
                 : '--';    
                const profileCompletion =
                  getValue(candidate, 'profileCompletion') !== undefined
                    ? `${getValue(candidate, 'profileCompletion')}%`
                    : '--';
                const testScore = getValue(candidate, 'testScore') !== undefined
                  ? `${getValue(candidate, 'testScore')}%`
                  : '--';
                const resumeStatus = getValue(candidate, 'resumeStatus');

                return (
                  <TableRow key={candidate._id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{role}</TableCell>
                    <TableCell>{experience}</TableCell>
                    <TableCell>{profileCompletion}</TableCell>
                    <TableCell>{testScore}</TableCell>
                    <TableCell>{resumeStatus}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetails(candidate)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedCandidate}
      />
    </Box>
  );
}
