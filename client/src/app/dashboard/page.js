"use client";
import React, { useState } from "react";
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
  const handleCreateContract = () => {
    // TODO: Implement create contract logic
    alert("Create Contract Functionality");
  };

  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // Sample contract data
  const allContracts = [
    {
      id: "1",
      name: "Marketing Services",
      client: "Acme Corp",
      value: "$50,000",
      status: "Active",
      startDate: "2025-01-15",
      endDate: "2025-12-31",
      description:
        "Comprehensive marketing services including digital marketing, content creation, and campaign management.",
      contactPerson: "John Smith",
      contactEmail: "john@acmecorp.com",
      terms: "Net 30",
    },
    {
      id: "2",
      name: "Consulting Agreement",
      client: "Tech Innovations",
      value: "$75,000",
      status: "Pending",
      startDate: "2025-03-01",
      endDate: "2025-08-31",
      description:
        "Strategic consulting services for new product development and market analysis.",
      contactPerson: "Sarah Johnson",
      contactEmail: "sarah@techinnovations.com",
      terms: "Net 45",
    },
    {
      id: "3",
      name: "Software License",
      client: "Global Solutions",
      value: "$25,000",
      status: "Draft",
      startDate: "2025-04-01",
      endDate: "2026-03-31",
      description:
        "Enterprise software license for 50 users with premium support package.",
      contactPerson: "Michael Chen",
      contactEmail: "michael@globalsolutions.com",
      terms: "Annual payment",
    },
    {
      id: "4",
      name: "Legal Agreement",
      client: "Law Firm LLP",
      value: "$120,000",
      status: "Active",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      description:
        "Ongoing legal services and representation for corporate matters.",
      contactPerson: "Elizabeth Taylor",
      contactEmail: "elizabeth@lawfirm.com",
      terms: "Monthly retainer",
    },
    {
      id: "5",
      name: "Freelance Contract",
      client: "Startup X",
      value: "$5,000",
      status: "Pending",
      startDate: "2025-03-15",
      endDate: "2025-05-15",
      description: "UI/UX design project for mobile application redesign.",
      contactPerson: "David Wong",
      contactEmail: "david@startupx.com",
      terms: "50% upfront, 50% on completion",
    },
  ];

  const filteredContracts =
    filter === "All"
      ? allContracts
      : allContracts.filter((contract) => contract.status === filter);

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
      <main className='pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
          <button
            onClick={handleCreateContract}
            className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
            hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg'
          >
            <PlusIcon className='h-5 w-5' />
            Create New Contract
          </button>
        </div>

        {/* <FeaturesSlider /> */}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
          {/* Recent Contracts */}
          <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='flex items-center justify-between p-4 border-b'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Recent Contracts
              </h2>
              <FileTextIcon className='h-6 w-6 text-gray-500' />
            </div>
            <div className='divide-y'>
              {recentContracts.map((contract) => (
                <div
                  key={contract.id}
                  className='px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer'
                  onClick={() =>
                    openContractModal(
                      allContracts.find((c) => c.id === contract.id)
                    )
                  }
                >
                  <div>
                    <p className='font-medium text-gray-800'>{contract.name}</p>
                    <p className='text-sm text-gray-500'>{contract.client}</p>
                  </div>
                  <div className='flex items-center'>
                    <span className='text-sm font-semibold mr-2'>
                      {contract.value}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                        statusColors[contract.status].bg
                      } ${statusColors[contract.status].text}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          statusColors[contract.status].indicator
                        }`}
                      ></span>
                      {contract.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Analytics */}
          <div className='bg-white rounded-xl shadow-lg p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Contract Analytics
              </h2>
              <BarChartIcon className='h-6 w-6 text-gray-500' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-blue-50 p-4 rounded-lg text-center'>
                <p className='text-sm text-gray-600'>Total Contracts</p>
                <p className='text-2xl font-bold text-blue-600'>42</p>
              </div>
              <div className='bg-green-50 p-4 rounded-lg text-center'>
                <p className='text-sm text-gray-600'>Active Contracts</p>
                <p className='text-2xl font-bold text-green-600'>28</p>
              </div>
              <div className='bg-yellow-50 p-4 rounded-lg text-center'>
                <p className='text-sm text-gray-600'>Pending</p>
                <p className='text-2xl font-bold text-yellow-600'>7</p>
              </div>
              <div className='bg-red-50 p-4 rounded-lg text-center'>
                <p className='text-sm text-gray-600'>Expired</p>
                <p className='text-2xl font-bold text-red-600'>7</p>
              </div>
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='flex items-center justify-between p-4 border-b'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Upcoming Renewals
              </h2>
              <ClockIcon className='h-6 w-6 text-gray-500' />
            </div>
            <div className='divide-y'>
              {upcomingRenewals.map((renewal) => (
                <div
                  key={renewal.id}
                  className='px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer'
                  onClick={() =>
                    openContractModal(
                      allContracts.find((c) => c.id === renewal.id)
                    )
                  }
                >
                  <div>
                    <p className='font-medium text-gray-800'>{renewal.name}</p>
                    <p className='text-sm text-gray-500'>{renewal.client}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      renewal.daysLeft <= 20
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {renewal.daysLeft} days left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Contract Filter */}
        <div className='flex justify-between items-center mt-8 mb-4'>
          <h2 className='text-xl font-semibold text-gray-800'>
            Contract Management
          </h2>
          <div className='flex items-center gap-2'>
            <div className='flex rounded-lg overflow-hidden shadow-md'>
              <button
                className={`px-4 py-2 ${
                  filter === "All"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => setFilter("All")}
              >
                All
              </button>
              <button
                className={`px-4 py-2 ${
                  filter === "Active"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => setFilter("Active")}
              >
                Active
              </button>
              <button
                className={`px-4 py-2 ${
                  filter === "Pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } transition-colors`}
                onClick={() => setFilter("Pending")}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 ${
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

        {/* Display Contracts */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className='bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-102 transition-all hover:shadow-xl'
              onClick={() => openContractModal(contract)}
            >
              <div className='flex items-center justify-between p-4 border-b'>
                <h3 className='font-semibold text-gray-800 truncate'>
                  {contract.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                    statusColors[contract.status].bg
                  } ${statusColors[contract.status].text}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      statusColors[contract.status].indicator
                    }`}
                  ></span>
                  {contract.status}
                </span>
              </div>
              <div className='p-4'>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-sm text-gray-500'>{contract.client}</p>
                  <p className='text-sm font-semibold text-gray-800'>
                    {contract.value}
                  </p>
                </div>
                <p className='text-xs text-gray-500 truncate'>
                  {contract.description}
                </p>
              </div>
              <div className='bg-gray-50 px-4 py-2 text-xs text-gray-500 flex justify-between items-center'>
                <span>View details</span>
                <span>
                  {contract.startDate} - {contract.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Contract Detail Modal */}
        {isModalOpen && selectedContract && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div
              className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10'>
                <h2 className='text-xl font-bold text-gray-800'>
                  {selectedContract.name}
                </h2>
                <button
                  onClick={closeModal}
                  className='text-gray-500 hover:text-gray-700 focus:outline-none'
                >
                  <XIcon className='h-6 w-6' />
                </button>
              </div>

              <div className='p-6'>
                {/* Status banner */}
                <div
                  className={`mb-6 p-3 rounded-lg ${
                    statusColors[selectedContract.status].bg
                  }`}
                >
                  <div className='flex items-center'>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        statusColors[selectedContract.status].indicator
                      } mr-2`}
                    ></span>
                    <span
                      className={`font-medium ${
                        statusColors[selectedContract.status].text
                      }`}
                    >
                      {selectedContract.status} Contract
                    </span>
                  </div>
                </div>

                {/* Contract details grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <UserIcon className='h-4 w-4' /> Client
                      </h3>
                      <p className='mt-1 text-lg font-medium text-gray-900'>
                        {selectedContract.client}
                      </p>
                    </div>

                    <div>
                      <h3 className='text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <DollarSignIcon className='h-4 w-4' /> Contract Value
                      </h3>
                      <p className='mt-1 text-lg font-medium text-gray-900'>
                        {selectedContract.value}
                      </p>
                    </div>

                    <div>
                      <h3 className='text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <CalendarIcon className='h-4 w-4' /> Contract Period
                      </h3>
                      <p className='mt-1 text-gray-900'>
                        {selectedContract.startDate} to{" "}
                        {selectedContract.endDate}
                      </p>
                    </div>

                    <div>
                      <h3 className='text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <TagIcon className='h-4 w-4' /> Payment Terms
                      </h3>
                      <p className='mt-1 text-gray-900'>
                        {selectedContract.terms}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <UserIcon className='h-4 w-4' /> Contact Person
                      </h3>
                      <p className='mt-1 text-gray-900'>
                        {selectedContract.contactPerson}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {selectedContract.contactEmail}
                      </p>
                    </div>

                    <div>
                      <h3 className='text-sm font-medium text-gray-500 flex items-center gap-2'>
                        <ClipboardIcon className='h-4 w-4' /> Description
                      </h3>
                      <p className='mt-1 text-gray-700'>
                        {selectedContract.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className='mt-8 flex flex-wrap gap-4'>
                  <button className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'>
                    Edit Contract
                  </button>
                  <button className='flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors'>
                    Download PDF
                  </button>
                  {selectedContract.status !== "Active" && (
                    <button className='flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors'>
                      Activate Contract
                    </button>
                  )}
                </div>

                {/* Timeline section */}
                <div className='mt-8 pt-6 border-t'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>
                    Contract Timeline
                  </h3>
                  <div className='space-y-4'>
                    <div className='flex items-start'>
                      <div>
                        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 mr-3'>
                          <CheckIcon className='h-4 w-4' />
                        </div>
                        <div className='h-full w-0.5 bg-gray-200 ml-4 mt-1'></div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-sm font-medium'>
                          Contract Created
                        </h4>
                        <p className='text-xs text-gray-500'>
                          January 10, 2025
                        </p>
                        <p className='text-sm mt-1'>
                          Initial contract draft created and shared with
                          stakeholders.
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <div>
                        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 mr-3'>
                          <PenToolIcon className='h-4 w-4' />
                        </div>
                        <div className='h-full w-0.5 bg-gray-200 ml-4 mt-1'></div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-sm font-medium'>Contract Signed</h4>
                        <p className='text-xs text-gray-500'>
                          January 15, 2025
                        </p>
                        <p className='text-sm mt-1'>
                          Contract signed by all parties.
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <div>
                        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 mr-3'>
                          <ActivityIcon className='h-4 w-4' />
                        </div>
                      </div>
                      <div className='flex-1'>
                        <h4 className='text-sm font-medium'>Contract Active</h4>
                        <p className='text-xs text-gray-500'>
                          January 15, 2025
                        </p>
                        <p className='text-sm mt-1'>
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
