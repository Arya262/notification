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
              border: state.isFocused ? `1px solid #05A3A3` : `1px solid #D1D5DB`,
              borderRadius: '0.375rem 0 0 0.375rem',
              backgroundColor: '#f9fafb',
              boxShadow: state.isFocused ? '0 0 0 1px #05A3A3' : 'none',
              minHeight: '38px',
              height: '38px',
              transition: 'all 0.15s ease-in-out'
            }),
            valueContainer: (base) => ({
              ...base,
              height: '38px',
              padding: '0 8px'
            }),
            input: (base) => ({
              ...base,
              margin: '0px',
              padding: '0px'
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
          className={`border border-gray-300 p-2 flex-1 rounded-r-md text-gray-700 h-[38px] focus:border-[#05A3A3] focus:outline-none focus:ring-1 focus:ring-[#05A3A3] transition-all duration-150 ease-in-out ${phoneError ? 'border-[#05A3A3]' : ''}`}
        />
      </div>
      {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
      <p className="text-xs text-gray-500 mt-1">
        Provide the contact's mobile number, making sure to include the correct country code (e.g., +1, +91).
      </p>
    </div>
  );
}