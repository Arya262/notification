const ContactMessage = ({ msg, sent }) => (
    <div className={`relative flex ${sent ? "justify-end" : "justify-start"}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow max-w-[40%]">
        <div className="p-3">
          <p className="text-sm font-semibold">{msg.contact.name}</p>
          <p className="text-xs text-gray-600">{msg.contact.phone}</p>
        </div>
      </div>
      <div className="flex justify-end items-center gap-1 px-2 py-1">
        <span className="text-[10px] text-gray-500">{msg.sent_at}</span>
        {sent && (
          <span className="text-blue-500">
            {msg.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
          </span>
        )}
      </div>
    </div>
  );
  export default ContactMessage