import React from "react";
import { PlusIcon, FileTextIcon, BarChartIcon, ClockIcon } from "lucide-react";
import FeaturesSlider from "../components/dashboard/FeaturesSlider";
import Navbar from "../components/dashboard/Navbar";

export default function DashboardPage() {
  const handleCreateContract = () => {
    // TODO: Implement create contract logic
    alert("Create Contract Functionality");
  };

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

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
          <button
            // onClick={handleCreateContract}
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
                  className='px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center'
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
                      className={`px-2 py-1 rounded-full text-xs ${
                        contract.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : contract.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
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
                  className='px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center'
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
      </main>
    </div>
  );
}
