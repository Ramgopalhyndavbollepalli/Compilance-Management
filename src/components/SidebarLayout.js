// src/components/SidebarLayout.js

import React, { useState } from 'react';
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PolicyIcon from '@mui/icons-material/Policy';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';

const LayoutContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f0f4f8, #e2ebf0)',
});

const Sidebar = styled(Box)(({ isOpen }) => ({
  width: isOpen ? '250px' : '0',
  overflow: 'hidden',
  backgroundColor: '#354052',
  color: '#ffffff',
  paddingTop: '2rem',
  transition: 'width 0.3s ease',
  minHeight: '100vh',
  position: 'fixed',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const SidebarListItem = styled(ListItem)({
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#3c4a5b',
    color: '#9FA8DA',
  },
  '& .MuiListItemIcon-root': {
    color: '#ffffff',
  },
});

const MainContent = styled(Box)({
  flex: 1,
  padding: '2rem',
  marginLeft: '250px',
  transition: 'margin-left 0.3s ease',
});

const SidebarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth(); // Access the logout function from AuthContext

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <Box>
          <IconButton onClick={handleSidebarToggle} sx={{ color: '#ffffff', position: 'absolute', top: '10px', right: '10px' }}>
            <CloseIcon />
          </IconButton>
          <List>
            <SidebarListItem button component={Link} to="/dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </SidebarListItem>
            <SidebarListItem button component={Link} to="/user-management">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </SidebarListItem>
            <SidebarListItem button component={Link} to="/compliance-management">
              <ListItemIcon>
                <PolicyIcon />
              </ListItemIcon>
              <ListItemText primary="Compliance Management" />
            </SidebarListItem>
            <SidebarListItem button component={Link} to="/audit-logs">
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Audit Logs" />
            </SidebarListItem>
            <SidebarListItem button component={Link} to="/notifications">
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </SidebarListItem>
            <SidebarListItem button component={Link} to="/compliance-reporting">
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Compliance Reporting" />
            </SidebarListItem>
            <SidebarListItem button component={Link} to="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </SidebarListItem>
          </List>
        </Box>

        {/* Logout button at the bottom of the sidebar */}
        <Box sx={{ padding: '2rem', textAlign: 'center' }}>
          <Button variant="contained" color="secondary" onClick={logout} fullWidth>
            Logout
          </Button>
        </Box>
      </Sidebar>

      <MainContent sx={{ marginLeft: isSidebarOpen ? '250px' : '0' }}>
        {!isSidebarOpen && (
          <IconButton
            onClick={handleSidebarToggle}
            sx={{
              position: 'fixed',
              top: '10px',
              left: '20px',
              zIndex: 2,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        {children || <Outlet />}
      </MainContent>
    </LayoutContainer>
  );
};

export default SidebarLayout;
