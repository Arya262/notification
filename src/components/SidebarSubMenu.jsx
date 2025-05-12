import { NavLink, useLocation } from "react-router-dom";
import { FileText, List, Compass } from "lucide-react";

const SidebarSubMenu = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const isTemplatesActive = location.pathname.startsWith("/templates");

  return (
    <div className="group relative">
      {/* Main Menu Item */}
      <div
        className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl font-medium text-base shadow-sm cursor-pointer 
        hover:bg-gray-100 ${isTemplatesActive ? "text-teal-500" : "text-black"}`}
      >
        <div className="flex items-center gap-3 group-hover:text-teal-500">
          <span className={`w-5 h-5 flex items-center justify-center text-gray-600 group-hover:text-teal-500 ${isTemplatesActive && "text-teal-500"}`}>
            <FileText size={22} />
          </span>
          <span>Templates</span>
        </div>
        <span className="text-gray-500 transition-transform duration-300 group-hover:rotate-90">{">"}</span>
      </div>

      {/* Submenu */}
      <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-md opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-screen overflow-hidden transition-all duration-300">
        <NavLink
          to="/templates"
          end
          onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl hover:bg-gray-100 ${
              isActive ? "text-teal-500 font-semibold" : "text-black"
            }`
          }
        >
           <span className="w-5 h-5 flex items-center justify-center text-gray-600 group-hover:text-teal-500">
            <List size={22} />
          </span>
          Template List
        </NavLink>
        <NavLink
          to="/templates/explore"
          onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl hover:bg-gray-100 ${
              isActive ? "text-teal-500 font-semibold" : "text-black"
            }`
          }
        >
           <span className="w-5 h-5 flex items-center justify-center text-gray-600 group-hover:text-teal-500">
            <Compass size={22} />
          </span>
          Explore Templates
        </NavLink>
      </div>
    </div>
  );
};

export default SidebarSubMenu;