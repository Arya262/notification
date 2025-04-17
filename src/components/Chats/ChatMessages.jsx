const ChatMessages = () => {
  return (
    <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto">
      <div className="bg-white border border-gray-200 shadow-md rounded-xl max-w-sm">
        <img
          src="https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg"
          alt="Restaurant"
          className="w-full h-36 object-cover rounded-t-xl"
        />
        <div className="p-4 text-sm text-gray-800">
          <h4 className="font-semibold text-black mb-2">
            Table Booking Cancellation Request Received
          </h4>
          <p>Hello</p>
          <p className="mt-1">
            We have received your cancellation request for your table booking at FOODCHOW on:
          </p>
          <p className="mt-2">Date: <span className="font-medium">2025-03-10</span></p>
          <p>Time: <span className="font-medium">7:30</span></p>
          <p className="mt-2">
            Your cancellation is being processed. If you have any questions, please contact us at <span className="font-medium">+91 525636396</span>
          </p>
          <p className="mt-3 text-gray-500">We hope to serve you another time!</p>
          <p className="text-gray-500">Foodchow no.1 Online Ordering System</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
