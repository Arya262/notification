import React, { useState } from "react";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h3 className="text-xl font-semibold mb-4">Add New Template</h3>
        <p className="text-sm text-gray-600">This feature is under construction!</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
