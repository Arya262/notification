const TemplateMessage = ({ msg, sent }) => (
  <div className={`relative flex ${sent ? "justify-end" : "justify-start"} mb-4`}>
    <div className="bg-white border rounded-2xl overflow-hidden shadow-md max-w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%]">
      
      {/* Banner Image (render only if banner_url exists) */}
      {msg.container_meta?.banner_url?.trim() && (
        <img
          src={msg.container_meta.banner_url}
          alt="Template"
          className="w-full h-40 object-cover"
        />
      )}
      
      {/* Template Content */}
      <div className="p-3">
        
        {/* Header */}
        {msg.container_meta?.header && (
          <p className="text-lg font-semibold text-red-600">{msg.container_meta.header}</p>
        )}

        {/* Data */}
        <p className="text-sm text-gray-800 whitespace-pre-line mt-1 break-words">
          {msg.container_meta?.data || "No data available"}
        </p>

        {/* Buttons */}
        {msg.container_meta?.buttons && msg.container_meta.buttons.length > 0 && (
          <div className="space-y-2 mt-2">
            {msg.container_meta.buttons.map((btn, idx) => (
              <button
                key={idx}
                className="w-full bg-[#0080ff] hover:bg-[#0066cc] text-white py-2 rounded text-sm font-medium transition"
              >
                {btn.text}
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        {msg.container_meta?.footer && (
          <p className="text-xs text-gray-400 mt-3">{msg.container_meta.footer}</p>
        )}
      </div>

      {/* Sent Timestamp */}
      <div className="flex justify-end px-3 pb-2">
        <span className="text-[10px] text-gray-500">{msg.sent_at}</span>
      </div>
    </div>
  </div>
);

export default TemplateMessage;
