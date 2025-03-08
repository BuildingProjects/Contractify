"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BellIcon, MenuIcon, XIcon, SearchIcon } from "lucide-react";
import logo from "../../assets/ankur.jpg";
import ProfileImage from "../../assets/bg_connect.png";

export default function Navbar() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notifications count

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden focus:outline-none"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <MenuIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>

            {/* Replacing Image with Styled Text Logo */}
            <h1 className="text-2xl font-bold text-gray-800 cursor-pointer">
              Contractify
            </h1>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex relative w-64">
            <input
              type="text"
              placeholder="Search contracts..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>

          {/* Right Section - Profile & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <BellIcon className="h-6 w-6 text-gray-700" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <Image
                  src={ProfileImage}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-300"
                />
                <span className="hidden md:block text-gray-700 font-medium">
                  John Doe
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transition-transform duration-200">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md py-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/contracts"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Contracts
            </Link>
            <Link
              href="/analytics"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Analytics
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
