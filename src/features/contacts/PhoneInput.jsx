import Select, { components } from 'react-select';
import { FiSearch } from 'react-icons/fi';

export default function PhoneInput({
  phone, setPhone, selectedCountry, setSelectedCountry,
  countryCodes, phoneError, validatePhoneNumber, isTouched, setIsTouched
}) {
  const customDropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      <FiSearch className="text-gray-500" />
    </components.DropdownIndicator>
  );

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setPhone(`${selectedOption.value} ${phone.split(' ')[1] || ''}`);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
      <div className="flex">
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countryCodes}
          placeholder="Search country code"
          className="w-48"
          styles={{
            control: (base, state) => ({
              ...base,
              border: `1px solid #05A3A3`,
              borderRadius: '0.375rem 0 0 0.375rem',
              backgroundColor: '#f9fafb',
              boxShadow: state.isFocused ? '0 0 0 1px #05A3A3' : 'none',
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
          components={{ DropdownIndicator: customDropdownIndicator }}
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
          onBlur={validatePhoneNumber}
          onKeyDown={(e) => e.key === 'Enter' && validatePhoneNumber()}
          className={`border p-2 flex-1 rounded-r-md text-gray-700 ${phoneError ? 'border-[#05A3A3]' : 'border-gray-300'}`}
        />
      </div>
      {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
      <p className="text-xs text-gray-500 mt-1">
        Provide the contact's mobile number, making sure to include the correct country code (e.g., +1, +91).
      </p>
    </div>
  );
}