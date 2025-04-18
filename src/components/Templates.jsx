import React, { useEffect, useState } from 'react';
import Table from './Table';
import ErrorBoundary from './ErrorBoundary';

import approvedIcon from '../assets/Approve.png';
import pendingIcon from '../assets/Pending.png';
import rejectedIcon from '../assets/Rejected.png';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("http://localhost:3000/templates");
        const data = await response.json();
        if (Array.isArray(data.templates)) {
          setTemplates(data.templates);
        } else {
          console.error("Invalid response format:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const approvedCount = templates.filter(t => t.status?.toLowerCase() === "approved").length;
  const pendingCount = templates.filter(t => t.status?.toLowerCase() === "pending").length;
  const rejectedCount = templates.filter(t => t.status?.toLowerCase() === "rejected").length;

  const summaryCards = [
    {
      label: 'Approved Templates',
      count: approvedCount,
      image: approvedIcon,
      bgColor: 'bg-[#D1FADF]',
    },
    {
      label: 'Pending Templates',
      count: pendingCount,
      image: pendingIcon,
      bgColor: 'bg-[#FEE4E2]',
    },
    {
      label: 'Rejected Templates',
      count: rejectedCount,
      image: rejectedIcon,
      bgColor: 'bg-[#FECDCA]',
    }
  ];

  return (
    <div className='flex flex-col gap-6'>
      {/* Summary Cards */}
      <div className='flex flex-col md:flex-row justify-start gap-4'>
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="w-full md:w-[350px] h-[124px] p-5 rounded-xl shadow-sm bg-white flex items-center gap-6"
          >
            <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center ${card.bgColor}`}>
              <img src={card.image} alt={card.label} className="w-[32px] h-[32px] object-contain" />
            </div>
            <div className="text-left">
              <p className="text-[18px] text-[#555] font-medium font-poppins">{card.label}</p>
              <p className="text-[22px] font-bold font-poppins mt-1">{card.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table of Templates */}
      <ErrorBoundary>
        {loading ? <p>Loading templates...</p> : <Table templates={templates} />}
      </ErrorBoundary>
    </div>
  );
};

export default Templates;
