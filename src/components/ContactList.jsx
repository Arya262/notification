import React, { useState, useEffect } from 'react';
import ContactRow from './ContactRow';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/contacts')
      .then((res) => res.json())
      .then((data) => {
        // Debugging: log the raw data to check if last_name exists
        console.log('Raw data:', data);

        // Transform the data
        const transformed = data.map((item) => {
          console.log('Transforming item:', item);  // Log individual items to check values

          return {
            ...item,
            status: item.is_active ? 'Opted-in' : 'Opted-Out',
            date: new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            }),
            number: `+91 ${item.mobile_no}`,
            fullName: `${item.name} ${item.last_name || ''}`.trim(), // Handle missing last name
          };
        });

        // Log transformed data
        console.log('Transformed data:', transformed);

        // Set the transformed data and set loading to false
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

  return (
    <div className="flex-1 p-6">
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

      <div className="overflow-x-auto">
        <div className="min-w-[700px] bg-white rounded-2xl shadow-[0px_-0.91px_3.66px_0px_#00000042] overflow-hidden">
          <div className="flex p-3 border-b font-semibold text-gray-700 bg-[#F4F4F4]">
            <div className="w-1/12 flex justify-center items-center">
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="w-2/12">Created Date</div>
            <div className="w-2/12">Status</div>
            <div className="w-3/12">Customer Name</div>
            <div className="w-2/12">WhatsApp Number</div>
            <div className="w-2/12">24 Hour Status</div>
            <div className="w-3/12">Action</div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading contacts...</div>
          ) : (
            filteredContacts.map((c, idx) => (
              <div key={idx} className="hover:bg-gray-50 transition">
                <ContactRow contact={c} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
