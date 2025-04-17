import React, { useState, useEffect } from 'react';

const Table = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredCounts, setFilteredCounts] = useState({
    all: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates'); // Replace with your actual API
        const data = await response.json();

        setTemplates(data);

        const approved = data.filter(t => t.status === 'Approved').length;
        const pending = data.filter(t => t.status === 'Pending').length;
        const rejected = data.filter(t => t.status === 'Rejected').length;

        setFilteredCounts({
          all: data.length,
          approved,
          pending,
          rejected,
        });
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="w-full max-w-[1250px] h-[500px] rounded-[16px] bg-white border-2 shadow-sm mr-1 mt-1 px-4 py-4 overflow-hidden">
      {/* Header Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center justify-start relative">
        <div className="pl-2 pt-2">
          <p className="font-poppins font-semibold text-[18px]">Templates List</p>
        </div>

        {/* All */}
        <div className="flex items-center border border-teal-500 w-[99px] h-[44px] rounded-[3.66px] font-poppins">
          <div className="text-[#898989] text-[17px] p-2 bg-white flex-grow">All</div>
          <div className="bg-[#00C023] text-white text-[16px] w-[42px] h-[44px] flex items-center justify-center">
            {filteredCounts.all}
          </div>
        </div>

        {/* Approved */}
        <div className="flex items-center border border-[#BEBEBE] w-[159px] h-[44px] rounded-[3.66px] font-poppins">
          <div className="text-[#898989] text-[17px] pl-3 bg-white flex-grow">Approved</div>
          <div className="bg-[#CCF6D4] text-black border border-[#2C9B40] w-[44px] h-[44px] flex items-center justify-center ml-3">
            {filteredCounts.approved}
          </div>
        </div>

        {/* Pending */}
        <div className="flex items-center border border-[#BEBEBE] w-[159px] h-[44px] rounded-[3.66px] font-poppins">
          <div className="text-[#898989] text-[17px] px-4 py-2 bg-white flex-grow">Pending</div>
          <div className="bg-[#FFC9C9] text-black border border-[#FF2E2E] w-[44px] h-[45px] flex items-center justify-center ml-3">
            {filteredCounts.pending}
          </div>
        </div>

        {/* Rejected */}
        <div className="flex items-center border border-[#BEBEBE] w-[159px] h-[44px] rounded-[3.66px] font-poppins">
          <div className="text-[#898989] text-[17px] px-4 py-2 bg-white flex-grow">Rejected</div>
          <div className="bg-[#FFC9C9] text-black border border-[#FF2E2E] w-[44px] h-[45px] flex items-center justify-center ml-3">
            {filteredCounts.rejected}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-[300px] ml-28 mt-2">
          <input
            type="text"
            placeholder="Search template by Name or Category..."
            className="w-full h-[40px] pl-4 pr-10 border border-gray-300 rounded-lg text-sm text-gray-600 placeholder-gray-400 outline-none"
          />
          <img
            src="./search.png"
            alt="Search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[18px] h-[18px]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-[800px] w-full table-auto font-poppins text-sm">
          <thead>
            <tr className="bg-[#F4F4F4] font-semibold text-[17px] h-[68px] text-left border-b border-[#C3C3C3]">
              <th className="min-w-[100px] px-4">Date</th>
              <th className="min-w-[180px] px-4">Template Name</th>
              <th className="min-w-[80px] px-4">Type</th>
              <th className="min-w-[100px] px-4">Category</th>
              <th className="min-w-[100px] pl-14">Status</th>
              <th className="min-w-[80px] pl-14">Action</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, index) => (
              <tr key={index} className="bg-white h-[60px] border-b border-[#C3C3C3] font-semibold">
                <td className="px-4 whitespace-nowrap">{template.date}</td>
                <td className="px-4 whitespace-nowrap">{template.name}</td>
                <td className="px-4">{template.type}</td>
                <td className="px-4">{template.category}</td>
                <td className="px-4">
                  <span
                    className={`w-[122.58px] ml-2 h-[40px] rounded-full text-white flex items-center justify-center border-[0.91px] px-4 ${
                      template.status === 'Approved'
                        ? 'bg-[#00A31E]'
                        : template.status === 'Pending'
                        ? 'bg-[#FF6262]'
                        : 'bg-[#999999]'
                    }`}
                  >
                    {template.status}
                  </span>
                </td>
                <td className="px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button type="button" className="w-[36.59px] h-[36.59px] flex items-center justify-center">
                      <img src="Group 5075.png" alt="Edit template" />
                    </button>
                    <button type="button" className="w-[37px] h-[37px] flex items-center justify-center">
                      <img src="delete.png" alt="Delete template" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
