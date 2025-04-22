import { useState, useEffect } from "react";
import searchIcon from "../../assets/search.png";
import deleteIcon from "../../assets/delet.png";

const data = [
  {
    date: "Apr 07, 2025",
    name: "Offer",
    type: "Manual Broadcast",
    msgType: "Template Massage",
    schedule: "Instant",
    status: "Live",
  },
  {
    date: "Apr 07, 2025",
    name: "Festival",
    type: "Manual Broadcast",
    msgType: "Template Massage",
    schedule: "Instant",
    status: "Live",
  },
  {
    date: "Apr 10, 2025",
    name: "Summer Sale",
    type: "Manual Broadcast",
    msgType: "Template Massage",
    schedule: "Later",
    status: "Paused",
  },
  {
    date: "Apr 11, 2025",
    name: "Flash Deal",
    type: "Manual Broadcast",
    msgType: "Text Massage",
    schedule: "Scheduled",
    status: "Paused",
  },
  {
    date: "Apr 12, 2025",
    name: "Survey",
    type: "Manual Broadcast",
    msgType: "Text Massage",
    schedule: "Scheduled",
    status: "Opted-Out",
  },
  {
    date: "Apr 13, 2025",
    name: "Welcome",
    type: "Manual Broadcast",
    msgType: "Template Massage",
    schedule: "Instant",
    status: "Opted-in",
  },
  {
    date: "Apr 14, 2025",
    name: "Reminder",
    type: "Manual Broadcast",
    msgType: "Text Massage",
    schedule: "Scheduled",
    status: "Stopped",
  },
];

const BroadcastDashboard = () => {
  const [search, setSearch] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  // Filter the data based on the active filter
  const filteredData = data.filter((row) => {
    if (activeFilter === "All" || activeFilter === null) return true;
    if (activeFilter === "Opted-in" && row.status === "Opted-in") return true;
    if (activeFilter === "Opted-Out" && row.status === "Opted-Out") return true;
    if (activeFilter === "Scheduled" && row.schedule === "Scheduled")
      return true;
    if (activeFilter === "Stopped" && row.status === "Stopped") return true;
    if (activeFilter === "Paused" && row.status === "Paused") return true;
    return false;
  });

  // Handle Select All checkbox change
  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    const newSelectedRows = {};
    if (event.target.checked) {
      filteredData.forEach((row, idx) => {
        newSelectedRows[idx] = true;
      });
    } else {
      setSelectedRows({});
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (idx, event) => {
    setSelectedRows({
      ...selectedRows,
      [idx]: event.target.checked,
    });
  };

  // Calculate filter counts dynamically based on data
  const statuses = {
    All: data.length,
    "Opted-in": data.filter((d) => d.status === "Opted-in").length,
    "Opted-Out": data.filter((d) => d.status === "Opted-Out").length,
    Scheduled: data.filter((d) => d.schedule === "Scheduled").length,
    Stopped: data.filter((d) => d.status === "Stopped").length,
    Paused: data.filter((d) => d.status === "Paused").length,
  };

  const filters = [
    {
      label: "All",
      count: statuses["All"],
      color: "bg-teal-500",
      width: "w-[90px]",
    },
    {
      label: "Opted-in",
      count: statuses["Opted-in"],
      color: "bg-blue-500",
      width: "w-[120px]",
    },
    {
      label: "Opted-Out",
      count: statuses["Opted-Out"],
      color: "bg-red-500",
      width: "w-[120px]",
    },
    {
      label: "Scheduled",
      count: statuses["Scheduled"],
      color: "bg-purple-500",
      width: "w-[130px]",
    },
    {
      label: "Stopped",
      count: statuses["Stopped"],
      color: "bg-red-500",
      width: "w-[110px]",
    },
    {
      label: "Paused",
      count: statuses["Paused"],
      color: "bg-yellow-500",
      width: "w-[110px]",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1000);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`w-full ${
        data.length > 0 ? "bg-white shadow-sm" : ""
      } rounded-xl mt-4 min-h-fit`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-4">
        {/* Filters - hidden on small screens */}
        <div className="hidden md:flex gap-4 flex-wrap items-center">
          {filters.map((f, i) => (
            <button
              key={i}
              className={`flex items-center justify-center h-10 text-md font-medium pl-2 pr-2 rounded-md ${
                f.width
              } transition-all duration-200 
    ${
      activeFilter === f.label
        ? "bg-teal-500 text-white text-[14px]"
        : "bg-transparent text-gray-700 text-[14px] hover:text-teal-500"
    }`}
              onClick={() =>
                setActiveFilter(f.label === activeFilter ? null : f.label)
              }
            >
              <div className="flex items-center gap-0">
                <span className="whitespace-nowrap">{f.label}</span>
                <span
                  className={`text-md font-bold flex items-center justify-center rounded ${
                    activeFilter === f.label ? "text-white" : ""
                  }`}
                  style={{
                    backgroundColor: "transparent",
                    padding: "0 4px",
                    marginLeft: "0",
                  }}
                >
                  ({f.count})
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Search Input - hidden on small screens */}
        <div className="hidden md:block relative w-[300px]">
          <img
            src={searchIcon}
            alt="Search"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search template by Name or Category..."
            className="pl-2 pr-8 py-2 border border-gray-300 text-sm rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-sm text-center border overflow-hidden">
          <thead className="bg-gray-100  border-b-2 border-gray-300">
            <tr>
              <th className="px-6 py-3">
                <div className="flex items-center justify-center h-full">
                  <input
                    type="checkbox"
                    className="form-checkbox w-4 h-4"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </div>
              </th>
              <th className="px-6 py-5 text-center text-[16px] font-semibold font-sans text-gray-700">
                Date
              </th>
              <th className="px-6 py-5 text-center text-[16px] font-semibold font-sans text-gray-700">
                Broadcast Name
              </th>
              <th className="px-6 py-5 text-center text-[16px] font-semibold font-sans text-gray-700">
                Type
              </th>
              <th className="px-6 py-5 text-center text-[16px] font-semibold font-sans text-gray-700">
                Message Type
              </th>
              <th className="px-6 py-5 text-center text-[16px] font-semibold font-sans text-gray-700">
                Scheduled Broadcast
              </th>
              <th className="px-6 py-5 text-center text-[16px] font-semibold font-sans text-gray-700">
                Status
              </th>
              <th className="px-6 py-5 text-center text-[16px] font-semibold font-sans text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No broadcasts available.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 text-md">
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center h-full">
                      <input
                        type="checkbox"
                        className="form-checkbox w-4 h-4"
                        checked={selectedRows[idx] || false}
                        onChange={(e) => handleCheckboxChange(idx, e)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-5 whitespace-nowrap text-[16px]  text-gray-700">
                    {row.date}
                  </td>
                  <td className="px-4 py-5 text-[16px]  text-gray-700">
                    {row.name}
                  </td>
                  <td className="px-4 py-5 text-[16px]  text-gray-700">
                    {row.type}
                  </td>
                  <td className="px-4 py-5 text-[16px]  text-gray-700">
                    {row.msgType}
                  </td>
                  <td className="px-4 py-5 text-[16px]  text-gray-700">
                    {row.schedule}
                  </td>
                  <td className="px-4 py-5 text-[16px] font-semibold text-green-600">
                    {row.status}
                  </td>{" "}
                  {/* You can keep status in green if preferred */}
                  <td className="px-4 py-2">
                    <button className="flex items-center justify-center hover:bg-red-600 w-8 h-8 rounded ml-11">
                      <img src={deleteIcon} alt="Delete" className="w-7 h-7" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BroadcastDashboard;
