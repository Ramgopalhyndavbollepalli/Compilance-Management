// src/components/PolicyForm.js
import React, { useState, useEffect } from 'react';
import { createPolicy, updatePolicy } from '../services/api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function PolicyForm({ policy, onClose, onSave }) {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (policy) {
      setFormData({
        name: policy.name || '',
        description: policy.description || '',
        category: policy.category || 'General',
      });
    }
  }, [policy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    if (!formData.name.trim() || !formData.category) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const policyData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
      };

      let updatedPolicy;
      if (policy?.id) {
        const response = await updatePolicy(policy.id, policyData, accessToken);
        updatedPolicy = response.data;
      } else {
        const response = await createPolicy(policyData, accessToken);
        updatedPolicy = response.data;
      }

      onSave(updatedPolicy);
      onClose();
    } catch (error) {
      console.error('Error saving policy:', error);
      setError('Failed to save policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h5">{policy ? 'Edit Policy' : 'Add New Policy'}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            name="name"
            label="Policy Name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
              <MenuItem value="Compliance">Compliance</MenuItem>
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Close</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {policy ? 'Update Policy' : 'Create Policy'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PolicyForm;
