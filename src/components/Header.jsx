import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Header({ isMenuOpen, onToggleSidebar }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
        withCredentials: true
      });

      const data = response.data;

      if (data.success) {
        toast.success("Successfully logged out!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/login");
      } else {
        toast.error("Logout failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <header className="flex flex-wrap justify-between items-center px-4 py-4  shadow-md bg-white relative gap-y-2">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
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
            src="/mobile_logo.webp"
            alt="Compact Company Logo"
            className="h-8 sm:hidden"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 flex-nowrap w-auto max-w-full overflow-hidden">
          {/* Search Bar */}
          <div className="relative w-[100px] xs:w-[120px] sm:w-[150px] md:w-[200px] lg:w-[250px] transition-all duration-300">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-8 py-2 w-full rounded-full bg-[#f0f2f5] text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#05a3a3]"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
              >
                &times;
              </button>
            )}
          </div>

          {/* Buttons */}
          <button
            type="button"
            className="bg-[#05a3a3] text-white text-sm px-4 h-10 flex items-center justify-center rounded whitespace-nowrap cursor-pointer"
          >
            Upgrade
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-[#05a3a3] text-white text-sm px-4 h-10 flex items-center justify-center rounded whitespace-nowrap cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
}