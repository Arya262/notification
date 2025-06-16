import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { debounce } from "lodash";
import { API_ENDPOINTS } from "../../../config/api";

const SendTemplate = ({ onSelect, onClose, returnFullTemplate = false }) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        
        const response = await fetch(
                `${API_ENDPOINTS.TEMPLATES.GET_ALL}?customer_id=${user?.customer_id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );

        // Check if the response status is OK
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Validate if 'templates' is an array
        if (Array.isArray(data.templates)) {
          setTemplates(data.templates);
          setFilteredTemplates(data.templates);
        } else {
          console.error("Invalid response format:", data);
          setError("Unexpected response format from server.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        // Enhanced error message: You can include error details if available
        setError(
          `Failed to load templates. Please try again. Error: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [user?.customer_id]);

  // Debounced filter templates on search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (searchTerm.trim() === "") {
        setFilteredTemplates(templates);
      } else {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredTemplates(
          templates.filter((template) =>
            template.element_name?.toLowerCase().includes(lowerTerm)
          )
        );
      }
    }, 300); // Delay 300ms after the user stops typing

    debouncedSearch();

    return () => debouncedSearch.cancel(); // Cleanup
  }, [searchTerm, templates]);

  const handleTemplateClick = (template) => {
    // Return either the full template or just the name based on the prop
    if (onSelect) {
      onSelect(returnFullTemplate ? template : template.element_name);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-[850px] max-w-full p-6 relative overflow-hidden">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
        Choose a Template
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <input
        type="text"
        placeholder="Search templates by name..."
        className="mb-4 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 h-10 rounded"
            ></div>
          ))}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-white text-gray-700 sticky top-0 z-10 shadow">
                <tr>
                  <th className="px-4 py-3">Status / Created At</th>
                  <th className="px-4 py-3">Template Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-center">Preview</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-gray-400">
                      No templates found.
                    </td>
                  </tr>
                ) : (
                  filteredTemplates.map((template, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => handleTemplateClick(template)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`${
                            template.status?.toLowerCase() === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          } text-xs font-medium px-2 py-1 rounded`}
                        >
                          {template.status || "N/A"}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {template.created_on
                            ? new Date(
                                Number(template.created_on)
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Unknown"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {template.element_name || "Unnamed"}
                      </td>
                      <td className="px-4 py-4">
                        {template.template_type || "Unknown"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateClick(template);
                          }}
                          className="bg-teal-500 hover:bg-teal-600 text-white text-xs px-3 py-1 rounded"
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendTemplate;
