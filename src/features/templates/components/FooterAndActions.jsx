import React from 'react';

const FooterAndActions = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Template Footer"
          value={formData.footer}
          onChange={(e) => handleChange("footer", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.footer && <p className="text-xs text-red-500">{errors.footer}</p>}
        <p className="text-xs text-gray-500 mt-1">Max 60 characters allowed.</p>
      </div>

      <div>
        <label className="block font-semibold mb-1">Interactive Actions</label>
        <div className="flex gap-6">
          {["none", "call", "quick", "all"].map((type) => (
            <label key={type} className="flex items-center gap-1">
              <input
                type="radio"
                value={type}
                checked={formData.actionType === type}
                onChange={() => handleChange("actionType", type)}
                className="text-[#0AA89E]"
                style={{ accentColor: "#0AA89E" }}
              />
              {{
                none: "None",
                call: "Call To Actions",
                quick: "Quick Replies",
                all: "All",
              }[type]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterAndActions; 