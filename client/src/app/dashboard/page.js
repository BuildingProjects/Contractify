"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { API_URL } from '../services/api';
// import { updateContractStatusToExpired } from "../services/contractService";

import {
  PlusIcon,
  FileTextIcon,
  BarChartIcon,
  ClockIcon,
  FilterIcon,
  XIcon,
  CalendarIcon,
  UserIcon,
  DollarSignIcon,
  TagIcon,
  CheckIcon,
  PenToolIcon,
  ActivityIcon,
  ClipboardIcon,
  IndianRupeeIcon,
} from "lucide-react";
import FeaturesSlider from "../components/dashboard/FeaturesSlider";
import Navbar from "../components/dashboard/Navbar";
import { useRouter } from "next/navigation";
import { downloadContractPDF } from '../services/contractService';
import { ethers } from 'ethers';
import { contractABI } from '../utils/contractABI';

export default function DashboardPage() {
  const [email, setEmail] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusCounts, setStatusCounts] = useState({});
  const router = useRouter();

  // Update the token check in useEffect
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          // Token has expired
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userEmail');
          router.push('/login');
          return;
        }
        setEmail(decoded.email);
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, []);

  // Update the contracts fetch to use the token properly
  useEffect(() => {
    if (!email) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    console.log("Making API request to:", `${API_URL}/contracts/getContracts/${email}`);
    const uri = `${API_URL}/contracts/getContracts/${email}`;
    fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: "include",
    })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userEmail');
          router.push('/login');
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response:", data);
      setContracts(data.contracts);
      setFilteredContracts(data.contracts);
      calculateStatusCounts(data.contracts);
    })
    .catch((error) => {
      console.error("Error fetching contracts:", error);
      if (error.message !== 'Authentication failed') {
        // Show error message to user
        alert('Failed to fetch contracts. Please try again later.');
      }
    });
  }, [email]);

  // Update the useEffect that handles expired contracts
  useEffect(() => {
    const updateExpiredContracts = async () => {
      try {
        console.log("Updating expired contracts...");
        const response = await fetch(`${API_URL}/contracts/updateContractStatusToExpired`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Expired contracts update response:", data);
        
        // Refresh the contracts list after updating expired status
        if (data.success) {
          fetchContracts();
        }
      } catch (error) {
        console.error("Error updating expired contracts:", error);
      }
    };

    updateExpiredContracts();
  }, []);

  const calculateStatusCounts = (contracts) => {
    if (!Array.isArray(contracts)) {
      console.log("No contracts array provided to calculateStatusCounts");
      setStatusCounts({});
      return;
    }
    
    const counts = contracts.reduce((acc, contract) => {
      if (contract && contract.status) {
        acc[contract.status] = (acc[contract.status] || 0) + 1;
      }
      return acc;
    }, {});
    setStatusCounts(counts);
  };

  const filterContracts = (status) => {
    setStatusFilter(status);

    if (!Array.isArray(contracts)) {
      console.log("No contracts array available for filtering");
      setFilteredContracts([]);
      return;
    }

    if (status === "All") {
      setFilteredContracts(contracts);
    } else if (status === "Active") {
      setFilteredContracts(
        contracts.filter((contract) => contract.status === "Ongoing")
      );
    } else if (status === "Expired") {
      setFilteredContracts(
        contracts.filter((contract) => new Date(contract.endDate) < new Date())
      );
    } else {
      setFilteredContracts(
        contracts.filter((contract) => contract.status === status)
      );
    }
  };

  // Calculate expired contracts count with null check
  const expiredContracts = Array.isArray(contracts) 
    ? contracts.filter((contract) => new Date(contract.endDate) < new Date()).length 
    : 0;

  const handleCreateContract = () => {
    router.push("/create-contract");
  };

  // Add a new function to fetch contracts
  const fetchContracts = async () => {
    if (!email) {
      console.log("Email is required");
      return;
    }

    try {
      console.log("Fetching contracts for email:", email);
      const response = await axios.get(`${API_URL}/contracts/getContracts/${email}`);
      console.log("API Response:", response.data);
      
      // Ensure we have an array of contracts
      const contracts = Array.isArray(response.data) ? response.data : [];
      setContracts(contracts);
      setFilteredContracts(contracts);
      calculateStatusCounts(contracts);
      
      // Update expired contracts
      try {
        console.log("Updating expired contracts...");
        const updateResponse = await axios.get(`${API_URL}/contracts/updateContractStatusToExpired`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log("Update Response:", updateResponse.data);
        
        if (updateResponse.data.success) {
          // Refresh contracts after updating status
          const refreshedResponse = await axios.get(`${API_URL}/contracts/getContracts/${email}`);
          const refreshedContracts = Array.isArray(refreshedResponse.data) ? refreshedResponse.data : [];
          setContracts(refreshedContracts);
          setFilteredContracts(refreshedContracts);
          calculateStatusCounts(refreshedContracts);
        }
      } catch (error) {
        console.error("Error updating expired contracts:", error.response?.data || error.message);
        // Don't throw the error, just log it and continue
      }
    } catch (error) {
      console.error("Error fetching contracts:", error.response?.data || error.message);
      // Set empty arrays on error
      setContracts([]);
      setFilteredContracts([]);
      setStatusCounts({});
    }
  };

  // Update the useEffect to use the new fetchContracts function
  useEffect(() => {
    fetchContracts();
  }, [email]);

  // Add a new useEffect to listen for route changes
  useEffect(() => {
    const handleRouteChange = () => {
      fetchContracts();
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [email]);

  // Add a new useEffect to listen for visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchContracts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [email]);

  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const openContractModal = (contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  // Status colors mapping
  const statusColors = {
    Active: {
      bg: "bg-green-100",
      text: "text-green-800",
      indicator: "bg-green-500",
    },
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      indicator: "bg-yellow-500",
    },
    Expired: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      indicator: "bg-gray-500",
    },
    Rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      indicator: "bg-red-500",
    },
  };

  // Initialize blockchain provider
  const initializeProvider = async () => {
    const rpcUrl = "https://sepolia.infura.io/v3/54c54cc052f04109a172d8e20ff723b2";
    
    // Create provider with Sepolia network configuration
    const provider = new ethers.JsonRpcProvider(rpcUrl, {
      chainId: 11155111,
      name: 'sepolia',
      ensAddress: null,
      timeout: 30000
    });

    try {
      // Test provider connection
      await provider.getNetwork();
      return provider;
    } catch (error) {
      throw new Error(`Failed to connect to Sepolia network: ${error.message}`);
    }
  };

  // Initialize contract instance
  const initializeContract = async (provider, withSigner = false) => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error("Contract address not configured in environment variables");
    }

    if (withSigner) {
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error("Private key not configured in environment variables");
      }
      const wallet = new ethers.Wallet(privateKey, provider);
      return new ethers.Contract(contractAddress, contractABI, wallet);
    }

    return new ethers.Contract(contractAddress, contractABI, provider);
  };

  const storeCIDOnChain = async (contractId, cid) => {
    try {
      console.log("Initializing blockchain connection...");
      const provider = await initializeProvider();
      
      console.log("Setting up contract with signer...");
      const contract = await initializeContract(provider, true);
      
      console.log(`Storing CID ${cid} for contract ${contractId}...`);
      const tx = await contract.addCid(contractId, cid, {
        gasLimit: 500000 // Set appropriate gas limit
      });
      
      console.log("Transaction sent:", tx.hash);
      console.log("Waiting for confirmation...");
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);
      
      return {
        success: true,
        hash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error("Blockchain Error:", error);
      throw new Error(`Blockchain Error: ${error.message}`);
    }
  };

  const readCIDFromChain = async (contractId) => {
    try {
      console.log("Initializing blockchain connection...");
      const provider = await initializeProvider();
      
      console.log("Setting up contract...");
      const contract = await initializeContract(provider, false);
      
      console.log(`Reading CID for contract ${contractId}...`);
      const cid = await contract.getLatestCid(contractId);
      
      if (!cid) {
        throw new Error("No CID found for this contract");
      }
      
      console.log("Retrieved CID:", cid);
      return cid;
    } catch (error) {
      console.error("Blockchain Error:", error);
      throw new Error(`Blockchain Error: ${error.message}`);
    }
  };

  const handleStoreCID = async (contractId) => {
    try {
      if (!selectedContract || !selectedContract.cids || selectedContract.cids.length === 0) {
        throw new Error("No CID available for this contract");
      }

      const latestCid = selectedContract.cids[selectedContract.cids.length - 1];
      
      // First verify CID exists on IPFS
      console.log("Verifying CID on IPFS...");
      const ipfsLink = `https://ipfs.io/ipfs/${latestCid}`;
      try {
        const response = await fetch(ipfsLink, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error("CID not found on IPFS");
        }
        console.log("CID verified on IPFS");
      } catch (error) {
        throw new Error("Unable to verify CID on IPFS. Please ensure the document is properly uploaded.");
      }

      // Store CID on blockchain
      console.log("Storing CID on blockchain...");
      const result = await storeCIDOnChain(contractId, latestCid);
      
      // Show success message with transaction details
      alert(
        `Successfully stored CID on blockchain\n\n` +
        `Transaction Hash: ${result.hash}\n` +
        `Block Number: ${result.blockNumber}\n\n` +
        `IPFS Link: ${ipfsLink}`
      );

      // Verify storage by reading back
      console.log("Verifying stored CID...");
      const storedCID = await readCIDFromChain(contractId);
      if (storedCID !== latestCid) {
        console.warn("Stored CID verification mismatch");
      } else {
        console.log("CID storage verified successfully");
      }
      
    } catch (error) {
      console.error("Error in handleStoreCID:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleViewCID = async (contractId) => {
    try {
      console.log("Fetching CID from blockchain...");
      const cid = await readCIDFromChain(contractId);
      
      // List of IPFS gateways to try
      const ipfsGateways = [
        'https://ipfs.io/ipfs',
        'https://gateway.pinata.cloud/ipfs',
        'https://cloudflare-ipfs.com/ipfs',
        'https://dweb.link/ipfs'
      ];

      // Try each gateway until we find one that works
      console.log("Checking IPFS gateways...");
      for (const gateway of ipfsGateways) {
        const url = `${gateway}/${cid}`;
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok) {
            const message = 
              `Contract CID: ${cid}\n\n` +
              `IPFS Link: ${url}\n\n` +
              `Click OK to open the document`;
              
            if (confirm(message)) {
              window.open(url, '_blank');
            }
            return;
          }
        } catch (error) {
          console.log(`Gateway ${gateway} failed:`, error);
          continue;
        }
      }

      throw new Error("Document not available on any IPFS gateway");

    } catch (error) {
      console.error("Error in handleViewCID:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDownloadPDF = async (contractId) => {
    try {
      const result = await downloadContractPDF(contractId);
      if (!result.success) {
        alert(result.error || 'Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header with responsive layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <button
            onClick={handleCreateContract}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
          hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
          >
            <PlusIcon className="h-5 w-5" />
            Create New Contract
          </button>
        </div>

        {/* Grid with responsive columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Contracts */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Recent Contracts
              </h2>
              <FileTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
            </div>
            <div className="divide-y">
              {Array.isArray(contracts) && contracts.length > 0 ? (
                contracts
                  .map((contract) => ({
                    ...contract,
                    startDate: new Date(contract.startDate),
                  }))
                  .sort((a, b) => b.startDate - a.startDate) // Sort by most recent start date
                  .slice(0, 3) // Show only the latest 3
                  .map((contract) => (
                    <div
                      key={contract._id}
                      className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer"
                      onClick={() => openContractModal(contract)}
                    >
                      <div className="overflow-hidden">
                        <p className="font-medium text-gray-800 truncate">
                          {contract.contractCategory || "No Category"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {contract.contractee || "No Contractee"}
                        </p>
                      </div>
                      <div className="flex items-center flex-shrink-0 ml-2">
                        <span className="text-xs sm:text-sm font-semibold mr-2 whitespace-nowrap">
                          ₹{contract.contractValue || "N/A"}
                        </span>
                        <span
                          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs flex items-center gap-1 ${
                            statusColors[contract.status]?.bg || "bg-gray-200"
                          } ${
                            statusColors[contract.status]?.text || "text-gray-800"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                              statusColors[contract.status]?.indicator ||
                              "bg-gray-400"
                            }`}
                          ></span>
                          <span className="hidden xs:inline">
                            {contract.status || "Unknown"}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="px-3 sm:px-4 py-2 sm:py-3 text-gray-500 text-center">
                  No contracts found
                </div>
              )}
            </div>
          </div>

          {/* Contract Analytics */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Contract Analytics
              </h2>
              <BarChartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="bg-blue-50 p-2 sm:p-4 rounded-lg text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Total Contracts
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {Array.isArray(contracts) ? contracts.length : 0}
                </p>
              </div>
              <div className="bg-green-50 p-2 sm:p-4 rounded-lg text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Active Contracts
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {statusCounts["Signed by Both"] || 0}
                </p>
              </div>
              <div className="bg-yellow-50 p-2 sm:p-4 rounded-lg text-center">
                <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {statusCounts["Pending"] || 0}
                </p>
              </div>
              <div className="bg-red-50 p-2 sm:p-4 rounded-lg text-center">
                <p className="text-xs sm:text-sm text-gray-600">Expired</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {expiredContracts}
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Upcoming Renewals
              </h2>
              <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
            </div>
            <div className="divide-y">
              {Array.isArray(contracts) && contracts.length > 0 ? (
                contracts
                  .map((contract) => {
                    const today = new Date(); // Get today's date
                    today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

                    const endDate = new Date(contract.endDate);
                    endDate.setHours(0, 0, 0, 0); // Normalize time

                    const daysLeft = Math.ceil(
                      (endDate - today) / (1000 * 60 * 60 * 24)
                    ); // Calculate remaining days

                    return { ...contract, daysLeft }; // Attach daysLeft to contract object
                  })
                  .filter((contract) => contract.daysLeft > 0) // Only contracts expiring in 30 days
                  .sort((a, b) => a.daysLeft - b.daysLeft) // Sort by nearest expiry
                  .slice(0, 3) // Show only top 3
                  .map((contract) => (
                    <div
                      key={contract._id}
                      className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer"
                      onClick={() => openContractModal(contract)}
                    >
                      <div className="overflow-hidden">
                        <p className="font-medium text-gray-800 truncate">
                          {contract.contractCategory || "No Category"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {contract.contractee || "No Contractee"}
                        </p>
                      </div>
                      <span
                        className={`ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs whitespace-nowrap ${
                          contract.daysLeft <= 20
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {contract.daysLeft} days
                      </span>
                    </div>
                  ))
              ) : (
                <div className="px-3 sm:px-4 py-2 sm:py-3 text-gray-500 text-center">
                  No upcoming renewals
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Contract Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Contract Management
          </h2>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <div className="w-full sm:w-auto flex rounded-lg overflow-hidden shadow-md">
              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "All"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("All");
                  filterContracts("All"); // Pass "All", not filter
                }}
              >
                All
              </button>

              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Active"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("Active");
                  filterContracts("Active"); // Corrected from "Signed by Both"
                }}
              >
                Active
              </button>

              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("Pending");
                  filterContracts("Pending"); // Pass actual status
                }}
              >
                Pending
              </button>

              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Rejected"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("Rejected");
                  filterContracts("Rejected");
                }}
              >
                Rejected
              </button>

              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Expired"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => {
                  setFilter("Expired");
                  filterContracts("Expired");
                }}
              >
                Expired
              </button>
            </div>
          </div>
        </div>

        {/* Display Contracts with responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {Array.isArray(filteredContracts) && filteredContracts.length > 0 ? (
            filteredContracts.map((contract) => (
              <div
                key={contract._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-102 transition-all hover:shadow-xl"
                onClick={() => openContractModal(contract)}
              >
                <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                  <h3 className="font-semibold text-gray-800 truncate max-w-[70%]">
                    {contract.contractCategory}
                  </h3>
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs flex items-center gap-1 whitespace-nowrap ${
                      statusColors[contract.status]?.bg || "bg-gray-200"
                    } ${statusColors[contract.status]?.text || "text-gray-800"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        statusColors[contract.status]?.indicator || "bg-gray-400"
                      }`}
                    ></span>
                    <span className="xs:inline">
                      {contract.status || "Unknown"}
                    </span>
                  </span>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[70%]">
                      {contract.contractee}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">
                      {contract.contractValue === "NA"
                        ? " "
                        : `₹${contract.contractValue}`}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {contract.contractDescription}
                  </p>
                </div>
                <div className="bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs text-gray-500 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1">
                  <span className="text-blue-600">View details</span>
                  <span className="text-xs whitespace-nowrap">
                    {new Date(contract.startDate).toLocaleDateString("en-GB")} -{" "}
                    {new Date(contract.endDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No contracts found
            </div>
          )}
        </div>

        {/* Contract Detail Modal - Responsive improvements */}
        {isModalOpen && selectedContract && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-0">
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-3 sm:p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[80%]">
                  {selectedContract.contractCategory}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {/* Status banner */}
                <div
                  className={`mb-4 sm:mb-6 p-2 sm:p-3 rounded-lg ${
                    statusColors[selectedContract.status].bg
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        statusColors[selectedContract.status].indicator
                      } mr-2`}
                    ></span>
                    <span
                      className={`text-sm font-medium ${
                        statusColors[selectedContract.status].text
                      }`}
                    >
                      {selectedContract.status} Contract
                    </span>
                  </div>
                </div>

                {/* Contract details grid - responsive layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
                        <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" /> Client
                      </h3>
                      <p className="mt-1 text-base sm:text-lg font-medium text-gray-900 break-words">
                        {selectedContract.contractee}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
                        <IndianRupeeIcon className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                        Contract Value
                      </h3>
                      <p className="mt-1 text-base sm:text-lg font-medium text-gray-900">
                        {selectedContract.contractValue}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2">
                        <ClipboardIcon className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                        Description
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-gray-700">
                        {selectedContract.contractDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons - responsive layout */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <button className="w-full sm:flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Edit Contract
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(selectedContract._id)}
                    className="w-full sm:flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Download PDF
                  </button>
                  <button 
                    onClick={() => handleStoreCID(selectedContract._id)}
                    className="w-full sm:flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Store on Blockchain
                  </button>
                  <button 
                    onClick={() => handleViewCID(selectedContract._id)}
                    className="w-full sm:flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    View CID
                  </button>
                </div>

                {/* Timeline section - more responsive */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-5">
                    Contract Timeline
                  </h3>
                  <div className="space-y-4 sm:space-y-5">
                    {/* Contract Creation Date */}
                    <div className="flex items-start">
                      <div>
                        <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-green-200 text-green-900 mr-3 sm:mr-4">
                          <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="h-full w-0.5 bg-gray-300 ml-4 sm:ml-5 mt-1"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-700">
                          Contract Created
                        </h4>
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          {new Date(
                            selectedContract.contractCreationDate
                          ).toLocaleDateString("en-GB")}
                        </p>
                        <p className="text-xs sm:text-sm mt-1 text-gray-600">
                          Initial contract draft created and shared with
                          stakeholders.
                        </p>
                      </div>
                    </div>

                    {/* Contract Start Date */}
                    <div className="flex items-start">
                      <div>
                        <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-200 text-blue-900 mr-3 sm:mr-4">
                          <PenToolIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="h-full w-0.5 bg-gray-300 ml-4 sm:ml-5 mt-1"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-700">
                          Contract Start Date
                        </h4>
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          {new Date(
                            selectedContract.startDate
                          ).toLocaleDateString("en-GB")}
                        </p>
                        <p className="text-xs sm:text-sm mt-1 text-gray-600">
                          Contract starts and becomes effective.
                        </p>
                      </div>
                    </div>

                    {/* Contract End Date */}
                    <div className="flex items-start">
                      <div>
                        <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-purple-200 text-purple-900 mr-3 sm:mr-4">
                          <ActivityIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-700">
                          Contract End Date
                        </h4>
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          {new Date(
                            selectedContract.endDate
                          ).toLocaleDateString("en-GB")}
                        </p>
                        <p className="text-xs sm:text-sm mt-1 text-gray-600">
                          Contract ends and will no longer be in effect.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
