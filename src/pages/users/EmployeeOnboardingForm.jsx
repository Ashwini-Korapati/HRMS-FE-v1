// import React, { useState, useEffect } from 'react';
// import { 
//   User,
//   Briefcase, 
//   DollarSign, 
//   FileText,
//   Upload,
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   ArrowRight
// } from 'lucide-react';

// const EmployeeOnboardingForm = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   const steps = [
//     { key: "personal", label: "Personal", icon: User },
//     { key: "job", label: "Job", icon: Briefcase },
//     { key: "compensation", label: "Compensation", icon: DollarSign },
//     { key: "statutory", label: "Statutory", icon: FileText },
//     { key: "documents", label: "Documents", icon: Upload }
//   ];

//   const formSections = {
//     personal: {
//       title: "Personal Information",
//       groups: [
//         {
//           title: "Basic Information",
//           fields: [
//             { label: "First Name", key: "firstName", type: "text", required: true },
//             { label: "Last Name", key: "lastName", type: "text" },
//             { label: "Email", key: "email", type: "email", required: true },
//             { label: "Phone Number", key: "phoneNumber", type: "text", required: true },
//             { label: "Date of Birth", key: "dob", type: "date", required: true },
//             { label: "Gender", key: "gender", type: "select", options: ["Female", "Male", "Non-binary", "Prefer not to say"], required: true },
//             { label: "Father's Name", key: "fathersName", type: "text" }
//           ]
//         },
//         {
//           title: "Contact & Emergency Information",
//           fields: [
//             { label: "Spouse Name", key: "spouseName", type: "text" },
//             { label: "Aadhar Number", key: "aadharNo", type: "text" },
//             { label: "Emergency Contact Name", key: "emergencyContactName", type: "text" },
//             { label: "Emergency Contact Number", key: "emergencyContactNumber", type: "text" }
//           ]
//         }
//       ]
//     },
//     job: {
//       title: "Job Information",
//       groups: [
//         {
//           title: "Employment Details",
//           fields: [
//             { label: "Employee Number Series", key: "empNumberSeries", type: "text" },
//             { label: "Employee ID", key: "emp_id", type: "text", required: true },
//             { label: "Department", key: "department", type: "select", options: ["Engineering", "Marketing", "HR", "Finance", "Sales", "Operations"], required: true },
//             { label: "Designation", key: "designation", type: "select", options: ["Intern", "Junior", "Senior", "Lead", "Manager", "Director"], required: true },
//             { label: "Role", key: "role", type: "select", options: ["Engineer", "Designer", "HR Executive", "Accountant", "Sales Rep", "Operations Associate"], required: true },
//             { label: "Reporting To", key: "reporting_to", type: "text" }
//           ]
//         },
//         {
//           title: "Job Terms",
//           fields: [
//             { label: "Date of Joining", key: "dateOfJoining", type: "date", required: true },
//             { label: "Probation Period (months)", key: "probationPeriod", type: "number" },
//             { label: "Confirmation Date", key: "confirmationDate", type: "date" },
//             { label: "Employment Type", key: "employmentType", type: "select", options: ["Full-time", "Part-time", "Contract", "Intern"] },
//             { label: "Status", key: "status", type: "select", options: ["Active", "On Probation", "On Leave", "Inactive"], required: true },
//             { label: "Cost Center", key: "costCenter", type: "text" },
//             { label: "Location", key: "location", type: "select", options: ["HQ", "Remote", "Onsite - Plant 1", "Onsite - Plant 2"] },
//             { label: "Company", key: "company", type: "select", options: ["Your Company"] },
//             { label: "Referred By", key: "referredBy", type: "text" }
//           ]
//         }
//       ]
//     },
//     compensation: {
//       title: "Compensation Details",
//       fields: [
//         { label: "Base Salary", key: "salary", type: "number", required: true },
//         { label: "Currency", key: "currency", type: "select", options: ["USD", "EUR", "GBP", "INR"], required: true },
//         { label: "Pay Schedule", key: "paySchedule", type: "select", options: ["Monthly", "Bi-Weekly", "Weekly"], required: true },
//         { label: "Payment Mode", key: "paymentMode", type: "select", options: ["Bank Transfer", "Cash", "Cheque", "UPI"], required: true },
//         { label: "Bank Name", key: "bankName", type: "text" },
//         { label: "Bank Branch", key: "bankBranch", type: "text" },
//         { label: "Bank Account Number", key: "bankAccountNumber", type: "text" }
//       ]
//     },
//     statutory: {
//       title: "Statutory Information",
//       fields: [
//         { label: "PAN Number", key: "panNumber", type: "text" },
//         { label: "Aadhar Number", key: "aadharNo", type: "text" },
//         { label: "Statutory Includes", key: "statutoryIncludes", type: "multiselect", options: ["PF", "ESI", "Gratuity", "LWF"] },
//         { label: "PF Number", key: "pfNumber", type: "text" },
//         { label: "UAN Number", key: "uanNumber", type: "text" },
//         { label: "ESI Number", key: "esiNumber", type: "text" },
//         { label: "PF Nominee Name", key: "pfNomineeName", type: "text" },
//         { label: "PF Nominee DOB", key: "pfNomineeDob", type: "date" }
//       ]
//     },
//     documents: {
//       title: "Documents Upload",
//       fields: [
//         { label: "Resume", key: "resume", type: "file", required: true },
//         { label: "ID Proof", key: "idProof", type: "file", required: true }
//       ]
//     }
//   };

