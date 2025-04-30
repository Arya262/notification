// NameInput.jsx
export default function NameInput({ name, setName }) {
    return (
      <div className="mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border h-10 pl-3 rounded-md w-full focus:outline-none focus:border-[#05A3A3]"
        />
        <p className="text-xs text-gray-500 mt-1">Enter a name to help identify this contact</p>
      </div>
    );
  }
  