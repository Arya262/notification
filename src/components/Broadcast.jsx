import StatCard from './StatCard';
import BroadcastTabs from './BroadcastTabs';
import SearchBar from './SearchBar';
import BroadcastTable from './BroadcastTable';
import AddBroadcastButton from './AddBroadcastButton';

import { FaBroadcastTower, FaPaperPlane, FaCalendarAlt, FaSignal } from 'react-icons/fa';

const Broadcast = () => {
  const stats = [
    { icon: <FaBroadcastTower />, title: 'Total Broadcast', count: 42 },
    { icon: <FaSignal />, title: 'Live Broadcast', count: 4 },
    { icon: <FaPaperPlane />, title: 'Sent Broadcast', count: 2 },
    { icon: <FaCalendarAlt />, title: 'Scheduled Broadcast', count: 2 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl font-semibold">Broadcast WhatsApp Campaigns</h1>
        <AddBroadcastButton />
      </div>

      <p className="text-gray-500">Launch a campaign today to start engaging new users on WhatsApp for your restaurant</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="flex justify-between items-center flex-wrap gap-4">
        <BroadcastTabs />
        <SearchBar />
      </div>

      <BroadcastTable />
    </div>
  );
};

export default Broadcast;