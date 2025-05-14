import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import vendor from "../../assets/vector.png";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";

const ExploreTemplates = () => {
  const navigate = useNavigate();
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
    // Get the token from localStorage
    const token = localStorage.getItem('auth_token');

    const response = await fetch(
      API_ENDPOINTS.TEMPLATES.GET_ALL + "?shop_id=1",
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '', // Add Authorization header if token exists
        },
      }
    );

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
          className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <img src={vendor} alt="plus sign" className="w-5 h-5" />
          Add New Templates
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
              {template.image_url && (
                <img
                  src={template.image_url}
                  alt={template.element_name}
                  className="w-full h-48 object-cover p-2 rounded-2xl"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              )}
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
                onClick={() => navigate('/broadcast', { 
                  state: { 
                    selectedTemplate: template,
                    openForm: true 
                  } 
                })}
className="bg-teal-500 text-black px-6 py-3 font-medium rounded 
                  border border-teal-500 hover:bg-teal-400 hover:text-white hover:border-teal-400 transition duration-300 ease-in-out"
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

