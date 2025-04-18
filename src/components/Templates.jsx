import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from './Table';

const Templates = () => {
  const [counts, setCounts] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchTemplateCounts = async () => {
      try {
        const response = await axios.get('https://pika-driving-gannet.ngrok-free.app/templates?shop_id=1');
        const templates = response.data.templates;

        const approved = templates.filter(t => t.status === 'approved').length;
        const pending = templates.filter(t => t.status === 'pending').length;
        const rejected = templates.filter(t => t.status === 'rejected').length;

        setCounts({ approved, pending, rejected });
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplateCounts();
  }, []);

  return (
    <div className="space-y-6 px-4 py-4">
      {/* Cards Section */}
      <div className="flex flex-col md:flex-row justify-start gap-4">
        {/* Approved Template Card */}
        <div className="w-full md:w-[350px] h-[124px] p-[20px] rounded-[7.58px] text-center border-2 shadow-sm bg-white">
          <div className="flex items-center justify-start gap-7">
            <div className="w-[60px] h-[60px]">
              <img src="./approve.png" className="w-full h-full object-contain mx-auto" alt="Approved" />
            </div>
            <div className="text-left">
              <p className="text-[20px] text-[#666464] font-poppins font-medium">
                Approved Templates
              </p>
              <p className="font-poppins font-semibold pt-3 text-[21px]">
                {counts.approved}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Template Card */}
        <div className="w-full md:w-[350px] h-[124px] p-[20px] rounded-[7.58px] text-center border-2 shadow-sm bg-white">
          <div className="flex items-center justify-start gap-7">
            <div className="w-[60px] h-[60px]">
              <img src="./pending.png" className="w-full h-full object-contain mx-auto" alt="Pending" />
            </div>
            <div className="text-left">
              <p className="text-[20px] text-[#666464] font-poppins font-medium">
                Pending Templates
              </p>
              <p className="font-poppins font-semibold pt-3 text-[21px]">
                {counts.pending}
              </p>
            </div>
          </div>
        </div>

        {/* Rejected Template Card */}
        <div className="w-full md:w-[350px] h-[124px] p-[20px] rounded-[7.58px] text-center border-2 shadow-sm bg-white">
          <div className="flex items-center justify-start gap-7">
            <div className="w-[60px] h-[60px]">
              <img src="./rejected.png" className="w-full h-full object-contain mx-auto" alt="Rejected" />
            </div>
            <div className="text-left">
              <p className="text-[20px] text-[#666464] font-poppins font-medium">
                Rejected Templates
              </p>
              <p className="font-poppins font-semibold pt-3 text-[21px]">
                {counts.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div>
        <Table />
      </div>
    </div>
  );
};

export default Templates;
