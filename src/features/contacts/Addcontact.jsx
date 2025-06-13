import React, { useEffect, useState } from "react";
import ContactTabs from "./ContactTabs";
import SuccessErrorMessage from "./SuccessErrorMessage";
import SingleContactForm from "./SingleContactForm";
import BulkContactForm from "./BulkContactForm";
import { API_ENDPOINTS } from "../../config/api";

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
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
  }, [countryCodes]);

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

 const handleSubmit = () => {
  // Get the token from localStorage
  const token = localStorage.getItem('auth_token');

  if (tab === "single") {
    if (!validatePhoneNumber()) return;

    fetch(API_ENDPOINTS.CONTACTS.ADD_SINGLE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': token ? `Bearer ${token}` : '', // Add Authorization header if token exists
      },
      body: JSON.stringify({
        user_country_code: selectedCountry.value,
        name: name.trim(),
        mobile_no: phone.split(" ")[1],
        customer_id: "1",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage(data.message || "Contact added successfully!");
          setErrorMessage("");
          closePopup();
        } else {
          setErrorMessage(data.message || "Failed to add contact.");
          setSuccessMessage("");
        }
      })
      .catch((err) => {
        console.error("API error:", err);
        setErrorMessage("An error occurred.");
        setSuccessMessage("");
      });
  } else {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("customer_id", "1");
      formData.append("group_name", groupName.trim());

      fetch(API_ENDPOINTS.CONTACTS.ADD_MULTIPLE, {
        method: "POST",
        headers: {
          'Authorization': token ? `Bearer ${token}` : '', // Add Authorization header if token exists
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSuccessMessage(data.message || "Contacts imported from file!");
            setErrorMessage("");
            closePopup();
          } else {
            setErrorMessage(data.message || "Failed to import from file.");
            setSuccessMessage("");
          }
        })
        .catch((err) => {
          console.error("Import from file failed:", err);
          setErrorMessage("An error occurred while importing from file.");
          setSuccessMessage("");
        });
    } else {
      setErrorMessage("Please provide a CSV file.");
      setSuccessMessage("");
    }
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
      <ContactTabs tab={tab} setTab={setTab} />
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
        />
      )}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-teal-600 text-white px-4 py-2 rounded mx-auto block"
      >
        Add Contact
      </button>
    </div>
  );
}