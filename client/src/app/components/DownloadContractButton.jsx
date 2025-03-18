import React, { useState } from 'react';
import { downloadContractPDF } from '../services/contractService.js';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const DownloadContractButton = ({ contractId, disabled = false }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadContractPDF(contractId);
    } catch (error) {
      console.error('Failed to download contract:', error);
      // You might want to add a toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<DownloadIcon />}
      onClick={handleDownload}
      disabled={disabled || isDownloading}
    >
      {isDownloading ? 'Downloading...' : 'Download PDF'}
    </Button>
  );
};

export default DownloadContractButton; 