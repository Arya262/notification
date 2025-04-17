const MessageInput = () => {
    return (
      <div className="border-t border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            type="text"
            placeholder="Send Message"
            className="text-sm border rounded-md p-2 w-full sm:w-[300px] focus:outline-none"
          />
          <button className="bg-teal-500 text-white whitespace-nowrap flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm w-full sm:w-auto">
            {/* <PaperPlaneIcon className="w-4 h-4" /> */}
            Send Template
          </button>
        </div>
      </div>
    );
  };
  
  export default MessageInput;
  