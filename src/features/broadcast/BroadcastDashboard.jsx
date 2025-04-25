import { useState, useEffect } from "react";
import searchIcon from "../../assets/search.png";
import deleteIcon from "../../assets/delete.png";

const BroadcastDashboard = ({ data, onDelete }) => {
  const [search, setSearch] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  // Filter the data based on the active filter and search input
  const filteredData = data.filter((row) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Opted-in" && row.status === "Opted-in") ||
      (activeFilter === "Opted-Out" && row.status === "Opted-Out") ||
      (activeFilter === "Scheduled" && row.schedule === "Scheduled") ||
      (activeFilter === "Stopped" && row.status === "Stopped") ||
      (activeFilter === "Paused" && row.status === "Paused");

    const matchesSearch =
      row.name?.toLowerCase().includes(search.toLowerCase()) ||
      row.broadcastName?.toLowerCase().includes(search.toLowerCase()) ||
      row.type?.toLowerCase().includes(search.toLowerCase()) ||
      row.msgType?.toLowerCase().includes(search.toLowerCase()) ||
      row.schedule?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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

  const handleCheckboxChange = (idx, event) => {
    setSelectedRows({
      ...selectedRows,
      [idx]: event.target.checked,
    });
  };

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
      color: "bg-teal-500",
      width: "w-[120px]",
    },
    {
      label: "Opted-Out",
      count: statuses["Opted-Out"],
      color: "bg-teal-500",
      width: "w-[120px]",
    },
    {
      label: "Scheduled",
      count: statuses["Scheduled"],
      color: "bg-teal-500",
      width: "w-[130px]",
    },
    {
      label: "Stopped",
      count: statuses["Stopped"],
      color: "bg-teal-500",
      width: "w-[110px]",
    },
    {
      label: "Paused",
      count: statuses["Paused"],
      color: "bg-teal-500",
      width: "w-[110px]",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1000);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`w-full ${
        data.length > 0 ? "bg-white shadow-sm" : ""
      } rounded-xl mt-4 shadow-2xl min-h-fit`}
    >
      <div className="flex items-center shadow-2xl p-4">
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <div className="hidden md:flex items-center gap-4">
            {filters.map((f, i) => (
              <button
                key={i}
                className={`flex items-center justify-center h-10 text-md font-medium pl-2 pr-2 rounded-md ${
                  f.width
                } transition-all duration-200 
                ${
                  activeFilter === f.label
                    ? `${f.color} text-white text-[14px]`
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
            <div className="hidden md:block lg:hidden">
              <button className="flex items-center justify-center h-10 w-10">
                <img src={searchIcon} alt="Search" className="w-5 h-5 opacity-60" />
              </button>
            </div>
          </div>
          <div className="hidden ml-28 lg:block flex-shrink-0">
            <div className="relative w-[300px]">
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
                className="pl-2 pr-8 py-2 border border-gray-300 text-sm rounded-md w-full focus:outline-none "
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto  max-w-full">
        <table className="w-full text-sm text-center   overflow-hidden">
          <thead className="bg-gray-100 border-b-2 shadow-sm border-gray-300">
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
                  <td className="px-4 py-5 whitespace-nowrap text-[16px] text-gray-700">
                    {row.date}
                  </td>
                  <td className="px-4 py-5 text-[16px] text-gray-700">
                    {row.name || row.broadcastName}
                  </td>
                  <td className="px-4 py-5 text-[16px] text-gray-700">
                    {row.type}
                  </td>
                  <td className="px-4 py-5 text-[16px] text-gray-700">
                    {row.msgType}
                  </td>
                  <td className="px-4 py-5 text-[16px] text-gray-700">
                    {row.schedule}
                  </td>
                  <td className="px-4 py-5 text-[16px] font-semibold text-green-600">
                    {row.status}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="flex items-center justify-center hover:bg-red-600 w-8 h-8 rounded ml-11"
                      onClick={() => onDelete && onDelete(idx)}
                    >
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