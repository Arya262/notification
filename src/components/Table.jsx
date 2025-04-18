import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";

const Table = ({ templates }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCounts = useMemo(() => {
    const approved = templates.filter((t) => t.status?.toLowerCase() === "approved").length;
    const pending = templates.filter((t) => t.status?.toLowerCase() === "pending").length;
    const rejected = templates.filter((t) => t.status?.toLowerCase() === "rejected").length;

    return {
      all: templates.length,
      approved,
      pending,
      rejected,
    };
  }, [templates]);

  const statusFilteredTemplates = useMemo(() => {
    if (activeFilter === "All") return templates;
    return templates.filter(
      (t) => t.status?.toLowerCase().trim() === activeFilter.toLowerCase()
    );
  }, [templates, activeFilter]);

  const displayedTemplates = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return statusFilteredTemplates.filter(
      (t) =>
        t.element_name?.toLowerCase().includes(term) ||
        t.category?.toLowerCase().includes(term)
    );
  }, [statusFilteredTemplates, searchTerm]);

  const filters = [
    { label: "All", count: filteredCounts.all },
    { label: "Approved", count: filteredCounts.approved, color: "bg-[#CCF6D4]" },
    { label: "Pending", count: filteredCounts.pending, color: "bg-[#FFC9C9]" },
    { label: "Rejected", count: filteredCounts.rejected, color: "bg-[#FFC9C9]" },
  ];

  return (
    <div className="w-full max-w-[1250px] h-[500px] rounded-[16px] bg-white shadow-sm overflow-hidden">
      {/* Header Filters and Search */}
      <div className="flex flex-wrap items-center gap-3 p-[10px]">
        <div className="pl-2 pt-2">
          <p className="font-poppins font-semibold text-[16px]">Templates List</p>
        </div>

        {filters.map((item, idx) => {
          const isActive = activeFilter === item.label;
          return (
<div
  key={idx}
  onClick={() => setActiveFilter(item.label)}
  className={`cursor-pointer flex items-center justify-between font-poppins text-sm w-[159px] h-[44px] rounded-[3.66px] border
    ${isActive ? "bg-[#00C023] text-white border-transparent" : "bg-white text-[#4F4F4F] border-[#BEBEBE]"}`}
>
  <div className={`pl-4 ${isActive ? "text-white" : "text-[#4F4F4F]"}`}>
    {item.label}
  </div>
  <div
    className={`w-[42px] h-[43px] text-sm font-semibold rounded-[3.66px] ml-auto  flex items-center justify-center
      ${
        isActive
          ? "bg-white text-[#00C023]"
          : item.label === "Approved"
          ? "bg-[#D5F8D0] text-black"
          : item.label === "Pending"
          ? "bg-[#FFD5D5] text-black"
          : item.label === "Rejected"
          ? "bg-[#FFD5D5] text-black"
          : "bg-gray-200 text-black"
      }`}
  >
    {item.count}
  </div>
</div>
          );
        })}

        <div className="relative w-[360px] h-[44px] ml-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search template by Name or Category..."
            className="w-full h-full pl-4 pr-11 border border-[#D9D9D9] rounded-[8px] text-sm text-[#4F4F4F] placeholder-[#A0A0A0] outline-none"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#4F4F4F] opacity-70"
            strokeWidth={1.8}
          />
        </div>
      </div>

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
            {displayedTemplates.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No templates found.
                </td>
              </tr>
            ) : (
              displayedTemplates.map((template, index) => (
                <tr
                  key={index}
                  className="bg-white h-[60px] border-b border-[#C3C3C3] font-semibold"
                >
                  <td className="px-4 whitespace-nowrap">
                    {template?.created_on
                      ? new Date(template.created_on).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 whitespace-nowrap">{template?.element_name || "-"}</td>
                  <td className="px-4">{template?.template_type || "-"}</td>
                  <td className="px-4">{template?.category || "-"}</td>
                  <td className="px-4">
                    <span
                      className={`w-[122.58px] ml-2 h-[40px] rounded-full text-white flex items-center justify-center border-[0.91px] px-4 ${
                        template?.status?.toLowerCase() === "approved"
                          ? "bg-[#00A31E]"
                          : template?.status?.toLowerCase() === "pending"
                          ? "bg-[#FF0033]"
                          : "bg-[#999999]"
                      }`}
                    >
                      {template?.status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
                        aria-label="Edit Template"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11.5A1.5 1.5 0 005.5 20H17a2 2 0 002-2v-5m-1.293-6.707a1 1 0 011.414 1.414L12.414 15H11v-1.414l6.707-6.707z"
                          />
                        </svg>
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                        aria-label="Delete Template"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 7h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7zm3 3v6m6-6v6M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
