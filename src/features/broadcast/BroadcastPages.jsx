import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import SendTemplate from "../chats/chatfeautures/SendTemplate";
import BroadcastHeader from "./components/BroadcastHeader";
import BroadcastForm from "./components/BroadcastForm";
import AlertDialog from "./components/AlertDialog";
import ConfirmationDialog from "./components/ConfirmationDialog";

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
    selectedTemplate: null,
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [highlightClose, setHighlightClose] = useState(false);
  const [highlightBorder, setHighlightBorder] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [customerLists, setCustomerLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCustomerLists = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/returnGroups");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setCustomerLists(result.data);
          setError(null);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err) {
        setError("Failed to fetch customer lists");
        setCustomerLists([]);
        console.error("Error fetching customer lists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerLists();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setHighlightClose(true);
        setHighlightBorder(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedFormData = {
        ...formData,
        scheduleDate: selectedDate ? selectedDate.toString() : "",
        date: formData.schedule === "Yes" && selectedDate ? selectedDate : new Date(),
        status: formData.schedule === "No" ? "Live" : "Scheduled",
        type: "Manual Broadcast",
        msgType: formData.messageType === "Regular Message" ? formData.regularMessageType : "Template Message",
        template: formData.selectedTemplate ? {
          name: formData.selectedTemplate.element_name,
          type: formData.selectedTemplate.template_type,
          data: formData.selectedTemplate.container_meta?.data,
          header: formData.selectedTemplate.container_meta?.header,
          footer: formData.selectedTemplate.container_meta?.footer,
          buttons: formData.selectedTemplate.container_meta?.buttons
        } : null
      };

      // API call to save broadcast
      const response = await fetch("http://localhost:3000/saveBroadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setAlertMessage("Broadcast saved successfully!");
        setShowAlert(true);
        
        // Close alert after 2 seconds
        setTimeout(() => {
          setShowAlert(false);
          onClose();
          navigate("/broadcast", {
            state: { formData: updatedFormData },
            replace: true,
          });
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to save broadcast");
      }
    } catch (err) {
      console.error("Error saving broadcast:", err);
      setError(err.message);
      setAlertMessage("Failed to save broadcast. Please try again.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTemplate = () => {
    setIsTemplateOpen(true);
  };

  const closeTemplate = () => {
    setIsTemplateOpen(false);
  };

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

  const handleTemplateSelect = (template) => {
    setFormData(prevData => ({
      ...prevData,
      selectedTemplate: template
    }));
    closeTemplate();
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
          <BroadcastHeader onClose={handleCloseAndNavigate} highlightClose={highlightClose} />
          
          <AlertDialog 
            showAlert={showAlert} 
            message={alertMessage}
          />

          <BroadcastForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleRadioChange={handleRadioChange}
            handleMediaChange={handleMediaChange}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isTemplateOpen={isTemplateOpen}
            openTemplate={openTemplate}
            closeTemplate={closeTemplate}
            SendTemplate={SendTemplate}
            loading={loading}
            error={error}
            customerLists={customerLists}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onTemplateSelect={handleTemplateSelect}
          />
        </div>
      </div>
      <ConfirmationDialog
        showExitDialog={showExitDialog}
        hasUnsavedChanges={hasUnsavedChanges}
        cancelExit={cancelExit}
        confirmExit={confirmExit}
      />
    </>
  );
};

export default BroadcastPages;