import React from "react";
import { MapPin, Headphones, Mail } from "lucide-react";
import Image from "next/image";
import Background from "../assets/bg_connect.png";

const ConnectUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <section className='bg-[#fdf4e9] py-16 px-4 md:px-12 lg:px-24'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
        {/* Left Section */}
        <div className='space-y-8'>
          <div>
            <p className='text-yellow-600 font-medium mb-2'>
              We'd love to hear from you!
            </p>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-800'>
              Connect with Us
            </h2>
          </div>

          <ul className='space-y-6'>
            <li className='flex items-center text-lg text-gray-700 group'>
              <div className='bg-yellow-400 text-white rounded-full p-3 mr-4 transition-all duration-300 group-hover:bg-yellow-500'>
                <Mail className='w-5 h-5' />
              </div>
              <a
                href='mailto:contractify2025@gmail.com'
                className='hover:text-gray-900 transition-colors'
              >
                contractify2025@gmail.com
              </a>
            </li>
            <li className='flex items-center text-lg text-gray-700 group'>
              <div className='bg-yellow-400 text-white rounded-full p-3 mr-4 transition-all duration-300 group-hover:bg-yellow-500'>
                <MapPin className='w-5 h-5' />
              </div>
              <span>Bhagalpur, Bihar</span>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className='relative rounded-lg p-8 overflow-hidden min-h-[500px]'>
          <Image
            src={Background}
            alt='Background pattern'
            fill
            sizes='(max-width: 768px) 50vw, 50vw'
            className='object-cover '
            priority
          />
          <div className='relative z-10'>
            <h3 className='text-3xl font-bold text-gray-800 mb-6'>
              Free Consultation
            </h3>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <input
                  type='email'
                  placeholder='Your Email'
                  className='w-full text-black p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow bg-white'
                  required
                />
              </div>
              <div>
                <input
                  type='text'
                  placeholder='Subject'
                  className='w-full p-3 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow bg-white'
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder='Message'
                  rows='5'
                  className='w-full text-black p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow resize-none bg-white'
                  required
                ></textarea>
              </div>
              <button
                type='submit'
                className='w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 uppercase tracking-wide'
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectUs;
