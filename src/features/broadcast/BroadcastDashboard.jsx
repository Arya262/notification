import { useState, useEffect } from "react";
import searchIcon from "../../assets/search.png";
import deleteIcon from "../../assets/delete.png";
import { HiDotsVertical } from "react-icons/hi"; 

const BroadcastDashboard = ({ onDelete }) => {
  const [search, setSearch] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const [menuOpen, setMenuOpen] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch broadcasts from API
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        setLoading(true);
        const response = await fetch('YOUR_API_ENDPOINT/broadcasts');
        if (!response.ok) {
          throw new Error('Failed to fetch broadcasts');
        }
        const data = await response.json();
        setBroadcasts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBroadcasts();
  }, []);

  // Filter data based on search and active filter
  const filteredData = broadcasts.filter(broadcast => {
    const matchesSearch = broadcast.broadcastName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || broadcast.status === activeFilter;
    return matchesSearch && matchesFilter;
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
    All: broadcasts.length,
    Live: broadcasts.filter((d) => d.status === "Live").length,
    Sent: broadcasts.filter((d) => d.status === "Sent").length,
    Scheduled: broadcasts.filter((d) => d.schedule === "Scheduled").length,
    Stopped: broadcasts.filter((d) => d.status === "Stopped").length,
    Paused: broadcasts.filter((d) => d.status === "Paused").length,
  };

  const filters = [
    {
      label: "All",
      count: statuses["All"],
      color: "bg-teal-500",
      width: "w-[90px]",
    },
    {
      label: "Live",
      count: statuses["Live"],
      color: "bg-teal-500",
      width: "w-[120px]",
    },
    {
      label: "Sent",
      count: statuses["Sent"],
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

  const toggleMenu = (idx) => {
    setMenuOpen(menuOpen === idx ? null : idx);
  };

  // const handleDelete = async (idx) => {
  //   try {
  //     const broadcastToDelete = filteredData[idx];
  //     const response = await fetch(`YOUR_API_ENDPOINT/broadcasts/${broadcastToDelete.id}`, {
  //       method: 'DELETE',
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Failed to delete broadcast');
  //     }

  //     // Update local state after successful deletion
  //     setBroadcasts(broadcasts.filter(b => b.id !== broadcastToDelete.id));
      
  //     if (onDelete) {
  //       onDelete(idx);
  //     }
  //     setMenuOpen(null);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${
        broadcasts.length > 0 ? "bg-white shadow-sm" : ""
      } rounded-xl mt-4 shadow-sm min-h-fit`}
    >
      <div className="flex items-center shadow-2xl p-4">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <div className="hidden md:flex items-center gap-4">
            {filters.map((f, i) => (
              <button
                key={i}
                className={`flex items-center justify-center h-10 text-md font-medium pl-2 pr-2 rounded-md ${
                  f.width
                } transition-all duration-200 ${
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
                    className={`text-md font-bold flex items-center justify-center rounded ${activeFilter === f.label ? "text-white" : ""}`}
                    style={{
                      backgroundColor: "transparent",padding: "0 4px",marginLeft: "0",}}>
                    ({f.count})
                  </span>
                </div>
              </button>
            ))}
            <div className="block md:block lg:hidden">
              <button className="flex items-center justify-center h-10 w-10">
                <img src={searchIcon}alt="Search"className="w-5 h-5 opacity-60"/>
              </button>
            </div>
          </div>
          <div className="hidden lg:block flex-shrink-0 ml-28">
            <div className="relative w-[300px]">
              <img src={searchIcon}alt="Search"className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60"/>
              <input type="text"value={search}onChange={(e) => setSearch(e.target.value)}placeholder="Search template by Name or Category..." className="pl-2 pr-8 py-2 border border-gray-300 text-sm rounded-md w-full focus:outline-none"/>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-sm text-center overflow-hidden table-auto">
          <thead className="bg-gray-100 border-b-2 shadow-sm border-gray-300">
            <tr>
              <th className="px-2 py-3 sm:px-6">
                <div className="flex items-center justify-center h-full">
                  <input type="checkbox"className="form-checkbox w-4 h-4" checked={selectAll} onChange={handleSelectAllChange}/>
                </div>
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Date
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Broadcast Name
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Message Type
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Scheduled Broadcast
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Status
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Message Funnel
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
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
                  <td className="px-2 py-2 sm:px-4">
                    <div className="flex items-center justify-center h-full">
                      <input
                        type="checkbox"
                        className="form-checkbox w-4 h-4"
                        checked={selectedRows[idx] || false}
                        onChange={(e) => handleCheckboxChange(idx, e)}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-3 sm:px-4 sm:py-5 whitespace-nowrap text-[12px]  sm:text-[16px] text-gray-700">
                    {row.date
                      ? (() => {
                          const date = new Date(row.date);
                          const formattedDate = date.toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            }
                          );
                          const hasTime =
                            date.getHours() !== 0 || date.getMinutes() !== 0;
                          if (hasTime) {
                            const formattedTime = date.toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            );
                            return (
                              <div className="flex flex-col">
                                <span>{formattedDate}</span>
                                <span>{formattedTime}</span>
                              </div>
                            );
                          }
                          return <span>{formattedDate}</span>;
                        })()
                      : "N/A"}
                  </td>
                  <td className="px-2 py-3  text-[12px] sm:text-[16px] text-gray-700">
                    {row.broadcastName}
                  </td>
                  <td className="px-2 py-3  text-[12px] sm:text-[16px] text-gray-700">
                    {row.msgType}
                  </td>
                  <td className="px-2 py-3  text-[12px] sm:text-[16px] text-gray-700">
                    {row.schedule}
                  </td>
                  <td className="px-2 py-3  text-[12px] sm:text-[16px] text-green-600">
                    {row.status}
                  </td>
                  
                  <td className="px-2 py-3 text-[12px] justify-end sm:text-[16px] w-auto font-semibold text-gray-700">
                    {row.messageFunnel ? (
                      <div className="grid grid-cols-4 gap-4 justify-items-center ">
                        <div className="flex flex-col items-center text-center">
                          <span className="text-lg font-bold">
                            {row.messageFunnel.totalContacts}
                          </span>
                          <span className="text-sm text-gray-500">
                            Total contacts
                          </span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <span className="text-lg font-bold">
                            {row.messageFunnel.deliveredPercentage}
                          </span>
                          <span className="text-sm text-gray-500">
                            Delivered 80% of total
                          </span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <span className="text-lg font-bold">
                            {row.messageFunnel.readPercentage}
                          </span>
                          <span className="text-sm text-gray-500">
                            Read 72% of total
                          </span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <span className="text-lg font-bold">
                            {row.messageFunnel.clicks}
                          </span>
                          <span className="text-sm text-gray-500">
                           Clicks
                          </span>
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className=" relative">
                    <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 sm:ml-5"onClick={() => toggleMenu(idx)}>
                      <HiDotsVertical className="w-6 h-6" />
                    </button>
                    {menuOpen === idx && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                        <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"onClick={() => handleDelete(idx)}>
                          Delete
                        </button>
                      </div>
                    )}
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
