// BroadcastPages.jsx
import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Broadcast from './Broadcast';
const BroadcastPages = ({ onClose}) => {
  const [formData, setFormData] = useState({
    broadcastName: '',
    customerList: 'Select Customer List',
    messageType: 'Pre-approved template message',
    schedule: 'Yes',
    scheduleDate: '',
    regularMessageType: 'Select Regular Message Type',
    message: '',
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(true);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      scheduleDate: selectedDate ? selectedDate.toString() : '',
    };
    navigate('/broadcast-preview', { state: { formData: updatedFormData }, replace: true });
  };

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
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
        src="calendar.png"
        alt="calendar"
        onClick={onClick}
        className="w-7 h-6 sm:w-7 sm:h-7 ml-2 flex-shrink-0"
      />
    </div>
  ));

  const handleCloseAndNavigate = () => {
    onClose(); // Call the onClose function passed from the parent to close the modal
    navigate('/broadcast'); // Navigate to broadcast route
  };


  return (
    <>
      {showBroadcastModal && (
        <div className="flex items-center justify-center mt-4 px-4 font-poppins">
          <div className="w-full max-w-[900px] p-4 bg-white rounded-lg shadow-lg ">
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#DFDFDF]">
              <h2 className="text-2xl text-black font-medium">Add Broadcast</h2>
              <button
            onClick={handleCloseAndNavigate}
            className="text-gray-500 hover:text-black text-2xl leading-none"
          >
            <img
              src="cross.png"
              alt="Close"
            />
          </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Broadcast Name & Customer List */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  name="broadcastName"
                  placeholder="Broadcast Name"
                  value={formData.broadcastName}
                  onChange={handleInputChange}
                  className="w-full sm:w-1/2 p-2 border border-[#606060] rounded text-gray-500 focus:outline-none"
                  required
                />
                <select
                  name="customerList"
                  value={formData.customerList}
                  onChange={handleInputChange}
                  className="w-full sm:w-1/2 p-2 border border-[#606060] rounded text-gray-500 focus:outline-none"
                  required
                >
                  <option value="Select Customer List">Select Customer List</option>
                  <option value="Customer List 1">Customer List 1</option>
                  <option value="Customer List 2">Customer List 2</option>
                </select>
              </div>

              {/* Message Type */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-black">Select Message Type</label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="messageType"
                      value="Pre-approved template message"
                      checked={formData.messageType === 'Pre-approved template message'}
                      onChange={handleRadioChange}
                      className="text-[#0AA89E]"
                      style={{ accentColor: '#0AA89E' }}
                      required
                    />
                    <span className="ml-2 text-[#717171]">Pre-approved template message</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="messageType"
                      value="Regular Message"
                      checked={formData.messageType === 'Regular Message'}
                      onChange={handleRadioChange}
                      className="text-[#0AA89E]"
                      style={{ accentColor: '#0AA89E' }}
                      required
                    />
                    <span className="ml-2 text-[#717171]">Regular Message</span>
                  </label>
                </div>
              </div>

              {formData.messageType === 'Pre-approved template message' && (
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 border border-[#0AA89E] text-[#0AA89E] text-[15px] font-medium rounded"
                >
                  Select Template
                </button>
              )}

              {formData.messageType === 'Regular Message' && (
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full">
                  <div className="w-full lg:w-2/3 pt-4">
                    <select
                      name="regularMessageType"
                      value={formData.regularMessageType}
                      onChange={handleInputChange}
                      className="w-full lg:w-[120%] p-2 border border-[#606060] rounded mb-2"
                      required
                    >
                      <option value="Select Regular Message Type">Select Regular Message Type</option>
                      <option value="Text Message">Text Message</option>
                      <option value="Image Message">Image Message</option>
                      <option value="Video Message">Video Message</option>
                    </select>
                    <textarea
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full lg:w-[120%] h-36 p-2 border border-[#606060] rounded resize-none"
                      required
                    />
                  </div>
                  <textarea
                    value={formData.message}
                    readOnly
                    className="w-full lg:w-[40%] h-48 lg:mt-2 lg:ml-28 p-2 border border-[#606060] rounded resize-none"
                  />
                </div>
              )}

              {/* Schedule */}
              <div className="w-full">
                <label className="block text-sm mb-1 font-semibold text-black">Schedule Broadcast</label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="schedule"
                      value="Yes"
                      checked={formData.schedule === 'Yes'}
                      onChange={handleRadioChange}
                      className="text-[#0AA89E]"
                      style={{ accentColor: '#0AA89E' }}
                      required
                    />
                    <span className="ml-2 text-[#717171]">Yes (Schedule for Later)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="schedule"
                      value="No"
                      checked={formData.schedule === 'No'}
                      onChange={handleRadioChange}
                      className="text-[#0AA89E]"
                      style={{ accentColor: '#0AA89E' }}
                      required
                    />
                    <span className="ml-2 text-[#717171]">No (Send Instantly)</span>
                  </label>
                </div>

                {formData.schedule === 'Yes' && (
                  <div className="w-full sm:w-1/2 mt-2">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      customInput={<CustomDateInput />}
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 text-left">
              <button
                type="submit"
                className="w-full sm:w-[20%] py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                Add Broadcast
              </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BroadcastPages;
