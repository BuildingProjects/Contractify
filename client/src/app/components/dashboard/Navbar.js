"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/ankur.jpg";
import ProfileImgae from "../../assets/bg_connect.png";
export default function Navbar() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <nav className='bg-white shadow-md fixed w-full z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Image
              src={logo}
              alt='Contractify Logo'
              width={40}
              height={40}
              className='cursor-pointer'
            />
          </div>

          {/* Navigation Links */}
          <div className='hidden md:flex space-x-4'>
            <Link
              href='/dashboard'
              className='text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md'
            >
              Dashboard
            </Link>
            <Link
              href='/contracts'
              className='text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md'
            >
              Contracts
            </Link>
            <Link
              href='/analytics'
              className='text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md'
            >
              Analytics
            </Link>
          </div>

          {/* Profile Section */}
          <div className='relative'>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className='flex items-center space-x-2 focus:outline-none'
            >
              <Image
                src={ProfileImgae}
                alt='User Profile'
                width={40}
                height={20}
                className='rounded-full'
              />
              <span className='hidden md:block'>John Doe</span>
            </button>

            {isProfileDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl'>
                <Link
                  href='/profile'
                  className='block px-4 py-2 text-gray-800 hover:bg-gray-100'
                >
                  Profile
                </Link>
                <Link
                  href='/settings'
                  className='block px-4 py-2 text-gray-800 hover:bg-gray-100'
                >
                  Settings
                </Link>
                <button className='w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100'>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
