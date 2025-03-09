// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   CalendarIcon,
//   PlusIcon,
//   SaveIcon,
//   ArrowLeftIcon,
//   XIcon,
// } from "lucide-react";
// import Navbar from "../components/dashboard/Navbar";
// import SignatureModal from "../components/SignatureModal";

// export default function CreateContractPage() {
//   const router = useRouter();
//   const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
//   const [currentSignatureTarget, setCurrentSignatureTarget] = useState(null);
//   const [formData, setFormData] = useState({
//     contractCategory: "",
//     contractor: "",
//     contractee: "",
//     contractorEmail: "",
//     contracteeEmail: "",
//     contractValue: "",
//     contractCreationDate: new Date().toISOString().split("T")[0],
//     startDate: "",
//     endDate: "",
//     contractDescription: "",
//     contractorSignature: null,
//     // contracteeSignature: null,
//   });
//   const [customFields, setCustomFields] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [wordCount, setWordCount] = useState(0);

//   const openSignatureModal = (target) => {
//     setCurrentSignatureTarget(target);
//     setIsSignatureModalOpen(true);
//   };

//   const handleSignatureSave = (signatureData) => {
//     setFormData({
//       ...formData,
//       [`${currentSignatureTarget}Signature`]: signatureData,
//     });
//   };

//   const removeSignature = (target) => {
//     setFormData({
//       ...formData,
//       [`${target}Signature`]: null,
//     });
//   };

//   // Count words in description
//   useEffect(() => {
//     const words = formData.contractDescription.trim()
//       ? formData.contractDescription.trim().split(/\s+/).length
//       : 0;
//     setWordCount(words);
//   }, [formData.contractDescription]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Clear error for the field being changed
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: "",
//       });
//     }
//   };

//   const newErrors = {};
//   if (!formData.contractorSignature);
//   newErrors.contractorSignature = "Contractor signature is required";
//   if (!formData.contracteeSignature)
//     newErrors.contracteeSignature = "Contractee signature is required";
//   const addCustomField = () => {
//     setCustomFields([...customFields, { field: "", value: "" }]);
//   };

//   const updateCustomField = (index, key, value) => {
//     const updatedFields = [...customFields];
//     updatedFields[index][key] = value;
//     setCustomFields(updatedFields);
//   };

//   const removeCustomField = (index) => {
//     const updatedFields = [...customFields];
//     updatedFields.splice(index, 1);
//     setCustomFields(updatedFields);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     const newErrors = {};

