const tabs = [
    { label: 'All', count: 48, active: true },
    { label: 'Live', count: 42 },
    { label: 'Sent', count: 4 },
    { label: 'Scheduled', count: 2 },
    { label: 'Stopped', count: 2 },
    { label: 'Paused', count: 2 },
  ];
  
  const BroadcastTabs = () => (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab, i) => (
        <button
          key={i}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
            tab.active
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border-gray-300'
          }`}
        >
          {tab.label} <span className="ml-1">({tab.count})</span>
        </button>
      ))}
    </div>
  );
  
  export default  BroadcastTabs;