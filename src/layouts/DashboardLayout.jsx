import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isChatRoute = location.pathname.startsWith("/chat");

  return (
    <div className="flex flex-col h-screen">
      <Header
        isMenuOpen={isMenuOpen}
        onToggleSidebar={() => setIsMenuOpen(!isMenuOpen)}
      />

      <div className="flex flex-1 overflow-hidden pt-[5px]">
        <Sidebar
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          className="overflow-y-auto"
        />

        {/* Mobile backdrop */}
        {/* {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )} */}

        <main
          className={`flex-1 p-2.5 bg-white ${
            isChatRoute ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
