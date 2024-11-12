// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { userId, userRole, accessToken, logout } = useAuth();  // Use accessToken from context
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    role: userRole,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!userId) {
      console.warn("userId is undefined, skipping API call");
      return;
    }

    console.log("Fetching user settings for userId:", userId);
    axios.get(`http://54.172.6.232:5000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`  // Use token from context
      }
    })
    .then(response => {
      const { username, email, role } = response.data;
      setFormData(prevFormData => ({
        ...prevFormData,
        username,
        email,
        role,
      }));
    })
    .catch(error => {
      console.error('Error fetching user settings:', error);
      setError('Failed to fetch user data');
    });
  }, [userId, accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    setError(null);
    setSuccessMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    const updateData = {
      username: formData.username,
      email: formData.email,
      role: formData.role,
    };

    if (formData.newPassword) {
      updateData.password = formData.newPassword;
    }

    axios.put(`http://127.0.0.1:5000/api/users/${userId}`, updateData, {
      headers: {
        Authorization: `Bearer ${accessToken}`  // Consistent usage of token
      }
    })
    .then(() => {
      setSuccessMessage("Settings updated successfully!");
      setError(null);
    })
    .catch(err => {
      setError("Error updating settings.");
      console.error('Error updating settings:', err);
    });
  };

  return (
    <Box sx={{ maxWidth: 500, margin: '0 auto', padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {successMessage && <Typography color="primary" sx={{ mb: 2 }}>{successMessage}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleInputChange} margin="normal" />
        <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleInputChange} margin="normal" type="email" />
        <TextField fullWidth label="New Password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} margin="normal" type="password" />
        <TextField fullWidth label="Confirm New Password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleInputChange} margin="normal" type="password" />
        
        <TextField fullWidth select label="Role" name="role" value={formData.role} onChange={handleInputChange} margin="normal" disabled={userRole !== 'admin'}>
          <MenuItem value="viewer">Viewer</MenuItem>
          <MenuItem value="editor">Editor</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Save Changes</Button>
      </form>
      <Button onClick={logout} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>Logout</Button>
    </Box>
  );
}

export default Settings;
