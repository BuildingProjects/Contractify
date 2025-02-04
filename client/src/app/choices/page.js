"use client";
import { useState } from "react";
import { Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ChoicesPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleRoleSelect = (role) => {
    router.push(`/signup?userType=${role}`);
  };

  return (
    <motion.div 
      className='min-h-screen flex items-center justify-center bg-white px-4 py-8'
      initial='hidden'
      animate='visible'
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.5, staggerChildren: 0.1 },
        },
      }}
    >
      <motion.div 
        className='w-full max-w-2xl mx-auto grid md:grid-cols-2 gap-8 items-center'
        variants={fadeIn}
      >
        {/* Text Section */}
        <div className='text-center md:text-left space-y-6 order-2 md:order-1'>
          <motion.div variants={fadeIn}>
            <span className='bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs sm:text-sm font-medium inline-block'>
              Choose Your Role
            </span>
          </motion.div>

          <motion.h2
            variants={fadeIn}
            className='text-3xl md:text-4xl font-serif text-gray-900'
          >
            Select Your Professional Path
          </motion.h2>

          <motion.p 
            variants={fadeIn}
            className='text-gray-600 text-sm md:text-base'
          >
            Discover the right role for your professional journey
          </motion.p>
        </div>

        {/* Buttons Section */}
        <div className='space-y-6 order-1 md:order-2'>
          <button
            onClick={() => handleRoleSelect('contractor')}
            className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium transition-all ${
              hovered === "contractor"
                ? "bg-black text-white scale-105" 
                : "bg-white text-black border-gray-300 hover:bg-gray-50"
            }`}
            onMouseEnter={() => setHovered("contractor")}
            onMouseLeave={() => setHovered(null)}
          >
            <Briefcase className='h-6 w-6 mr-3' />
            <div className='text-left'>
              <span className='block text-lg font-semibold'>Contractor</span>
              <p className='text-sm opacity-70'>I want to provide services</p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('contractee')}
            className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium transition-all ${
              hovered === "contractee"
                ? "bg-black text-white scale-105" 
                : "bg-white text-black border-gray-300 hover:bg-gray-50"
            }`}
            onMouseEnter={() => setHovered("contractee")}
            onMouseLeave={() => setHovered(null)}
          >
            <Users className='h-6 w-6 mr-3' />
            <div className='text-left'>
              <span className='block text-lg font-semibold'>Contractee</span>
              <p className='text-sm opacity-70'>I need professional services</p>
            </div>
          </button>

          <motion.p 
            variants={fadeIn}
            className='text-center text-sm text-gray-600 mt-4'
          >
            Not sure?{" "}
            <a 
              href='#' 
              className='font-medium text-black hover:text-gray-800'
            >
              Learn more about roles
            </a>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}