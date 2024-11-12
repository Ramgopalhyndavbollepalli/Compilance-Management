// src/pages/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, MenuItem } from '@mui/material';

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'viewer' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup', formData);
      setSuccess("Signup successful! Please login.");
      setError(null);
    } catch (error) {
      setError("Signup failed. Try again.");
      setSuccess(null);
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #1abc9c, #16a085)' 
    }}>
      <Paper elevation={6} sx={{ padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center', borderRadius: '12px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>Signup</Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        {success && <Typography color="primary" sx={{ mb: 2 }}>{success}</Typography>}
        <form onSubmit={handleSignup}>
          <TextField 
            fullWidth 
            label="Username" 
            variant="outlined" 
            type="text" 
            value={formData.username} 
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
            margin="normal"
          />
          <TextField 
            fullWidth 
            label="Email" 
            variant="outlined" 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            margin="normal"
          />
          <TextField 
            fullWidth 
            label="Password" 
            variant="outlined" 
            type="password" 
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            margin="normal"
          />
          <TextField 
            fullWidth 
            label="Role" 
            variant="outlined" 
            select 
            value={formData.role} 
            onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
            margin="normal"
          >
            <MenuItem value="viewer">Viewer</MenuItem>
            <MenuItem value="editor">Editor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, py: 1.5, backgroundColor: '#16a085', color: '#fff', fontWeight: 'bold' }}
          >
            Signup
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Signup;
