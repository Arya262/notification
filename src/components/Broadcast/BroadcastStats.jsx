import brodcastIcon from '../../assets/S.png'
import liveIcon from  '../../assets/Live_brodcast.png'
import sentIcon from '../../assets/sent_brodcast.png'
import totalIcon from '../../assets/Total_brodcast.png'


const stats = [
  { label: "Total Broadcast", value: 42, icon: brodcastIcon },
  { label: "Live Broadcast", value: 4, icon: liveIcon },
  { label: "Sent Broadcast", value: 2, icon: sentIcon },
  { label: "Scheduled Broadcast", value: 2, icon: totalIcon },
];

const BroadcastStats = () => {
  return (
    <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
    {stats.map((item, index) => (
      <div key={index} className="bg-white p-4 rounded-xl shadow ">
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

