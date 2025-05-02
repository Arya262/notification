import React, { useEffect, useState } from "react";
import { debounce } from "lodash";

const SendTemplate = ({ onSelect, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/templates?shop_id=1");
        const data = await response.json();
        if (Array.isArray(data.templates)) {
          const approvedTemplates = data.templates.filter(
            (template) => template.status?.toLowerCase() === "approved"
          );
          setTemplates(approvedTemplates);
          setFilteredTemplates(approvedTemplates);
        } else {
          console.error("Invalid response format:", data);
          setError("Unexpected response format from server.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load templates. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

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
    console.log("Template selected:", template.element_name); 
    if (onSelect) onSelect(template.element_name); 
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-[850px] max-w-full p-6 relative overflow-hidden">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      )}

      <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
        Choose a Template
      </h2>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

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
            <div key={i} className="animate-pulse bg-gray-100 h-10 rounded"></div>
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
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                          {template.status || "N/A"}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {template.created_on
                            ? new Date(Number(template.created_on)).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Unknown"}
                        </div>
                      </td>
                      <td className="px-4 py-4">{template.element_name || "Unnamed"}</td>
                      <td className="px-4 py-4">{template.template_type || "Unknown"}</td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={(e) => {
                            console.log("Template selected:", template.element_name);
                            e.stopPropagation(); // prevents row click from firing 
                            if (onSelect) onSelect(template.element_name);
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