//     if (!formData.contractCategory)
//       newErrors.contractCategory = "Contract category is required";
//     if (!formData.contractor)
//       newErrors.contractor = "Contractor name is required";
//     if (!formData.contractee)
//       newErrors.contractee = "Contractee name is required";
//     if (!formData.contractorEmail)
//       newErrors.contractorEmail = "Contractor email is required";
//     if (!formData.contracteeEmail)
//       newErrors.contracteeEmail = "Contractee email is required";
//     if (!formData.startDate) newErrors.startDate = "Start date is required";
//     if (!formData.endDate) newErrors.endDate = "End date is required";

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (
//       formData.contractorEmail &&
//       !emailRegex.test(formData.contractorEmail)
//     ) {
//       newErrors.contractorEmail = "Invalid email format";
//     }
//     if (
//       formData.contracteeEmail &&
//       !emailRegex.test(formData.contracteeEmail)
//     ) {
//       newErrors.contracteeEmail = "Invalid email format";
//     }

//     // Date validation
//     if (
//       formData.startDate &&
//       formData.endDate &&
//       new Date(formData.startDate) > new Date(formData.endDate)
//     ) {
//       newErrors.endDate = "End date must be after start date";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }
//     console.log(JSON.stringify(formData));

//     // Form is valid, proceed with submission
//     const payload = {
//       ...formData, // Includes all predefined fields
//       ...customFields, // Includes dynamic custom fields
//     };

//     console.log("Form submitted:", JSON.stringify(payload));
//     try {
//       console.log("Submitting contract form with payload:", payload);

//       const response = await fetch(
//         "http://localhost:5000/api/contracts/createContract",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//           credentials: "include",
//         }
//       );

//       console.log("Response status:", response.status);
//       const responseData = await response.json();
//       console.log("Response data:", responseData);

//       if (response.ok) {
//         console.log("Form submitted successfully");
//       } else {
//         console.error("Failed to submit form. Server response:", responseData);
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//     // Navigate back to dashboard
//     // router.push("/dashboard");
//   };

//   return (
//     <div className='min-h-screen bg-gray-50'>
//       <Navbar />
//       <main className='pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12'>
//         {/* Header */}
//         <div className='flex items-center gap-4 mb-6'>
//           <button
//             onClick={() => router.push("/dashboard")}
//             className='inline-flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
//           >
//             <ArrowLeftIcon className='h-5 w-5 text-gray-600' />
//           </button>
//           <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
//             Create New Contract
//           </h1>
//         </div>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className='bg-white rounded-xl shadow-lg p-4 sm:p-6'
//         >
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
//             {/* Contract Category */}
//             <div>
//               <label
//                 htmlFor='contractCategory'
//                 className='block text-sm font-medium text-gray-700 mb-1'
//               >
//                 Contract Category*
//               </label>
//               <select
//                 id='contractCategory'
//                 name='contractCategory'
//                 value={formData.contractCategory}
//                 onChange={handleChange}
//                 className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.contractCategory ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value=''>Select a category</option>
//                 <option value='Service'>Service</option>
//                 <option value='Employment'>Employment</option>
//                 <option value='Sales'>Sales</option>
//                 <option value='Rental'>Rental</option>
//                 <option value='License'>License</option>
//                 <option value='Partnership'>Partnership</option>
//                 <option value='Other'>Other</option>
//               </select>
//               {errors.contractCategory && (
//                 <p className='mt-1 text-sm text-red-500'>
//                   {errors.contractCategory}
//                 </p>
//               )}
//             </div>

//             {/* Contract Value */}
//             <div>
//               <label
//                 htmlFor='contractValue'
//                 className='block text-sm font-medium text-gray-700 mb-1'
//               >
//                 Contract Value
//               </label>
//               <input
//                 type='text'
//                 id='contractValue'
//                 name='contractValue'
//                 value={formData.contractValue}
//                 onChange={handleChange}
//                 placeholder='Enter contract value'
//                 className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
//               />
//               <p className='mt-1 text-xs text-gray-500'>
//                 {!formData.contractValue &&
//                   "If no value is specified, N/A will be displayed"}
//               </p>
//             </div>

//             {/* Contractor Name */}
//             <div>
//               <label
//                 htmlFor='contractor'
//                 className='block text-sm font-medium text-gray-700 mb-1'
//               >
//                 Contractor Name*
//               </label>
//               <input
//                 type='text'
//                 id='contractor'
//                 name='contractor'
//                 value={formData.contractor}
//                 onChange={handleChange}
//                 placeholder='Enter contractor name'
//                 className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.contractor ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.contractor && (
//                 <p className='mt-1 text-sm text-red-500'>{errors.contractor}</p>
//               )}
//             </div>

//             {/* Contractee Name */}
//             <div>
//               <label
//                 htmlFor='contractee'
//                 className='block text-sm font-medium text-gray-700 mb-1'
//               >
//                 Contractee Name*
//               </label>
//               <input
//                 type='text'
//                 id='contractee'
//                 name='contractee'
//                 value={formData.contractee}
//                 onChange={handleChange}
//                 placeholder='Enter contractee name'
//                 className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.contractee ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.contractee && (
//                 <p className='mt-1 text-sm text-red-500'>{errors.contractee}</p>
//               )}
//             </div>

//             {/* Contractor Email */}
//             <div>
//               <label
//                 htmlFor='contractorEmail'
//                 className='block text-sm font-medium text-gray-700 mb-1'
//               >
//                 Contractor Email*
//               </label>
//               <input
//                 type='email'
//                 id='contractorEmail'
//                 name='contractorEmail'
//                 value={formData.contractorEmail}
//                 onChange={handleChange}
//                 placeholder='Enter contractor email'
//                 className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.contractorEmail ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.contractorEmail && (
//                 <p className='mt-1 text-sm text-red-500'>
//                   {errors.contractorEmail}
//                 </p>
//               )}
//             </div>

//             {/* Contractee Email */}
//             <div>
//               <label
//                 htmlFor='contracteeEmail'
//                 className='block text-sm font-medium text-gray-700 mb-1'
//               >
//                 Contractee Email*
//               </label>
//               <input
//                 type='email'
//                 id='contracteeEmail'
//                 name='contracteeEmail'
//                 value={formData.contracteeEmail}
//                 onChange={handleChange}
//                 placeholder='Enter contractee email'
//                 className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.contracteeEmail ? "border-red-500" : "border-gray-300"
//                 }`}
//               />
//               {errors.contracteeEmail && (
//                 <p className='mt-1 text-sm text-red-500'>
//                   {errors.contracteeEmail}
//                 </p>
//               )}
//             </div>

//             {/* Creation Date */}
//             <div>
//               <label
//                 htmlFor='creationDate'
//                 className='block text-sm font-medium text-gray-700 mb-1'
//               >
//                 Creation Date
//               </label>
//               <div className='relative'>
//                 <input
//                   type='date'
//                   id='creationDate'
//                   name='creationDate'
//                   value={formData.contractCreationDate}
//                   onChange={handleChange}
//                   readOnly
//                   className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 cursor-not-allowed'
//                 />
//                 <CalendarIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
//               </div>
//               <p className='mt-1 text-xs text-gray-500'>
//                 Auto-generated from system date
//               </p>
//             </div>

//             {/* Start Date */}
//             <div>
//               <label
//                 htmlFor='startDate'
//                 className='block text-sm font-medium text-gray-700 mb-1'
//               >
//                 Start Date*
//               </label>
//               <div className='relative'>
//                 <input
//                   type='date'
//                   id='startDate'
//                   name='startDate'
//                   value={formData.startDate}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.startDate ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 <CalendarIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
//               </div>
//               {errors.startDate && (
//                 <p className='mt-1 text-sm text-red-500'>{errors.startDate}</p>
//               )}
//             </div>

//             {/* End Date */}
//             <div>
//               <label
//                 htmlFor='endDate'
//                 className='block text-sm font-medium text-gray-700 mb-1'
//               >
//                 End Date*
//               </label>
//               <div className='relative'>
//                 <input
//                   type='date'
//                   id='endDate'
//                   name='endDate'
//                   value={formData.endDate}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.endDate ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 <CalendarIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
//               </div>
//               {errors.endDate && (
//                 <p className='mt-1 text-sm text-red-500'>{errors.endDate}</p>
//               )}
//             </div>
//           </div>

//           {/* Description */}
//           <div className='mt-6'>
//             <label
//               htmlFor='contractDescription'
//               className='block text-sm font-medium text-gray-700 mb-1'
//             >
//               Description
//             </label>
//             <textarea
//               id='contractDescription'
//               name='contractDescription'
//               value={formData.contractDescription}
//               onChange={handleChange}
//               rows={4}
//               placeholder='Enter contract description'
//               className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
//             ></textarea>
//             <p className='mt-1 text-xs text-gray-500'>
//               {wordCount} / 30 words {wordCount > 30 ? "(Exceeds limit)" : ""}
//               <br />
//               Please keep the description concise within 30 words
//             </p>
//           </div>

//           {/* Custom Fields */}
//           <div className='mt-6'>
//             <div className='flex justify-between items-center mb-2'>
//               <h3 className='text-lg font-medium text-gray-800'>
//                 Custom Fields
//               </h3>
//               <button
//                 type='button'
//                 onClick={addCustomField}
//                 className='inline-flex items-center justify-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
//               >
//                 <PlusIcon className='h-4 w-4' />
//                 Add Field
//               </button>
//             </div>

//             {customFields.length === 0 && (
//               <p className='text-sm text-gray-500 italic'>
//                 No custom fields added yet
//               </p>
//             )}

//             <div className='space-y-3 mt-3'>
//               {customFields.map((field, index) => (
//                 <div key={index} className='flex items-center gap-3'>
//                   <div className='flex-1'>
//                     <input
//                       type='text'
//                       value={field.field}
//                       onChange={(e) =>
//                         updateCustomField(index, "field", e.target.value)
//                       }
//                       placeholder='Field name'
//                       className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
//                     />
//                   </div>
//                   <div className='flex-1'>
//                     <input
//                       type='text'
//                       value={field.value}
//                       onChange={(e) =>
//                         updateCustomField(index, "value", e.target.value)
//                       }
//                       placeholder='Field value'
//                       className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
//                     />
//                   </div>
//                   <button
//                     type='button'
//                     onClick={() => removeCustomField(index)}
//                     className='p-2 text-gray-400 hover:text-red-500 focus:outline-none'
//                   >
//                     <XIcon className='h-5 w-5' />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className='mt-8'>
//             <h3 className='text-lg font-medium text-gray-800 mb-4'>
//               Signatures
//             </h3>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//               {/* Contractor Signature */}
//               <div className='border rounded-lg p-4'>
//                 <p className='text-sm font-medium text-gray-700 mb-2'>
//                   Contractor Signature
//                 </p>
//                 {formData.contractorSignature ? (
//                   <div className='relative'>
//                     <img
//                       src={formData.contractorSignature}
//                       alt='Contractor Signature'
//                       className='max-h-24 border rounded-md'
//                     />
//                     <button
//                       onClick={() => removeSignature("contractor")}
//                       className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600'
//                     >
//                       <XIcon className='h-4 w-4' />
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     type='button'
//                     onClick={() => openSignatureModal("contractor")}
//                     className='w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors'
//                   >
//                     <span className='text-blue-600 font-medium'>
//                       + Add Signature
//                     </span>
//                   </button>
//                 )}
//                 {errors.contractorSignature && (
//                   <p className='mt-1 text-sm text-red-500'>
//                     {errors.contractorSignature}
//                   </p>
//                 )}
//               </div>

//               {/* Contractee Signature */}
//               {/* <div className='border rounded-lg p-4'>
//                 <p className='text-sm font-medium text-gray-700 mb-2'>
//                   Contractee Signature
//                 </p>
//                 {formData.contracteeSignature ? (
//                   <div className='relative'>
//                     <img
//                       src={formData.contracteeSignature}
//                       alt='Contractee Signature'
//                       className='max-h-24 border rounded-md'
//                     />
//                     <button
//                       onClick={() => removeSignature("contractee")}
//                       className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600'
//                     >
//                       <XIcon className='h-4 w-4' />
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     type='button'
//                     onClick={() => openSignatureModal("contractee")}
//                     className='w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors'
//                   >
//                     <span className='text-blue-600 font-medium'>
//                       + Add Signature
//                     </span>
//                   </button>
//                 )}
//                 {errors.contracteeSignature && (
//                   <p className='mt-1 text-sm text-red-500'>
//                     {errors.contracteeSignature}
//                   </p>
//                 )}
//               </div> */}
//             </div>
//           </div>

//           {/* Submit Buttons */}
//           <div className='mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4'>
//             <button
//               type='submit'
//               className='flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md flex items-center justify-center gap-2'
//             >
//               <SaveIcon className='h-5 w-5' />
//               Create Contract
//             </button>
//             <button
//               type='button'
//               onClick={() => router.push("/dashboard")}
//               className='flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2'
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </main>
//       <SignatureModal
//         isOpen={isSignatureModalOpen}
//         onClose={() => setIsSignatureModalOpen(false)}
//         onSignatureSave={handleSignatureSave}
//       />
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  PlusIcon,
  SaveIcon,
  ArrowLeftIcon,
  XIcon,
} from "lucide-react";
import Navbar from "../components/dashboard/Navbar";
import SignatureModal from "../components/SignatureModal"; // Add this import
import { FileSignature } from "lucide-react"; // Add this to your imports
export default function CreateContractPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contractCategory: "",
    contractor: "",
    contractee: "",
    contractorEmail: "",
    contracteeEmail: "",
    contractValue: "",
    contractCreationDate: new Date().toISOString().split("T")[0],
    startDate: "",
    endDate: "",
    contractDescription: "",
    contractorSignature: {
      digital: "",
      photo: "",
    },
  });
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [wordCount, setWordCount] = useState(0);

  // Count words in description
  useEffect(() => {
    const words = formData.contractDescription.trim()
      ? formData.contractDescription.trim().split(/\s+/).length
      : 0;
    setWordCount(words);
  }, [formData.contractDescription]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  const saveSignature = (signatureImage, type = "digital") => {
    setFormData({
      ...formData,
      contractorSignature: {
        ...formData.contractorSignature,
        [type]: signatureImage,
      },
    });

    // Clear any signature error if it exists
    if (errors.signature) {
      setErrors({
        ...errors,
        signature: "",
      });
    }
  };
  const addCustomField = () => {
    setCustomFields([...customFields, { field: "", value: "" }]);
  };

  const updateCustomField = (index, key, value) => {
    const updatedFields = [...customFields];
    updatedFields[index][key] = value;
    setCustomFields(updatedFields);
  };

  const removeCustomField = (index) => {
    const updatedFields = [...customFields];
    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};

    if (!formData.contractCategory)
      newErrors.contractCategory = "Contract category is required";
    if (!formData.contractor)
      newErrors.contractor = "Contractor name is required";
    if (!formData.contractee)
      newErrors.contractee = "Contractee name is required";
    if (!formData.contractorEmail)
      newErrors.contractorEmail = "Contractor email is required";
    if (!formData.contracteeEmail)
      newErrors.contracteeEmail = "Contractee email is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (
      !formData.contractorSignature.digital &&
      !formData.contractorSignature.photo
    ) {
      newErrors.signature = "Signature is required";
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      formData.contractorEmail &&
      !emailRegex.test(formData.contractorEmail)
    ) {
      newErrors.contractorEmail = "Invalid email format";
    }
    if (
      formData.contracteeEmail &&
      !emailRegex.test(formData.contracteeEmail)
    ) {
      newErrors.contracteeEmail = "Invalid email format";
    }

    // Date validation
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log(JSON.stringify(formData));

    // Form is valid, proceed with submission
    const payload = {
      ...formData, // Includes all predefined fields
      ...customFields, // Includes dynamic custom fields
    };

    console.log("Form submitted:", JSON.stringify(payload));
    try {
      console.log("Submitting contract form with payload:", payload);

      const response = await fetch(
        "http://localhost:5000/api/contracts/createContract",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        console.log("Form submitted successfully");
      } else {
        console.error("Failed to submit form. Server response:", responseData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    // Navigate back to dashboard
    // router.push("/dashboard");
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-6'>
          <button
            onClick={() => router.push("/dashboard")}
            className='inline-flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
          >
            <ArrowLeftIcon className='h-5 w-5 text-gray-600' />
          </button>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Create New Contract
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-xl shadow-lg p-4 sm:p-6'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
            {/* Contract Category */}
            <div>
              <label
                htmlFor='contractCategory'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contract Category*
              </label>
              <select
                id='contractCategory'
                name='contractCategory'
                value={formData.contractCategory}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contractCategory ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value=''>Select a category</option>
                <option value='Service'>Service</option>
                <option value='Employment'>Employment</option>
                <option value='Sales'>Sales</option>
                <option value='Rental'>Rental</option>
                <option value='License'>License</option>
                <option value='Partnership'>Partnership</option>
                <option value='Other'>Other</option>
              </select>
              {errors.contractCategory && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.contractCategory}
                </p>
              )}
            </div>

            {/* Contract Value */}
            <div>
              <label
                htmlFor='contractValue'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contract Value
              </label>
              <input
                type='text'
                id='contractValue'
                name='contractValue'
                value={formData.contractValue}
                onChange={handleChange}
                placeholder='Enter contract value'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <p className='mt-1 text-xs text-gray-500'>
                {!formData.contractValue &&
                  "If no value is specified, N/A will be displayed"}
              </p>
            </div>

            {/* Contractor Name */}
            <div>
              <label
                htmlFor='contractor'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contractor Name*
              </label>
              <input
                type='text'
                id='contractor'
                name='contractor'
                value={formData.contractor}
                onChange={handleChange}
                placeholder='Enter contractor name'
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contractor ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contractor && (
                <p className='mt-1 text-sm text-red-500'>{errors.contractor}</p>
              )}
            </div>

            {/* Contractee Name */}
            <div>
              <label
                htmlFor='contractee'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contractee Name*
              </label>
              <input
                type='text'
                id='contractee'
                name='contractee'
                value={formData.contractee}
                onChange={handleChange}
                placeholder='Enter contractee name'
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contractee ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contractee && (
                <p className='mt-1 text-sm text-red-500'>{errors.contractee}</p>
              )}
            </div>

            {/* Contractor Email */}
            <div>
              <label
                htmlFor='contractorEmail'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contractor Email*
              </label>
              <input
                type='email'
                id='contractorEmail'
                name='contractorEmail'
                value={formData.contractorEmail}
                onChange={handleChange}
                placeholder='Enter contractor email'
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contractorEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contractorEmail && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.contractorEmail}
                </p>
              )}
            </div>

            {/* Contractee Email */}
            <div>
              <label
                htmlFor='contracteeEmail'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Contractee Email*
              </label>
              <input
                type='email'
                id='contracteeEmail'
                name='contracteeEmail'
                value={formData.contracteeEmail}
                onChange={handleChange}
                placeholder='Enter contractee email'
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contracteeEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contracteeEmail && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.contracteeEmail}
                </p>
              )}
            </div>

            {/* Creation Date */}
            <div>
              <label
                htmlFor='creationDate'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Creation Date
              </label>
              <div className='relative'>
                <input
                  type='date'
                  id='creationDate'
                  name='creationDate'
                  value={formData.contractCreationDate}
                  onChange={handleChange}
                  readOnly
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-gray-100 cursor-not-allowed'
                />
                <CalendarIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
              </div>
              <p className='mt-1 text-xs text-gray-500'>
                Auto-generated from system date
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor='startDate'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Start Date*
              </label>
              <div className='relative'>
                <input
                  type='date'
                  id='startDate'
                  name='startDate'
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <CalendarIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
              </div>
              {errors.startDate && (
                <p className='mt-1 text-sm text-red-500'>{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor='endDate'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                End Date*
              </label>
              <div className='relative'>
                <input
                  type='date'
                  id='endDate'
                  name='endDate'
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <CalendarIcon className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
              </div>
              {errors.endDate && (
                <p className='mt-1 text-sm text-red-500'>{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className='mt-6'>
            <label
              htmlFor='contractDescription'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Description
            </label>
            <textarea
              id='contractDescription'
              name='contractDescription'
              value={formData.contractDescription}
              onChange={handleChange}
              rows={4}
              placeholder='Enter contract description'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            ></textarea>
            <p className='mt-1 text-xs text-gray-500'>
              {wordCount} / 30 words {wordCount > 30 ? "(Exceeds limit)" : ""}
              <br />
              Please keep the description concise within 30 words
            </p>
          </div>

          {/* Custom Fields */}
          <div className='mt-6'>
            <div className='flex justify-between items-center mb-2'>
              <h3 className='text-lg font-medium text-gray-800'>
                Custom Fields
              </h3>
              <button
                type='button'
                onClick={addCustomField}
                className='inline-flex items-center justify-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <PlusIcon className='h-4 w-4' />
                Add Field
              </button>
            </div>

            {customFields.length === 0 && (
              <p className='text-sm text-gray-500 italic'>
                No custom fields added yet
              </p>
            )}

            <div className='space-y-3 mt-3'>
              {customFields.map((field, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <div className='flex-1'>
                    <input
                      type='text'
                      value={field.field}
                      onChange={(e) =>
                        updateCustomField(index, "field", e.target.value)
                      }
                      placeholder='Field name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div className='flex-1'>
                    <input
                      type='text'
                      value={field.value}
                      onChange={(e) =>
                        updateCustomField(index, "value", e.target.value)
                      }
                      placeholder='Field value'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => removeCustomField(index)}
                    className='p-2 text-gray-400 hover:text-red-500 focus:outline-none'
                  >
                    <XIcon className='h-5 w-5' />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Signature Section */}
          <div className='mt-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Your Signature*
            </label>
            <div className='border rounded-lg border-gray-300 p-4'>
              {formData.contractorSignature.digital ||
              formData.contractorSignature.photo ? (
                <div className='flex items-center justify-between'>
                  <div>
                    <img
                      src={
                        formData.contractorSignature.digital ||
                        formData.contractorSignature.photo
                      }
                      alt='Your signature'
                      className='h-16 border rounded p-1'
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => setShowSignatureModal(true)}
                    className='text-sm text-blue-600 hover:text-blue-800'
                  >
                    Change Signature
                  </button>
                </div>
              ) : (
                <button
                  type='button'
                  onClick={() => setShowSignatureModal(true)}
                  className='flex items-center gap-2 text-blue-600 hover:text-blue-800 py-2 px-3 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors'
                >
                  <FileSignature className='h-5 w-5' />
                  Add Signature
                </button>
              )}
              {errors.signature && (
                <p className='mt-1 text-sm text-red-500'>{errors.signature}</p>
              )}
            </div>
          </div>
          {/* Submit Buttons */}
          <div className='mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4'>
            <button
              type='submit'
              className='flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md flex items-center justify-center gap-2'
            >
              <SaveIcon className='h-5 w-5' />
              Create Contract
            </button>
            <button
              type='button'
              onClick={() => router.push("/dashboard")}
              className='flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2'
            >
              Cancel
            </button>
          </div>
          {/* Signature Modal */}
          <SignatureModal
            isOpen={showSignatureModal}
            onClose={() => setShowSignatureModal(false)}
            onSave={saveSignature}
          />
        </form>
      </main>
    </div>
  );
}
