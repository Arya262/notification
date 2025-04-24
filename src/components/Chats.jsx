import React, { useState, useEffect,useRef } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";
import { API_BASE } from "./config/api";

import ChatSidebar from "./Chats/chatSiderbar";
import ChatHeader from "./Chats/ChatHeader";
import ChatMessageArea from "./Chats/ChatMessages";
import MessageInput from "./Chats/MessageInput";
import UserDetails from "./Chats/UserDetails";

const Chat = () => {
  const [showUserDetails, setShowUserDetails] = useState(false); 
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

    // Refs to track clicks outside user details and profile button
    const userDetailsRef = useRef(null);
    const profileButtonRef = useRef(null);

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

    // Close user details if click is outside of the user details area or profile button
    useEffect(() => {
      const handleClickOutside = (e) => {
        // Check if the click is outside the user details or profile button
        if (
          userDetailsRef.current && !userDetailsRef.current.contains(e.target) &&
          !profileButtonRef.current.contains(e.target)
        ) {
          setShowUserDetails(false);  // Close user details
        }
      };
  
      // Add the event listener
      document.addEventListener("click", handleClickOutside);
  
      // Clean up the event listener
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);

  useEffect(() => {
    fetchContacts();
    if (location.state?.contact) {
      handleSelectContact(location.state.contact);
    }
  }, [location.state]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowUserDetails(false); 
    setContacts((prev) =>
      prev.map((c) => ({ ...c, active: c.id === contact.id }))
    );

    if (contact.conversation_id) {
      fetchMessagesForContact(contact.conversation_id);
    } else {
      setMessages([]);
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
      fetchMessagesForContact(selectedContact.conversation_id);
      fetchContacts();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleUserDetails = () => {
    setShowUserDetails((prev) => !prev); // Toggle the user details visibility
  };

  return (
    <div className="flex flex-col md:flex-row w-full border border-gray-300 rounded-2xl bg-white mx-auto max-w-screen-2xl overflow-hidden">
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
        <ChatHeader
          selectedContact={selectedContact}
          onProfileClick={() => setShowUserDetails(true)} 
          ref={profileButtonRef}
        />

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

          {showUserDetails && (
            <div ref={userDetailsRef}> {/* Attach ref here */}
              <UserDetails
                selectedContact={selectedContact}
                isExpanded={true}
                setIsExpanded={() => setShowUserDetails(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
