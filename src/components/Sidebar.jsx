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

  return (
    <div
      ref={sidebarRef}
      role="navigation"
      aria-label="Main sidebar"
      className={`fixed top-16 left-0 h-screen w-64 bg-white z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        mt-14 md:mt-2 lg:mt-0
        lg:relative lg:translate-x-0 lg:top-auto lg:left-auto lg:h-auto
        shadow-[0px_4px_4px_0px_#00000040] lg:sticky ${className}`}
    >
      <div className="h-full overflow-y-auto p-4">
        <div className="flex flex-col gap-4 ">
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
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-base shadow-sm transition-all duration-200 
                  ${
                    isActive
                      ? "bg-teal-500 text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`w-5 h-5 flex items-center justify-center ${
                        isActive
                          ? "text-white"
                          : "text-gray-600 group-hover:text-teal-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
