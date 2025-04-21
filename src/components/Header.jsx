import React from "react";
import { FaSearch } from "react-icons/fa";
import { Menu, X } from "lucide-react";

export default function Header({ isMenuOpen, onToggleSidebar }) {
  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-3 shadow-md bg-white relative gap-y-2">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Burger Menu (Mobile Only) */}
        <button
          onClick={onToggleSidebar} // Pass the toggle function
          className="lg:hidden"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logos */}
        <img
          src="/logo.png"
          alt="Company Logo"
          className="h-10 hidden sm:block"
        />
        <img
          src="/icon-logo.svg"
          alt="Compact Company Logo"
          className="h-8 sm:hidden"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 max-w-full">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-200 rounded-[15px] px-4 h-10 w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <span className="font-semibold text-black mr-2 whitespace-nowrap ">
            WhatsApp Number:
          </span>
          <span className="bg-white text-black font-medium px-3 py-1 rounded-[7px]">
            +1 123456789
          </span>
        </div>

        {/* Buttons */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#05a3a3] text-white text-sm px-4 h-10 flex items-center justify-center rounded whitespace-nowrap"
        >
          Upgrade
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#05a3a3] text-white text-sm px-4 h-10 flex items-center justify-center rounded whitespace-nowrap"
        >
          Foodchow POS
        </a>
      </div>
    </header>
  );
}
