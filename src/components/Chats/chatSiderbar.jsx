import { IoSearchOutline } from "react-icons/io5";

const ChatSidebar = () => {
  return (
    <div className="w-full md:w-1/3 bg-white border-r border-gray-300 p-2">
      <h2 className="text-2xl font-semibold mt-3">Inbox</h2>
      <div className="relative mt-2">
        <input
          type="text"
          placeholder="Search Contact"
          className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500" />
      </div>
      <div className="space-y-2 mt-2 overflow-y-auto max-h-[60vh]">
        {[
          { name: "Demo Guest", time: "5:58 PM", active: true },
          { name: "Guest Demo", time: "5:58 PM" },
          { name: "John Doe", time: "5:58 PM" },
          { name: "Horvat", time: "5:58 PM" },
          { name: "Jan Janssen", time: "5:58 PM" },
        ].map((contact, index) => (
          <div
            key={index}
            className={`flex items-center p-2 border border-gray-300 rounded-md text-sm cursor-pointer ${
              contact.active ? "bg-blue-200" : "bg-white"
            } hover:bg-gray-100`}
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
            <div className="flex-1 flex justify-between items-center">
              <p className="font-semibold">{contact.name}</p>
              <p className="text-sm text-gray-500">{contact.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;