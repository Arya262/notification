import React from 'react';

const FilterBar = ({ filters, activeFilter, setActiveFilter }) => {
  return (
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
          onClick={() => setActiveFilter(f.label === activeFilter ? null : f.label)}
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
  );
};

export default FilterBar; 