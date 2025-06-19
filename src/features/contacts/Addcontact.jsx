import React, { useEffect, useState } from "react";
import ContactTabs from "./ContactTabs";
import SuccessErrorMessage from "./SuccessErrorMessage";
import SingleContactForm from "./SingleContactForm";
import BulkContactForm from "./BulkContactForm";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

export default function AddContact({ closePopup }) {
  const [tab, setTab] = useState("single");
  const [phone, setPhone] = useState("+1 ");
  const [optStatus, setOptStatus] = useState("Opted In");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [fieldMapping, setFieldMapping] = useState({});

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/codes"
        );
        const data = await res.json();
        const sorted = data.data
          ?.map((c) => ({
            value: c.dial_code,
            label: `${c.code} ${c.dial_code} ${c.name}`,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountryCodes(sorted);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setCountryCodes([
          { value: "+1", label: "US +1 United States" },
          { value: "+91", label: "IN +91 India" },
        ]);
      }
    };
    fetchCountryCodes();
  }, []);

  useEffect(() => {
    if (countryCodes.length && !selectedCountry) {
      const india = countryCodes.find((c) => c.value === "+91");
      setSelectedCountry(india || countryCodes[0]);
      setPhone(`${(india || countryCodes[0]).value} `);
    }
  }, [countryCodes, selectedCountry]);

  const validatePhoneNumber = () => {
    const raw = phone.split(" ")[1] || "";
    const cleaned = raw.replace(/\D/g, "");
    const pattern = /^[0-9]{10}$/;
    if (!cleaned) {
      setPhoneError("Please enter a phone number.");
      return false;
    } else if (!pattern.test(cleaned)) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validateGroupName = () => {
    if (tab === "bulk" && !groupName.trim()) {
      setGroupNameError("Group name is required for bulk upload.");
      return false;
    }
    if (tab === "bulk" && groupName.trim().length < 2) {
      setGroupNameError("Group name must be at least 2 characters long.");
      return false;
    }
    if (tab === "bulk" && groupName.trim().length > 50) {
      setGroupNameError("Group name must be less than 50 characters.");
      return false;
    }
    setGroupNameError("");
    return true;
  };

  const clearBulkData = () => {
    setFile(null);
    setGroupName("");
    setGroupNameError("");
  };

  const handleTabChange = (newTab) => {
    if (newTab === "single" && tab === "bulk") {
      clearBulkData();
    }
    setTab(newTab);
  };

  const handleSubmit = async () => {
    // Validate based on current tab
    if (tab === "single") {
      if (!validatePhoneNumber()) return;
    } else if (tab === "bulk") {
      if (!validateGroupName()) return;
      if (!file) {
        setErrorMessage("Please provide a CSV file.");
        setSuccessMessage("");
        return;
      }
    }

    setIsSubmitting(true);

    if (!user) {
      alert("You must be logged in.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (tab === "single") {
        const response = await fetch(API_ENDPOINTS.CONTACTS.ADD_SINGLE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            country_code: selectedCountry.value,
            first_name: name.trim(),
            mobile_no: phone.split(" ")[1],
            customer_id: user.customer_id,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setSuccessMessage(data.message || "Contact added successfully!");
          setErrorMessage("");
          closePopup();
        } else {
          setErrorMessage(data.message || "Failed to add contact.");
          setSuccessMessage("");
        }
      } else {
const formData = new FormData();
formData.append("file", file);
formData.append("customer_id", user.customer_id);
formData.append("group_name", groupName.trim());
formData.append("field_mapping", JSON.stringify(fieldMapping)); // 👈 include this

// 🔍 Log FormData before sending
console.log("📤 Submitting FormData:");
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}

        const response = await fetch(API_ENDPOINTS.CONTACTS.ADD_MULTIPLE, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          setSuccessMessage(data.message || "Contacts imported from file!");
          setErrorMessage("");
          closePopup();
        } else {
          setErrorMessage(data.message || "Failed to import from file.");
          setSuccessMessage("");
        }
      }
    } catch (error) {
      console.error("API error:", error);
      setErrorMessage("An error occurred.");
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl text-gray-500 p-6">
      <h2 className="text-xl font-semibold mb-2 text-black">Add Contact</h2>
      <SuccessErrorMessage
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <p className="text-sm text-gray-600 mb-4">
        Add one contact at a time or bulk upload contacts from a CSV.{" "}
        <a href="#" className="text-blue-600 underline">
          Learn more
        </a>
      </p>
      <ContactTabs tab={tab} setTab={handleTabChange} />
      {tab === "single" && (
        <SingleContactForm
          phone={phone}
          setPhone={setPhone}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countryCodes={countryCodes}
          phoneError={phoneError}
          validatePhoneNumber={validatePhoneNumber}
          isTouched={isTouched}
          setIsTouched={setIsTouched}
          optStatus={optStatus}
          setOptStatus={setOptStatus}
          name={name}
          setName={setName}
        />
      )}
      {tab === "bulk" && (
        <BulkContactForm
          file={file}
          setFile={setFile}
          groupName={groupName}
          setGroupName={setGroupName}
          groupNameError={groupNameError}
           fieldMapping={fieldMapping}
  setFieldMapping={setFieldMapping}
        />
      )}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 bg-teal-600 text-white px-4 py-2 rounded mx-auto block cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Adding...</span>
          </>
        ) : (
          "Add Contact"
        )}
      </button>
    </div>
  );
}
