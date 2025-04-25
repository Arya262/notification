const TemplateMessage = ({ msg, sent }) => (
  <div className={`relative flex ${sent ? "justify-end" : "justify-start"}`}>
    <div className="bg-white border rounded-2xl overflow-hidden shadow-md max-w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%]">
      <img
        src={msg.container_meta?.banner_url || "https://via.placeholder.com/600x300"}
        alt="Template"
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        {msg.container_meta?.header && (
          <p className="text-lg font-semibold text-red-600">{msg.container_meta.header}</p>
        )}
        <p className="text-sm text-gray-800 whitespace-pre-line mt-1">
          {msg.container_meta?.data || "No data available"}
        </p>
        <div className="space-y-2 mt-2">
          {msg.container_meta?.buttons?.map((btn, idx) => (
            <button key={idx} className="w-full bg-[#0080ff] hover:bg-[#0066cc] text-white py-2 rounded text-sm font-medium transition">
              {btn.text}
            </button>
          ))}
        </div>
        {msg.container_meta?.footer && (
          <p className="text-xs text-gray-400 mt-3">{msg.container_meta.footer}</p>
        )}
      </div>
      <div className="flex justify-end px-3 pb-2">
        <span className="text-[10px] text-gray-500">{msg.sent_at}</span>
      </div>
    </div>
  </div>
);

export default TemplateMessage;
