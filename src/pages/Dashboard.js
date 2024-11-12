import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BarChart from '../components/BarChart';

const DashboardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f0f4f8, #e2ebf0)',
  padding: '2rem',
});

const MetricCard = styled(Card)({
  borderRadius: '15px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.2)',
  },
  backgroundColor: '#ffffff',
});

const DashboardTitle = styled(Typography)({
  fontWeight: '700',
  color: '#354052',
  marginBottom: '1.5rem',
});

const ChartContainer = styled(Box)({
  marginTop: '2.5rem',
  padding: '1.5rem',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
});

const Dashboard = () => {
  return (
    <DashboardContainer>
      <DashboardTitle variant="h4" gutterBottom>
        Dashboard Overview
      </DashboardTitle>

      {/* Metrics Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon fontSize="large" color="primary" />
                <Box ml={2}>
                  <Typography variant="h6" color="textPrimary">
                    Total Users
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    150
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SecurityIcon fontSize="large" color="primary" />
                <Box ml={2}>
                  <Typography variant="h6" color="textPrimary">
                    Total Policies
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    45
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard>
            <CardContent>
              <Box display="flex" alignItems="center">
                <NotificationsIcon fontSize="large" color="primary" />
                <Box ml={2}>
                  <Typography variant="h6" color="textPrimary">
                    Notifications
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    20
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <ChartContainer>
        <Typography variant="h5" gutterBottom color="textPrimary">
          Compliance Rate
        </Typography>
        <BarChart />
      </ChartContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
