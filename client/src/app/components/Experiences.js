import Image from "next/image";
import { useState, useEffect } from "react";
import ExperiencesPng from "../assets/Experiencepng.jpeg";

const testimonials = [
  {
    message:
      "Contractify streamlined our agreements, saving us so much time and effort. Truly impactful!",
    author: "Michael Johnson",
  },
  {
    message: "The e-signature feature was a game-changer for our team!",
    author: "Sarah Connor",
  },
  {
    message:
      "We love how seamless and secure the process is now. Amazing tool!",
    author: "John Doe",
  },
];

export default function Experiences() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Duplicate testimonials for seamless looping
  const extendedTestimonials = [
    testimonials[testimonials.length - 1], // Clone the last testimonial
    ...testimonials,
    testimonials[0], // Clone the first testimonial
  ];

  const handleTransitionEnd = () => {
    setIsAnimating(false);
    if (activeIndex === 0) {
      // Jump to the last real testimonial
      setActiveIndex(testimonials.length);
    } else if (activeIndex === testimonials.length + 1) {
      // Jump to the first real testimonial
      setActiveIndex(1);
    }
  };

  // Automatically change slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setActiveIndex((prev) => prev + 1);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#FAF4E7] py-16 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <p className="text-orange-600 text-sm font-medium uppercase tracking-wide mb-3">
          Real Experiences
        </p>
        <h2 className="text-gray-800 text-4xl lg:text-5xl font-serif mb-10">
          What Our Clients Say
        </h2>

        {/* Image and Testimonials */}
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-[400px]">
            <Image
              src={ExperiencesPng}
              alt="Testimonial background"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full overflow-hidden">
              {/* Slide container */}
              <div
                className={`flex transition-transform duration-700 ease-in-out ${
                  isAnimating ? "" : "transition-none"
                }`}
                style={{
                  transform: `translateX(-${
                    activeIndex * 100
                  }%)`, // Adjusted for extended testimonials
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {extendedTestimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="min-w-full flex items-center justify-center"
                  >
                    <div
                      className="bg-white p-8 rounded-lg shadow-md w-[90%] lg:w-[50%] h-[180px] flex flex-col justify-center"
                    >
                      <p className="text-gray-700 text-lg italic mb-4 text-center">
                        “{testimonial.message}”
                      </p>
                      <p className="text-orange-600 text-sm font-medium text-center">
                        — {testimonial.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index + 1); // Adjust for extended testimonials
                setIsAnimating(true);
              }}
              className={`w-3 h-3 rounded-full ${
                activeIndex === index + 1
                  ? "bg-orange-600"
                  : "bg-gray-300 hover:bg-gray-400"
              } transition`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
