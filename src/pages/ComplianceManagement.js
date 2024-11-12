// src/pages/ComplianceManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PolicyForm from '../components/PolicyForm';
import { useAuth } from '../context/AuthContext';

function ComplianceManagement() {
  const { userRole, accessToken } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState(null);  // Define setError here

  // Function to fetch policies
  const fetchPolicies = () => {
    console.log("DEBUG: Access token in fetchPolicies:", accessToken);
    if (!accessToken) {
      console.warn("WARNING: Access token is missing, fetchPolicies request skipped.");
      return;
    }

    axios.get('/api/policies', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(response => {
        console.log("DEBUG: Fetched policies:", response.data);
        setPolicies(response.data);
      })
      .catch(error => {
        console.error("ERROR: Fetching policies failed:", error);
        if (error.response?.status === 401) handleAccessDenied();
      });
  };

  useEffect(() => {
    fetchPolicies();
  }, [accessToken]);

  const handleAccessDenied = () => {
    setAccessDenied(true);
    console.log("Access Denied: You do not have permission to edit or delete policies.");
  };

  const editPolicy = (policy) => {
    if (userRole === 'viewer') {
      handleAccessDenied();
      return;
    }
    setSelectedPolicy(policy);
    setIsEditing(true);
  };

  const deletePolicy = (policyId) => {
    if (userRole === 'viewer') {
      handleAccessDenied();
      return;
    }

    console.log(`DEBUG: Attempting to delete policy with ID ${policyId}`);
    axios.delete(`/api/policies/${policyId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(() => {
        console.log(`DEBUG: Policy with ID ${policyId} deleted successfully`);
        setPolicies(prev => prev.filter(policy => policy.id !== policyId));
      })
      .catch(error => {
        if (error.response?.status === 401) {
          handleAccessDenied();
        } else {
          console.error('ERROR: Deleting policy failed:', error);
        }
      });
  };
  
  const savePolicy = async (policyData) => {
    try {
      let response;
      if (policyData.id) {
        response = await axios.put(`/api/policies/${policyData.id}`, policyData, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      } else {
        response = await axios.post('/api/policies', policyData, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
  
      if (response.status === 200 || response.status === 201) {
        fetchPolicies();  // Refresh list after save
        setIsEditing(false);
        setSelectedPolicy(null);
      }
    } catch (error) {
      console.error("ERROR: Saving policy failed:", error);
      setError("Failed to save policy. Please try again.");
    }
  };
  
  

  
  

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>Compliance Policies</Typography>
      {userRole !== 'viewer' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(true)}
          sx={{ marginBottom: '1rem' }}
        >
          Add New Policy
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Policy Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              {userRole !== 'viewer' && <TableCell><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>{policy.name}</TableCell>
                <TableCell>{policy.description}</TableCell>
                <TableCell>{policy.category}</TableCell>
                {userRole !== 'viewer' && (
                  <TableCell>
                    <IconButton color="primary" onClick={() => editPolicy(policy)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => deletePolicy(policy.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isEditing && (
        <PolicyForm 
          policy={selectedPolicy} 
          onClose={() => setIsEditing(false)} 
          onSave={savePolicy} 
        />
      )}

      <Dialog open={accessDenied} onClose={() => setAccessDenied(false)}>
        <DialogTitle>Access Denied</DialogTitle>
        <DialogContent>
          <Typography>You do not have permission to perform this action. Contact your administrator.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccessDenied(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ComplianceManagement;
