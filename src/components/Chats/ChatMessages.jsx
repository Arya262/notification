const ChatMessages = ({ contact }) => {
  return (
    <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto flex items-start">
      <div className="relative bg-white border border-teal-400 rounded-xl shadow-md max-w-md ml-6">

        {/* PERFECT triangle tail — top-left */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-white border-l border-t border-teal-400 rotate-45 z-10"></div>

        {/* Image */}
        <img
          src="https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg"
          alt="Restaurant Hall"
          className="w-full h-40 object-cover rounded-t-xl"
        />

        {/* Message Content */}
        <div className="p-4 space-y-2 text-sm text-left">
          <h4 className="font-semibold text-black">
            Table Booking Cancellation Request Received
          </h4>
          <p>Hello</p>
          <p>
            We have received your cancellation request for your Table booking at FOODCHOW on:
          </p>
          <p className="text-gray-500">Date: 2025-03-10</p>
          <p className="text-gray-500">7:30</p>
          <p>
            Your cancellation is being <span className="font-bold">processed</span>. If you have any questions, please contact us at <span className="font-bold">+91 525636396</span>
          </p>
          <p className="text-gray-400">We hope to serve you another time!</p>
          <p className="text-gray-400">Foodchow no.1 Online Ordering System</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
