import React, { useEffect, useState } from "react";

const SendTemplate = ({ onSelect }) => {
 const [templates, setTemplates] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchTemplates = async () => {
   setLoading(true);
   try {
    const response = await fetch("http://localhost:3000/templates?shop_id=1");
    const data = await response.json();
    console.log("Fetched data:", data);
    if (Array.isArray(data.templates)) {
     setTemplates(data.templates);
    } else {
     console.error("Invalid response format:", data);
    }
   } catch (err) {
    console.error("Fetch error:", err);
   } finally {
    setLoading(false);
   }
  };

  fetchTemplates();
 }, []);

 return (
  <div className="bg-white rounded-lg shadow-xl w-[850px] max-w-full p-6 relative overflow-auto">
   <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
    Choose a Template
   </h2>

   {loading ? (
    <p className="text-center text-sm text-gray-500">Loading templates...</p>
   ) : (
    <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-md overflow-hidden">
     <thead className="bg-gray-100 text-gray-700">
      <tr>
       <th className="px-4 py-3">Status / Created At</th>
       <th className="px-4 py-3">Template Name</th>
       <th className="px-4 py-3">Type</th>
       <th className="px-4 py-3 text-center">Preview</th>
      </tr>
     </thead>
     <tbody>
      {templates.length === 0 ? (
       <tr>
        <td colSpan="4" className="text-center py-5 text-gray-400">
         No templates found.
        </td>
       </tr>
      ) : (
       templates.map((template, index) => (
        <tr
         key={index}
         className="border-t border-gray-200 hover:bg-gray-50 transition"
        >
         <td className="px-4 py-4 whitespace-nowrap">
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
           {template.status || "N/A"}
          </span>
          <div className="text-xs text-gray-500 mt-1">
           {template.created_on }
          </div>
         </td>
         <td className="px-4 py-4">{template.element_name }</td>
         <td className="px-4 py-4">{template.template_type}</td>
         <td className="px-4 py-4 text-center">
          <button
           onClick={() => {
            console.log("Template selected:", template.element_name);
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
   )}
  </div>
 );
};

export default SendTemplate;
