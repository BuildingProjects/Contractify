import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { VerifiedUser as VerifiedIcon } from '@mui/icons-material';
import { API_URL } from '../services/api';

const BlockchainVerification = ({ contractId, currentCID }) => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyOnBlockchain = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/contracts/verify/${contractId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const data = await response.json();
      setVerificationStatus({
        verified: data.verified,
        chainCID: data.chainCID,
        matches: data.chainCID === currentCID
      });
    } catch (err) {
      setError('Failed to verify contract on blockchain');
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2, bgcolor: '#FAF4E7' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#C28500', display: 'flex', alignItems: 'center', gap: 1 }}>
        <VerifiedIcon /> Blockchain Verification
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Current Contract CID: {currentCID}
        </Typography>

        <Button 
          variant="contained" 
          onClick={verifyOnBlockchain}
          disabled={isLoading}
          sx={{
            mt: 2,
            bgcolor: '#C28500',
            '&:hover': {
              bgcolor: '#9E6800',
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Verify on Blockchain'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {verificationStatus && !error && (
          <Box sx={{ mt: 2 }}>
            <Alert 
              severity={verificationStatus.matches ? "success" : "warning"}
              sx={{ mb: 2 }}
            >
              {verificationStatus.matches 
                ? "Contract verified successfully on blockchain!"
                : "Contract verification failed - CID mismatch"}
            </Alert>
            
            <Typography variant="body2" color="text.secondary">
              Blockchain CID: {verificationStatus.chainCID}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default BlockchainVerification; 