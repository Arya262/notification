const AudioMessage = ({ msg, sent }) => (
    <div className={`relative flex ${sent ? "justify-end" : "justify-start"}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow max-w-[40%] flex items-center">
        <audio controls src={msg.media_url} className="w-full rounded">
          <p>Your browser does not support the audio element.</p>
        </audio>
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
  export default AudioMessage;