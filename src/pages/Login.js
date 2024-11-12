// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', formData);
      if (response.status === 200) {
        // Extract the access token, user role, and ID from the response
        const { access_token, role, user_id } = response.data;

        console.log("DEBUG: Received token, role, user ID:", access_token, role, user_id);
        
        // Call login in AuthContext to set the auth state
        login(role, user_id, access_token);
        
        // Navigate to dashboard after login
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("DEBUG: Login failed with error:", error);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #c850c0, #4158d0)' 
    }}>
      <Paper elevation={6} sx={{ padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center', borderRadius: '12px' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>Login</Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <form onSubmit={handleLogin}>
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
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, py: 1.5, backgroundColor: '#4158d0', color: '#fff', fontWeight: 'bold' }}
          >
            Login
          </Button>
        </form>
        <Button 
          onClick={() => navigate('/signup')} 
          variant="outlined" 
          fullWidth 
          sx={{ mt: 2, color: '#4158d0', borderColor: '#4158d0', fontWeight: 'bold' }}
        >
          Signup
        </Button>
      </Paper>
    </Box>
  );
}

export default Login;
