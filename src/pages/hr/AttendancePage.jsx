import React, { useState } from 'react';

// Main container component for the entire attendance page.
// This component orchestrates the layout and combines the three
// main sections: Summary, Monthly View, and Upload.
const MainAttendance = () => {
  // State to manage the current step of the multi-page form.
  // 0: Summary, 1: Monthly Attendance, 2: Upload
  const [currentPage, setCurrentPage] = useState(0);

  // A more direct function to change the page based on the selected tab index.
  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return <AttendanceSummaryCard />;
      case 1:
        return <MonthlyAttendanceSection />;
      case 2:
        return <UploadAttendanceForm />;
      default:
        return <AttendanceSummaryCard />;
    }
  };

  return (
    // Main container for the entire app with a clean background color.
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8 lg:p-12 antialiased flex flex-col items-center">
      {/* Page Title and Description */}
      <header className="text-center mb-0 mt-[-10]">
        {/* <h5 className="text-2xl md:text-3xl font-extrabold text-[#1f2937] leading-tight mb-2">
          Employee Attendance Portal
        </h5> */}
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          View daily summaries, search for monthly records, and upload attendance sheets.
        </p>
      </header>
      
      {/* Tabbed navigation bar */}
      <nav className="w-full max-w-xl mb-8">
        <div className="flex justify-center bg-white rounded-xl shadow-md p-2 space-x-2 md:space-x-4">
          <button
            onClick={() => handlePageChange(0)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300
              ${currentPage === 0
                ? 'bg-[#1E6091] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            Summary
          </button>
          <button
            onClick={() => handlePageChange(1)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300
              ${currentPage === 1
                ? 'bg-[#1E6091] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            Monthly
          </button>
          <button
            onClick={() => handlePageChange(2)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300
              ${currentPage === 2
                ? 'bg-[#1E6091] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'}`
            }
          >
            Upload
          </button>
        </div>
      </nav>

      {/* Main content area for the current page */}
      <main className="w-full max-w-4xl">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

// --- Sub-Component 1: Today's Summary Card ---
// A clean, visually appealing card for the daily attendance overview.
const AttendanceSummaryCard = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#1E6091] h-full flex flex-col justify-center transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
    <h3 className="text-2xl font-bold text-[#1f2937] mb-4 text-center">Today's Summary</h3>
    <p className="text-gray-500 mb-6 text-center">
      A quick overview of today's attendance metrics.
    </p>
    <div className="grid grid-cols-2 gap-4 text-gray-700">
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-500">Employees Present</p>
        <p className="text-2xl font-bold text-[#1E6091]">N/A</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-500">Employees on Leave</p>
        <p className="text-2xl font-bold text-red-500">N/A</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-500">Working from Home</p>
        <p className="text-2xl font-bold text-yellow-500">N/A</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-500">In Office</p>
        <p className="text-2xl font-bold text-green-500">N/A</p>
      </div>
    </div>
  </div>
);

// --- Sub-Component 2: Monthly Attendance Section ---
// Handles the form for searching monthly attendance and displaying results in a table.
const MonthlyAttendanceSection = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleSearchAttendance = () => {
    // Mock action: in a real app, this would fetch data from an API.
    console.log(`Fetching attendance for Employee ID: ${employeeId}, Month: ${month}, Year: ${year}`);
  };

  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const mockAttendanceData = [
    { date: '2023-08-01', check_in: '09:00:00', check_out: '17:00:00', total_hours: '8', location: 'Office', attdence_status: 'Present' },
    { date: '2023-08-02', check_in: '09:15:00', check_out: '17:30:00', total_hours: '8.25', location: 'Remote', attdence_status: 'Work From Home' },
    { date: '2023-08-03', check_in: 'N/A', check_out: 'N/A', total_hours: 'N/A', location: 'N/A', attdence_status: 'Leave' },
    { date: '2023-08-04', check_in: '09:05:00', check_out: '17:10:00', total_hours: '8.08', location: 'Office', attdence_status: 'Present' },
    { date: '2023-08-05', check_in: 'N/A', check_out: 'N/A', total_hours: 'N/A', location: 'N/A', attdence_status: 'Weekend' },
    { date: '2023-08-06', check_in: 'N/A', check_out: 'N/A', total_hours: 'N/A', location: 'N/A', attdence_status: 'Weekend' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#1E6091] transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl h-full flex flex-col">
      <h3 className="text-2xl font-bold text-[#1f2937] mb-4">Monthly Attendance</h3>
      
      {/* Search form inputs */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center mb-6">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E6091] focus:border-transparent transition-all"
        />
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E6091] focus:border-transparent transition-all"
        >
          <option value="">Select Month</option>
          {monthOptions.map((name, index) => (
            <option key={index} value={index + 1}>{name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Enter Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E6091] focus:border-transparent transition-all"
        />
        <button
          onClick={handleSearchAttendance}
          className="w-full md:w-auto px-6 py-2 bg-[#1E6091] text-white font-semibold rounded-md hover:bg-[#2E7DA8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E6091] focus:ring-offset-2"
        >
          Search
        </button>
      </div>
      
      {/* Attendance data table */}
      <div className="overflow-x-aAuto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockAttendanceData.map((attendance, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{attendance.date}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{attendance.check_in}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{attendance.check_out}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{attendance.total_hours}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">{attendance.location}</td>
                <td className="py-3 px-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${attendance.attdence_status === 'Present' ? 'bg-green-100 text-green-800' :
                      attendance.attdence_status === 'Work From Home' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`
                  }>
                    {attendance.attdence_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Sub-Component 3: Attendance Upload Form ---
// A card for uploading attendance data via an Excel file.
const UploadAttendanceForm = () => {
  const [upload, setUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpload(file);
  };

  const handleUpload = () => {
    if (!upload) {
      console.log('Please select a file to upload'); 
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUpload(null);
      console.log('File uploaded successfully!');
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#1E6091] h-full flex flex-col justify-center transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-[#1f2937] mb-4 text-center">Upload Attendance</h2>
      <p className="text-gray-500 mb-6 text-center">
        Upload a new attendance spreadsheet.
      </p>
      <div className="mt-6 space-y-4">
        <label className="block text-gray-700 font-semibold">
          Choose Excel File
        </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0 file:text-sm file:font-semibold
                       file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors"
        />
        {upload && (
          <div className="text-sm text-gray-600 text-center">
            Selected file: <span className="font-medium text-[#1E6091]">{upload.name}</span>
          </div>
        )}
        <button
          onClick={handleUpload}
          className="w-full px-4 py-2 mt-4 bg-[#1E6091] text-white font-semibold rounded-md
                       hover:bg-[#2E7DA8] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isUploading || !upload}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

// Export the main component for use in your application.
export default MainAttendance;
