import React, { useState, useEffect,useRef } from "react";
import ContactRow from "./ContactRow";
import AddContact from "./Addcontact";
import vendor from "../../assets/vector.png";

const ConfirmationDialog = ({ showExitDialog, hasUnsavedChanges, cancelExit, confirmExit }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        cancelExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cancelExit]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  if (!showExitDialog) return null;

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
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
        tabIndex="-1"
      >
        <div className="flex items-center gap-3 mb-4">
          <svg
            className="w-6 h-6 text-teal-500"
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
          <h3 id="dialog-title" className="text-lg font-semibold text-gray-800">
            Exit Confirmation
          </h3>
        </div>
        <p id="dialog-message" className="text-gray-600 mb-6">
          {hasUnsavedChanges
            ? "You have unsaved changes. Are you sure you want to exit?"
            : "Are you sure you want to exit?"}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelExit}
            className="px-3 py-2 w-[70px] bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={confirmExit}
            className="px-3 py-2 w-[70px] bg-teal-500 text-white rounded-md hover:bg-teal-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Confirm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCrossHighlighted, setIsCrossHighlighted] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const popupRef = useRef(null);
  

  useEffect(() => {
    fetch("http://localhost:3000/contacts?shop_id=1")
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((item) => ({
          ...item,
          status: item.is_active ? "Opted-in" : "Opted-Out",
          customer_id: item.customer_id,
          date: new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          number: `${item.country_code || ""} ${item.mobile_no}`,
          fullName: `${item.name} ${item.last_name || ""}`.trim(),
        }));
        setContacts(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch contacts:", err);
        setLoading(false);
      });
  }, []);

  const filterCounts = {
    All: contacts.length,
    "Opted-in": contacts.filter((c) => c.status === "Opted-in").length,
    "Opted-Out": contacts.filter((c) => c.status === "Opted-Out").length,
  };

  const filteredContacts = contacts.filter((c) => {
    if (filter === "All") return true;
    return c.status === filter;
  });

  const filterButtons = ["All", "Opted-in", "Opted-Out"];

  // Handle Select All checkbox change
  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    const newSelected = {};
    if (checked) {
      filteredContacts.forEach((_, idx) => {
        newSelected[idx] = true;
      });
    }
    setSelectedRows(newSelected);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (idx, event) => {
    setSelectedRows((prev) => ({
      ...prev,
      [idx]: event.target.checked,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setTimeout(() => setIsCrossHighlighted(true), 0);
      } else {
        setIsCrossHighlighted(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    const total = filteredContacts.length;
    const selected = Object.values(selectedRows).filter(Boolean).length;
    setSelectAll(selected === total && total > 0);
  }, [selectedRows, filteredContacts.length]);
  

  const handleCloseAndNavigate = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    setIsPopupOpen(false);
    setShowExitDialog(false);
    setIsCrossHighlighted(false);
  };

  const cancelExit = () => {
    setShowExitDialog(false);
    setIsCrossHighlighted(false);
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-xl font-bold">Contacts</h2>
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => setFilter(btn)}
                className={`px-4 py-2 min-h-[40px] rounded-md text-sm font-medium transition 
                  ${
                    filter === btn
                      ? "bg-[#05a3a3] text-white"
                      : "text-gray-700 hover:text-[#05a3a3]"
                  }`}
              >
                {btn} ({filterCounts[btn]})
              </button>
            ))}
          </div>
        </div>

        {/* <button*/}
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 px-4 py-2 rounded"
          onClick={openPopup}
        >
          <img src={vendor} alt="plus sign" className="w-5 h-5" />
          Add Contact
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px] bg-white rounded-2xl shadow-[0px_-0.91px_3.66px_0px_#00000042] overflow-hidden">
          <div className="flex p-3 border-b font-semibold text-gray-700 bg-[#F4F4F4]">
            <div className="w-[8%] flex justify-center items-center">
            <input
                    type="checkbox"
                    className="form-checkbox w-4 h-4"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
            </div>
            <div className="w-[15%]">Created Date</div>
            <div className="w-[12%]">Status</div>
            <div className="w-[20%]">Customer Name</div>
            <div className="w-[18%]">WhatsApp Number</div>
            <div className="w-[14%]">24 Hour Status</div>
            <div className="w-[13%] min-w-[200px] text-center">Action</div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading contacts...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No contacts found.
            </div>
          ) : (
            filteredContacts.map((contact, idx) => (
              <div key={contact.id} className="hover:bg-gray-50 transition">
                <ContactRow
                  contact={contact}
                  isChecked={!!selectedRows[idx]}
                  onCheckboxChange={(e) => handleCheckboxChange(idx, e)}
                />
              </div>
            ))
          )}
        </div>
      </div>
      {isPopupOpen && (
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
              onClick={handleCloseAndNavigate}
              className={`absolute top-2 right-4 text-gray-600 hover:text-black text-3xl font-bold w-8 h-8 flex items-center justify-center pb-2 rounded-full transition-colors ${
                isCrossHighlighted ? "bg-red-500 text-white hover:text-white" : "bg-gray-100"
              }`}
            >
              ×
            </button>
            <AddContact closePopup={closePopup} />
          </div>
        </div>
      )}
      <ConfirmationDialog
        showExitDialog={showExitDialog}
        hasUnsavedChanges={false}
        cancelExit={cancelExit}
        confirmExit={confirmExit}
      />
    </div>
  );
}
