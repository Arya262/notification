import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "./config/api";

import ChatSidebar from "./Chats/chatSiderbar";
import ChatHeader from "./Chats/ChatHeader";
import ChatMessageArea from "./Chats/ChatMessages";
import MessageInput from "./Chats/MessageInput";
import UserDetails from "./Chats/UserDetails";

const Chat = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/conversations?shop_id=1`);
      const enriched = response.data
        .map((c) => ({
          id: c.guest_id,
          conversation_id: c.conversation_id,
          name: `${c.name} ${c.last_name || ""}`.trim(),
          mobile_no: c.mobile_no,
          updated_at: c.updated_at,
          image: c.profile_image,
          active: false,
        }))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      setContacts(enriched);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setContacts((prev) =>
      prev.map((c) => ({ ...c, active: c.id === contact.id }))
    );

    // Only fetch messages if conversation_id is 6
    if (contact.conversation_id) {
      fetchMessagesForContact(contact.conversation_id);
    } else {
      setMessages([]); // Clear messages for other conversation_ids
    }
  };

  const fetchMessagesForContact = async (conversationId) => {
    try {
      const response = await axios.get(
        `${API_BASE}/messages?conversation_id=${conversationId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Function to handle sending messages
  const handleSendMessage = async (newMessageText) => {
    if (!selectedContact) {
      console.error("No contact selected");
      return;
    }

    const newMessage = {
      conversation_id: selectedContact.conversation_id,
      message: newMessageText,
    };

    try {
      const response = await axios.post(
        "http://192.168.1.41:3000/sendmessage",
        newMessage
      );

      console.log("Response from API:", response.data);
      // ✅ Pass the correct conversation ID to refresh messages
      fetchContacts();
      fetchMessagesForContact(selectedContact.conversation_id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-4 w-full border border-gray-300 rounded-2xl bg-white mx-auto max-w-screen-2xl overflow-hidden">
      {loading ? (
        <div className="p-6 text-center text-gray-500 w-full md:w-1/3">
          Loading contacts...
        </div>
      ) : (
        <ChatSidebar
          contacts={contacts}
          selectedContact={selectedContact}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSelectContact={handleSelectContact}
        />
      )}

      <div className="w-full">
        <ChatHeader selectedContact={selectedContact} />

        <div className="w-full md:flex md:flex-row">
          <div className="w-full md:flex-1">
            {selectedContact ? (
              <>
                <ChatMessageArea
                  selectedContact={selectedContact}
                  messages={messages}
                />
                <MessageInput onSendMessage={handleSendMessage} />
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-lg">
                Select a contact to start chatting
              </div>
            )}
          </div>

          <UserDetails
            selectedContact={selectedContact}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
