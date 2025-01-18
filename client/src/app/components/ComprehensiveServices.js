"use client";
import Image from "next/image";

const eSigningImage = require('../assets/esigning.jpeg');
const contract_genrationImage = require("../assets/contract_genration.jpeg");
const automated_workflows = require("../assets/automated_workflows.jpeg");
const secure_storage = require("../assets/secure_storage.jpeg");

// Remove the curly braces from image values
const services = [
  {
    title: "eSigning",
    description: "Quickly sign contracts from anywhere anytime.",
    image: eSigningImage, // Remove curly braces
  },
  {
    title: "Contract Generation",
    description: "Generate contracts in minutes with templates.",
    image: contract_genrationImage, // Remove curly braces
  },
  {
    title: "Automated Workflows",
    description: "Streamline your contract processes efficiently with our tools.",
    image: automated_workflows, // Remove curly braces
  },
  {
    title: "Secure Storage",
    description: "Store contracts securely and access them easily with us.",
    image: secure_storage, // Remove curly braces
  },
];

export default function ComprehensiveServices() {
  return (
    <section className="py-16 bg-[#FDF7F2]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <p className="text-amber-600 font-medium mb-2">
            Simplifying Contracts
          </p>
          <h2 className="text-4xl md:text-5xl font-serif">
            Our Comprehensive Services
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-white/90 text-sm md:text-base">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium inline-flex items-center gap-2">
            Explore Services
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="translate-y-[1px]"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}