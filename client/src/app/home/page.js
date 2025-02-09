import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ContractDashboard() {
  // Sample data
  const monthlyData = [
    { name: "Jan", active: 40, pending: 24, expired: 5 },
    { name: "Feb", active: 45, pending: 20, expired: 8 },
    { name: "Mar", active: 50, pending: 18, expired: 10 },
    { name: "Apr", active: 48, pending: 22, expired: 7 },
    { name: "May", active: 52, pending: 19, expired: 6 },
    { name: "Jun", active: 58, pending: 15, expired: 4 },
  ];

  const upcomingRenewals = [
    { id: 1, name: "Software License A", date: "2025-02-15", value: "$12,000" },
    { id: 2, name: "Service Agreement B", date: "2025-02-20", value: "$8,500" },
    { id: 3, name: "Vendor Contract C", date: "2025-02-28", value: "$15,000" },
  ];

  // Stats data
  const stats = [
    {
      title: "Total Contracts",
      value: "156",
      icon: (
        <svg
          className='w-6 h-6 text-blue-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      ),
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Contracts",
      value: "58",
      icon: (
        <svg
          className='w-6 h-6 text-green-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ),
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Review",
      value: "15",
      icon: (
        <svg
          className='w-6 h-6 text-yellow-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ),
      bgColor: "bg-yellow-100",
    },
    {
      title: "Expiring Soon",
      value: "4",
      icon: (
        <svg
          className='w-6 h-6 text-red-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ),
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Contract Management Dashboard
        </h1>
        <button className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
          Add Contract
        </button>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {stats.map((stat, index) => (
          <div key={index} className='bg-white p-6 rounded-lg shadow'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500'>{stat.title}</p>
                <p className='text-2xl font-bold text-gray-800'>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Contract Status Chart */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>
            Contract Status Overview
          </h2>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Line type='monotone' dataKey='active' stroke='#2563eb' />
                <Line type='monotone' dataKey='pending' stroke='#eab308' />
                <Line type='monotone' dataKey='expired' stroke='#dc2626' />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Upcoming Renewals</h2>
          <div className='space-y-4'>
            {upcomingRenewals.map((renewal) => (
              <div
                key={renewal.id}
                className='flex items-center justify-between p-4 bg-gray-50 rounded'
              >
                <div>
                  <p className='font-medium text-gray-800'>{renewal.name}</p>
                  <div className='flex items-center space-x-2 text-sm text-gray-500'>
                    <svg
                      className='h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                    <span>{renewal.date}</span>
                  </div>
                </div>
                <div>
                  <p className='font-bold text-blue-600'>{renewal.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractDashboard;
