'use client';

import React from 'react'
import {
  Typography,
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Grid,
  Button,
}from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import axios from 'axios';
import { useEffect, useState } from 'react';
import UserDetailsModal from '../dashboard/userDetailsPopup/page'
import Link from 'next/link';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          'http://localhost:5000/api/admin-dashboard',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(response.data.dashboards || []);
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getValue = (value) => {
    if (value == null) return '--';
    if (typeof value === 'object') return value.name ?? JSON.stringify(value);
    return value;
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ background: '#f6f8fa', minHeight: '100vh', padding: '32px' }}>
      {/* Header */}
      <Paper elevation={0} sx={{ mb: 4, p: 3, borderRadius: 3, background: '#fff' }}>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Typography variant='h4' fontWeight={700}>Admin Dashboard</Typography>
            <Typography variant='subtitle1' color='text.secondary'>Candidate Management</Typography>
          </Grid>
           <Grid item>
        <Button variant="contained" href="/admin/TestPage" passHref>
          <SmartToyIcon /> Assign test
        </Button>
      
        <Button variant="contained" href="/admin/test" passHref style={{ marginLeft: '16px' }}>
          <SmartToyIcon />  Create test with AI
        </Button>
      
    </Grid>
        </Grid>
      </Paper>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Users', value: users.length, icon: '👤' },
          { label: 'Resume Uploaded', value: users.filter(u => getValue(u.resumeStatus) === 'Uploaded').length, icon: '📄' },
          { label: 'Payments Completed', value: users.filter(u => getValue(u.paymentStatus) === 'Paid').length, icon: '💰' },
          { label: 'Pending Payments', value: users.filter(u => getValue(u.paymentStatus) === 'Pending').length, icon: '⏳' },
          { label: 'Hired Candidates', value: users.filter(u => getValue(u.hired) === 'Yes').length, icon: '✅' }
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Avatar sx={{ bgcolor: '#0a0b0bff', mx: 'auto', mb: 1 }}>{stat.icon}</Avatar>
              <Typography variant='h6'>{stat.label}</Typography>
              <Typography variant='h4' fontWeight={700}>{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* User Table */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: '#fff', mb: 4 }}>
        <Typography variant='h6' fontWeight={700} gutterBottom sx={{ color: '#6b7280' }}>👥 User List</Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Test Score</TableCell>
                <TableCell align='right'>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow
                  key={user._id}
                  sx={{ backgroundColor: users.indexOf(user) % 2 === 0 ? '#ffffff' : '#f9fafb', '&:hover': { backgroundColor: '#f3f4f6' } }}
                >
                  <TableCell>{getValue(user.name)}</TableCell>
                  <TableCell>{getValue(user.email)}</TableCell>
                  <TableCell>{getValue(user.desirableJob?.desirableJob)}</TableCell>
                  <TableCell>
                    <Typography sx={{ color: getValue(user.status) === 'Active' ? 'green' : 'red', fontWeight: 500 }}>
                      {getValue(user.status)}
                    </Typography>
                  </TableCell>
                  <TableCell>{getValue(user.testScore?.points)}</TableCell>
                  <TableCell align='right'>
                    <Button
                      variant='outlined'
                      size='small'
                      onClick={() => handleViewUser(user)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal Popup */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />

      {/* Active Positions */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: '#fff' }}>
        <Typography variant='h6' fontWeight={700} gutterBottom sx={{ color: '#6b7280' }}>📌 Active Positions</Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Number of Active Users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...new Set(users.filter(u => getValue(u.status) === 'Active').map(u => getValue(u.desirableJob?.desirableJob)))]
                .map((job, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{job}</TableCell>
                    <TableCell>{users.filter(u => getValue(u.status) === 'Active' && getValue(u.desirableJob?.desirableJob) === job).length}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
} 
