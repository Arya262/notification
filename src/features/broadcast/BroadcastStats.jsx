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

  // Calculate total stats from message funnel data
  const totalStats = data.reduce((acc, item) => {
    return {
      totalContacts: acc.totalContacts + (item.sent || 0),
      delivered: acc.delivered + (item.delivered || 0),
      read: acc.read + (item.read || 0),
      clicks: acc.clicks + (item.clicked || 0)
    };
  }, { totalContacts: 0, delivered: 0, read: 0, clicks: 0 });

  const stats = [
    { label: "Total Contact", value: totalStats.totalContacts, icon: brodcastIcon },
    { label: "Message Delivered", value: totalStats.delivered, icon: liveIcon },
    { label: "Message Read", value: totalStats.read, icon: sentIcon },
    { label: "Total link Click", value: totalStats.clicks, icon: totalIcon },
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