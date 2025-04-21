import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";

const Table = ({ templates = [] }) => {
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
    { label: "Approved", count: filteredCounts.approved },
    { label: "Pending", count: filteredCounts.pending },
    { label: "Rejected", count: filteredCounts.rejected },
  ];

  return (
    <div className="w-full max-w-[1250px] font-sans h-auto rounded-[16px] bg-white shadow-[0px_0.91px_3.66px_0px_#00000042] overflow-hidden">
      {/* Header Filters and Search */}
      <div className="flex flex-wrap items-center gap-3 mt-3 ">
        <div className="pl-2 ">
          <p className="font-semibold text-[21px]">Templates List</p>
        </div>

        {filters.map((item, idx) => {
          const isActive = activeFilter === item.label;
          return (
            <div
              key={idx}
              onClick={() => setActiveFilter(item.label)}
              className={`cursor-pointer flex items-center justify-between px-4 py-2 rounded-md font-poppins text-sm font-medium
    ${isActive ? "bg-[#009EA1] text-white hover:bg-[#05a3a3] hover:text-white" : "hover:bg-white"} 
    transition-colors duration-200`}
            >
              <span
                className={`
     ${isActive ? "text-white hover:text-white" : "text-[#1F2937]"} 
     hover:text-[#05a3a3] transition-colors duration-200
    `}
              >
                {item.label} ({item.count})
              </span>
            </div>
          );
        })}

        <div className="relative flex items-center ml-52 w-full md:w-[360px] h-[44px]">
          {/* Icon button only on mobile (left aligned) */}
          <button className="block md:hidden w-[44px] h-[44px] flex items-center justify-center border border-[#D9D9D9] rounded-[8px]">
            <Search className="w-[18px] h-[18px] text-[#4F4F4F]" strokeWidth={1.8} />
          </button>

          {/* Input field only on desktop/tablet (md and up) */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search template by Name or Category..."
            className="hidden md:block w-full h-full pl-4 pr-11 border border-[#D9D9D9] rounded-[8px] text-sm text-[#4F4F4F] placeholder-[#A0A0A0] outline-none"
          />

          {/* Search icon inside input for md+ screens */}
          <div className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="w-[18px] h-[18px] text-[#4F4F4F] opacity-70" strokeWidth={1.8} />
          </div>
        </div>

      </div>

     
      <div className="overflow-y-auto overflow-x-auto mt-4 flex scrollbar-hide scroll-smooth max-h-[500px]">
        <table className="w-full text-[16px] text-center border overflow-hidden">
          <thead className="bg-gray-100 border-b-2 border-gray-200 font-semibold text-gray-700">
            <tr>
              <th className="px-9 py-3 text-nowrap text-center text-[16px] font-semibold font-sans text-gray-700">
                Date
              </th>
              <th className="pl-20 text-nowrap py-3 text-center text-[16px] font-semibold font-sans text-gray-700">
                Template Name
              </th>
              <th className="pl-24 py-3 text-center text-[16px] font-semibold font-sans text-gray-700">
                Type
              </th>
              <th className="pl-24 text-nowrap py-3 text-center text-[16px] font-semibold font-sans text-gray-700">
                Message Type
              </th>

              <th className="pl-7 py-3 text-center text-[16px] font-semibold font-sans text-gray-700">
                Status
              </th>
              <th className="pr-5 py-3 text-center text-[16px] font-semibold font-sans text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {displayedTemplates.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No templates found.
                </td>
              </tr>
            ) : (
              displayedTemplates.map((template, index) => (
                <tr
                  key={index}
                  className="bg-white h-[60px] border-b border-[#C3C3C3] "
                >
                  <td className="pl-4 py-2 whitespace-nowrap">
                    {template?.created_on
                      ? new Date(template.created_on).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="pl-6 py-2 whitespace-nowrap">{template?.element_name || "-"}</td>
                  <td className="pl-24 py-2">
                    {template?.template_type
                      ? template.template_type.charAt(0).toUpperCase() + template.template_type.slice(1)
                      : "-"}
                  </td>
                  <td className="pl-14 py-2">
                    {template?.category
                      ? template.category.charAt(0).toUpperCase() + template.category.slice(1)
                      : "-"}
                  </td>
                  <td className="pl-24 py-2">
                    <span
                      className={`w-[122.58px] font-semibold h-[40px] rounded-full text-white flex items-center justify-center border-[0.91px] px-4 ${template?.status?.toLowerCase() === "approved"
                        ? "bg-green-500"
                        : template?.status?.toLowerCase() === "pending"
                          ? "bg-gray-400"
                          : "bg-red-500"
                        }`}
                    >
                      {template?.status
                        ? template.status.charAt(0).toUpperCase() + template.status.slice(1)
                        : "Unknown"}
                    </span>
                  </td>
                  <td className="pr-10 py-2">
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