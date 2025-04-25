import brodcastIcon from '../../assets/Total_brodcast.png';
import liveIcon from '../../assets/Live_brodcast.png';
import sentIcon from '../../assets/sent_brodcast.png';
import totalIcon from '../../assets/S.png';

const BroadcastStats = ({ data }) => {
  // Calculate dynamic stats
  const totalBroadcast = data.length;
  const liveBroadcast = data.filter(item => item.status === "Live").length;
  const sentBroadcast = data.filter(item => item.status === "Opted-in" || item.status === "Stopped").length; // Adjust logic as needed
  const scheduledBroadcast = data.filter(item => item.schedule === "Yes" || item.status === "Scheduled").length;

  const stats = [
    { label: "Total Broadcast", value: totalBroadcast, icon: brodcastIcon },
    { label: "Live Broadcast", value: liveBroadcast, icon: liveIcon },
    { label: "Sent Broadcast", value: sentBroadcast, icon: sentIcon },
    { label: "Scheduled Broadcast", value: scheduledBroadcast, icon: totalIcon },
  ];

  return (
    <div className="hidden  sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {stats.map((item, index) => (
        <div key={index} className="bg-white p-4 mt-0 rounded-xl shadow ">
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