//   const handleInputChange = (key, value) => {
//     setFormData(prev => ({ ...prev, [key]: value }));
//     if (errors[key]) {
//       setErrors(prev => ({ ...prev, [key]: null }));
//     }
//   };

//   const handleMultiSelectChange = (key, option) => { 
//     const currentValues = formData[key] || [];
//     const newValues = currentValues.includes(option)
//       ? currentValues.filter(v => v !== option)
//       : [...currentValues, option];
//     handleInputChange(key, newValues);
//   };

//   const validateCurrentStep = () => {
//     const currentStepKey = steps[currentStep].key;
//     const currentSection = formSections[currentStepKey];
//     const newErrors = {};

//     // For sections with groups
//     if (currentSection.groups) {
//       currentSection.groups.forEach(group => {
//         group.fields.forEach(field => {
//           if (field.required && (!formData[field.key] || formData[field.key] === '')) {
//             newErrors[field.key] = 'This field is required';
//           }
//         });
//       });
//     } else {
//       // For other sections with direct fields
//       currentSection.fields.forEach(field => {
//         if (field.required && (!formData[field.key] || formData[field.key] === '')) {
//           newErrors[field.key] = 'This field is required';
//         }
//       });
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (validateCurrentStep() && currentStep < steps.length - 1) {
//       setIsTransitioning(true);
//       setTimeout(() => {
//         setCurrentStep(currentStep + 1);
//         setIsTransitioning(false);
//       }, 150);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 0) {
//       setIsTransitioning(true);
//       setTimeout(() => {
//         setCurrentStep(currentStep - 1);
//         setIsTransitioning(false);
//       }, 150);
//     }
//   };

//   const handleSubmit = () => {
//     if (validateCurrentStep()) {
//       console.log('Form Data:', formData);
//       alert('Employee onboarding completed successfully!');
//     }
//   };

//   const renderField = (field) => {
//     const hasError = errors[field.key];
//     const baseInputClasses = `w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//       hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//     }`;

//     switch (field.type) {
//       case 'select':
//         return (
//           <div key={field.key} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {field.label} {field.required && <span className="text-red-500">*</span>}
//             </label>
//             <select
//               value={formData[field.key] || ''}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               className={baseInputClasses}
//             >
//               <option value="">Select {field.label}</option>
//               {field.options?.map(option => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </select>
//             {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
//               {hasError}
//             </p>}
//           </div>
//         );

//       case 'multiselect':
//         return (
//           <div key={field.key} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {field.label} {field.required && <span className="text-red-500">*</span>}
//             </label>
//             <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
//               {field.options?.map(option => (
//                 <label key={option} className="flex items-center space-x-3 mb-3 last:mb-0 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
//                   <input
//                     type="checkbox"
//                     checked={(formData[field.key] || []).includes(option)}
//                     onChange={() => handleMultiSelectChange(field.key, option)}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
//                   />
//                   <span className="text-sm font-medium text-gray-700">{option}</span>
//                 </label>
//               ))}
//             </div>
//             {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
//               {hasError}
//             </p>}
//           </div>
//         );

//       case 'file':
//         return (
//           <div key={field.key} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {field.label} {field.required && <span className="text-red-500">*</span>}
//             </label>
//             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <div className="mt-4">
//                 <label className="cursor-pointer">
//                   <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 font-medium transform hover:-translate-y-0.5">
//                     Choose File
//                   </span>
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) => handleInputChange(field.key, e.target.files[0])}
//                   />
//                 </label>
//                 <p className="text-sm text-gray-500 mt-3">
//                   {formData[field.key] ? formData[field.key].name : 'No file chosen'}
//                 </p>
//               </div>
//             </div>
//             {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
//               {hasError}
//             </p>}
//           </div>
//         );

