import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactRow({ contact, isChecked, onCheckboxChange }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [shouldFlipUp, setShouldFlipUp] = useState(false);
  const dropdownRef = useRef(null);
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => {
      const next = !prev;

      if (next && rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setShouldFlipUp(spaceBelow < 160); 
      }
      return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessageClick = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/conversationid?customer_id=${contact.customer_id}`
      );
      const data = await res.json();

      if (!data || !data.conversation_id) {
        console.error(
          "No conversation_id found for contact",
          contact.customer_id
        );
        return;
      }

      navigate("/chats", {
        state: {
          contact: {
            ...contact,
            conversation_id: data.conversation_id,
          },
        },
      });
    } catch (error) {
      console.error("Failed to fetch conversation ID", error);
    }
  };

  return (
    <div
      ref={rowRef}
      className="flex items-center px-3 py-4 border-b border-[#C3C3C3] relative"
    >
      {/* Checkbox */}
      <div className="w-[8%] flex justify-center items-center">
      <input
            type="checkbox"
            className="form-checkbox w-4 h-4"
            checked={isChecked}
            onChange={onCheckboxChange}
          />
      </div>

      {/* Created Date */}
      <div className="w-[15%] truncate">{contact.date}</div>

      {/* Status */}
      <div className="w-[12%] font-medium text-green-600 truncate">
        {contact.status}
      </div>

      {/* Customer Name */}
      <div className="w-[20%] truncate">{contact.fullName}</div>

      {/* WhatsApp Number */}
      <div className="w-[18%] truncate">{contact.number}</div>

      {/* 24 Hour Status */}
      <div className="w-[14%]">
        <span
          className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium min-w-[80px] text-center
            ${contact.is_active === 1 ? "bg-green-500" : "bg-red-400"}`}
        >
          {contact.is_active === 1 ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Send Button + Three Dot Menu */}
      <div
        className="w-[13%] flex justify-end items-center gap-2 relative"
        ref={dropdownRef}
      >
        {/* Send Message Button */}
        <button
          onClick={handleSendMessageClick}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-full whitespace-nowrap"
          aria-label={`Send message to ${contact.fullName}`}
        >
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

        {/* Three Dots */}
        <button
          onClick={toggleDropdown}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          aria-label="Contact options"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v.01M12 12v.01M12 19v.01"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className={`absolute right-0 ${shouldFlipUp ? "bottom-12" : "top-12"} w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20`}
          >
            <button
              onClick={() => console.log("Edit", contact.id)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>

            <button
              onClick={() => console.log("Delete", contact.id)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
