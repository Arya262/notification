import React from 'react';

const FormFields = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-1/2">
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Template Category</option>
            <option value="marketing">Marketing</option>
            <option value="transactional">Transactional</option>
          </select>
          {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
        </div>

        <div className="w-1/2">
          <input
            type="text"
            placeholder="Template Name"
            value={formData.elementName}
            onChange={(e) => handleChange("elementName", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.elementName && <p className="text-xs text-red-500">{errors.elementName}</p>}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <select
            value={formData.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Language</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>
          {errors.language && <p className="text-xs text-red-500">{errors.language}</p>}
        </div>

        <input
          type="text"
          placeholder="Template Header (optional)"
          value={formData.header}
          onChange={(e) => handleChange("header", e.target.value)}
          className="w-1/2 border px-3 py-2 rounded"
        />
      </div>
    </div>
  );
};

export default FormFields; 