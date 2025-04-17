import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Menu, X } from 'lucide-react';

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
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full w-full sm:w-[250px] md:w-[300px] lg:w-[350px]">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            aria-label="Search Workflows"
            placeholder="Search Workflow by Name or Webhook URL"
            className="bg-white outline-none text-sm flex-1 px-3 rounded-full hidden sm:block"
          />
        </div>

        {/* Buttons */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#05a3a3] text-white text-sm px-3 py-1 rounded whitespace-nowrap"
        >
          Upgrade
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#05a3a3] text-white text-sm px-3 py-1 rounded whitespace-nowrap"
        >
          Foodchow POS
        </a>
      </div>
    </header>
  );
}
