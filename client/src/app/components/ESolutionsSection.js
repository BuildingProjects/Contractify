"use client";

import Image from "next/image";
import mapImage from "../assets/bg_about.png"; // Replace with your image file name
import laptopImage from "../assets/home.jpg"; // Replace with your image file name
import patternImage from "../assets/piggy.jpg"; // Replace with your image file name
import hammerIcon from "../assets/law2_about.png"; // Replace with your icon file name

// export default function ESolutionsSection() {
//   return (
//     <section className="bg-[#FEF8ED] py-16 px-6 md:px-12 lg:px-32">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//         {/* Left Content */}
//         <div className="space-y-6">
//           <h3 className="text-sm font-medium text-yellow-700 uppercase tracking-wide">
//             Seamless Transition
//           </h3>
//           <h1 className="text-4xl font-bold text-black">
//             Unmatched E-Signing Solutions
//           </h1>
//           <p className="text-lg text-gray-800">
//             Our platform offers unparalleled eSigning capabilities that simplify
//             your workflow and enhance security.
//           </p>
//           <ul className="space-y-3">
//             <li className="flex items-center">
//               <span className="bg-yellow-500 w-6 h-6 flex items-center justify-center rounded-full">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="white"
//                   className="w-4 h-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </span>
//               <span className="ml-4 text-gray-800">E-signature Compliance</span>
//             </li>
//             <li className="flex items-center">
//               <span className="bg-yellow-500 w-6 h-6 flex items-center justify-center rounded-full">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="white"
//                   className="w-4 h-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </span>
//               <span className="ml-4 text-gray-800">
//                 Real-time Document Editing
//               </span>
//             </li>
//             <li className="flex items-center">
//               <span className="bg-yellow-500 w-6 h-6 flex items-center justify-center rounded-full">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="white"
//                   className="w-4 h-4"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               </span>
//               <span className="ml-4 text-gray-800">
//                 Templates and Clauses
//               </span>
//             </li>
//           </ul>
//         </div>

//         {/* Right Content */}
//         <div className="relative grid grid-cols-2 gap-4">
//           {/* Icon */}
//           <div className="absolute -top-6 left-6 bg-yellow-500 w-12 h-12 flex items-center justify-center rounded-md shadow-md">
//             <Image src={hammerIcon} alt="Icon" width={20} height={20} />
//           </div>
//           {/* Images */}
//           <div className="row-span-2">
//             <Image
//               src={mapImage}
//               alt="Map"
//               className="rounded-lg shadow-lg"
//               width={300}
//               height={300}
//             />
//           </div>
//           <div>
//             <Image
//               src={laptopImage}
//               alt="Laptop"
//               className="rounded-lg shadow-lg"
//               width={300}
//               height={300}
//             />
//           </div>
//           <div>
//             <Image
//               src={patternImage}
//               alt="Pattern"
//               className="rounded-lg shadow-lg"
//               width={300}
//               height={300}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
export default function ESolutionsSection() {
  return (
    <section className='bg-[#FAF4E7] py-16 px-6 md:px-12 lg:px-32'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
        {/* Left Content */}
        <div className='space-y-6'>
          <h3 className='text-sm font-medium text-yellow-700 uppercase tracking-wide'>
            Seamless Transition
          </h3>
          <h1 className='text-4xl font-bold text-black'>
            Unmatched E-Signing Solutions
          </h1>
          <p className='text-lg text-gray-800'>
            Our platform offers unparalleled eSigning capabilities that simplify
            your workflow and enhance security.
          </p>
          <ul className='space-y-3'>
            <li className='flex items-center'>
              <span className='bg-yellow-500 w-6 h-6 flex items-center justify-center rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='white'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </span>
              <span className='ml-4 text-gray-800'>E-signature Compliance</span>
            </li>
            <li className='flex items-center'>
              <span className='bg-yellow-500 w-6 h-6 flex items-center justify-center rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='white'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </span>
              <span className='ml-4 text-gray-800'>
                Real-time Document Editing
              </span>
            </li>
            <li className='flex items-center'>
              <span className='bg-yellow-500 w-6 h-6 flex items-center justify-center rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='white'
                  className='w-4 h-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </span>
              <span className='ml-4 text-gray-800'>Templates and Clauses</span>
            </li>
          </ul>
        </div>

        {/* Right Content - Images */}
        <div className='relative'>
          {/* Hammer Icon */}
          <div className='absolute -top-8 left-8 bg-yellow-500 w-12 h-12 flex items-center justify-center rounded-md shadow-lg z-10'>
            <Image src={hammerIcon} alt='Icon' width={20} height={20} />
          </div>

          {/* Main Image - Map */}
          <div className='relative'>
            <Image
              src={mapImage}
              alt='Map'
              className='rounded-lg shadow-lg'
              width={400}
              height={300}
            />
          </div>

          {/* Secondary Image - Laptop */}
          <div className='absolute top-0 right-4 transform translate-x-1/4 -translate-y-1/4 z-0'>
            <Image
              src={laptopImage}
              alt='Laptop'
              className='rounded-lg shadow-md'
              width={200}
              height={150}
            />
          </div>

          {/* Tertiary Image - Pattern */}
          <div className='absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4'>
            <Image
              src={patternImage}
              alt='Pattern'
              className='rounded-lg shadow-md'
              width={150}
              height={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
