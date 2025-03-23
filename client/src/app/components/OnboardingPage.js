"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
const housImage = require("../assets/home.jpg");

const OnboardingPage = () => {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.3,
      },
    },
  };

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleDemoClick = () => {
    setShowVideo(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    // Re-enable scrolling
    document.body.style.overflow = "auto";
  };

  return (
    <motion.main
      className='w-full overflow-x-hidden pt-8 bg-[#FAF4E7] sm:pt-8 pb-12 sm:pb-8 px-4 sm:px-6 lg:px-8'
      initial='hidden'
      animate='visible'
      variants={staggerContainer}
    >
      {/* Video Modal */}
      {showVideo && (
        <div className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 sm:p-4 touch-none'>
          <div className='relative w-full h-full sm:h-auto sm:max-w-4xl bg-black sm:rounded-xl overflow-hidden flex items-center justify-center'>
            <button
              onClick={handleCloseVideo}
              className='absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all z-10'
              aria-label='Close video'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>
            <div
              className={`${
                isMobile ? "w-full h-full" : "w-full aspect-video"
              }`}
            >
              {/* Local video player with controls */}
              <video
                className='w-full h-full object-contain'
                controls
                autoPlay
                playsInline
                src='/demovideo.mp4'
                preload='auto'
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center'>
          {/* Left Column */}
          <motion.div className='space-y-6 sm:space-y-8' variants={fadeIn}>
            <div className='inline-block'>
              <motion.span
                className='text-[#C28500] px-4 py-2 rounded-full text-xs sm:text-sm font-medium'
                variants={fadeIn}
              >
                EFFORTLESS ESIGNING
              </motion.span>
            </div>

            <motion.h1
              className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-gray-900'
              variants={fadeIn}
            >
              Streamline Your Contract Management Process
            </motion.h1>

            <motion.p
              className='text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed'
              variants={fadeIn}
            >
              Generate, e-sign, and manage your contracts all in one secure
              platform with Contractify.
            </motion.p>

            <motion.div className='flex flex-wrap gap-4' variants={fadeIn}>
              <button
                onClick={() => router.push("/choices")}
                className='bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-800 transition-all text-sm sm:text-lg'
              >
                Get Started
              </button>
              <button
                onClick={handleDemoClick}
                className='bg-[#C28500] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-amber-600 transition-all text-sm sm:text-lg flex items-center gap-2'
                aria-label='Watch demo video'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='12' cy='12' r='10'></circle>
                  <polygon points='10 8 16 12 10 16 10 8'></polygon>
                </svg>
                Watch Demo
              </button>
              <button className='border-2 border-black text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-black hover:text-white transition-all text-sm sm:text-lg'>
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div className='relative w-full' variants={fadeIn}>
            <div className='relative h-[300px] sm:h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl'>
              <Image
                src={housImage}
                alt='House key with coins'
                fill
                className='object-cover'
                priority
              />
              {/* Overlay gradient */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>

              {/* Play button overlay on the image */}
              <motion.button
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all'
                onClick={handleDemoClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label='Play demo video'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='ml-1'
                >
                  <polygon points='5 3 19 12 5 21 5 3'></polygon>
                </svg>
              </motion.button>
            </div>

            {/* Testimonial Card - Made more responsive */}
            <motion.div
              className='absolute bottom-[-2rem] right-0 sm:right-[-1rem] md:right-[-2rem] bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl max-w-[85%] sm:max-w-[280px] md:max-w-[320px] transform hover:scale-105 transition-transform'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className='flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-sm sm:text-lg md:text-xl font-bold'>
                  A
                </div>
                <div>
                  <p className='font-semibold text-gray-900 text-xs sm:text-sm md:text-base'>
                    Alex Morrison
                  </p>
                  <p className='text-xs text-gray-500'>Contract Manager</p>
                </div>
              </div>
              <div className='flex text-amber-400 mb-1 sm:mb-2 md:mb-3 text-xs sm:text-sm'>
                ★★★★★
              </div>
              <p className='text-gray-600 text-xs'>
                "Contractify transformed our contract management process. The
                seamless eSigning feature is a game-changer!"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

export default OnboardingPage;
