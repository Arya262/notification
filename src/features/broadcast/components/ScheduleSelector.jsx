import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from './CustomDateInput';

const ScheduleSelector = ({ formData, handleRadioChange, selectedDate, setSelectedDate }) => {
  return (
    <div className="w-full">
      <label className="block text-sm mb-1 font-semibold text-black">
        Schedule Broadcast
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="schedule"
            value="Yes"
            checked={formData.schedule === "Yes"}
            onChange={handleRadioChange}
            className="text-[#0AA89E]"
            style={{ accentColor: "#0AA89E" }}
            required
          />
          <span className="ml-2 text-[#717171]">
            Yes (Schedule for Later)
          </span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="schedule"
            value="No"
            checked={formData.schedule === "No"}
            onChange={handleRadioChange}
            className="text-[#0AA89E]"
            style={{ accentColor: "#0AA89E" }}
            required
          />
          <span className="ml-2 text-[#717171]">
            No (Send Instantly)
          </span>
        </label>
      </div>

      {formData.schedule === "Yes" && (
        <div className="w-full sm:w-1/2 mt-2">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            minTime={
              selectedDate &&
              new Date(selectedDate).toDateString() ===
                new Date().toDateString()
                ? new Date(
                    0,
                    0,
                    0,
                    new Date().getHours(),
                    new Date().getMinutes() + 1
                  )
                : new Date(0, 0, 0, 0, 0)
            }
            maxTime={new Date(0, 0, 0, 23, 45)}
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none"
            customInput={<CustomDateInput />}
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleSelector; 