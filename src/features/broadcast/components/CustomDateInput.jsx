import React from 'react';

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="flex items-center w-full border border-gray-300 rounded-md p-2 text-gray-700 cursor-pointer">
    <input
      type="text"
      readOnly
      value={value}
      ref={ref}
      onClick={onClick}
      className="w-full bg-transparent outline-none cursor-pointer text-base sm:text-lg"
      placeholder="Select date & time"
    />
    <img
      src="/calendar.png"
      alt="calendar"
      onClick={onClick}
      className="w-7 h-6 sm:w-7 sm:h-7 ml-2 text-teal-500 flex-shrink-0"
    />
  </div>
));

export default CustomDateInput; 