//       case 'textarea':
//         return (
//           <div key={field.key} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {field.label} {field.required && <span className="text-red-500">*</span>}
//             </label>
//             <textarea
//               value={formData[field.key] || ''}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               className={`${baseInputClasses} min-h-[120px] resize-none`}
//               placeholder={`Enter ${field.label.toLowerCase()}`}
//               rows={4}
//             />
//             {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
//               {hasError}
//             </p>}
//           </div>
//         );

//       default:
//         return (
//           <div key={field.key} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {field.label} {field.required && <span className="text-red-500">*</span>}
//             </label>
//             <input
//               type={field.type}
//               value={formData[field.key] || ''}
//               onChange={(e) => handleInputChange(field.key, e.target.value)}
//               className={baseInputClasses}
//               placeholder={`Enter ${field.label.toLowerCase()}`}
//             />
//             {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
//               {hasError}
//             </p>}
//           </div>
//         );
//     }
//   };

//   const renderStepContent = () => {
//     const currentStepKey = steps[currentStep].key;
//     const currentSection = formSections[currentStepKey];

//     return (
//       <div className={`transition-all duration-300 ease-in-out ${
//         isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
//       }`}>
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             {currentSection.title}
//           </h2>
//           <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
//         </div>

//         {currentSection.groups ? (
//           // Sections with groups (Personal and Job)
//           <div className="space-y-8">
//             {currentSection.groups.map((group, groupIndex) => (
//               <div key={groupIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//                   {group.title}
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {group.fields.map(renderField)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           // Other sections with direct fields
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {currentSection.fields.map(renderField)}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const saveDraft = () => {
//     const draftData = {
//       formData,
//       currentStep,
//       timestamp: new Date().toISOString()
//     };
//     console.log('Draft saved:', draftData);
//     alert('Draft saved successfully!');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-12">
//           <div className="flex justify-between items-center mb-8">
//             <div className="text-center flex-1">
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
//                 Employee Onboarding
//               </h1>
//               <p className="text-gray-600 text-lg">Create a new employee in 5 guided steps</p>
//             </div>
//             <button 
//               onClick={saveDraft}
//               className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium"
//             >
//               Save Draft
//             </button>
//           </div>
//         </div>

//         {/* Animated Progress Stepper */}
//         <div className="mb-12">
//           <div className="flex items-center justify-between relative">
//             {/* Progress Line */}
//             <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
//               <div 
//                 className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
//                 style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
//               />
//             </div>

//             {steps.map((step, index) => {
//               const Icon = step.icon;
//               const isActive = index === currentStep;
//               const isCompleted = index < currentStep;
              
//               return (
//                 <div key={step.key} className="flex flex-col items-center relative">
//                   <div className={`
//                     flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 transform
//                     ${isCompleted 
//                       ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500 text-white scale-110' 
//                       : isActive 
//                         ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 text-white scale-110 shadow-lg' 
//                         : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
//                     }
//                   `}>
//                     {isCompleted ? (
//                       <Check className="w-5 h-5" />
//                     ) : (
//                       <Icon className="w-5 h-5" />
//                     )}
//                   </div>
                  
//                   <span className={`
//                     mt-3 text-sm font-medium transition-colors duration-300
//                     ${isActive 
//                       ? 'text-blue-600' 
//                       : isCompleted 
//                         ? 'text-green-600' 
//                         : 'text-gray-500'
//                     }
//                   `}>
//                     {step.label}
//                   </span>

//                   {/* Active step indicator */}
//                   {isActive && (
//                     <div className="absolute -bottom-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="mb-8">
//           {renderStepContent()}
//         </div>

//         {/* Navigation */}
//         <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <button
//             onClick={prevStep}
//             disabled={currentStep === 0}
//             className={`
//               flex items-center px-6 py-3 rounded-xl transition-all duration-200 font-medium
//               ${currentStep === 0 
//                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md transform hover:-translate-y-0.5'
//               }
//             `}
//           >
//             <ChevronLeft className="w-4 h-4 mr-2" />
//             Previous
//           </button>

//           <div className="text-center">
//             <span className="text-sm text-gray-500">
//               Step {currentStep + 1} of {steps.length}
//             </span>
//           </div>

//           <button
//             onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
//             className="
//               flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
//               rounded-xl hover:shadow-lg transition-all duration-200 font-medium
//               transform hover:-translate-y-0.5 hover:scale-105
//             "
//           >
//             {currentStep === steps.length - 1 ? 'Complete Onboarding' : 'Next Step'}
//             {currentStep !== steps.length - 1 ? (
//               <ChevronRight className="w-4 h-4 ml-2" />
//             ) : (
//               <ArrowRight className="w-4 h-4 ml-2" />
//             )}
//           </button>
//         </div>

//         {/* Progress Summary */}
//         <div className="mt-8 text-center">
//           <div className="inline-flex items-center space-x-4 bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-3">
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//               <span className="text-sm text-gray-600">Completed: {currentStep}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//               <span className="text-sm text-gray-600">Current: Step {currentStep + 1}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
//               <span className="text-sm text-gray-600">Remaining: {steps.length - currentStep - 1}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeOnboardingForm;


// EmployeeOnboardingForm.js
import React, { useEffect } from 'react';
import { 
  User,
  Briefcase, 
  DollarSign, 
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  X,
  Loader
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCurrentStep,
  updateFormData,
  setErrors,
  setIsTransitioning,
  clearError,
  createEmployee,
  clearSuccess,
} from '../../features/onboardingSlice'
import { useParams } from 'react-router-dom';

const EmployeeOnboardingForm = () => {
  const dispatch = useDispatch();
  const { companyId } = useParams();
  const { currentStep, formData, errors, isTransitioning, loading, success, error } = useSelector(state => state.onboarding);

  const steps = [
    { key: "personal", label: "Personal", icon: User },
    { key: "job", label: "Job", icon: Briefcase },
    { key: "compensation", label: "Compensation", icon: DollarSign },
    { key: "statutory", label: "Statutory", icon: FileText },
    { key: "documents", label: "Documents", icon: Upload }
  ];

  const formSections = {
    personal: {
      title: "Personal Information",
      groups: [
        {
          title: "Basic Information",
          fields: [
            { label: "First Name", key: "firstName", type: "text", required: true },
            { label: "Last Name", key: "lastName", type: "text" },
            { label: "Email", key: "email", type: "email", required: true },
            { label: "Phone Number", key: "phoneNumber", type: "text", required: true },
            { label: "Date of Birth", key: "dob", type: "date", required: true },
            { label: "Gender", key: "gender", type: "select", options: ["Female", "Male", "Non-binary", "Prefer not to say"], required: true },
            { label: "Father's Name", key: "fathersName", type: "text" }
          ]
        },
        {
          title: "Contact & Emergency Information",
          fields: [
            { label: "Spouse Name", key: "spouseName", type: "text" },
            { label: "Aadhar Number", key: "aadharNo", type: "text" },
            { label: "Emergency Contact Name", key: "emergencyContactName", type: "text" },
            { label: "Emergency Contact Number", key: "emergencyContactNumber", type: "text" }
          ]
        }
      ]
    },
    job: {
      title: "Job Information",
      groups: [
        {
          title: "Employment Details",
          fields: [
            { label: "Employee Number Series", key: "empNumberSeries", type: "text" },
            { label: "Employee ID", key: "emp_id", type: "text", required: true },
            { label: "Department", key: "department", type: "select", options: ["Engineering", "Marketing", "HR", "Finance", "Sales", "Operations"], required: true },
            { label: "Designation", key: "designation", type: "select", options: ["Intern", "Junior", "Senior", "Lead", "Manager", "Director"], required: true },
            { label: "Role", key: "role", type: "select", options: ["Engineer", "Designer", "HR Executive", "Accountant", "Sales Rep", "Operations Associate"], required: true },
            { label: "Reporting To", key: "reporting_to", type: "text" }
          ]
        },
        {
          title: "Job Terms",
          fields: [
            { label: "Date of Joining", key: "dateOfJoining", type: "date", required: true },
            { label: "Probation Period (months)", key: "probationPeriod", type: "number" },
            { label: "Confirmation Date", key: "confirmationDate", type: "date" },
            { label: "Employment Type", key: "employmentType", type: "select", options: ["Full-time", "Part-time", "Contract", "Intern"] },
            { label: "Status", key: "status", type: "select", options: ["Active", "On Probation", "On Leave", "Inactive"], required: true },
            { label: "Cost Center", key: "costCenter", type: "text" },
            { label: "Location", key: "location", type: "select", options: ["HQ", "Remote", "Onsite - Plant 1", "Onsite - Plant 2"] },
            { label: "Company", key: "company", type: "select", options: ["Your Company"] },
            { label: "Referred By", key: "referredBy", type: "text" }
          ]
        }
      ]
    },
    compensation: {
      title: "Compensation Details",
      fields: [
        { label: "Base Salary", key: "salary", type: "number", required: true },
        { label: "Currency", key: "currency", type: "select", options: ["USD", "EUR", "GBP", "INR"], required: true },
        { label: "Pay Schedule", key: "paySchedule", type: "select", options: ["Monthly", "Bi-Weekly", "Weekly"], required: true },
        { label: "Payment Mode", key: "paymentMode", type: "select", options: ["Bank Transfer", "Cash", "Cheque", "UPI"], required: true },
        { label: "Bank Name", key: "bankName", type: "text" },
        { label: "Bank Branch", key: "bankBranch", type: "text" },
        { label: "Bank Account Number", key: "bankAccountNumber", type: "text" }
      ]
    },
    statutory: {
      title: "Statutory Information",
      fields: [
        { label: "PAN Number", key: "panNumber", type: "text" },
        { label: "Aadhar Number", key: "aadharNo", type: "text" },
        { label: "Statutory Includes", key: "statutoryIncludes", type: "multiselect", options: ["PF", "ESI", "Gratuity", "LWF"] },
        { label: "PF Number", key: "pfNumber", type: "text" },
        { label: "UAN Number", key: "uanNumber", type: "text" },
        { label: "ESI Number", key: "esiNumber", type: "text" },
        { label: "PF Nominee Name", key: "pfNomineeName", type: "text" },
        { label: "PF Nominee DOB", key: "pfNomineeDob", type: "date" }
      ]
    },
    documents: {
      title: "Documents Upload",
      fields: [
        { label: "Resume", key: "resume", type: "file", required: true },
        { label: "ID Proof", key: "idProof", type: "file", required: true }
      ]
    }
  };

  useEffect(() => {
    // Clear success message after 5 seconds
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleInputChange = (key, value) => {
    dispatch(updateFormData({ [key]: value }));
    if (errors[key]) {
      dispatch(clearError({ key }));
    }
  };

  const handleMultiSelectChange = (key, option) => { 
    const currentValues = formData[key] || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter(v => v !== option)
      : [...currentValues, option];
    handleInputChange(key, newValues);
  };

  const validateCurrentStep = () => {
    const currentStepKey = steps[currentStep].key;
    const currentSection = formSections[currentStepKey];
    const newErrors = {};

    // For sections with groups
    if (currentSection.groups) {
      currentSection.groups.forEach(group => {
        group.fields.forEach(field => {
          if (field.required && (!formData[field.key] || formData[field.key] === '')) {
            newErrors[field.key] = 'This field is required';
          }
        });
      });
    } else {
      // For other sections with direct fields
      currentSection.fields.forEach(field => {
        if (field.required && (!formData[field.key] || formData[field.key] === '')) {
          newErrors[field.key] = 'This field is required';
        }
      });
    }

    dispatch(setErrors(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      dispatch(setIsTransitioning(true));
      setTimeout(() => {
        dispatch(setCurrentStep(currentStep + 1));
        dispatch(setIsTransitioning(false));
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      dispatch(setIsTransitioning(true));
      setTimeout(() => {
        dispatch(setCurrentStep(currentStep - 1));
        dispatch(setIsTransitioning(false));
      }, 150);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      // Prepare data for API
      const employeeData = {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dob: formData.dob,
          gender: formData.gender,
          fathersName: formData.fathersName,
          spouseName: formData.spouseName,
          aadharNo: formData.aadharNo,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactNumber: formData.emergencyContactNumber,
        },
        jobInfo: {
          empNumberSeries: formData.empNumberSeries,
          emp_id: formData.emp_id,
          department: formData.department,
          designation: formData.designation,
          role: formData.role,
          reporting_to: formData.reporting_to,
          dateOfJoining: formData.dateOfJoining,
          probationPeriod: formData.probationPeriod,
          confirmationDate: formData.confirmationDate,
          employmentType: formData.employmentType,
          status: formData.status,
          costCenter: formData.costCenter,
          location: formData.location,
          company: formData.company,
          referredBy: formData.referredBy,
        },
        compensation: {
          salary: formData.salary,
          currency: formData.currency,
          paySchedule: formData.paySchedule,
          paymentMode: formData.paymentMode,
          bankName: formData.bankName,
          bankBranch: formData.bankBranch,
          bankAccountNumber: formData.bankAccountNumber,
        },
        statutoryInfo: {
          panNumber: formData.panNumber,
          aadharNo: formData.aadharNo,
          statutoryIncludes: formData.statutoryIncludes,
          pfNumber: formData.pfNumber,
          uanNumber: formData.uanNumber,
          esiNumber: formData.esiNumber,
          pfNomineeName: formData.pfNomineeName,
          pfNomineeDob: formData.pfNomineeDob,
        },
        documents: {
          resume: formData.resume,
          idProof: formData.idProof,
        }
      };

      dispatch(createEmployee({ companyId, employeeData }));
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.key];
    const baseInputClasses = `w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
    }`;

    switch (field.type) {
      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={baseInputClasses}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
              {hasError}
            </p>}
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
              {field.options?.map(option => (
                <label key={option} className="flex items-center space-x-3 mb-3 last:mb-0 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={(formData[field.key] || []).includes(option)}
                    onChange={() => handleMultiSelectChange(field.key, option)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
              {hasError}
            </p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 font-medium transform hover:-translate-y-0.5">
                    Choose File
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleInputChange(field.key, e.target.files[0])}
                  />
                </label>
                <p className="text-sm text-gray-500 mt-3">
                  {formData[field.key] ? formData[field.key].name : 'No file chosen'}
                </p>
              </div>
            </div>
            {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
              {hasError}
            </p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={`${baseInputClasses} min-h-[120px] resize-none`}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              rows={4}
            />
            {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
              {hasError}
            </p>}
          </div>
        );

      default:
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={baseInputClasses}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {hasError && <p className="text-red-500 text-sm flex items-center mt-1">
              {hasError}
            </p>}
          </div>
        );
    }
  };

  const renderStepContent = () => {
    const currentStepKey = steps[currentStep].key;
    const currentSection = formSections[currentStepKey];

    return (
      <div className={`transition-all duration-300 ease-in-out ${
        isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
      }`}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentSection.title}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>

        {currentSection.groups ? (
          // Sections with groups (Personal and Job)
          <div className="space-y-8">
            {currentSection.groups.map((group, groupIndex) => (
              <div key={groupIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.fields.map(renderField)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Other sections with direct fields
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSection.fields.map(renderField)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const saveDraft = () => {
    const draftData = {
      formData,
      currentStep,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('employeeOnboardingDraft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  };

  const loadDraft = () => {
    const draftData = localStorage.getItem('employeeOnboardingDraft');
    if (draftData) {
      const { formData: draftFormData, currentStep: draftCurrentStep } = JSON.parse(draftData);
      dispatch(updateFormData(draftFormData));
      dispatch(setCurrentStep(draftCurrentStep));
      alert('Draft loaded successfully!');
    } else {
      alert('No draft found!');
    }
  };

  // Success and Error notifications
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">Employee has been onboarded successfully.</p>
            <button
              onClick={() => dispatch(resetOnboarding())}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              Add Another Employee
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Notifications */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
            <X className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <p className="text-red-800 font-medium">{error.message || 'An error occurred'}</p>
              {error.errors && (
                <ul className="text-red-700 text-sm mt-1">
                  {Object.entries(error.errors).map(([key, value]) => (
                    <li key={key}>- {value}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Employee Onboarding
              </h1>
              <p className="text-gray-600 text-lg">Create a new employee in 5 guided steps</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={loadDraft}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium"
              >
                Load Draft
              </button>
              <button 
                onClick={saveDraft}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* Animated Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.key} className="flex flex-col items-center relative">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 transform
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500 text-white scale-110' 
                      : isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 text-white scale-110 shadow-lg' 
                        : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <span className={`
                    mt-3 text-sm font-medium transition-colors duration-300
                    ${isActive 
                      ? 'text-blue-600' 
                      : isCompleted 
                        ? 'text-green-600' 
                        : 'text-gray-500'
                    }
                  `}>
                    {step.label}
                  </span>

                  {/* Active step indicator */}
                  {isActive && (
                    <div className="absolute -bottom-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 0 || loading}
            className={`
              flex items-center px-6 py-3 rounded-xl transition-all duration-200 font-medium
              ${currentStep === 0 || loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md transform hover:-translate-y-0.5'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <button
            onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
            disabled={loading}
            className={`
              flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
              rounded-xl transition-all duration-200 font-medium
              ${loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-105'
              }
            `}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {currentStep === steps.length - 1 ? 'Complete Onboarding' : 'Next Step'}
                {currentStep !== steps.length - 1 ? (
                  <ChevronRight className="w-4 h-4 ml-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-2" />
                )}
              </>
            )}
          </button>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Completed: {currentStep}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Current: Step {currentStep + 1}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">Remaining: {steps.length - currentStep - 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOnboardingForm;