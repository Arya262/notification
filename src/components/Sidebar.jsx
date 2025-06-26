import { useEffect, useRef, useCallback } from "react";
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
import SidebarSubMenu from "./SidebarSubMenu";

const Sidebar = ({ isOpen, setIsOpen, className = "" }) => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/" },
    { name: "Contact List", icon: <Contact2 size={22} />, path: "/contact" },
    {
      name: "Templates",
      icon: <FileText size={22} />,
      path: "/templates",
      submenu: true,
    },
    { name: "Chats", icon: <MessageCircle size={22} />, path: "/chats" },
    { name: "Broadcast", icon: <Megaphone size={22} />, path: "/broadcast" },
    { name: "Setting", icon: <Settings size={22} />, path: "/settings" },
    { name: "Help", icon: <HelpCircle size={22} />, path: "/help" },
  ];

  const handleClickOutside = useCallback(
    (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target?.closest("button") &&
        window.innerWidth < 1024
      ) {
        setIsOpen(false);
      }
    },
    [isOpen, setIsOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={sidebarRef}
      role="navigation"
      aria-label="Main sidebar"
      tabIndex={-1}
      className={`
  fixed top-0 left-0 z-50
  w-64 h-screen
  bg-[#fff] text-white
  flex flex-col
  transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  lg:relative lg:translate-x-0 lg:top-0 lg:h-auto
  lg:bg-white lg:text-black
  shadow-2xl lg:shadow-2xl
  ${className}
`}
    >
      {/* Logo/Header (non-scrollable) */}
      <div className="px-4 py-5 border-b border-white/10 lg:hidden shrink-0">
        <NavLink to="/" onClick={handleNavClick}>
          <img src="/logo.png" alt="Logo" className="h-8" />
        </NavLink>
      </div>

      {/* Scrollable content area only */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {menuItems.map((item) =>
          item.submenu ? (
            <SidebarSubMenu
              key={item.name}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          ) : (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-base shadow-sm transition-all duration-200 ${
                  isActive
                    ? "bg-teal-500 text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`
              }
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </NavLink>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
