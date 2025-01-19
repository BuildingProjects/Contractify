"use client";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const eSigningImage = require("../assets/esigning.jpeg");
const contract_genrationImage = require("../assets/contract_genration.jpeg");
const automated_workflows = require("../assets/automated_workflows.jpeg");
const secure_storage = require("../assets/secure_storage.jpeg");

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    margin: "-10% 0px",
    amount: 0.2,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Faster spring animation
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
    mass: 0.2,
  });

  const headerY = useTransform(smoothProgress, [0, 1], [0, -50]);
  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0.9, 1, 1, 0.9]
  );
  const scale = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0.98, 1, 1, 0.98]
  );

  const cards = [
    {
      title: "eSigning",
      description: "Quickly sign contracts from anywhere anytime.",
      image: eSigningImage,
    },
    {
      title: "Contract Generation",
      description: "Generate contracts in minutes with templates.",
      image: contract_genrationImage,
    },
    {
      title: "Automated Workflows",
      description:
        "Streamline your contract processes efficiently with our tools.",
      image: automated_workflows,
    },
    {
      title: "Secure Storage",
      description: "Store contracts securely and access them easily with us.",
      image: secure_storage,
    },
  ];

  return (
    <motion.div
      ref={sectionRef}
      className='bg-[#FAF4E7] py-16 px-6 md:px-12 lg:px-32 relative min-h-screen overflow-hidden'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }} // Reduced from 0.5
    >
      {/* Header Section */}
      <motion.div
        className='text-center mb-12 relative z-10'
        style={{ y: headerY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }} // Reduced y offset
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }} // Reduced from 0.6
        >
          <h2 className='text-sm font-medium text-yellow-700 tracking-wide uppercase'>
            Simplifying Contracts
          </h2>
          <h1 className='text-4xl font-bold text-black mt-2'>
            Our Comprehensive Services
          </h1>
        </motion.div>
      </motion.div>

      {/* Grid Section */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10'
        style={{ scale, opacity }}
      >
        {cards.map((card, index) => {
          const delay = index * 0.05; // Reduced from 0.1

          return (
            <motion.div
              key={index}
              className='relative bg-yellow-100 shadow-lg rounded-lg overflow-hidden transform-gpu'
              style={{ height: "300px" }}
              initial={{ opacity: 0, y: 20 }} // Reduced y offset
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.3, // Reduced from 0.6
                        delay,
                        ease: "easeOut",
                      },
                    }
                  : {}
              }
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.15 }, // Faster hover
              }}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className='object-cover opacity-40 transition-transform duration-200 transform-gpu'
                priority={true} // Priority loading for all images
              />
              <motion.div
                className='absolute inset-0 p-8 flex flex-col justify-end bg-opacity-0 hover:bg-opacity-10 bg-black transition-all duration-200'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.1 }} // Reduced delay
              >
                <h3 className='text-2xl font-semibold text-black mb-2'>
                  {card.title}
                </h3>
                <p className='text-sm text-black'>{card.description}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Button Section */}
      <motion.div
        className='text-center mt-12 relative z-10'
        initial={{ opacity: 0, y: 10 }} // Reduced y offset
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.3, delay: 0.2 }} // Reduced duration and delay
      >
        <motion.button
          className='bg-black text-white text-lg py-3 px-8 rounded-lg transform-gpu'
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.15 }, // Faster hover
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.1 },
          }}
        >
          Explore Services
        </motion.button>
      </motion.div>

      {/* Background effect */}
      <motion.div
        className='absolute inset-0 pointer-events-none'
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 226, 130, 0.15) 0%, transparent 70%)",
          y: useTransform(smoothProgress, [0, 1], [0, -30]), // Reduced movement
          scale: useTransform(smoothProgress, [0, 0.5, 1], [1, 1.05, 1]), // Reduced scale
        }}
      />
    </motion.div>
  );
}
