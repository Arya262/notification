import React from 'react';

const MessageTypeSelector = ({ formData, handleRadioChange }) => {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1 text-black">
        Select Message Type
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="messageType"
            value="Pre-approved template message"
            checked={formData.messageType === "Pre-approved template message"}
            onChange={handleRadioChange}
            className="text-[#0AA89E]"
            style={{ accentColor: "#0AA89E" }}
            required
          />
          <span className="ml-2 text-[#717171]">
            Pre-approved template message
          </span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="messageType"
            value="Regular Message"
            checked={formData.messageType === "Regular Message"}
            onChange={handleRadioChange}
            className="text-[#0AA89E]"
            style={{ accentColor: "#0AA89E" }}
            required
          />
          <span className="ml-2 text-[#717171]">Regular Message</span>
        </label>
      </div>
    </div>
  );
};

export default MessageTypeSelector; 