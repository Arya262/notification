import deleteIcon from "../../assets/delete.png";

const ChatHeader = ({ selectedContact }) => {
  if (!selectedContact) return null; // 🔥 This hides the header entirely if no contact is selected

  return (
    <>
      <div className="chat-header flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          {selectedContact.avatar ? (
            <img
              src={selectedContact.avatar}
              alt={selectedContact.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          )}

          {/* Name */}
          <h3 className="font-semibold text-lg">{selectedContact.name}</h3>
        </div>

        {/* Actions */}
        <div className="chat-header-actions flex items-center space-x-4">
          <button
            className="notification-btn flex items-center text-md font-semibold hover:text-blue-600"
            aria-label="Hide notifications"
            title="Hide notifications"
          >
            <img
              src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTEvmZLi1igqILpsyIyKDww7BRlyra3ej3863aEABOq-Rr0iscV"
              alt="Bell Icon"
              className="w-[20px] h-[20px] mr-2"
            />
            Hide Notification
          </button>

          <button
            className="delete-btn flex items-center hover:bg-red-100 p-1 rounded"
            aria-label="Delete chat"
            title="Delete chat"
            onClick={() => alert(`Delete chat with ${selectedContact.name}?`)}
          >
            <img src={deleteIcon} alt="Delete" className="w-8 h-8" />
          </button>
        </div>
      </div>
      <hr className="chat-separator" />
    </>
  );
};

export default ChatHeader;
