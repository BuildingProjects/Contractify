"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRef } from "react";
import AnkurImage from "../assets/ankur.jpg";
import RoshanImage from "../assets/roshan.jpg";
import AshutoshImage from "../assets/ashutosh.jpg";
import HimanshuImage from "../assets/himanshu.jpg";
import ManiranjanImage from "../assets/maniranjan.jpg";

// Team Members Data
const teamMembers = [
  {
    name: "Ankur Dwivedi",
    role: "Founder & Developer",
    image: AnkurImage,
    linkedin: "https://www.linkedin.com/in/ankur-dwivedi-a82463258/",
  },
  {
    name: "Ashutosh Mishra",
    role: "Developer",
    image: AshutoshImage,
    linkedin: "https://www.linkedin.com/in/ashutosh-mishra-46a082238/",
  },
  {
    name: "Roshan",
    role: "Developer",
    image: RoshanImage,
    linkedin: "https://www.linkedin.com/in/roshan2003/",
  },
  {
    name: "Himanshu Tiwari",
    role: "Blockchain Developer",
    image: HimanshuImage,
    linkedin: "https://in.linkedin.com/in/himanshu-tiwari-97a738291",
  },
  {
    name: "Maniranjan",
    role: "AI Chatbot Developer",
    image: ManiranjanImage,
    linkedin: "https://www.linkedin.com/in/maniranjan-086857288/",
  },
];

const TeamSection = () => {
  const scrollRef = useRef(null);

  // Function to scroll left or right
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Adjust for smooth scrolling
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#FAF4E7] py-12 px-4 md:px-12 lg:px-20 relative">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-6xl font-bold text-gray-800">
          Our Team
        </h2>
        <p className="text-lg text-gray-600">Dedicated Experts</p>
      </motion.div>

      {/* Scroll Buttons */}
      {/* <button
        onClick={() => scroll("left")}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10 hover:bg-gray-600"
      >
        <FaArrowLeft size={20} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10 hover:bg-gray-600"
      >
        <FaArrowRight size={20} />
      </button> */}

      {/* Scrollable Team Members */}
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex space-x-8 px-2 py-4 overflow-x-auto no-scrollbar"
          style={{
            
            width: "100%",
            maxWidth: "980px", // Adjust to fit exactly 3 members at a time
            margin: "0 auto",
          }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-w-[300px] bg-white shadow-md rounded-lg overflow-hidden transition-transform"
              style={{ scrollSnapAlign: "start" }}
            >
              <img
                src={member.image.src || member.image}
                alt={member.name}
                className="w-full h-80 object-cover"
              />
              <div className="bg-[#FAF4E7] text-black p-4 text-center">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-sm">{member.role}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-blue-600 mt-2 hover:underline"
                >
                  <FaLinkedin className="mr-2" /> LinkedIn
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
