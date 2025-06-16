import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";
import SingleDeleteDialog from "./SingleDeleteDialog";
import EditContact from "./EditContact";

const SingleDeleteConfirmationDialog = ({
  showDialog,
  contactName,
  onCancel,
  onConfirm,
  isDeleting,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  if (!showDialog) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-5 flex items-center justify-center z-50 transition-opacity duration-300"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg transform transition-all duration-300 scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="single-delete-dialog-title"
        aria-describedby="single-delete-dialog-message"
        tabIndex="-1"
      >
        <div className="flex items-center gap-3 mb-4">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3
            id="single-delete-dialog-title"
            className="text-lg font-semibold text-gray-800"
          >
            Delete Confirmation
          </h3>
        </div>
        <p id="single-delete-dialog-message" className="text-gray-600 mb-6">
          Are you sure you want to delete {contactName}? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-3 py-2 w-[70px] bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-3 py-2 w-[70px] bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center"
            aria-label="Delete"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ContactRow({
  contact,
  isChecked,
  onCheckboxChange,
  onDelete,
  onEdit,
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [shouldFlipUp, setShouldFlipUp] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isCrossHighlighted, setIsCrossHighlighted] = useState(false);
  const dropdownRef = useRef(null);
  const rowRef = useRef(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => {
      const next = !prev;
      if (next && rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setShouldFlipUp(spaceBelow < 160);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChat = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.CONTACTS.GET_CONVERSATION_ID(contact.contact_id),
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!data || !data.conversation_id) {
        console.error(
          "No conversation_id found for contact",
          contact.customer_id
        );
        return;
      }

      // Navigate with the contact and conversation ID
      navigate("/chats", {
        state: {
          customer_id: contact.customer_id,
          conversation_id: data.conversation_id,
        },
      });
    } catch (error) {
      console.error("Failed to fetch conversation ID", error);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await onDelete(contact.id);
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    setShowEditDialog(true);
  };

  const handleEditClose = () => {
    setShowEditDialog(false);
    setIsCrossHighlighted(false);
  };

  const handleEditSuccess = () => {
    if (onEdit) {
      onEdit();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setTimeout(() => setIsCrossHighlighted(true), 0);
      } else {
        setIsCrossHighlighted(false);
      }
    };

    if (showEditDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEditDialog]);

  return (
    <>
      <tr
        ref={rowRef}
        className="border-t border-b border-b-[#C3C3C3] hover:bg-gray-50 text-md"
      >
        <td className="px-2 py-4 sm:px-4">
          <div className="flex items-center justify-center h-full">
            <input
              type="checkbox"
              className="form-checkbox w-4 h-4"
              checked={isChecked}
              onChange={onCheckboxChange}
            />
          </div>
        </td>
        <td className="px-2 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-[12px] sm:text-[16px] text-gray-700">
          {contact.date}
        </td>
        <td className="px-2 py-4 text-[12px] sm:text-[16px] text-green-600">
          {contact.status}
        </td>
        <td className="px-2 py-4 text-[12px] sm:text-[16px] text-gray-700">
          {contact.fullName}
        </td>
        <td className="px-2 py-4 text-[12px] sm:text-[16px] text-gray-700">
          {contact.user_country_code}
          {contact.number}
        </td>
        <td className="px-2 py-4 text-[12px] sm:text-[16px]">
          <span
            className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium min-w-[80px] text-center
              ${contact.is_active === 1 ? "bg-green-500" : "bg-red-400"}`}
          >
            {contact.is_active === 1 ? "Active" : "Inactive"}
          </span>
        </td>
        <td className="relative py-4">
          <div ref={dropdownRef} className="flex justify-center">
            <button
              onClick={handleChat}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-full whitespace-nowrap mr-2"
              aria-label={`Send message to ${contact.fullName}`}
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
              onClick={toggleDropdown}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              aria-label="Contact options"
            >
              <svg
                className="w-5 h-5 text-gray-600"
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
            {isDropdownOpen && (
              <div
                className={`absolute right-0 ${
                  shouldFlipUp ? "bottom-12" : "top-12"
                } w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20`}
              >
                <button
                  onClick={handleEditClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
      <SingleDeleteDialog
        showDialog={showDeleteDialog}
        contactName={contact.fullName}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
      {showEditDialog && (
        <div
          className="fixed inset-0 bg-white/40 flex items-center justify-center z-50 transition-all duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCrossHighlighted(true);
              setTimeout(() => setIsCrossHighlighted(false), 2000);
            }
          }}
        >
          <div
            ref={popupRef}
            className={`bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative sm:animate-slideUp border ${
              isCrossHighlighted ? "border-teal-500" : "border-gray-300"
            } transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleEditClose}
              className={`absolute top-2 right-4 text-gray-600 hover:text-black text-3xl font-bold w-8 h-8 flex items-center justify-center pb-2 rounded-full transition-colors ${
                isCrossHighlighted
                  ? "bg-red-500 text-white hover:text-white"
                  : "bg-gray-100"
              }`}
            >
              ×
            </button>
            <EditContact
              contact={contact}
              closePopup={handleEditClose}
              onSuccess={handleEditSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}
