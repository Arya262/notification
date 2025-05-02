import React, { useState, useEffect,useRef } from "react";
import ContactRow from "./ContactRow";
import AddContact from "./Addcontact";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCrossHighlighted, setIsCrossHighlighted] = useState(false);
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

        <button
          onClick={openPopup} // <-- Add this line
          className="flex items-center gap-2 bg-[#05a3a3] text-white px-4 py-2 min-h-[40px] rounded-md text-sm font-medium"
        >
          <span className="text-lg font-bold">+</span> Add Contact
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
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-lg w-full max-w-3xl shadow-lg relative">
          <div
            ref={popupRef}
            className="bg-white rounded-lg w-full max-w-3xl shadow-lg relative"
          >
          <button
              onClick={closePopup}
              className={`absolute top-2 right-4 text-gray-600 hover:text-black text-3xl font-bold w-8 h-8 flex items-center justify-center pb-2 rounded-full transition-colors ${
                isCrossHighlighted ? "bg-red-500 text-white hover:text-white" : "bg-gray-100"
              }`}
            >
              ×
            </button>
            <AddContact closePopup={closePopup} />
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
