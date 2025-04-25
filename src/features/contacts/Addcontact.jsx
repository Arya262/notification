import React, { useState, useEffect } from 'react'; 
import Select, { components } from 'react-select'; // Import react-select and components
import { FiSearch } from 'react-icons/fi'; // Import search icon from react-icons

export default function AddContact() {
  const [tab, setTab] = useState('single');
  const [phone, setPhone] = useState('+1 '); // Default country code with a space
  const [optStatus, setOptStatus] = useState('Opted In');
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [csvUrl, setCsvUrl] = useState('');
  const [file, setFile] = useState(null);
  const [countryCodes, setCountryCodes] = useState([]); // Store country codes
  const [selectedCountry, setSelectedCountry] = useState(null); // Default selected country
  const [phoneError, setPhoneError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  // Fetch country codes from API
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/codes');
        const data = await response.json();
        if (data.error === false && data.data) {
          const sortedCountries = data.data
            .map(country => ({
              value: country.dial_code,
              label: `${country.code} ${country.dial_code} ${country.name}`,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
          setCountryCodes(sortedCountries);
        }
      } catch (error) {
        console.error('Error fetching country codes:', error);
        setCountryCodes([
          { value: '+1', label: 'US +1 United States' },
          { value: '+90', label: 'TR +90 Turkey' },
          { value: '+91', label: 'IN +91 India' },
          { value: '+92', label: 'PK +92 Pakistan' },
          { value: '+93', label: 'AF +93 Afghanistan' },
          { value: '+94', label: 'LK +94 Sri Lanka' },
          { value: '+95', label: 'MM +95 Myanmar (Burma)' },
          { value: '+960', label: 'MV +960 Maldives' },
        ]);
      }
    };
    fetchCountryCodes();
  }, []);

  // Set default country code after fetching
  useEffect(() => {
    if (countryCodes.length > 0 && !selectedCountry) {
      setSelectedCountry(countryCodes[0]);
      setPhone(`${countryCodes[0].value} `);
    }
  }, [countryCodes]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (tab === 'single') {
      if (!validatePhoneNumber()) return;

      // Make the API request to add the customer
      fetch('http://localhost:3000/addcustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_country_code: selectedCountry.value,
          name: name,
          mobile_no: phone.split(' ')[1], // Remove country code and get only the mobile number
          shop_id: '1', // Replace with actual shop ID if dynamic
        }),
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
      
      // Log the form data for now
      console.log({ phone, optStatus, name, tags });
    } else {
      console.log({ csvUrl, file });
    }
  };

  // Handle country selection
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setPhone(`${selectedOption.value} ${phone.split(' ')[1] || ''}`); // Update phone with new country code
  };

  // Custom DropdownIndicator to show the search icon
  const customDropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FiSearch className="text-gray-500" />
      </components.DropdownIndicator>
    );
  };

  const validatePhoneNumber = () => {
    const rawNumber = phone.split(' ')[1] || '';
    const phoneNumber = rawNumber.replace(/\D/g, ''); // Remove non-digit characters
    const phonePattern = /^[0-9]{10}$/;

    if (!phoneNumber) {
      setPhoneError('Please enter a phone number.');
      return false;
    } else if (!phonePattern.test(phoneNumber)) {
      setPhoneError('Phone number must contain exactly 10 digits and no letters or symbols.');
      return false;
    }

    setPhoneError('');
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl text-gray-500 p-6">
      <h2 className="text-xl font-semibold mb-2 text-black">Add Contact</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add one contact at a time or bulk upload contacts from a CSV.{' '}
        <a href="#" className="text-blue-600 underline">Learn more</a>
      </p>
      {/* Tabs */}
      <div className="flex space-x-12 border-b mb-4">
        <button
          onClick={() => setTab('single')}
          className={`pb-2 font-medium flex items-center ${tab === 'single' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
        >
          <span className="flex items-center">
            <img src="contact.png" className="w-4 h-4 mr-2" alt="Single Contact Icon" />
            Add Single Contact
          </span>
        </button>
        <button
          onClick={() => setTab('bulk')}
          className={`pb-2 font-medium flex items-center ${tab === 'bulk' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
        >
          <span className="flex items-center">
            <img src="bulk.webp" className="w-4 h-4 mr-2" alt="Bulk Contacts Icon" />
            Add Bulk Contacts
          </span>
        </button>
      </div>

      {/* Single Contact Form */}
      {tab === 'single' && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
            <div className="flex">
              {/* Use react-select for searchable dropdown */}
              <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                options={countryCodes}
                placeholder="Search country code"
                className="w-48"
                classNamePrefix="select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    border: `1px solid ${state.isFocused ? '#05A3A3' : '#05A3A3'}`, // Red border on focus (click)
                    borderRadius: '0.375rem 0 0 0.375rem',
                    backgroundColor: '#f9fafb',
                    color: '#374151',
                    boxShadow: state.isFocused ? '0 0 0 1px #05A3A3' : 'none', // Optional glow on focus
                    '&:hover': {
                      borderColor: state.isFocused ? '#05A3A3' : '#05A3A3',
                    },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? '#05A3A3'
                      : state.isFocused
                        ? '#e5e7eb'
                        : 'white',
                    color: state.isSelected ? 'white' : '#374151',
                  }),
                }}
                components={{
                  DropdownIndicator: customDropdownIndicator,
                }}
              />

              <input
                type="text"
                placeholder="Enter mobile number"
                value={phone.split(' ')[1] || ''}
                onFocus={() => setIsTouched(true)}
                onChange={(e) => {
                  setPhone(`${selectedCountry?.value || ''} ${e.target.value}`);
                  if (isTouched) validatePhoneNumber();
                }}
                onBlur={() => validatePhoneNumber()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') validatePhoneNumber();
                }}
                className={`border p-2 flex-1 rounded-r-md text-gray-700 ${phoneError ? 'border-[#05A3A3]' : 'border-gray-300'}`}
              />
            </div>
            {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Provide the contact's mobile number, making sure to include the correct country code (e.g., +1, +91).
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Opt Status</label>
            <div className="flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="optStatus"
                  value="Opted In"
                  checked={optStatus === 'Opted In'}
                  onChange={(e) => setOptStatus(e.target.value)}
                  className="form-radio text-red-600 checked:bg-red-600 checked:border-red-600"
                />
                <span className="ml-2 text-gray-700">Opted In</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="optStatus"
                  value="Opted Out"
                  checked={optStatus === 'Opted Out'}
                  onChange={(e) => setOptStatus(e.target.value)}
                  className="form-radio text-red-600 focus:ring-red-600"
                />
                <span className="ml-2 text-gray-700">Opted Out</span>
              </label>
            </div>
            <p className="text-xs text-gray-700 mt-1">
              Choose whether this contact has agreed to receive messages or not.
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full border border-gray-300 p-2 rounded-md text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a name to help identify this contact
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full border border-gray-300 p-2 rounded-md text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add tags to help categorize this contact.
            </p>
          </div>
        </>
      )}

      {/* Bulk Contact Form */}
      {tab === 'bulk' && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">CSV URL</label>
            <input
              type="text"
              placeholder="Enter CSV file URL"
              value={csvUrl}
              onChange={(e) => setCsvUrl(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload your contacts in .csv format. Up to 50MB file size (~200,000 contacts) allowed.{' '}
              <a href="#" className="text-blue-600 underline">Download Sample CSV</a>
            </p>
          </div>

          <div className="mb-6 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="cursor-pointer text-gray-500">
              <div className="flex justify-center mb-2">
                <img src="cloud-computing.png" className="w-6 h-6" alt="Upload Icon" />
              </div>
              <p>Choose a file or drag it here.</p>
              <p className="text-xs mt-1">
                Upload a CSV file — max 50MB and 200K contacts allowed.
              </p>
              {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
            </label>
          </div>
        </>
      )}

      {/* Add Contact Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-[#05A3A3] items-center text-white px-4 py-2 rounded-md transition"
        >
          Add Contact
        </button>
      </div>
    </div>
  );
}
