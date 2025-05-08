import React, { useEffect, useState } from "react";
import Modal from "./Modal";

const ExploreTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const MAX_LENGTH = 100; // Maximum length for container_meta?.data

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/templates");
        const data = await response.json();
        if (Array.isArray(data.templates)) {
          setTemplates(data.templates);
          localStorage.setItem("templates", JSON.stringify(data.templates));
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        setError("Failed to fetch templates");
        const cachedTemplates = localStorage.getItem("templates");
        if (cachedTemplates) {
          setTemplates(JSON.parse(cachedTemplates));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Function to normalize container_meta?.data
  const normalizeData = (data) => {
    if (!data) return "No metadata available"; // Fallback if no data exists
    // Truncate if longer than max length, and pad with dots if shorter
    return data.length > MAX_LENGTH
      ? data.slice(0, MAX_LENGTH) + "..."
      : data.padEnd(MAX_LENGTH, ".");
  };

  const handleAddTemplate = (newTemplate) => {
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem("templates", JSON.stringify(updatedTemplates));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Explore Templates</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-teal-600 transition"
          aria-label="Add new template"
        >
          <span aria-hidden="true">➕</span> Add New Templates
        </button>
      </div>

      {loading ? (
        <p>Loading templates...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : templates.length === 0 ? (
        <p>No templates available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template.id || template.element_name}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={template.image_url || "/placeholder.jpg"}
                alt={template.element_name}
                className="w-full h-48 object-cover p-2 rounded-2xl"
              />
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {template.element_name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{template.category}</p>
                <p className="text-sm text-gray-700 mb-2">
                  {normalizeData(template.container_meta?.data)} {/* Normalized data */}
                </p>
              </div>
              <button
                type="button"
                className="bg-white text-black px-6 py-3 font-medium rounded 
                  hover:bg-teal-500 hover:text-white transition duration-300 ease-in-out"
              >
                Send Template
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTemplate}
      />
    </div>
  );
};

export default ExploreTemplates;
