import { IoSearchOutline } from "react-icons/io5";

const getAvatarColor = (name = "User") => {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`; // More dynamic and visually distinct colors
};

const formatLastMessageTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getMessagePreview = (message, type) => {
  if (!message && !type) return null;

  if (message && type === "text") {
    return message;
  }

  switch (type) {
    case "image":
      return "📷 Photo";
    case "video":
      return "🎥 Video";
    case "document":
      return "📄 Document";
    case "audio":
      return "🎵 Audio";
    case "location":
      return "📍 Location";
    case "contact":
      return "👤 Contact";
    case "template":
      return "📋 Template";
    default:
      return message || "";
  }
};

const ChatSidebar = ({
  contacts,
  selectedContact,
  searchQuery,
  onSearchChange,
  onSelectContact,
}) => {
  const filteredContacts = (contacts || []).filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAvatar = (contact) => {
    const name = contact?.name || "User";
    const firstLetter = name.charAt(0).toUpperCase();
    const bgColor = getAvatarColor(name);

    if (contact.image) {
      return (
        <img
          src={contact.image}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover mr-4"
        />
      );
    }

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
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200 p-4">
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
      <div className="space-y-2 overflow-y-auto flex-1 scrollbar-hide">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact, index) => (
            <div
              key={contact.id ?? `contact-${index}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectContact(contact)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectContact(contact);
                }
              }}
              className={`flex items-center px-2 py-1 cursor-pointer rounded-xl transition border focus:outline-none w-full max-w-full
                ${
                  selectedContact?.id === contact.id
                    ? "border-[#0AA89E] bg-white"
                    : "border-[#E0E0E0] bg-white hover:bg-gray-100"
                }`}
            >
              {/* Avatar */}
              <div className="shrink-0">{renderAvatar(contact)}</div>

              {/* Contact Details */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex justify-between items-center space-x-2">
                  <p className="font-semibold text-black truncate max-w-[160px]">
                    {contact.name || "Unnamed"}
                  </p>
                  <p className="text-xs text-gray-500 select-none shrink-0">
                    {formatLastMessageTime(contact.lastMessageTime)}
                  </p>
                </div>

                <div className="w-full overflow-hidden">
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {getMessagePreview(
                      contact.lastMessage,
                      contact.lastMessageType
                    ) || <span className="italic text-gray-400">No messages yet</span>}
                  </p>
                </div>
              </div>
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
