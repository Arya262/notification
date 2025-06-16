import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import { API_BASE, API_ENDPOINTS } from "../../config/api";

import ChatSidebar from "./chatSiderbar";
import ChatHeader from "./ChatHeader";
import ChatMessageArea from "./ChatMessages";
import MessageInput from "./MessageInput";
import UserDetails from "./UserDetails";

const Chat = () => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const socket = useSocket();

  const userDetailsRef = useRef(null);
  const profileButtonRef = useRef(null);
  const { user } = useAuth();

  const fetchContacts = async () => {
    try {
      setLoading(true);

      // const token = localStorage.getItem("auth_token");
      // const response = await axios.get(
      //   `${API_ENDPOINTS.CHAT.CONVERSATIONS}?customer_id=3161`,
      //   {

      //   }
      // );

      const response = await fetch(
        `${API_ENDPOINTS.CHAT.CONVERSATIONS}?customer_id=${user?.customer_id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      const enriched = await Promise.all(
        data.map(async (c) => {
          let lastMessage = null;
          let lastMessageType = null;
          let lastMessageTime = c.updated_at;

          if (c.conversation_id) {
            try {
              const messagesResponse = await fetch(
                `${API_ENDPOINTS.CHAT.MESSAGES}?conversation_id=${c.conversation_id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );
              if (messagesResponse.data?.length > 0) {
                const latestMessage =
                  messagesResponse.data[messagesResponse.data.length - 1];
                lastMessage =
                  latestMessage.content || latestMessage.element_name;
                lastMessageType = latestMessage.message_type;
                lastMessageTime = latestMessage.sent_at;
              }
            } catch (error) {
              console.error(
                `Failed to fetch messages for conversation ${c.conversation_id}`,
                error
              );
            }
          }

          return {
            id: c.customer_id,
            conversation_id: c.conversation_id,
            name: `${c.first_name} ${c.last_name || ""}`.trim(),
            mobile_no: c.mobile_no,
            updated_at: c.updated_at,
            image: c.profile_image,
            active: false,
            lastMessage,
            lastMessageType,
            lastMessageTime,
          };
        })
      );
      const sortedContacts = enriched.sort(
        (a, b) =>
          new Date(b.lastMessageTime || b.updated_at) -
          new Date(a.lastMessageTime || a.updated_at)
      );

      setContacts(sortedContacts);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    if (location.state?.contact) {
      handleSelectContact(location.state.contact);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userDetailsRef.current &&
        !userDetailsRef.current.contains(e.target) &&
        !profileButtonRef.current.contains(e.target)
      ) {
        setShowUserDetails(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      console.log("New message received:", message);

      if (
        selectedContact &&
        message.conversation_id === selectedContact.conversation_id
      ) {
        setMessages((prev) => [...prev, message]);
      }

      setContacts((prevContacts) => {
        const contactExists = prevContacts.some(
          (c) => c.conversation_id === message.conversation_id
        );
        if (!contactExists) return prevContacts;

        const updated = prevContacts.map((contact) =>
          contact.conversation_id === message.conversation_id
            ? {
                ...contact,
                lastMessageTime: message.sent_at || new Date().toISOString(),
                lastMessage: message.content || message.element_name,
                lastMessageType: message.message_type,
              }
            : contact
        );

        updated.sort(
          (a, b) =>
            new Date(b.lastMessageTime || b.updated_at) -
            new Date(a.lastMessageTime || a.updated_at)
        );

        return [...updated];
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedContact]);

  const handleSelectContact = (contact) => {
    console.log("Selected contact:", contact);
    setSelectedContact(contact);
    setShowUserDetails(false);
    setContacts((prev) =>
      prev.map((c) => ({ ...c, active: c.id === contact.id }))
    );

    if (contact.conversation_id) {
      console.log(
        "Fetching messages for conversation:",
        contact.conversation_id
      );
      fetchMessagesForContact(contact.conversation_id);
      if (socket) {
        socket.emit("join_conversation", String(contact.conversation_id));
        console.log("Joined conversation room:", contact.conversation_id);
      }
    } else {
      console.log("No conversation_id found for contact");
      setMessages([]);
    }
  };

  const fetchMessagesForContact = async (conversationId) => {
    try {
      console.log("Making API request for messages...");

      const response = await axios.get(
        `${API_ENDPOINTS.CHAT.MESSAGES}?conversation_id=${conversationId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      console.log("Messages API response:", response.data);
      setMessages(response.data);

      if (response.data?.length > 0) {
        const latestMessage = response.data[response.data.length - 1];
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.conversation_id === conversationId
              ? {
                  ...contact,
                  lastMessageTime: latestMessage.sent_at,
                  lastMessage:
                    latestMessage.content || latestMessage.element_name,
                  lastMessageType: latestMessage.message_type,
                }
              : contact
          )
        );
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSendMessage = async (input) => {
    if (!selectedContact) {
      console.error("No contact selected");
      return;
    }

    const newMessage = {
      conversation_id: selectedContact.conversation_id,
    };

    let messageType = "text";
    if (typeof input === "string") {
      newMessage.message = input;
    } else if (typeof input === "object" && input.template_name) {
      newMessage.element_name = input.template_name;
      messageType = "template";
    } else {
      console.warn("Invalid message format");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/sendmessage`, newMessage);
      console.log("Response from API:", response.data);

      setContacts((prevContacts) => {
        const updatedContacts = prevContacts.map((contact) =>
          contact.id === selectedContact.id
            ? {
                ...contact,
                lastMessageTime: new Date().toISOString(),
                lastMessage:
                  typeof input === "string" ? input : input.template_name,
                lastMessageType: messageType,
              }
            : contact
        );
        return updatedContacts.sort(
          (a, b) =>
            new Date(b.lastMessageTime || b.updated_at) -
            new Date(a.lastMessageTime || a.updated_at)
        );
      });

      fetchMessagesForContact(selectedContact.conversation_id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleUserDetails = () => {
    setShowUserDetails((prev) => !prev);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen border border-gray-300 rounded-2xl bg-white mx-auto max-w-screen-2xl overflow-hidden">
      {loading ? (
        <div className="w-full md:w-1/3 p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
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

      <div className="w-full h-full flex flex-col">
        <ChatHeader
          selectedContact={selectedContact}
          onProfileClick={toggleUserDetails}
          ref={profileButtonRef}
        />

        <div className="w-full md:flex md:flex-row h-full">
          <div className="w-full md:flex-1 h-full">
            {selectedContact ? (
              <>
                <ChatMessageArea
                  selectedContact={selectedContact}
                  messages={messages || []}
                />
                <MessageInput
                  onSendMessage={handleSendMessage}
                  selectedContact={selectedContact}
                />
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-lg">
                Select a contact to start conversation
              </div>
            )}
          </div>

          {showUserDetails && (
            <div ref={userDetailsRef}>
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
