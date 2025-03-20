import { ethers } from 'ethers';

export const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_cid",
        "type": "string"
      }
    ],
    "name": "addCid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "cid",
        "type": "string"
      }
    ],
    "name": "CidAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getUserCidByIndex",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserCidCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserCids",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Helper function to get contract instance
export const getContract = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Please install MetaMask to use this feature");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error("Contract address not configured");
  }

  return new ethers.Contract(contractAddress, contractABI, signer);
};

// Store CID on blockchain
export const storeCIDOnChain = async (cid) => {
  try {
    const contract = await getContract();
    
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Call addCid instead of storeCID
    const transaction = await contract.addCid(cid);
    await transaction.wait();
    
    return {
      success: true,
      message: 'CID stored successfully',
      transactionHash: transaction.hash
    };
  } catch (error) {
    console.error('Error storing CID:', error);
    return {
      success: false,
      error: error.message || 'Failed to store CID'
    };
  }
};

// Get user's CIDs
export const getUserCIDs = async (userAddress) => {
  try {
    const contract = await getContract();
    const cids = await contract.getUserCids(userAddress);
    return {
      success: true,
      cids,
      message: 'CIDs retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get CIDs'
    };
  }
};

// Get CID count for a user
export const getUserCIDCount = async (userAddress) => {
  try {
    const contract = await getContract();
    const count = await contract.getUserCidCount(userAddress);
    return {
      success: true,
      count: count.toString(),
      message: 'CID count retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get CID count'
    };
  }
};

// Get specific CID by index
export const getUserCIDByIndex = async (userAddress, index) => {
  try {
    const contract = await getContract();
    const cid = await contract.getUserCidByIndex(userAddress, index);
    return {
      success: true,
      cid,
      message: 'CID retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get CID'
    };
  }
}; 