import React, { useEffect, useState } from "react";
import Modal from "./Modal"; // Import the Modal component

const ExploreTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/templates");
        const data = await response.json();
        if (Array.isArray(data.templates)) {
          setTemplates(data.templates);
          localStorage.setItem("templates", JSON.stringify(data.templates)); // optional caching
        } else {
          console.error("Invalid response format:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        // Try loading from localStorage as a fallback
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

  // Handle the addition of a new template
  const handleAddTemplate = (newTemplate) => {
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem("templates", JSON.stringify(updatedTemplates)); // Update localStorage
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Explore Templates</h2>
        <button
          onClick={() => setIsModalOpen(true)} // Open the modal
          className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-teal-600 transition"
        >
          <span>➕</span> Add New Templates
        </button>
      </div>

      {loading ? (
        <p>Loading templates...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              {template.image_url && (
                <img
                  src={template.image_url}
                  alt={template.element_name}
                  className="w-full h-48 object-cover p-2 rounded-2xl"
                />
              )}
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {template.element_name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {template.category}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  {template.container_meta.data}
                </p>
              </div>
              <button className="bg-teal-500 text-white py-3 font-medium hover:bg-teal-600 transition">
                Send Template
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding new templates */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTemplate}
      />
    </div>
  );
};

export default ExploreTemplates;
