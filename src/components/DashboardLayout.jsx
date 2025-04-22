import Header from "./Header";
import Sidebar from "./Sidebar";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Check if current route is chat
  const isChatRoute = location.pathname.startsWith("/chat");

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        isMenuOpen={isMenuOpen}
        onToggleSidebar={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

        {/* Main content area */}
        <main
          className={`flex-1 p-[10px] bg-white ${
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
