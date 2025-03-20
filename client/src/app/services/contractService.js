import { API_URL } from './api';
import { ethers } from 'ethers';
import { contractABI } from './contractABI';

const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://ipfs.filebase.io/ipfs/",
  "https://crustwebsites.net/ipfs/"
];

// Contract address from environment variable
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Initialize provider function to handle cases where window.ethereum isn't immediately available
const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  throw new Error('MetaMask not installed or not accessible');
};

// Initialize contract instance function with validation
const getContract = async () => {
  try {
    const provider = getProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    // Validate contract functions exist
    if (!contract.interface.functions['addCid(string,string)']) {
      throw new Error('Contract is missing addCid function');
    }
    if (!contract.interface.functions['getCID(string)']) {
      throw new Error('Contract is missing getCID function');
    }

    // Set up event listeners
    contract.on("CIDStored", (contractId, cid, timestamp) => {
      console.log(`New CID stored for contract ${contractId}: ${cid}`);
    });

    contract.on("ContractVerified", (contractId, verified) => {
      console.log(`Contract ${contractId} verification result: ${verified}`);
    });

    return contract;
  } catch (error) {
    console.error('Error initializing contract:', error);
    throw new Error(`Contract initialization failed: ${error.message}`);
  }
};

async function fetchFromIPFS(cid) {
  for (let gateway of IPFS_GATEWAYS) {
    try {
      console.log(`Attempting to fetch from gateway: ${gateway}`);
      const response = await fetch(`${gateway}${cid}`);
      if (!response.ok) {
        console.warn(`Gateway ${gateway} failed with status: ${response.status}`);
        continue;
      }
      return await response.blob();
    } catch (error) {
      console.error(`Error with gateway ${gateway}:`, error);
    }
  }
  throw new Error("Failed to fetch PDF from all IPFS gateways");
}

export const getIPFSUrl = (cid) => {
  return `https://ipfs.io/ipfs/${cid}`;
};

export const storeCIDOnChain = async (contractId, cid) => {
  try {
    console.log('Storing CID on blockchain for contract:', contractId);
    console.log('CID:', cid);
    
    // Validate inputs
    if (!contractId || !cid) {
      throw new Error('ContractId and CID are required');
    }

    // Request account access
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = await getContract();
    
    // Validate function exists
    if (typeof contract.addCid !== 'function') {
      throw new Error('addCid function not found in contract');
    }
    
    // Store CID on blockchain with proper error handling
    const tx = await contract.addCid(contractId, cid).catch(error => {
      console.error('Transaction failed:', error);
      throw new Error(`Transaction failed: ${error.message}`);
    });
    
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction to be mined with timeout
    const receipt = await Promise.race([
      tx.wait(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction timeout')), 60000)
      )
    ]);
    
    console.log('Transaction confirmed in block:', receipt.blockNumber);
    
    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error storing CID on blockchain:', error);
    return {
      success: false,
      error: error.message || 'Failed to store CID on blockchain'
    };
  }
};

export const getCIDFromChain = async (contractId) => {
  try {
    console.log('Getting CID from blockchain for contract:', contractId);
    
    // Validate input
    if (!contractId) {
      throw new Error('ContractId is required');
    }

    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = await getContract();
    
    // Validate function exists
    if (typeof contract.getCID !== 'function') {
      throw new Error('getCID function not found in contract');
    }
    
    const cid = await contract.getCID(contractId).catch(error => {
      console.error('Failed to get CID:', error);
      throw new Error(`Failed to get CID: ${error.message}`);
    });
    
    console.log('Retrieved CID from blockchain:', cid);
    
    return {
      success: true,
      cid: cid
    };
  } catch (error) {
    console.error('Error getting CID from blockchain:', error);
    return {
      success: false,
      error: error.message || 'Failed to get CID from blockchain'
    };
  }
};

export const downloadContractPDF = async (contractId) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    // First, get the contract details to get the latest CID
    const contractResponse = await fetch(`${API_URL}/contracts/${contractId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!contractResponse.ok) {
      throw new Error(`Failed to fetch contract details: ${contractResponse.status}`);
    }

    const contractData = await contractResponse.json();
    if (!contractData.contract || !contractData.contract.cids || contractData.contract.cids.length === 0) {
      throw new Error('No PDF available for this contract');
    }

    // Get the latest CID
    const latestCid = contractData.contract.cids[contractData.contract.cids.length - 1];
    const pdfUrl = `https://ipfs.io/ipfs/${latestCid}`;

    // Open the PDF in a new tab
    window.open(pdfUrl, '_blank');

    return {
      success: true,
      pdfUrl,
      message: 'PDF opened successfully'
    };
  } catch (error) {
    console.error('Error downloading contract:', error);
    return {
      success: false,
      error: error.message || 'Failed to download contract'
    };
  }
};

export const viewContractOnIPFS = async (contractId) => {
  try {
    console.log("Fetching contract details for ID:", contractId);
    const response = await fetch(`${API_URL}/contracts/${contractId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.contract) {
      throw new Error("No contract found with this ID");
    }

    const contract = data.contract;
    if (!contract.cids || contract.cids.length === 0) {
      throw new Error("Contract has no PDF CIDs");
    }

    const latestCID = contract.cids[contract.cids.length - 1];
    console.log("Latest CID:", latestCID);

    const pdfBlob = await fetchFromIPFS(latestCID);
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return {
      success: true,
      pdfUrl,
      cid: latestCID,
      message: 'Contract PDF retrieved successfully'
    };
  } catch (error) {
    console.error("Error viewing contract:", error);
    return {
      success: false,
      error: error.message || 'Failed to view contract on IPFS'
    };
  }
};

export const verifyContract = async (contractId) => {
  try {
    console.log("Verifying contract on blockchain for ID:", contractId);
    
    // Get CID from blockchain
    const blockchainResult = await getCIDFromChain(contractId);
    if (!blockchainResult.success) {
      throw new Error(blockchainResult.error);
    }

    // Get contract details from backend
    const response = await fetch(`${API_URL}/contracts/verify/${contractId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Backend verification response:", data);

    // Compare CIDs
    const isVerified = data.cid === blockchainResult.cid;

    return {
      success: true,
      isVerified,
      blockchainCID: blockchainResult.cid,
      backendCID: data.cid,
      verificationTimestamp: new Date().toISOString(),
      message: isVerified ? 'Contract verified successfully' : 'Contract verification failed - CIDs do not match'
    };
  } catch (error) {
    console.error("Error verifying contract:", error);
    return {
      success: false,
      error: error.message || 'Failed to verify contract'
    };
  }
};

const handleDownload = async (contractId) => {
  try {
    const result = await downloadContractPDF(contractId);
    if (result.success) {
      window.open(result.pdfUrl, '_blank');
    } else {
      console.error('Download failed:', result.error);
      // Handle download failure
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // Handle unexpected errors
  }
};

const handleVerification = async (contractId) => {
  try {
    const result = await verifyContract(contractId);
    if (result.success) {
      console.log('Contract verified:', result.isVerified);
      // Handle successful verification
    } else {
      console.error('Verification failed:', result.error);
      // Handle verification failure
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // Handle unexpected errors
  }
};

const handleStoreCID = async (contractId, cid) => {
  try {
    const result = await storeCIDOnChain(contractId, cid);
    if (result.success) {
      console.log('CID stored successfully:', result.transactionHash);
      // Handle successful storage
    } else {
      console.error('Failed to store CID:', result.error);
      // Handle storage failure
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // Handle unexpected errors
  }
};