"use client";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='fixed w-full top-0 z-50 bg-white/90 backdrop-blur-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo */}
          <Link href='/' className='text-2xl font-bold text-gray-900'>
            Contractify
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <Link
              href='/'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Home
            </Link>
            <Link
              href='/about'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              About
            </Link>
            <Link
              href='/service'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Service
            </Link>
            <Link
              href='/portfolio'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Portfolio
            </Link>
            <button className='bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all'>
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className='md:hidden p-2'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='md:hidden py-4'>
            <div className='flex flex-col gap-4'>
              <Link
                href='/'
                className='text-gray-600 hover:text-gray-900 px-4 py-2'
              >
                Home
              </Link>
              <Link
                href='/about'
                className='text-gray-600 hover:text-gray-900 px-4 py-2'
              >
                About
              </Link>
              <Link
                href='/service'
                className='text-gray-600 hover:text-gray-900 px-4 py-2'
              >
                Service
              </Link>
              <Link
                href='/portfolio'
                className='text-gray-600 hover:text-gray-900 px-4 py-2'
              >
                Portfolio
              </Link>
              <button className='bg-black text-white mx-4 py-2.5 rounded-lg hover:bg-gray-800 transition-all'>
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
