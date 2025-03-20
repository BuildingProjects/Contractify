import { ethers } from 'ethers';
import { ContractABI } from './contractABI';

// Contract address - replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const deployContract = async (contractData) => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to deploy contracts');
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create contract factory
    const ContractFactory = new ethers.ContractFactory(
      ContractABI.abi,
      ContractABI.bytecode,
      signer
    );

    // Deploy contract
    console.log('Deploying contract...');
    const contract = await ContractFactory.deploy(
      contractData.contractId,
      contractData.cid
    );

    // Wait for deployment
    await contract.deployed();
    console.log('Contract deployed to:', contract.address);

    return {
      success: true,
      contractAddress: contract.address,
      transactionHash: contract.deployTransaction.hash
    };
  } catch (error) {
    console.error('Error deploying contract:', error);
    throw error;
  }
};

export const storeCIDOnChain = async (contractId, cid) => {
  try {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to store CIDs');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI.abi, signer);

    console.log('Storing CID on blockchain...');
    const tx = await contract.storeCID(contractId, cid);
    await tx.wait();
    console.log('CID stored successfully. Transaction hash:', tx.hash);

    return tx.hash;
  } catch (error) {
    console.error('Error storing CID on blockchain:', error);
    throw error;
  }
};

export const getCIDFromChain = async (contractId) => {
  try {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to fetch CIDs');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI.abi, provider);

    console.log('Fetching CID from blockchain...');
    const cid = await contract.getCID(contractId);
    console.log('CID fetched successfully:', cid);

    return cid;
  } catch (error) {
    console.error('Error fetching CID from blockchain:', error);
    throw error;
  }
}; 