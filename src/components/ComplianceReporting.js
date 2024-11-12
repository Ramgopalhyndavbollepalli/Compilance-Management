// src/components/ComplianceReporting.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Box, CircularProgress } from '@mui/material';

function ComplianceReporting() {
  const [reportCriteria, setReportCriteria] = useState({
    startDate: '',
    endDate: '',
    complianceStatus: '',
  });
  const [loading, setLoading] = useState(false);

  const generateReport = () => {
    console.log("DEBUG: Initiating report generation with criteria:", reportCriteria);
    setLoading(true);

    axios.post('/api/reports', reportCriteria, { responseType: 'blob' })
      .then(response => {
        console.log("DEBUG: Report received from server");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'compliance_report.pdf');
        document.body.appendChild(link);
        link.click();
        setLoading(false);
        console.log("DEBUG: Report download triggered");
      })
      .catch(error => {
        console.error('ERROR: Error generating report:', error);
        setLoading(false);
      });
  };

  return (
    <Box sx={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Generate Compliance Report
      </Typography>
      <Box component="form" display="flex" flexDirection="column" gap="1rem">
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={reportCriteria.startDate}
          onChange={(e) => setReportCriteria({ ...reportCriteria, startDate: e.target.value })}
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={reportCriteria.endDate}
          onChange={(e) => setReportCriteria({ ...reportCriteria, endDate: e.target.value })}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Compliance Status</InputLabel>
          <Select
            value={reportCriteria.complianceStatus}
            onChange={(e) => setReportCriteria({ ...reportCriteria, complianceStatus: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="compliant">Compliant</MenuItem>
            <MenuItem value="non-compliant">Non-Compliant</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" justifyContent="center" mt="1rem">
          <Button
            variant="contained"
            color="primary"
            onClick={generateReport}
            disabled={loading}
            sx={{ width: '100%' }}
          >
            {loading ? <CircularProgress size={24} /> : "Generate Report"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ComplianceReporting;
