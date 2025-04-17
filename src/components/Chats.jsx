import { useState } from "react";
import ContactList from "./Chats/ContactList";
import ChatHeader from "./Chats/ChatHeader";
import ChatMessages from "./Chats/ChatMessages";
import MessageInput from "./Chats/MessageInput";
import UserDetails from "./Chats/UserDetails";

const Chats = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const contacts = [
    { name: "Demo Guest", time: "5:58 PM", active: true },
    { name: "Guest Demo", time: "5:58 PM" },
    { name: "John Doe", time: "5:58 PM" },
    { name: "Horvat", time: "5:58 PM" },
    { name: "Jan Janssen", time: "5:58 PM" },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="flex flex-col md:flex-row mt-4 w-full border border-gray-300 rounded-2xl bg-white mx-auto max-w-11xl">
      {/* Left Sidebar: Contacts */}
      <ContactList
        contacts={contacts}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSelectContact={handleSelectContact}
      />

      {/* Center: Chat Area */}
      <div className="w-full md:w-3/4 relative border-l border-gray-200">
        {selectedContact && (
          <>
            <ChatHeader contact={selectedContact} />
            <ChatMessages contact={selectedContact} />
            <MessageInput />
          </>
        )}
      </div>

      {/* Right Sidebar: User Details */}
      <div className=" md:block w-full md:w-1/4 border-l border-gray-200">
        <UserDetails isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </div>
    </div>
  );
};

export default Chats;
