import Header from "./Header";
import Sidebar from "./Sidebar";
import React, { useState } from "react";
import { Outlet } from "react-router-dom"; 

const DashboardLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header on top */}
      <Header
        isMenuOpen={isMenuOpen}
        onToggleSidebar={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Sidebar and Main Content */}
      <div className="flex flex-1 pt-[5px]">
        {/* Sidebar */}
        <Sidebar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

        {/* Main content */}
        <main className="flex-1 p-[10px] bg-white overflow-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
