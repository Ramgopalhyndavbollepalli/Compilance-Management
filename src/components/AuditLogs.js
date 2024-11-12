// src/pages/AuditLogs.js
import React, { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../services/api';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    const getAuditLogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchAuditLogs();
        setLogs(response.data || []);
      } catch (error) {
        setError("Failed to fetch audit logs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getAuditLogs();
  }, []);

  // Calculate the logs to display on the current page
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  // Handle page navigation
  const nextPage = () => setCurrentPage((prev) => (prev * logsPerPage < logs.length ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <Card sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '12px', padding: '2rem' }}>
      <CardContent>
        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
          Audit Logs
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" variant="h6">
            {error}
          </Typography>
        ) : currentLogs.length > 0 ? (
          <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: '12px', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#3f51b5', color: '#ffffff' }}>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLogs.map((log, index) => (
                  <TableRow key={log.id || index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9fafb' } }}>
                    <TableCell>{log.date ? new Date(log.date).toLocaleString() : "No date"}</TableCell>
                    <TableCell>{log.user || "No user"}</TableCell>
                    <TableCell>{log.action || "No action"}</TableCell>
                    <TableCell>{log.details || "No details"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No audit logs available.
          </Typography>
        )}
        {/* Pagination Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
          <IconButton onClick={prevPage} disabled={currentPage === 1}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="body2" sx={{ mx: 2 }}>
            Page {currentPage} of {Math.ceil(logs.length / logsPerPage)}
          </Typography>
          <IconButton onClick={nextPage} disabled={currentPage * logsPerPage >= logs.length}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AuditLogs;
