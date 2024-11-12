import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from '@mui/material';
import UserForm from '../components/UserForm';
import { useAuth } from '../context/AuthContext';

function UserManagement() {
  const { userRole, accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchUsers = () => {
    axios.get('/api/users', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  const confirmDeleteUser = (userId) => {
    if (userRole === 'viewer') {
      setAccessDenied(true);
      return;
    }
    setUserToDelete(userId);
    setOpenDeleteDialog(true);
  };

  const deleteUser = () => {
    if (userToDelete) {
      axios.delete(`/api/users/${userToDelete}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then(() => {
          setUsers(prev => prev.filter(user => user.id !== userToDelete));
          setOpenDeleteDialog(false);
        })
        .catch(error => console.error('Error deleting user:', error));
    }
  };

  const saveUser = (userData) => {
    const request = userData.id
      ? axios.put(`/api/users/${userData.id}`, userData, { headers: { Authorization: `Bearer ${accessToken}` } })
      : axios.post('/api/users', userData, { headers: { Authorization: `Bearer ${accessToken}` } });

    request
      .then(() => {
        fetchUsers();
        setIsEditing(false);
        setSelectedUser(null);
      })
      .catch(error => console.error('Error saving user:', error));
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      {userRole !== 'viewer' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(true)}
          sx={{ marginBottom: '1rem' }}
        >
          Add New User
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              {userRole !== 'viewer' && <TableCell><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                {userRole !== 'viewer' && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditing(true);
                      }}
                      sx={{ marginRight: '0.5rem' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => confirmDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isEditing && (
        <UserForm user={selectedUser} onClose={() => setIsEditing(false)} onSave={saveUser} />
      )}

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancel</Button>
          <Button onClick={deleteUser} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

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

export default UserManagement;
