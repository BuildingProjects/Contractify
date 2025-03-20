import React, { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { CloudQueue as IPFSIcon } from '@mui/icons-material';
import { viewContractOnIPFS, getIPFSUrl } from '../services/contractService';

export const ViewIPFSButton = ({ contractId, cid, variant = 'icon' }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleView = async () => {
    try {
      setIsLoading(true);
      if (cid) {
        // If CID is provided directly, use it
        window.open(getIPFSUrl(cid), '_blank');
      } else {
        // Otherwise fetch the contract and get latest CID
        await viewContractOnIPFS(contractId);
      }
    } catch (error) {
      console.error('Failed to view on IPFS:', error);
      // You might want to add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <Tooltip title="View on IPFS">
        <IconButton
          onClick={handleView}
          disabled={isLoading}
          color="primary"
        >
          <IPFSIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={handleView}
      disabled={isLoading}
      startIcon={<IPFSIcon />}
    >
      {isLoading ? 'Opening...' : 'View on IPFS'}
    </Button>
  );
};

export default ViewIPFSButton; 