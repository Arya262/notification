const ContactList = ({ contacts, searchQuery, onSearchChange, onSelectContact }) => {
    return (
      <div className="w-full md:w-1/4 bg-white border-r border-gray-200 p-4">
        <h2 className="text-2xl font-semibold mb-4">Inbox</h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search Contact"
            value={searchQuery}
            onChange={onSearchChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {contacts
            .filter(contact =>
              contact.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((contact, index) => (
              <div
                key={index}
                onClick={() => onSelectContact(contact)}
                className={`flex items-center p-2 rounded-lg cursor-pointer border ${
                  contact.active ? "bg-teal-100" : "bg-white"
                } hover:bg-gray-100`}
              >
                <img
                  src={contact.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <p className="font-semibold">{contact.name}</p>
                </div>
                <span className="text-sm text-gray-500">{contact.time}</span>
              </div>
            ))}
        </div>
      </div>
    );
  };
  
  export default ContactList;
  