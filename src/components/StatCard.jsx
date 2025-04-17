const StatCard = ({ icon, title, count }) => (
    <div className="bg-white p-5 rounded-xl shadow-md flex items-start gap-4">
      <div className="bg-[#0AA89E2B] text-[#0AA89E] p-3 rounded-full text-xl">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-semibold">{count}</h2>
      </div>
    </div>
  );

  export default StatCard