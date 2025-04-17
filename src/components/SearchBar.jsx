const SearchBar = () => (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Search template by Name or Category..."
        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
      <span className="absolute left-3 top-2.5 text-gray-500 text-sm">🔍</span>
    </div>
  );
  export default SearchBar