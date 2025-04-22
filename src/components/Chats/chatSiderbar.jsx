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
    <div className="w-full md:w-1/3 bg-white border-r border-gray-200 p-4">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4 text-black">
        Inbox
      </h2>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search Contact"
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full p-3 pl-4 pr-12 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0AA89E] shadow-sm"
        />
        <IoSearchOutline className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
      </div>

      {/* Contacts List */}
      <div className="space-y-2 overflow-y-auto max-h-[70vh] scrollbar-hide">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={`flex items-center px-4 py-2 cursor-pointer rounded-xl transition border
              ${
                selectedContact?.id === contact.id
                  ? "border-[#0AA89E] bg-white"
                  : "border-[#E0E0E0] bg-white hover:bg-gray-100"
              }`}
          >
            {/* Avatar */}
            <img
              src={contact.image}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover mr-4"
            />

            {/* Name & Time */}
            <div className="flex-1 flex justify-between items-center">
              <p className="font-semibold text-black">{contact.name}</p>
              <p className="text-sm text-gray-500">
                {formatTime(contact.updated_at).toLowerCase()}
              </p>
            </div>
          </div>
        ))}

        {/* Empty state */}
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
