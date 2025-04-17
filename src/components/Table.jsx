import React from 'react';
import TemplateRow from './templates/TemplateRow';
import FilterChip from './templates/FilterChip';

const Table = ({ templates = [], loading }) => {
  return (
    <div className="w-full max-w-[1250px] rounded-[16px] bg-white border-2 shadow-sm p-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <p className="font-poppins font-semibold text-[18px]">Templates List</p>

        <div className="flex flex-wrap gap-4">
          <FilterChip label="All" count={templates.length} bgColor="bg-[#00C023]" borderColor="border-teal-500" textColor="text-white" />
          <FilterChip label="Approved" count={templates.filter(t => t.status === "Approved").length} bgColor="bg-[#CCF6D4]" borderColor="border-[#2C9B40]" />
          <FilterChip label="Pending" count={templates.filter(t => t.status === "Pending").length} bgColor="bg-[#FFC9C9]" borderColor="border-[#FF2E2E]" />
          <FilterChip label="Rejected" count={templates.filter(t => t.status === "Rejected").length} bgColor="bg-[#FFC9C9]" borderColor="border-[#FF2E2E]" />
        </div>

        <div className="relative w-[300px] mt-2">
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
              <th className="px-4">Date</th>
              <th className="px-4">Template Name</th>
              <th className="px-4">Type</th>
              <th className="px-4">Category</th>
              <th className="pl-14">Status</th>
              <th className="pl-14">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Loading templates...
                </td>
              </tr>
            ) : (
              templates.map((template, index) => (
                <TemplateRow
                  key={index}
                  date={template.date}
                  name={template.name}
                  type={template.type}
                  category={template.category}
                  status={template.status}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
