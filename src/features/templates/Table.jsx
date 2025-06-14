import React, { useState, useMemo, useEffect, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import ActionMenu from '../broadcast/components/ActionMenu';
import { useNavigate } from "react-router-dom";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  if (hasTime) {
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return (
      <div className="flex flex-col">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>
    );
  }
  return <span>{formattedDate}</span>;
};

const Table = ({ templates = [], onDelete, onEdit }) => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [localTemplates, setLocalTemplates] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const [shouldFlipUp, setShouldFlipUp] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const dropdownRef = useRef(null);
    const rowRefs = useRef({});

    useEffect(() => {
        const savedTemplates = localStorage.getItem("templates");
        if (savedTemplates) {
            setLocalTemplates(JSON.parse(savedTemplates));
        } else {
            setLocalTemplates(templates);
        }
    }, [templates]);

    useEffect(() => {
        localStorage.setItem("templates", JSON.stringify(localTemplates));
    }, [localTemplates]);

    const filteredCounts = useMemo(() => {
        const approved = localTemplates.filter((t) => t.status?.toLowerCase() === "approved").length;
        const pending = localTemplates.filter((t) => t.status?.toLowerCase() === "pending").length;
         const failed = localTemplates.filter((t) => t.status?.toLowerCase() === "failed").length;
        return {
            all: localTemplates.length,
            approved,
            pending,
            failed,
        };
    }, [localTemplates]);

    const statusFilteredTemplates = useMemo(() => {
        if (activeFilter === "All") return localTemplates;
        return localTemplates.filter(
            (t) => t.status?.toLowerCase().trim() === activeFilter.toLowerCase()
        );
    }, [localTemplates, activeFilter]);

    const displayedTemplates = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return statusFilteredTemplates.filter(
            (t) =>
                t.element_name?.toLowerCase().includes(term) ||
                t.category?.toLowerCase().includes(term)
        );
    }, [statusFilteredTemplates, searchTerm]);

    const filters = [
        { label: "All", count: filteredCounts.all },
        { label: "Approved", count: filteredCounts.approved },
        { label: "Pending", count: filteredCounts.pending },
        { label: "Failed", count: filteredCounts.failed },,
    ];

    const toggleMenu = (index) => {
        setMenuOpen(menuOpen === index ? null : index);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDeleteClick = (template) => {
        setSelectedTemplate(template);
        setShowDeleteDialog(true);
        setMenuOpen(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTemplate) return;
        
        try {
            setIsDeleting(true);
            await onDelete(selectedTemplate.id);
            setShowDeleteDialog(false);
            setSelectedTemplate(null);
        } catch (error) {
            console.error("Error deleting template:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
        setSelectedTemplate(null);
    };

    const handleEditClick = (template) => {
        setMenuOpen(null);
        if (onEdit) {
            onEdit(template);
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="w-full font-sans rounded-[16px] scrollbar-hide scroll-smooth bg-white shadow-[0px_0.91px_3.66px_0px_#00000042] overflow-hidden">
                {/* Header Filters and Search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-2 sm:p-3 md:p-4">
                  
                    <div className="flex-shrink-0 pl-2 pr-3">
                        <p className="font-semibold text-base sm:text-lg md:text-xl text-nowrap">
                            Templates List
                        </p>
                    </div>

                   
                    <div className="flex items-center gap-2 sm:gap-3 flex-grow w-full">
                      
                        <div className="sm:hidden w-full overflow-x-scroll scrollbar-hide">
                            <div className="flex items-center gap-2 scroll-snap-x-mandatory">
                                {filters.map((f, i) => (
                                    <button
                                        key={i}
                                        className={`px-4 py-2 min-h-[40px] rounded-md text-sm font-medium transition 
                                            ${
                                                activeFilter === f.label
                                                    ? "bg-[#05a3a3] text-white"
                                                    : "text-gray-700 hover:text-[#05a3a3]"
                                            }`}
                                        onClick={() => setActiveFilter(f.label)}
                                    >
                                        {f.label} ({f.count})
                                    </button>
                                ))}
                              
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setShowMobileSearch((prev) => !prev)}
                                        className="flex items-center justify-center h-9 w-9 border border-gray-300 rounded-md"
                                        aria-label="Toggle search input"
                                    >
                                        <IoSearch className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                   
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0 overflow-x-auto">
                            {filters.map((f, i) => (
                                <button
                                    key={i}
                                    className={`px-4 py-2 min-h-[40px] rounded-md text-sm font-medium transition 
                                        ${
                                            activeFilter === f.label
                                                ? "bg-[#05a3a3] text-white"
                                                : "text-gray-700 hover:text-[#05a3a3]"
                                        }`}
                                    onClick={() => setActiveFilter(f.label)}
                                >
                                    {f.label} ({f.count})
                                </button>
                            ))}
                        </div>

                    
                        <div className="hidden sm:block flex-grow max-w-[400px] relative ml-auto">
                            <IoSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search template by Name or Category..."
                                className="pl-3 pr-7 py-1.5 sm:py-2 border border-gray-300 text-sm sm:text-base rounded-md w-full focus:outline-none focus:ring focus:border-teal-400 placeholder:text-sm sm:placeholder:text-base"
                            />
                        </div>
                    </div>

               
                    {showMobileSearch && (
                        <div className="sm:hidden w-full px-2 mt-2">
                            <div className="relative">
                                <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search template by Name or Category..."
                                    className="w-full pl-3 pr-6 py-1.5 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring focus:border-teal-400 placeholder:text-base"
                                />
                            </div>
                        </div>
                    )}
                </div>


                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <table className="min-w-[800px] w-full text-sm sm:text-base text-center ">
                        <thead className="bg-gray-100 border-b-2 border-gray-200 font-medium text-gray-700">
                            <tr>
                                <th className="py-4 px-4 text-nowrap">Date</th>
                                <th className="py-4 px-4 text-nowrap">Template Name</th>
                                <th className="py-4 px-4 text-nowrap">Type</th>
                                <th className="py-4 px-4 text-nowrap">Message Type</th>
                                <th className="py-4 px-4 text-nowrap">Status</th>
                                <th className="py-4 px-4 text-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedTemplates.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        No templates found.
                                    </td>
                                </tr>
                            ) : (
                                displayedTemplates.map((template, index) => (
                                    <tr
                                        key={template.id || index}
                                        ref={(el) => (rowRefs.current[index] = el)}
                                        className="border-b border-[#C3C3C3] hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-4">{formatDate(template.created_on)}</td>
                                        <td className="py-4 px-4">{template?.element_name || '-'}</td>
                                        <td className="py-4 px-4">{template?.template_type ? template.template_type.charAt(0).toUpperCase() + template.template_type.slice(1) : '-'}</td>
                                        <td className="py-4 px-4">{template.category ? template.category.charAt(0).toUpperCase() + template.category.slice(1) : '-'}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                template.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                                                template.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {template.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-center items-center gap-2 relative" ref={dropdownRef}>
                                                {/* Send Message Button */}
                                                <button
                                                    onClick={() => navigate('/broadcast', { 
                                                        state: { 
                                                            selectedTemplate: template,
                                                            openForm: true 
                                                        } 
                                                    })}
                                                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-full whitespace-nowrap"
                                                    aria-label={`Send message to ${template.element_name}`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-4 h-4 transform rotate-45"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 12h14M12 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                    <span className="text-sm font-medium">Send Message</span>
                                                </button>

                                                
                                                <button
                                                    onClick={() => toggleMenu(index)}
                                                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                                                    aria-label="Template options"
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-[#000]"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 5v.01M12 12v.01M12 19v.01"
                                                        />
                                                    </svg>
                                                </button>

                                            
                                                {menuOpen === index && (
                                                    <div
                                                        className={`absolute right-0 ${shouldFlipUp ? "bottom-12" : "top-12"} w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20`}
                                                    >
                                                        <button
                                                            onClick={() => handleEditClick(template)}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(template)}
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <DeleteConfirmationDialog
                showDialog={showDeleteDialog}
                title="Delete Template"
                message={`Are you sure you want to delete ${selectedTemplate?.element_name}? This action cannot be undone.`}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Table;