import Header from "./Header";
import Sidebar from "./Sidebar";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        {/* Main content area — only this scrolls */}
        <main className="flex-1 p-[10px] bg-white overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
