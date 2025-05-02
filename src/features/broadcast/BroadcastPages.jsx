import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SendTemplate from "../chats/chatfeautures/SendTemplate"

const BroadcastPages = ({ onClose, showCustomAlert }) => {
  const [formData, setFormData] = useState({
    broadcastName: "",
    customerList: "Select Customer List",
    messageType: "Pre-approved template message",
    schedule: "No",
    scheduleDate: "",
    regularMessageType: "Text Message",
    message: "",
    image: "",
    video: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [highlightClose, setHighlightClose] = useState(false);
  const [highlightBorder, setHighlightBorder] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const dialogRef = useRef(null);

  const [customerLists, setCustomerLists] = useState([]); // Stores customer list data
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(null); // Error state for the API request

  useEffect(() => {
    const fetchCustomerLists = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch("http://localhost:3000/returnGroups");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setCustomerLists(result.data);
          setError(null); // Clear any previous errors
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err) {
        setError("Failed to fetch customer lists");
        setCustomerLists([]); // Clear customer lists on error
        console.error("Error fetching customer lists:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    fetchCustomerLists();
  }, []);
   // Empty dependency array ensures this runs once when the component mounts

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setHighlightClose(true);
        setHighlightBorder(true);
        // setShowExitDialog(true);
        const timer = setTimeout(() => {
          setHighlightClose(false);
          setHighlightBorder(false);
        }, 3000);
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
          [mediaType]: reader.result,
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
      date:
        formData.schedule === "Yes" && selectedDate ? selectedDate : new Date(),
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
        src="/calendar.png"
        alt="calendar"
        onClick={onClick}
        className="w-7 h-6 sm:w-7 sm:h-7 ml-2 text-teal-500 flex-shrink-0"
      />
    </div>
  ));

  const handleCloseAndNavigate = () => {
    setShowExitDialog(true);
  };

  const hasUnsavedChanges = Object.values(formData).some(
    (value) =>
      value &&
      value !== "Select Customer List" &&
      value !== "Text Message" &&
      value !== "Pre-approved template message" &&
      value !== "No"
  );

  const confirmExit = () => {
    onClose();
    navigate("/broadcast");
    setShowExitDialog(false);
    setHighlightClose(false);
    setHighlightBorder(false);
  };

  const cancelExit = () => {
    setShowExitDialog(false);
    setHighlightClose(false);
    setHighlightBorder(false);
  };

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

  const ConfirmationDialogInline = () => {
    if (!showExitDialog) return null;

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          cancelExit();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
      dialogRef.current?.focus();
    }, []);

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          ref={dialogRef}
          className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg transform transition-all duration-300 scale-100"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-message"
          tabIndex="-1"
        >
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6 text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3
              id="dialog-title"
              className="text-lg font-semibold text-gray-800"
            >
              Exit Confirmation
            </h3>
          </div>
          <p id="dialog-message" className="text-gray-600 mb-6">
            {hasUnsavedChanges
              ? "You have unsaved changes. Are you sure you want to exit?"
              : "Are you sure you want to exit?"}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={cancelExit}
              className="px-3 py-2 w-[70px] bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              onClick={confirmExit}
              className="px-3 py-2 w-[70px] bg-teal-500 text-white rounded-md hover:bg-teal-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Confirm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [isTemplateOpen, setIsTemplateOpen] = useState(false);

  const openTemplate = () => {
    setIsTemplateOpen(true);
  };

  const closeTemplate = () => {
    setIsTemplateOpen(false);
  };
  return (
    <>
      <div className="flex items-center justify-center font-poppins">
        <div
          ref={modalRef}
          className={`w-full max-w-[900px] p-4 bg-white rounded-lg shadow-lg border ${
            highlightBorder ? "border-teal-500" : "border-transparent"
          } transition-all duration-300`}
        >
          <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#DFDFDF]">
            <h2 className="text-2xl text-black font-medium">Add Broadcast</h2>
            <button
              onClick={handleCloseAndNavigate}
              className={`absolute top-2 right-4 pb-2 text-3xl font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                highlightClose
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                  : "bg-teal-500 text-white hover:bg-[#048080]"
              }`}
            >
              ×
            </button>
          </div>

          {showAlert && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-between w-1/3">
                <p className="text-gray-700">
                  You applied, you canceled, but applied
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                {loading ? (
                  <option>Loading...</option> // Show loading option while fetching data
                ) : error ? (
                  <option>{error}</option> // Show error message if the API fails
                ) : (
                  customerLists.map((customer, group_id) => (
                    <option key={group_id} value={customer.group_name}>
                      {customer.group_name}{" "}
                      {/* Assuming 'name' is the field from the API response */}
                    </option>
                  ))
                )}
              </select>
            </div>

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
              </div>
            </div>

            {formData.messageType === "Pre-approved template message" && (
              <div>
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 border border-[#0AA89E] text-[#0AA89E] text-[15px] font-medium rounded"
                  onClick={openTemplate}
                >
                  Select Template
                </button>

                {isTemplateOpen && (
                  <>
                    {/* Background Overlay with White Blur */}
                    <div className="fixed inset-0  bg-opacity-5 backdrop-blur-sm z-40" />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <SendTemplate closeTemplate={closeTemplate} />
                    </div>
                  </>
                )}
              </div>
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
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full lg:w-[120%] h-36 p-2 border border-[#606060] rounded resize-none mt-2"
                    required
                  />
                </div>

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
      <ConfirmationDialogInline />
    </>
  );
};

export default BroadcastPages;
