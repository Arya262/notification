import { useState, useEffect } from "react";
import searchIcon from "../../assets/search.png";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import BroadcastTable from "./components/BroadcastTable";

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
        const response = await fetch("http://localhost:3000/broadcasts");
        if (!response.ok) {
          throw new Error("Failed to fetch broadcasts");
        }
        const data = await response.json();
        setBroadcasts(Array.isArray(data.broadcasts) ? data.broadcasts : []);
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
  const filteredData = broadcasts.filter((broadcast) => {
    const name = broadcast.broadcastName || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" || broadcast.status === activeFilter;
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

  const handleDelete = async (idx) => {
    try {
      const broadcastToDelete = filteredData[idx];
      const response = await fetch(
        `http://localhost:3000/broadcasts/${broadcastToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete broadcast");
      }

      setBroadcasts(
        broadcasts.filter((b) => b.id !== broadcastToDelete.id)
      );

      if (onDelete) {
        onDelete(idx);
      }
      setMenuOpen(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={`w-full ${
        broadcasts.length > 0 ? "bg-white shadow-sm" : ""
      } rounded-xl mt-4 shadow-sm min-h-fit`}
    >
      <div className="flex items-center shadow-2xl p-4">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <FilterBar
            filters={filters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <div className="block md:block lg:hidden">
            <button className="flex items-center justify-center h-10 w-10">
              <img
                src={searchIcon}
                alt="Search"
                className="w-5 h-5 opacity-60"
              />
            </button>
          </div>
          <SearchBar search={search} setSearch={setSearch} />
        </div>
      </div>
      <BroadcastTable
        filteredData={filteredData}
        selectAll={selectAll}
        handleSelectAllChange={handleSelectAllChange}
        selectedRows={selectedRows}
        handleCheckboxChange={handleCheckboxChange}
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
        handleDelete={handleDelete}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default BroadcastDashboard;
