"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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
} from "lucide-react";
import FeaturesSlider from "../components/dashboard/FeaturesSlider";
import Navbar from "../components/dashboard/Navbar";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusCounts, setStatusCounts] = useState({});

  // In your first useEffect where you decode the token
  useEffect(() => {
    const token = Cookies.get("authToken");
    console.log("Initial token check:", token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // Log the full decoded token
        console.log("Token expiration:", new Date(decoded.exp * 1000)); // Check expiration
        setEmail(decoded.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found");
    }
  }, []);

  // Separate useEffect to wait for email to be set
  useEffect(() => {
    if (!email) return;

    console.log(
      "Making API request to:",
      `http://localhost:5000/api/contracts/getContracts/${email}`
    );

    fetch(`http://localhost:5000/api/contracts/getContracts/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // This is critical - it includes cookies in the request
    })
      .then((response) => {
        if (!response.ok) {
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
      });
  }, [email]);

  const calculateStatusCounts = (contracts) => {
    const counts = contracts.reduce((acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1;
      return acc;
    }, {});
    setStatusCounts(counts);
  };

  const filterContracts = (status) => {
    setStatusFilter(status);
    if (status === "all") {
      setFilteredContracts(contracts);
    } else {
      setFilteredContracts(
        contracts.filter((contract) => contract.status === status)
      );
    }
  };

  const handleCreateContract = () => {
    // TODO: Implement create contract logic
    alert("Create Contract Functionality");
  };

  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // Sample contract data
  // const allContracts = [
  //   {
  //     id: "1",
  //     name: "Marketing Services",
  //     client: "Acme Corp",
  //     value: "$50,000",
  //     status: "Active",
  //     startDate: "2025-01-15",
  //     endDate: "2025-12-31",
  //     description:
  //       "Comprehensive marketing services including digital marketing, content creation, and campaign management.",
  //     contactPerson: "John Smith",
  //     contactEmail: "john@acmecorp.com",
  //     terms: "Net 30",
  //   },
  //   {
  //     id: "2",
  //     name: "Consulting Agreement",
  //     client: "Tech Innovations",
  //     value: "$75,000",
  //     status: "Pending",
  //     startDate: "2025-03-01",
  //     endDate: "2025-08-31",
  //     description:
  //       "Strategic consulting services for new product development and market analysis.",
  //     contactPerson: "Sarah Johnson",
  //     contactEmail: "sarah@techinnovations.com",
  //     terms: "Net 45",
  //   },
  //   {
  //     id: "3",
  //     name: "Software License",
  //     client: "Global Solutions",
  //     value: "$25,000",
  //     status: "Draft",
  //     startDate: "2025-04-01",
  //     endDate: "2026-03-31",
  //     description:
  //       "Enterprise software license for 50 users with premium support package.",
  //     contactPerson: "Michael Chen",
  //     contactEmail: "michael@globalsolutions.com",
  //     terms: "Annual payment",
  //   },
  //   {
  //     id: "4",
  //     name: "Legal Agreement",
  //     client: "Law Firm LLP",
  //     value: "$120,000",
  //     status: "Active",
  //     startDate: "2025-01-01",
  //     endDate: "2025-12-31",
  //     description:
  //       "Ongoing legal services and representation for corporate matters.",
  //     contactPerson: "Elizabeth Taylor",
  //     contactEmail: "elizabeth@lawfirm.com",
  //     terms: "Monthly retainer",
  //   },
  //   {
  //     id: "5",
  //     name: "Freelance Contract",
  //     client: "Startup X",
  //     value: "$5,000",
  //     status: "Pending",
  //     startDate: "2025-03-15",
  //     endDate: "2025-05-15",
  //     description: "UI/UX design project for mobile application redesign.",
  //     contactPerson: "David Wong",
  //     contactEmail: "david@startupx.com",
  //     terms: "50% upfront, 50% on completion",
  //   },
  // ];

  // // const filteredContracts =
  // //   filter === "All"
  // //     ? allContracts
  // //     : allContracts.filter((contract) => contract.status === filter);

  const recentContracts = [
    {
      id: "1",
      name: "Marketing Services",
      client: "Acme Corp",
      value: "$50,000",
      status: "Active",
    },
    {
      id: "2",
      name: "Consulting Agreement",
      client: "Tech Innovations",
      value: "$75,000",
      status: "Pending",
    },
    {
      id: "3",
      name: "Software License",
      client: "Global Solutions",
      value: "$25,000",
      status: "Draft",
    },
  ];

  const upcomingRenewals = [
    {
      id: "1",
      name: "IT Support Contract",
      client: "Enterprise Systems",
      daysLeft: 15,
    },
    {
      id: "2",
      name: "Design Retainer",
      client: "Creative Agency",
      daysLeft: 22,
    },
  ];

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
    Draft: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      indicator: "bg-gray-500",
    },
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        {/* Header with responsive layout */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Dashboard
          </h1>
          <button
            onClick={handleCreateContract}
            className='w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
          hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg'
          >
            <PlusIcon className='h-5 w-5' />
            Create New Contract
          </button>
        </div>

        {/* Grid with responsive columns */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {/* Recent Contracts */}
          <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='flex items-center justify-between p-3 sm:p-4 border-b'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>
                Recent Contracts
              </h2>
              <FileTextIcon className='h-5 w-5 sm:h-6 sm:w-6 text-gray-500' />
            </div>
            <div className='divide-y'>
              {recentContracts.map((contract) => (
                <div
                  key={contract.id}
                  className='px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer'
                  onClick={() =>
                    openContractModal(
                      allContracts.find((c) => c.id === contract.id)
                    )
                  }
                >
                  <div className='overflow-hidden'>
                    <p className='font-medium text-gray-800 truncate'>
                      {contract.name}
                    </p>
                    <p className='text-xs sm:text-sm text-gray-500 truncate'>
                      {contract.client}
                    </p>
                  </div>
                  <div className='flex items-center flex-shrink-0 ml-2'>
                    <span className='text-xs sm:text-sm font-semibold mr-2 whitespace-nowrap'>
                      {contract.value}
                    </span>
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs flex items-center gap-1 ${
                        statusColors[contract.status].bg
                      } ${statusColors[contract.status].text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          statusColors[contract.status].indicator
                        }`}
                      ></span>
                      <span className='hidden xs:inline'>
                        {contract.status}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Analytics */}
          <div className='bg-white rounded-xl shadow-lg p-3 sm:p-4'>
            <div className='flex items-center justify-between mb-3 sm:mb-4'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>
                Contract Analytics
              </h2>
              <BarChartIcon className='h-5 w-5 sm:h-6 sm:w-6 text-gray-500' />
            </div>
            <div className='grid grid-cols-2 gap-2 sm:gap-4'>
              <div className='bg-blue-50 p-2 sm:p-4 rounded-lg text-center'>
                <p className='text-xs sm:text-sm text-gray-600'>
                  Total Contracts
                </p>
                <p className='text-xl sm:text-2xl font-bold text-blue-600'>
                  {contracts.length}
                </p>
              </div>
              <div className='bg-green-50 p-2 sm:p-4 rounded-lg text-center'>
                <p className='text-xs sm:text-sm text-gray-600'>
                  Active Contracts
                </p>
                <p className='text-xl sm:text-2xl font-bold text-green-600'>
                  {statusCounts["Signed by Both"] || 0}
                </p>
              </div>
              <div className='bg-yellow-50 p-2 sm:p-4 rounded-lg text-center'>
                <p className='text-xs sm:text-sm text-gray-600'>Pending</p>
                <p className='text-xl sm:text-2xl font-bold text-yellow-600'>
                  {statusCounts["Pending"] || 0}
                </p>
              </div>
              <div className='bg-red-50 p-2 sm:p-4 rounded-lg text-center'>
                <p className='text-xs sm:text-sm text-gray-600'>Expired</p>
                <p className='text-xl sm:text-2xl font-bold text-red-600'>7</p>
              </div>
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='flex items-center justify-between p-3 sm:p-4 border-b'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>
                Upcoming Renewals
              </h2>
              <ClockIcon className='h-5 w-5 sm:h-6 sm:w-6 text-gray-500' />
            </div>
            <div className='divide-y'>
              {upcomingRenewals.map((renewal) => (
                <div
                  key={renewal.id}
                  className='px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer'
                  onClick={() =>
                    openContractModal(
                      allContracts.find((c) => c.id === renewal.id)
                    )
                  }
                >
                  <div className='overflow-hidden'>
                    <p className='font-medium text-gray-800 truncate'>
                      {renewal.name}
                    </p>
                    <p className='text-xs sm:text-sm text-gray-500 truncate'>
                      {renewal.client}
                    </p>
                  </div>
                  <span
                    className={`ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs whitespace-nowrap ${
                      renewal.daysLeft <= 20
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {renewal.daysLeft} days
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Contract Filter */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            Contract Management
          </h2>
          <div className='w-full sm:w-auto flex items-center gap-2'>
            <div className='w-full sm:w-auto flex rounded-lg overflow-hidden shadow-md'>
              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "All"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => setFilter("All")}
              >
                All
              </button>
              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Active"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => setFilter("Active")}
              >
                Active
              </button>
              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => setFilter("Pending")}
              >
                Pending
              </button>
              <button
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm ${
                  filter === "Draft"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => setFilter("Draft")}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        {/* Display Contracts with responsive grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4'>
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className='bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all'
              onClick={() => openContractModal(contract)}
            >
              <div className='flex items-center justify-between p-3 sm:p-4 border-b'>
                <h3 className='font-semibold text-gray-800 truncate max-w-[70%]'>
                  {contract.name}
                </h3>
                <span
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs flex items-center gap-1 whitespace-nowrap ${
                    statusColors[contract.status].bg
                  } ${statusColors[contract.status].text}`}
                >
                  <span
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      statusColors[contract.status].indicator
                    }`}
                  ></span>
                  <span className='hidden xs:inline'>{contract.status}</span>
                </span>
              </div>
              <div className='p-3 sm:p-4'>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-xs sm:text-sm text-gray-500 truncate max-w-[70%]'>
                    {contract.client}
                  </p>
                  <p className='text-xs sm:text-sm font-semibold text-gray-800'>
                    {contract.value}
                  </p>
                </div>
                <p className='text-xs text-gray-500 truncate'>
                  {contract.description}
                </p>
              </div>
              <div className='bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs text-gray-500 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1'>
                <span className='text-blue-600'>View details</span>
                <span className='text-xs whitespace-nowrap'>
                  {contract.startDate} - {contract.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Contract Detail Modal - Responsive improvements */}
        {isModalOpen && selectedContract && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-0'>
            <div
              className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex justify-between items-center p-3 sm:p-4 border-b sticky top-0 bg-white z-10'>
                <h2 className='text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[80%]'>
                  {selectedContract.name}
                </h2>
                <button
                  onClick={closeModal}
                  className='text-gray-500 hover:text-gray-700 focus:outline-none'
                >
                  <XIcon className='h-5 w-5 sm:h-6 sm:w-6' />
                </button>
              </div>

              <div className='p-4 sm:p-6'>
                {/* Status banner */}
                <div
                  className={`mb-4 sm:mb-6 p-2 sm:p-3 rounded-lg ${
                    statusColors[selectedContract.status].bg
                  }`}
                >
                  <div className='flex items-center'>
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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                  <div className='space-y-3 sm:space-y-4'>
                    <div>
                      <h3 className='text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <UserIcon className='h-3 w-3 sm:h-4 sm:w-4' /> Client
                      </h3>
                      <p className='mt-1 text-base sm:text-lg font-medium text-gray-900 break-words'>
                        {selectedContract.client}
                      </p>
                    </div>

                    <div>
                      <h3 className='text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <DollarSignIcon className='h-3 w-3 sm:h-4 sm:w-4' />{" "}
                        Contract Value
                      </h3>
                      <p className='mt-1 text-base sm:text-lg font-medium text-gray-900'>
                        {selectedContract.value}
                      </p>
                    </div>
                    <div>
                      <h3 className='text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <ClipboardIcon className='h-3 w-3 sm:h-4 sm:w-4' />{" "}
                        Description
                      </h3>
                      <p className='mt-1 text-xs sm:text-sm text-gray-700'>
                        {selectedContract.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons - responsive layout */}
                <div className='mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4'>
                  <button className='w-full sm:flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm'>
                    Edit Contract
                  </button>
                  <button className='w-full sm:flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm'>
                    Download PDF
                  </button>
                  {selectedContract.status !== "Active" && (
                    <button className='w-full sm:flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm'>
                      Activate Contract
                    </button>
                  )}
                </div>

                {/* Timeline section - more responsive */}
                <div className='mt-6 sm:mt-8 pt-4 sm:pt-6 border-t'>
                  <h3 className='text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4'>
                    Contract Timeline
                  </h3>
                  <div className='space-y-3 sm:space-y-4'>
                    <div className='flex items-start'>
                      <div>
                        <div className='flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 text-green-800 mr-2 sm:mr-3'>
                          <CheckIcon className='h-3 w-3 sm:h-4 sm:w-4' />
                        </div>
                        <div className='h-full w-0.5 bg-gray-200 ml-3 sm:ml-4 mt-1'></div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-xs sm:text-sm font-medium'>
                          Contract Created
                        </h4>
                        <p className='text-xs text-gray-500'>
                          January 10, 2025
                        </p>
                        <p className='text-xs sm:text-sm mt-1'>
                          Initial contract draft created and shared with
                          stakeholders.
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <div>
                        <div className='flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-800 mr-2 sm:mr-3'>
                          <PenToolIcon className='h-3 w-3 sm:h-4 sm:w-4' />
                        </div>
                        <div className='h-full w-0.5 bg-gray-200 ml-3 sm:ml-4 mt-1'></div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-xs sm:text-sm font-medium'>
                          Contract Signed
                        </h4>
                        <p className='text-xs text-gray-500'>
                          January 15, 2025
                        </p>
                        <p className='text-xs sm:text-sm mt-1'>
                          Contract signed by all parties.
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <div>
                        <div className='flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-100 text-purple-800 mr-2 sm:mr-3'>
                          <ActivityIcon className='h-3 w-3 sm:h-4 sm:w-4' />
                        </div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-xs sm:text-sm font-medium'>
                          Contract Active
                        </h4>
                        <p className='text-xs text-gray-500'>
                          January 15, 2025
                        </p>
                        <p className='text-xs sm:text-sm mt-1'>
                          Contract is now active and in effect.
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
