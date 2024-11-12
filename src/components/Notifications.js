// src/components/Notifications.js
import React, { useEffect, useState } from 'react';
import { fetchNotifications } from '../services/api';
import { CircularProgress, Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const notificationsPerPage = 10;

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchNotifications();
        if (response && response.data && Array.isArray(response.data)) {
          // Sort to display the most recent notifications first
          setNotifications(response.data.reverse());
        } else {
          console.warn("Unexpected response format from API");
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const startIdx = (page - 1) * notificationsPerPage;
  const currentNotifications = notifications.slice(startIdx, startIdx + notificationsPerPage);

  const handleNextPage = () => {
    if (page * notificationsPerPage < notifications.length) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <Box sx={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center">Notifications</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" variant="body1" align="center">{error}</Typography>
      ) : currentNotifications.length > 0 ? (
        <>
          <Stack spacing={2} sx={{ marginBottom: '1rem' }}>
            {currentNotifications.map((notification) => (
              <Card key={notification.id} variant="outlined" sx={{ backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {notification.message || "No message"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {`User: ${notification.user_name || "Unknown"}`}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {`Date: ${notification.date ? new Date(notification.date).toLocaleString() : "Unknown date"}`}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ArrowBackIosIcon />}
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}
              onClick={handleNextPage}
              disabled={page * notificationsPerPage >= notifications.length}
            >
              Next
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="body1" align="center">No notifications available.</Typography>
      )}
    </Box>
  );
}

export default Notifications;
