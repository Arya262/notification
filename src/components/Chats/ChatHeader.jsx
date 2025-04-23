import deleteIcon from "../../assets/delete.png";

const ChatHeader = ({ selectedContact, onProfileClick }) => {
  if (!selectedContact) return null;

  return (
    <div className="chat-header flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-white">
      {/* Profile section - make it clickable */}
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={onProfileClick} // 👈 trigger the detail panel
      >
        {selectedContact.image ? (
          <img
            src={selectedContact.image}
            alt={selectedContact.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
        )}

        <h3 className="font-semibold text-lg text-black">
          {selectedContact.name}
        </h3>
      </div>

      {/* Right-side actions */}
      <div className="chat-header-actions flex items-center space-x-4">
        <button
          className="notification-btn flex items-center text-sm font-medium text-gray-600 hover:text-blue-600"
          aria-label="Hide notifications"
          title="Hide notifications"
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
          aria-label="Delete chat"
          title="Delete chat"
          onClick={() => {
            if (
              confirm(`Are you sure you want to delete the chat with ${selectedContact.name}?`)
            ) {
              console.log("Deleted:", selectedContact.id);
            }
          }}
        >
          <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;