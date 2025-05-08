import React from 'react';

const AlertDialog = ({ showAlert, message }) => {
  if (!showAlert) return null;

  const isError = message.includes("Failed to save broadcast");

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-between w-1/3">
        <p className={`${isError ? 'text-red-500' : 'text-gray-700'}`}>{message}</p>
      </div>
    </div>
  );
};

export default AlertDialog; 