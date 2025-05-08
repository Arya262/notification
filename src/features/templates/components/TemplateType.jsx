import React from 'react';

const TemplateType = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Template Type</label>
        <div className="flex gap-6">
          {["text", "image", "video", "document"].map((type) => (
            <label key={type} className="flex items-center gap-1">
              <input
                type="radio"
                value={type}
                checked={formData.templateType === type}
                onChange={() => handleChange("templateType", type)}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <textarea
          placeholder="Template Format"
          value={formData.format}
          onChange={(e) => handleChange("format", e.target.value)}
          rows={4}
          className="w-full border px-3 py-2 rounded resize-none"
        />
        {errors.format && <p className="text-xs text-red-500">{errors.format}</p>}
        <p className="text-xs text-gray-500 mt-1">
          Use formatting – bold, italic, strikethrough. <code>&#123;&#123;1&#125;&#125;</code>, your code will expire in{" "}
          <code>&#123;&#123;2&#125;&#125;</code> mins. You are allowed a
          maximum of 1024 characters.
        </p>
      </div>
    </div>
  );
};

export default TemplateType; 