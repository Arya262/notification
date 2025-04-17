import React, { useState } from "react";

import ChatSidebar from "./Chats/chatSiderbar";
import ChatHeader from "./Chats/ChatHeader";
import ChatMessageArea from "./Chats/ChatMessages";
import MessageInput from "./Chats/MessageInput";
import UserDetails from "./Chats/UserDetails";

const Chat = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col md:flex-row mt-4 w-full border border-gray-300 rounded-2xl bg-white mx-auto max-w-screen-2xl overflow-hidden">
      {/* Left Sidebar: Contacts */}
      <ChatSidebar />

      {/* Center: Chat Area and User Details */}
      <div className="w-full">
        <ChatHeader />

        {/* Chat Area */}
        <div className="w-full md:flex md:flex-row">
          <div className="w-full md:flex-1">
            <ChatMessageArea />
            <MessageInput />
          </div>

          {/* Right Sidebar: User Details */}
          <UserDetails isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
