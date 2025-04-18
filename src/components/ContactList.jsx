import React, { useState, useEffect } from 'react';
import ContactRow from './ContactRow';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/contacts')
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((item) => ({
          ...item,
          status: item.is_active ? 'Opted-in' : 'Opted-Out',
          date: new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }),
          number: `${item.country_code || '+91'} ${item.mobile_no}`,
          fullName: `${item.name} ${item.last_name || ''}`.trim(),
        }));
        setContacts(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch contacts:', err);
        setLoading(false);
      });
  }, []);

  const filterCounts = {
    All: contacts.length,
    'Opted-in': contacts.filter((c) => c.status === 'Opted-in').length,
    'Opted-Out': contacts.filter((c) => c.status === 'Opted-Out').length,
  };

  const filteredContacts = contacts.filter((c) => {
    if (filter === 'All') return true;
    return c.status === filter;
  });

  const filterButtons = ['All', 'Opted-in', 'Opted-Out'];

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentIds = filteredContacts.map((c) => c.id);
    const allSelected = currentIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  return (
    <div className="flex-1">
      {/* Header + Filter Buttons */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-xl font-bold">Contacts</h2>
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => setFilter(btn)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition 
                  ${filter === btn
                    ? 'bg-[#05a3a3] text-white'
                    : 'text-gray-700 hover:text-[#05a3a3]'}`}
              >
                {btn} ({filterCounts[btn]})
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 bg-[#05a3a3] text-white px-4 py-2 rounded text-sm font-medium">
          <span className="text-lg font-bold">+</span> Add Contact
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px] bg-white rounded-2xl shadow-[0px_-0.91px_3.66px_0px_#00000042] overflow-hidden">
          {/* Table Header */}
          <div className="flex p-3 border-b font-semibold text-gray-700 bg-[#F4F4F4]">
            <div className="w-[8%] flex justify-center items-center">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={
                  filteredContacts.length > 0 &&
                  filteredContacts.every((c) => selectedIds.includes(c.id))
                }
                onChange={toggleSelectAll}
              />
            </div>
            <div className="w-[15%]">Created Date</div>
            <div className="w-[12%]">Status</div>
            <div className="w-[20%]">Customer Name</div>
            <div className="w-[18%]">WhatsApp Number</div>
            <div className="w-[14%]">24 Hour Status</div>
            <div className="w-[13%] min-w-[200px] text-left">Action</div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No contacts found.</div>
          ) : (
            filteredContacts.map((c) => (
              <div key={c.id} className="hover:bg-gray-50 transition">
                <ContactRow
                  contact={c}
                  isChecked={selectedIds.includes(c.id)}
                  onCheckboxChange={() => handleCheckboxChange(c.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
