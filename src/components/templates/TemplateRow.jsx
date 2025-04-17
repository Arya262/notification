const TemplateRow = ({ date, name, type, category, status }) => {
  const statusColors = {
    Approved: "bg-[#00A31E]",
    Pending: "bg-[#FF6262]",
    Rejected: "bg-[#FFA500]",
  };

  return (
    <tr className="bg-white h-[60px] border-b border-[#C3C3C3] font-semibold">
      <td className="px-4 whitespace-nowrap">{date}</td>
      <td className="px-4 whitespace-nowrap">{name}</td>
      <td className="px-4">{type}</td>
      <td className="px-4">{category}</td>
      <td className="px-4">
        <span
          className={`w-[122.58px] ml-2 h-[40px] rounded-full text-white flex items-center justify-center border px-4 ${statusColors[status]}`}
        >
          {status}
        </span>
      </td>
      <td className="px-4">
        <div className="flex items-center justify-center gap-2">
          <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11.5A1.5 1.5 0 005.5 20H17a2 2 0 002-2v-5m-1.293-6.707a1 1 0 011.414 1.414L12.414 15H11v-1.414l6.707-6.707z"
              />
            </svg>
          </button>

          <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md focus:outline outline-2 outline-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 7h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7zm3 3v6m6-6v6M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TemplateRow;
