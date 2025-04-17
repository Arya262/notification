import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Contact2,
  FileText,
  MessageCircle,
  Megaphone,
  Settings,
  HelpCircle,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/" },
    { name: "Contact List", icon: <Contact2 size={22} />, path: "/contact" },
    { name: "Templates", icon: <FileText size={22} />, path: "/templates" },
    { name: "Chats", icon: <MessageCircle size={22} />, path: "/chats" },
    { name: "Broadcast", icon: <Megaphone size={22} />, path: "/broadcast" },
    { name: "Setting", icon: <Settings size={22} />, path: "/settings" },
    { name: "Help", icon: <HelpCircle size={22} />, path: "/help" },
  ];

  // Close sidebar on outside click for < lg screens
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("button") &&
        window.innerWidth < 1024 // only for small and tablet
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Close sidebar on route change for < lg screens
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <div
      ref={sidebarRef}
      role="navigation"
      aria-label="Main sidebar"
      className={`fixed top-16 left-0 h-screen w-64 bg-white p-4 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        mt-8 lg:mt-0
        lg:relative lg:translate-x-0 lg:top-auto lg:left-auto lg:h-auto shadow-[0px_4px_4px_0px_#00000040]`}
    >
      <div className="flex flex-col gap-4 mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-base shadow-sm transition-all duration-200 ${
                isActive
                  ? "bg-teal-500 text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`
            }
          >
            <span
              className={`w-5 h-5 flex items-center justify-center ${
                location.pathname === item.path
                  ? "text-white"
                  : "text-gray-600 group-hover:text-teal-500"
              }`}
            >
              {item.icon}
            </span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
