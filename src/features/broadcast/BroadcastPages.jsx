import React, { useState, forwardRef, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BroadcastPages = ({ onClose, showCustomAlert }) => {
  const [formData, setFormData] = useState({
    broadcastName: "",
    customerList: "Select Customer List",
    messageType: "Pre-approved template message",
    schedule: "No",
    scheduleDate: "",
    regularMessageType: "Text Message",
    message: "",
    image: "", // Stores the image for "Image Message"
    video: "", // Added to store the video separately for "Video Message"
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // State for custom alert
  const [highlightClose, setHighlightClose] = useState(false); // New state for highlighting close button
  const navigate = useNavigate();
  const modalRef = useRef(null); // Ref for the modal container

  // Effect to handle click outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setHighlightClose(true);
        const timer = setTimeout(() => setHighlightClose(false), 3000);
        return () => clearTimeout(timer);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleMediaChange = (e, mediaType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          [mediaType]: reader.result, // Store the media (image or video) in the appropriate field
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      scheduleDate: selectedDate ? selectedDate.toString() : "",
      date: selectedDate
        ? selectedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
        : new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }),
      status: formData.schedule === "No" ? "Live" : "Scheduled",
      type: "Manual Broadcast",
      msgType:
        formData.messageType === "Regular Message"
          ? formData.regularMessageType
          : "Template Message",
    };
    onClose();
    navigate("/broadcast", {
      state: { formData: updatedFormData },
      replace: true,
    });
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
    const confirmExit = window.confirm("Are you sure you want to exit the page?");
    if (confirmExit) {
      onClose();
      navigate("/broadcast");
    }
  };

  // Custom File Input Component for Drag and Drop (used for both image and video)
  const CustomFileInput = ({ mediaType, accept }) => {
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (
        file &&
        file.type.startsWith(mediaType === "image" ? "image/" : "video/")
      ) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prevData) => ({
            ...prevData,
            [mediaType]: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div
        className="w-full lg:w-[120%] mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label
          htmlFor={mediaType === "image" ? "imageMessage" : "videoMessage"}
          className="cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-8 h-8 text-gray-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <span className="text-gray-500 text-sm">
              Choose a {mediaType === "image" ? "file" : "video"} or drag it
              here.
            </span>
          </div>
          <input
            id={mediaType === "image" ? "imageMessage" : "videoMessage"}
            type="file"
            name={mediaType === "image" ? "imageMessage" : "videoMessage"}
            accept={accept}
            onChange={(e) => handleMediaChange(e, mediaType)}
            className="hidden"
          />
        </label>
      </div>
    );
  };

  return (
    <>
      {true && (
        <div className="flex items-center justify-center   font-poppins">
          <div ref={modalRef} className="w-full max-w-[900px] p-4 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#DFDFDF]">
              <h2 className="text-2xl text-black font-medium">Add Broadcast</h2>
              <button
                onClick={handleCloseAndNavigate}
                className={`text-gray-500 hover:text-black text-2xl leading-none ${
                  highlightClose ? 'bg-red-500 rounded-full p-1 animate-pulse' : ''
                }`}
              >
                <img src="cross.png" alt="Close" />
              </button>
            </div>

            {/* Custom Alert */}
            {showAlert && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-between w-1/3">
                  <p className="text-gray-700">You applied, you canceled, but applied</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Broadcast Name & Customer List */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  name="broadcastName"
                  placeholder="BroadcastName"
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
                  <option value="Select Customer List">
                    Select Customer List
                  </option>
                  <option value="Customer List 1">Customer List 1</option>
                  <option value="Customer List 2">Customer List 2</option>
                </select>
              </div>

              {/* Message Type */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-black">
                  Select Message Type
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="messageType"
                      value="Pre-approved template message"
                      checked={
                        formData.messageType === "Pre-approved template message"
                      }
                      onChange={handleRadioChange}
                      className="text-[#0AA89E]"
                      style={{ accentColor: "#0AA89E" }}
                      required
                    />
                    <span className="ml-2 text-[#717171]">
                      Pre-approved template message
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="messageType"
                      value="Regular Message"
                      checked={formData.messageType === "Regular Message"}
                      onChange={handleRadioChange}
                      className="text-[#0AA89E]"
                      style={{ accentColor: "#0AA89E" }}
                      required
                    />
                    <span className="ml-2 text-[#717171]">Regular Message</span>
                  </label>
                </div>
              </div>

              {formData.messageType === "Pre-approved template message" && (
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 border border-[#0AA89E] text-[#0AA89E] text-[15px] font-medium rounded"
                >
                  Select Template
                </button>
              )}

              {formData.messageType === "Regular Message" && (
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full">
                  <div className="w-full lg:w-2/3 pt-4">
                    <select
                      name="regularMessageType"
                      value={formData.regularMessageType}
                      onChange={handleInputChange}
                      className="w-full lg:w-[120%] p-2 border border-[#606060] rounded mb-2"
                      required
                    >
                      <option value="Select Regular Message Type">
                        Select Regular Message Type
                      </option>
                      <option value="Text Message">Text Message</option>
                      <option value="Image Message">Image Message</option>
                      <option value="Video Message">Video Message</option>
                    </select>
                    {/* Show image or video upload input based on regularMessageType */}
                    {(formData.regularMessageType === "Image Message" ||
                      formData.regularMessageType === "Video Message") && (
                      <div className="w-full lg:w-[100%] mt-2">
                        <CustomFileInput
                          mediaType={
                            formData.regularMessageType === "Image Message"
                              ? "image"
                              : "video"
                          }
                          accept={
                            formData.regularMessageType === "Image Message"
                              ? "image/*"
                              : "video/*"
                          }
                        />
                      </div>
                    )}
                    {/* Always show the textarea for message input */}
                    <textarea
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full lg:w-[120%] h-36 p-2 border border-[#606060] rounded resize-none mt-2"
                      required
                    />
                  </div>

                  {/* Preview Section */}
                  {/* Only show preview container when image or video is selected */}
                  {(formData.regularMessageType === "Image Message" &&
                    formData.image) ||
                  (formData.regularMessageType === "Video Message" &&
                    formData.video) ? (
                    <div className="w-full lg:w-[40%] lg:mt-2 lg:ml-28 p-2 border border-[#606060] rounded">
                      {formData.regularMessageType === "Image Message" &&
                      formData.image ? (
                        <div className="flex flex-col">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full max-h-[300px] object-contain"
                          />
                          {formData.message && (
                            <div className="w-full p-2 bg-white">
                              {formData.message}
                            </div>
                          )}
                        </div>
                      ) : formData.regularMessageType === "Video Message" &&
                        formData.video ? (
                        <div className="flex flex-col">
                          <video
                            src={formData.video}
                            controls
                            className="w-full max-h-[300px] object-contain"
                          />
                          {formData.message && (
                            <div className="w-full p-2 bg-white">
                              {formData.message}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Schedule */}
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