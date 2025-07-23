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
// 1. IMPORT YOUR MODAL (adjust the path if it's different)
import UserDetailsModal from '../userDetailsPopup/page.jsx';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. State for controlling the modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          'http://localhost:5000/api/admin-dashboard',
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

  // 3. Functions to handle opening and closing the modal
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
                const name = candidate.fullName || candidate.name || '--';
                const email = candidate.email || '--';
                const role =
                  typeof candidate.desirableJob === 'string'
                    ? candidate.desirableJob
                    : candidate.desirableJob?.name || '--';
                const experience =
                  candidate.experience != null
                    ? `${candidate.experience} year${candidate.experience > 1 ? 's' : ''}`
                    : '--';
                const profileCompletion =
                  candidate.profileCompletion != null
                    ? `${candidate.profileCompletion}%`
                    : '--';
                const testScore = candidate.testScore?.points != null ? `${candidate.testScore.points}%` : '--';
                const resumeStatus = candidate.resumeStatus || '--';

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
                      {/* 4. The button now opens the modal */}
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

      {/* 5. The Modal component is here, ready to be displayed */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedCandidate}
      />
    </Box>
  );
}