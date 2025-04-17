import React, { useState, useEffect } from 'react';
import Table from './Table';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates'); // Replace with actual endpoint
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const approvedCount = templates.filter(t => t.status === 'Approved').length;
  const pendingCount = templates.filter(t => t.status === 'Pending').length;
  const rejectedCount = templates.filter(t => t.status === 'Rejected').length;

  return (
    <div className="p-4">
      {/* Summary Cards */}
      <div className="flex flex-col md:flex-row justify-start gap-4 mb-6">
        <Card icon="./approve.png" title="Approved Templates" count={approvedCount} />
        <Card icon="./pending.png" title="Pending Templates" count={pendingCount} />
        <Card icon="./rejected.png" title="Rejected Templates" count={rejectedCount} />
      </div>

      {/* Table Component */}
      <Table templates={templates} loading={loading} />
    </div>
  );
};

const Card = ({ icon, title, count }) => (
  <div className="w-full md:w-[350px] h-[124px] p-[20px] rounded-[7.58px] text-center border-2 border-[#E2E8F0] shadow-[0px -0.91px 3.66px 0px #00000042] bg-white">
    <div className="flex items-center justify-start gap-7">
      <div className="w-[60px] h-[60px]">
        <img src={icon} className="w-full h-full object-contain mx-auto" alt="" />
      </div>
      <div className="text-left">
        <p className="text-[20px] text-[#666464] font-poppins font-medium">{title}</p>
        <p className="font-poppins font-semibold pt-3 text-[21px]">{count}</p>
      </div>
    </div>
  </div>
);

export default Templates;
