import React from 'react';

const AlertDialog = ({ showAlert, message }) => {
  if (!showAlert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-between w-1/3">
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default AlertDialog; 