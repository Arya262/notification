import { IoSearchOutline } from "react-icons/io5";
import { formatTime } from "../../utils/time";

// Function to generate a consistent color based on name
const getAvatarColor = (name) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const ChatSidebar = ({
  contacts,
  selectedContact,
  searchQuery,
  onSearchChange,
  onSelectContact,
  onDeleteContact, // <-- NEW PROP for removing contact after delete
}) => {
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to render avatar
  const renderAvatar = (contact) => {
    if (contact.image) {
      return (
        <img
          src={contact.image}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover mr-4"
        />
      );
    }
    
    const firstLetter = contact.name.charAt(0).toUpperCase();
    const bgColor = getAvatarColor(contact.name);
    
    return (
      <div 
        className="w-10 h-10 rounded-full mr-4 flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: bgColor }}
      >
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="w-full md:w-1/3 bg-white border-r border-gray-200 p-4">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4 text-black">Inbox</h2>

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
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectContact(contact)}
              onKeyDown={(e) => e.key === "Enter" && onSelectContact(contact)}
              className={`flex items-center px-2 py-1 cursor-pointer rounded-xl transition border focus:outline-none
                ${
                  selectedContact?.id === contact.id
                    ? "border-[#0AA89E] bg-white"
                    : "border-[#E0E0E0] bg-white hover:bg-gray-100"
                }`}
            >
              {/* Avatar */}
              {renderAvatar(contact)}

              {/* Contact Details */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-black">{contact.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatTime(contact.lastMessageTime)}
                  </p>
                </div>
                {/* Optional Last Message */}
                {contact.lastMessage && (
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {contact.lastMessage}
                  </p>
                )}
              </div>

              {/* Small delete button beside contact if you want (optional) */}
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteContact?.(contact.id);
                }}
                className="text-gray-400 hover:text-red-500 ml-2"
              >
                ✖
              </button> */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm mt-4">
            No contacts found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
