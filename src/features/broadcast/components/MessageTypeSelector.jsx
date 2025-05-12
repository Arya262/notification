import React from 'react';

const MessageTypeSelector = ({ formData, handleRadioChange, disabled }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <span className="block text-sm font-semibold mb-1 text-black">
          Pre-approved template message
        </span>
      </div>
    </div>
  );
};

export default MessageTypeSelector; 