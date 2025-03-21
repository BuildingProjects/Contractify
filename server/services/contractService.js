const Web3 = require('web3');
const ETH=require('web3-eth');
const { contractABI } = require('./contractABI');

// Environment variables
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.infura.io/v3/54c54cc052f04109a172d8e20ff723b2";

// Initialize Web3 provider
const getProvider = () => {
  try {
    // Check if RPC_URL is set and accessible
    if (!RPC_URL) {
      throw new Error("RPC_URL is missing. Please ensure it's set in your environment variables.");
    }

    // Log the RPC URL to confirm it's being accessed correctly
    console.log("Using RPC_URL:", RPC_URL);

    // Initialize Web3 with the provided HTTP provider
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

    // Confirm Web3 has been initialized
    console.log("Web3 provider initialized successfully");
    return web3;
  } catch (error) {
    console.error("Error initializing Web3 provider:", error);
    throw new Error("Failed to initialize provider: " + error.message);
  }
};

// Initialize contract instance function with validation
const getContract = async () => {
  try {
    const web3 = getProvider();

    // Create contract instance
    const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

    // Validate contract functions exist
    if (!contract.methods.addCid) {
      throw new Error('Contract is missing addCid function');
    }

    // Set up event listeners
    contract.events.CIDStored()
      .on('data', (event) => {
        console.log(`New CID stored for contract ${event.returnValues.contractId}: ${event.returnValues.cid}`);
      })
      .on('error', console.error);

    contract.events.ContractVerified()
      .on('data', (event) => {
        console.log(`Contract ${event.returnValues.contractId} verification result: ${event.returnValues.verified}`);
      })
      .on('error', console.error);

    return contract;
  } catch (error) {
    console.error('Error initializing contract:', error);
    throw new Error(`Contract initialization failed: ${error.message}`);
  }
};

// Store CID on blockchain
const storeCIDOnChain = async (contractId, cid) => {
  try {
    console.log('Storing CID on blockchain for contract:', contractId);
    console.log('CID:', cid);
    
    // Validate inputs
    if (!contractId || !cid) {
      throw new Error('ContractId and CID are required');
    }
    
    const contract = await getContract();
    const web3 = getProvider();
    
    // Get account from private key
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    
    // Estimate gas
    const gasEstimate = await contract.methods.addCid(contractId, cid)
      .estimateGas({ from: account.address });
    
    // Store CID on blockchain with proper error handling
    const tx = await contract.methods.addCid(contractId, cid)
      .send({
        from: account.address,
        gas: Math.floor(gasEstimate * 1.2),
        gasPrice: await web3.eth.getGasPrice()
      });
    
    console.log('Transaction sent:', tx.transactionHash);
    console.log('Transaction confirmed in block:', tx.blockNumber);
    
    return {
      success: true,
      transactionHash: tx.transactionHash,
      blockNumber: tx.blockNumber
    };
  } catch (error) {
    console.error('Error storing CID on blockchain:', error);
    return {
      success: false,
      error: error.message || 'Failed to store CID on blockchain'
    };
  }
};

// Fetch CID from blockchain
const getCIDFromChain = async (contractId) => {
  try {
    console.log('Getting CID from blockchain for contract:', contractId);
    
    // Validate input
    if (!contractId) {
      throw new Error('ContractId is required');
    }
    
    const contract = await getContract();
    
    // Get CID from contract
    const cid = await contract.methods.getCID(contractId).call();
    
    if (!cid) {
      throw new Error('No CID found for this contract');
    }
    
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

// Fetch from IPFS
const fetchFromIPFS = async (cid) => {
  const IPFS_GATEWAYS = [
    "https://ipfs.io/ipfs/",
    "https://ipfs.filebase.io/ipfs/",
    "https://crustwebsites.net/ipfs/"
  ];

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
};

// Handle verification
const verifyContract = async (contractId) => {
  try {
    console.log("Verifying contract on blockchain for ID:", contractId);
    
    // Get CID from blockchain
    const blockchainResult = await getCIDFromChain(contractId);
    if (!blockchainResult.success) {
      throw new Error(blockchainResult.error);
    }

    // Get contract details from backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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

// Exporting functions
module.exports = {
  storeCIDOnChain,
  getCIDFromChain,
  fetchFromIPFS,
  verifyContract
};
