import React from 'react';

export default function ContactRow({ contact, isChecked, onCheckboxChange }) {
  return (
    <div className="flex items-center px-3 py-4 border-b border-[#C3C3C3]">
      {/* Checkbox */}
      <div className="w-[8%] flex justify-center items-center">
        <input
          type="checkbox"
          className="w-4 h-4"
          checked={isChecked}
          onChange={onCheckboxChange}
        />
      </div>

      {/* Created Date */}
      <div className="w-[15%] truncate">{contact.date}</div>

      {/* Status */}
      <div className="w-[12%] font-medium text-green-600 truncate">{contact.status}</div>

      {/* Customer Name */}
      <div className="w-[20%] truncate">{contact.fullName}</div>

      {/* WhatsApp Number */}
      <div className="w-[18%] truncate">{contact.number}</div>

      {/* 24 Hour Status */}
      <div className="w-[14%]">
        <span
          className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium min-w-[80px] text-center
            ${contact.is_active === 1 ? 'bg-green-500' : 'bg-red-400'}`}
        >
          {contact.is_active === 1 ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Actions */}
      <div className="w-[13%] min-w-[200px] flex justify-end gap-2 flex-nowrap">
        {/* Edit */}
        <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11.5A1.5 1.5 0 005.5 20H17a2 2 0 002-2v-5m-1.293-6.707a1 1 0 011.414 1.414L12.414 15H11v-1.414l6.707-6.707z"
            />
          </svg>
        </button>

        {/* Send Message */}
        <button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-full whitespace-nowrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 transform rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
          <span className="text-sm font-medium">Send Message</span>
        </button>

        {/* Delete */}
        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 7h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7zm3 3v6m6-6v6M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
