import React, { useEffect, useState } from "react";
import ContactTabs from "./ContactTabs";
import SuccessErrorMessage from "./SuccessErrorMessage";
import SingleContactForm from "./SingleContactForm";
import { API_ENDPOINTS } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

export default function EditContact({ contact, closePopup, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [optStatus, setOptStatus] = useState("Opted In");
  const [name, setName] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    // Initialize form with contact data
    if (contact) {
      setName(contact.first_name || "");
      setPhone(`${contact.country_code || ""} ${contact.mobile_no || ""}`);
      setOptStatus(contact.is_active ? "Opted In" : "Opted Out");
    }
  }, [contact]);

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
        // Set the selected country based on contact's country code
        if (contact?.country_code) {
          const matchingCountry = sorted.find(
            (c) => c.value === contact.country_code
          );
          if (matchingCountry) {
            setSelectedCountry(matchingCountry);
          }
        }
      } catch (err) {
        setCountryCodes([
          { value: "+1", label: "US +1 United States" },
          { value: "+91", label: "IN +91 India" },
        ]);
      }
    };
    fetchCountryCodes();
  }, [contact]);

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

  const handleSubmit = async () => {
    if (!user) {
      setErrorMessage("You must be logged in.");
      return;
    }

    if (!validatePhoneNumber()) return;

    const requestBody = {
      contact_id: contact.contact_id,
      customer_id: user.customer_id,
      country_code: selectedCountry.value,
      first_name: name.trim(),
      mobile_no: phone.split(" ")[1],
    };

    console.log("📤 Sending update request:", requestBody);

    try {
      const response = await fetch(API_ENDPOINTS.CONTACTS.UPDATE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(data.message || "Contact updated successfully!");
        setErrorMessage("");
        if (onSuccess) {
          onSuccess();
        }
        closePopup();
      } else {
        setErrorMessage(data.message || "Failed to update contact.");
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("API error:", err);
      setErrorMessage("An error occurred while updating the contact.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl text-gray-500 p-6">
      <h2 className="text-xl font-semibold mb-2 text-black">Edit Contact</h2>
      <SuccessErrorMessage
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <p className="text-sm text-gray-600 mb-4">
        Update the contact's information below.
      </p>
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
      <button
        onClick={handleSubmit}
        className="mt-4 bg-teal-600 text-white px-4 py-2 rounded mx-auto block"
      >
        Update Contact
      </button>
    </div>
  );
}
