"use client";

import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa"; // Import LinkedIn icon from react-icons
import AnkurImage from "../assets/ankur.jpg";
import RoshanImage from "../assets/roshan.jpg";
import AshutoshImage from "../assets/ashutosh.jpg";

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
];

const TeamSection = () => {
  return (
    <section className="bg-[#FAF4E7] py-12 px-4 md:px-12 lg:px-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-6xl font-bold text-gray-800">
          Our Team
        </h2>
        <p className="text-lg text-gray-600">Dedicated Experts</p>
      </div>
      <div className="flex flex-wrap justify-center gap-16">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform w-60" // Set fixed width
          >
            <img
              src={member.image.src || member.image}
              alt={member.name}
              className="w-full h-96 object-cover"
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
    </section>
  );
};

export default TeamSection;
