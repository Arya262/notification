import brodcastIcon from '../../assets/Total_brodcast.png';
import liveIcon from '../../assets/Live_brodcast.png';
import sentIcon from '../../assets/sent_brodcast.png';
import totalIcon from '../../assets/S.png';

const BroadcastStats = ({ data }) => {
  // Validate data prop
  if (!data || !Array.isArray(data)) {
    return (
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="bg-white p-4 mt-0 rounded-xl shadow">
          <p className="text-md text-gray-600">Invalid data</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic stats
  const totalContact = data.length;
  const messageDelivered = data.filter((item) => item.status === "Live").length;
  const messageRead = data.filter((item) => item.status === "Sent").length; // Fixed: Changed to "Sent"
  const totalLinkClick = data.filter(
    (item) => item.schedule === "Yes" || item.status === "Scheduled"
  ).length;

  const stats = [
    { label: "Total Contact", value: totalContact, icon: brodcastIcon },
    { label: "Message Delivered", value: messageDelivered, icon: liveIcon },
    { label: "Message Read", value: messageRead, icon: sentIcon },
    { label: "Total link Click", value: totalLinkClick, icon: totalIcon },
  ];

  return (
    <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {stats.map((item, index) => (
        <div key={index} className="bg-white p-4 mt-0 rounded-xl shadow">
          <div className="flex items-center gap-3">
            <img src={item.icon} alt={item.label} className="w-14 h-14" />
            <div>
              <p className="text-md text-gray-600">{item.label}</p>
              <p className="text-xl font-bold">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BroadcastStats; 