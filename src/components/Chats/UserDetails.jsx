const UserDetails = ({ isExpanded, setIsExpanded }) => {
  return (
    <div className="w-full md:w-auto md:min-w-[300px] bg-white border-l border-gray-300 p-0">
      <div className="user-details h-full">
        <div className="profile mt-3">
          <div className="avatar">
            <img
              src="https://via.placeholder.com/60"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h3>Demo Guest</h3>
          <p>+91 85968 95689</p>
          <p className="opted-in">Opted-in</p>
        </div>
        <hr className="hr" />
        <div className="flex justify-between items-center p-2 mt-0 mb-0 space-x-0">
          <p className="text-sm font-bold text-black">Last Message</p>
          <p className="text-sm text-black">3:59 PM</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm pl-2 text-black font-bold mr-9 text-nowrap">
            24 Hours Status
          </p>
          <span className="px-4 py-1 bg-red-600 mb-3 text-white text-sm rounded-full">
            Inactive
          </span>
        </div>
        <div
          className="details-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-gray-400">GENERAL DETAILS</span>
          <svg
            className={`w-4 h-4 text-gray-500 ${isExpanded ? "rotated" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        {isExpanded && (
          <div className="space-y-3 p-2">
            <div className="w-full">
              <span className="block text-md font-medium text-black text-left mb-2">
                Status
              </span>
              <div className="relative w-full">
                <select className="w-full p-2 border border-gray-300 rounded-md font-semibold bg-white text-sm appearance-none focus:outline-none pr-8">
                  <option>Open</option>
                  <option>Close</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full">
              <span className="block text-md text-black font-semibold text-left mb-2">
                Tags
              </span>
              <div className="relative w-full">
                <select className="w-full p-2 border border-gray-300 rounded-md text-gray-400 bg-white text-sm appearance-none focus:outline-none pr-8">
                  <option>+ Add Tags</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full">
              <span className="block text-md font-medium text-black text-left mb-2">
                Incoming Status
              </span>
              <div className="relative w-full">
                <select className="w-full p-2 border font-semibold border-gray-300 rounded-md bg-white text-sm appearance-none focus:outline-none pr-8">
                  <option>Allowed</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;