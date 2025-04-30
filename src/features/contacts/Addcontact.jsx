import React, { useEffect, useState } from 'react';
import ContactTabs from './ContactTabs';
import SuccessErrorMessage from './SuccessErrorMessage';
import SingleContactForm from './SingleContactForm';

export default function AddContact({ closePopup }) {
  const [tab, setTab] = useState('single');
  const [phone, setPhone] = useState('+1 ');
  const [optStatus, setOptStatus] = useState('Opted In');
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [csvUrl, setCsvUrl] = useState('');
  const [file, setFile] = useState(null);
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/codes');
        const data = await res.json();
        const sorted = data.data?.map((c) => ({
          value: c.dial_code,
          label: `${c.code} ${c.dial_code} ${c.name}`
        })).sort((a, b) => a.label.localeCompare(b.label));
        setCountryCodes(sorted);
      } catch (err) {
        setCountryCodes([
          { value: '+1', label: 'US +1 United States' },
          { value: '+91', label: 'IN +91 India' },
        ]);
      }
    };
    fetchCountryCodes();
  }, []);

  useEffect(() => {
    if (countryCodes.length && !selectedCountry) {
      const india = countryCodes.find(c => c.value === '+91');
      setSelectedCountry(india || countryCodes[0]);
      setPhone(`${(india || countryCodes[0]).value} `);
    }
  }, [countryCodes]);

  const validatePhoneNumber = () => {
    const raw = phone.split(' ')[1] || '';
    const cleaned = raw.replace(/\D/g, '');
    const pattern = /^[0-9]{10}$/;
    if (!cleaned) {
      setPhoneError('Please enter a phone number.');
      return false;
    } else if (!pattern.test(cleaned)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSubmit = () => {
    if (tab === 'single') {
      if (!validatePhoneNumber()) return;

      fetch('http://localhost:3000/addcustomer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_country_code: selectedCountry.value,
          name,
          mobile_no: phone.split(' ')[1],
          shop_id: '1'
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSuccessMessage('Contact added successfully!');
            setErrorMessage('');
            setTimeout(() => {
              closePopup(); // Close the popup on success
            }, 1000);
          } else {
            setErrorMessage('Failed to add contact.');
            setSuccessMessage('');
          }
        })
        .catch(() => {
          setErrorMessage('An error occurred.');
          setSuccessMessage('');
        });
    } else {
      console.log({ csvUrl, file });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl text-gray-500 p-6">
      <h2 className="text-xl font-semibold mb-2 text-black">Add Contact</h2>
      <SuccessErrorMessage successMessage={successMessage} errorMessage={errorMessage} />
      <p className="text-sm text-gray-600 mb-4">
        Add one contact at a time or bulk upload contacts from a CSV.{' '}
        <a href="#" className="text-blue-600 underline">Learn more</a>
      </p>
      <ContactTabs tab={tab} setTab={setTab} />
      {tab === 'single' && (
        <SingleContactForm
          phone={phone} setPhone={setPhone}
          selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}
          countryCodes={countryCodes}
          phoneError={phoneError} validatePhoneNumber={validatePhoneNumber}
          isTouched={isTouched} setIsTouched={setIsTouched}
          optStatus={optStatus} setOptStatus={setOptStatus}
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