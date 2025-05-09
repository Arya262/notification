import { forwardRef, useState } from "react";
import deleteIcon from "../../assets/delete.png";

// Function to generate a consistent color based on name
const getAvatarColor = (name) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const ChatHeader = forwardRef(({ selectedContact, onProfileClick }, profileButtonRef) => {
  const [deleting, setDeleting] = useState(false);

  if (!selectedContact) return null;

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete the chat with ${selectedContact.name}?`)) {
      try {
        setDeleting(true);
        console.log("Deleted:", selectedContact.id);
        // TODO: Replace with your actual DELETE API call here
        await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate API delay
      } catch (error) {
        console.error("Failed to delete chat", error);
      } finally {
        setDeleting(false);
      }
    }
  };

  // Function to render avatar
  const renderAvatar = (contact) => {
    if (contact.image) {
      return (
        <img
          src={contact.image}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    
    const firstLetter = contact.name.charAt(0).toUpperCase();
    const bgColor = getAvatarColor(contact.name);
    
    return (
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: bgColor }}
      >
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="chat-header flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-white">
      {/* Profile section with forwarded ref */}
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={onProfileClick}
        ref={profileButtonRef}
      >
        {renderAvatar(selectedContact)}
        <h3 className="font-semibold text-lg text-black">
          {selectedContact.name}
        </h3>
      </div>

      {/* Actions */}
      <div className="chat-header-actions flex items-center space-x-4">
        <button
          className="notification-btn flex items-center text-sm font-medium text-gray-600 hover:text-blue-600"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTEvmZLi1igqILpsyIyKDww7BRlyra3ej3863aEABOq-Rr0iscV"
            alt="Bell Icon"
            className="w-5 h-5 mr-2"
          />
          Hide Notification
        </button>

        <button
          className="delete-btn flex items-center hover:bg-red-100 p-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={deleting}
        >
          {deleting ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin w-5 h-5 text-red-500" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span className="text-red-500 text-sm">Deleting...</span>
            </div>
          ) : (
            <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
});

export default ChatHeader;
