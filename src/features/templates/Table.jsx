
import React, { useState, useMemo, useEffect } from "react";

const Table = ({ templates = [], onEdit, onDelete }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [editedTemplate, setEditedTemplate] = useState({});
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [localTemplates, setLocalTemplates] = useState([]);

  useEffect(() => {
    const savedTemplates = localStorage.getItem("templates");
    if (savedTemplates) {
      setLocalTemplates(JSON.parse(savedTemplates));
    } else {
      setLocalTemplates(templates);
    }
  }, [templates]);

  useEffect(() => {
    localStorage.setItem("templates", JSON.stringify(localTemplates));
  }, [localTemplates]);

  const filteredCounts = useMemo(() => {
    const approved = localTemplates.filter((t) => t.status?.toLowerCase() === "approved").length;
    const pending = localTemplates.filter((t) => t.status?.toLowerCase() === "pending").length;
    const rejected = localTemplates.filter((t) => t.status?.toLowerCase() === "rejected").length;
    return {
      all: localTemplates.length,
      approved,
      pending,
      rejected,
    };
  }, [localTemplates]);

  const statusFilteredTemplates = useMemo(() => {
    if (activeFilter === "All") return localTemplates;
    return localTemplates.filter(
      (t) => t.status?.toLowerCase().trim() === activeFilter.toLowerCase()
    );
  }, [localTemplates, activeFilter]);

  const displayedTemplates = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return statusFilteredTemplates.filter(
      (t) =>
        t.element_name?.toLowerCase().includes(term) ||
        t.category?.toLowerCase().includes(term)
    );
  }, [statusFilteredTemplates, searchTerm]);

  const handleEditClick = (template) => {
    setEditRow(template.id);
    setEditedTemplate({ ...template });
  };

  const handleSaveEdit = (id) => {
    const capitalizedTemplate = {
      ...editedTemplate,
      element_name: editedTemplate.element_name?.charAt(0).toUpperCase() + editedTemplate.element_name?.slice(1),
      category: editedTemplate.category?.charAt(0).toUpperCase() + editedTemplate.category?.slice(1),
    };

    const updatedTemplates = localTemplates.map(template =>
      template.id === id ? { ...template, ...capitalizedTemplate } : template
    );

    setLocalTemplates(updatedTemplates);
    setEditRow(null);
    setEditedTemplate({});
  };

  const handleCancelEdit = () => {
    setEditRow(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
    setEditedTemplate(prev => ({
      ...prev,
      [name]: capitalized,
    }));
  };

  const handleDeleteClick = (id) => {
    onDelete(id);
    const updated = localTemplates.filter(t => t.id !== id);
    setLocalTemplates(updated);
  };

  const filters = [
    { label: "All", count: filteredCounts.all },
    { label: "Approved", count: filteredCounts.approved },
    { label: "Pending", count: filteredCounts.pending },
    { label: "Rejected", count: filteredCounts.rejected },
  ];


  return (
    <div className="w-full font-sans rounded-[16px] scrollbar-hide scroll-smooth bg-white shadow-[0px_0.91px_3.66px_0px_#00000042] overflow-hidden">
      {/* Header Filters and Search */}
      <div className="flex items-center gap-2 overflow-x-auto p-1 sm:p-2 ">
        <div className="pl-2 pr-3">
          <p className="font-semibold text-[18px]">Templates List</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {filters.map((f, i) => (
            <button
              key={i}
              className={`flex items-center justify-center h-8 sm:h-9 md:h-10 text-xs sm:text-sm md:text-[16px] font-medium px-1 sm:px-2 md:px-3 rounded-md ${f.width} transition-all duration-200 ${activeFilter === f.label
                ? "bg-teal-500 text-white"
                : "bg-transparent text-gray-700 hover:text-teal-500"
                }`}
              onClick={() => setActiveFilter(f.label)}
            >
              <div className="flex items-center gap-0">
                <span className="whitespace-nowrap">{f.label}</span>
                <span
                  className={`text-xs sm:text-sm md:text-md font-bold flex items-center justify-center rounded ${activeFilter === f.label ? "text-white" : ""
                    }`}
                  style={{
                    backgroundColor: "transparent",
                    padding: "0 4px",
                    marginLeft: "0",
                  }}
                >
                  ({f.count})
                </span>
              </div>
            </button>
          ))}

          {/* Search Icon for mobile */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setShowMobileSearch(prev => !prev)}
              className="flex items-center justify-center h-8 sm:h-9 w-8 sm:w-9 border border-gray-300 rounded-md"
            >
              <img
                src="search.png"
                alt="Search"
                className="w-4 sm:w-5 h-4 sm:h-5 opacity-60"
              />
            </button>
          </div>
        </div>

        {/* Search Input for desktop */}
        <div className="hidden lg:block flex-shrink-0">
          <div className="relative w-[400px] sm:w-[300px] md:w-[400px] ml-[55%]">
            <img
              src="search.png"
              alt="Search"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 sm:w-5 md:w-5 h-2 sm:h-5 md:h-5 opacity-60"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search template by Name or Category..."
              className="pl-2 pr-24 py-1 sm:py-2 border border-gray-300 text-xs sm:text-sm md:text-base rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <div className="lg:hidden w-full px-2 mt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search template by Name or Category..."
            className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring focus:border-teal-400"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-y-auto w-full overflow-x-auto flex scrollbar-hide scroll-smooth max-h-[500px]">
        <table className="min-w-full text-[16px] text-center ">
          <thead className="bg-gray-100 border-b-2 border-gray-200 font-semibold text-gray-700">
            <tr>
              <th className="py-3 text-nowrap">Date</th>
              <th className="pl-24 text-nowrap py-3">Template Name</th>
              <th className="pl-24 py-3">Type</th>
              <th className="pl-28 text-nowrap py-3">Message Type</th>
              <th className="pl-14 py-3">Status</th>
              <th className="pl-14 pr-3 py-3">Action</th>
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
                  className="bg-white h-[60px] border-b text-[16px] border-[#C3C3C3]"
                >
                  <td className="pl-4 py-2 whitespace-normal">
                    {editRow === template.id ? (
                      <input
                        type="date"
                        name="created_on"
                        value={editedTemplate.created_on || ""}
                        onChange={handleChange}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      new Date(template.created_on).toLocaleDateString()
                    )}
                  </td>
                  <td className="pl-20 py-2 break-words whitespace-normal max-w-[200px]">
                    {editRow === template.id ? (
                      <input
                        type="text"
                        name="element_name"
                        value={editedTemplate.element_name || ""}
                        onChange={handleChange}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      template.element_name
                    )}
                  </td>
                  <td className="pl-24 py-2 break-words whitespace-normal max-w-[180px]">
                    {template?.template_type
                      ? template.template_type.charAt(0).toUpperCase() + template.template_type.slice(1)
                      : "-"}
                  </td>
                  <td className="pl-24 py-2 break-words whitespace-normal max-w-[180px]">
                    {editRow === template.id ? (
                      <input
                        type="text"
                        name="category"
                        value={editedTemplate.category || ""}
                        onChange={handleChange}
                        className="px-2 mr-3 py-1 border rounded"
                      />
                    ) : (
                      template.category
                        ? template.category.charAt(0).toUpperCase() + template.category.slice(1)
                        : "-"
                    )}
                  </td>

                  <td className="px-4 py-2 whitespace-normal">
                    <span
                      className={`inline-flex items-center justify-center text-[14px] px-4 ml-14 py-1 rounded-full text-white font-semibold border-[0.91px] ${template?.status?.toLowerCase() === "approved"
                        ? "bg-green-500"
                        : template?.status?.toLowerCase() === "pending"
                          ? "bg-gray-400"
                          : "bg-red-500"
                        } text-sm sm:text-base`}
                    >
                      {template?.status
                        ? template.status.charAt(0).toUpperCase() + template.status.slice(1)
                        : "Unknown"}
                    </span>

                  </td>
                  <td className="pl-14 pr-4 py-2">
                    {editRow === template.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                          onClick={() => handleSaveEdit(template.id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">

                        <button
                          className="bg-gray-100 hover:bg-gray-200 p-1.5 sm:p-2 rounded-md transition-colors duration-200"
                          aria-label="Edit Template" onClick={() => handleEditClick(template)}
                        >

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600"
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
                          className="bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-md transition-colors duration-200"
                          aria-label="Delete Template" onClick={() => handleDeleteClick(template.id)}
                        >

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 7h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7zm3 3v6m6-6v6M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
                          </svg>
                        </button>
                      </div>
                    )}
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