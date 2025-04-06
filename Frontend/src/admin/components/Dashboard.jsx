import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { getDashboardStats } from '../../services/adminService';
import { PeopleAlt, ShoppingCart, RateReview, Comment } from '@mui/icons-material';

const StatCard = ({ title, value, icon, loading, error }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      minHeight: '150px'
    }}
  >
    {loading ? (
      <CircularProgress sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
    ) : error ? (
      <Typography color="error" variant="body2">{error}</Typography>
    ) : (
      <>
        <Box sx={{ mb: 2, color: 'primary.main' }}>
          {icon}
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ mt: 1 }}>
          {value}
        </Typography>
      </>
    )}
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    reviews: 0,
    testimonials: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: <PeopleAlt fontSize="large" />
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: <ShoppingCart fontSize="large" />
    },
    {
      title: 'Reviews',
      value: stats.reviews,
      icon: <RateReview fontSize="large" />
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: <Comment fontSize="large" />
    }
  ];

  return (
    <Box sx={{ pt: 2 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <StatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              loading={loading}
              error={error}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 