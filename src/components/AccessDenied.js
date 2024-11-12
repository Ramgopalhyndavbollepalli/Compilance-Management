// src/components/AccessDenied.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const AccessDenied = () => {
  return (
    <Box sx={{ padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h5" color="error" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" gutterBottom>
        You do not have permission to access this page. Please contact your administrator.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </Box>
  );
};

export default AccessDenied;
