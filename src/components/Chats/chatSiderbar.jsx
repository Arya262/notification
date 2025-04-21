import { IoSearchOutline } from "react-icons/io5";
import { formatTime } from "../../utils/time";

const ChatSidebar = ({
  contacts,
  selectedContact,
  searchQuery,
  onSearchChange,
  onSelectContact,
}) => {
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-1/3 bg-white border-r border-gray-300 p-4">
      <h2 className="text-2xl font-semibold mb-4">Inbox</h2>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search Contact"
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500" />
      </div>

      {/* Contacts List */}
      <div className="space-y-2 overflow-y-auto max-h-[60vh]">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={`flex items-center p-2 border rounded-md text-sm cursor-pointer transition ${
              selectedContact?.id === contact.id
                ? "bg-blue-100 border-blue-400"
                : "bg-white"
            } hover:bg-gray-100`}
          >
            <img
              src={contact.image}
              alt={contact.name}
              className="w-10 h-10 rounded-full mr-4 object-cover"
            />
            <div className="flex-1 flex justify-between items-center">
              <p className="font-semibold">{contact.name}</p>
              <p className="text-sm text-gray-500">
                {formatTime(contact.updated_at)}
              </p>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-4">
            No contacts found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
