import React from 'react';

const ActionMenu = ({ onDelete }) => {
  return (
    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
      <button
        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default ActionMenu; 