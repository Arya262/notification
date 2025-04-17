import React from 'react'
import Table from './Table';

const Templates = () => {
  return (
    <div className='flex flex-col gap-6'>
      {/* Summary Cards */}
      <div className='flex flex-col md:flex-row justify-start gap-4'>
        {/* Approved Template Card */}
        <div className="w-full md:w-[350px] h-[124px] p-[20px] rounded-[7.58px] text-center border-2 shadow-sm bg-white">
          <div className="flex items-center justify-start gap-7">
            <div className="w-[60px] h-[60px]">
              <img src='./approve.png' className="w-full h-full object-contain mx-auto" />
            </div>
            <div className="text-left">
              <p className="text-[20px] text-[#666464] font-poppins font-medium">
                Approved Templates
              </p>
              <p className="font-poppins font-semibold pt-3 text-[21px]">
                42
              </p>
            </div>
          </div>
        </div>

        {/* Pending Template Card */}
        <div className="w-full md:w-[350px] h-[124px] p-[20px] rounded-[7.58px] text-center border-2 shadow-sm bg-white">
          <div className="flex items-center justify-start gap-7">
            <div className="w-[60px] h-[60px]">
              <img src='./pending.png' className="w-full h-full object-contain mx-auto" />
            </div>
            <div className="text-left">
              <p className="text-[20px] text-[#666464] font-poppins font-medium">
                Pending Templates
              </p>
              <p className="font-poppins font-semibold pt-3 text-[21px]">
                4
              </p>
            </div>
          </div>
        </div>

        {/* Rejected Template Card */}
        <div className="w-full md:w-[350px] h-[124px] p-[20px] rounded-[7.58px] text-center border-2 shadow-sm bg-white">
          <div className="flex items-center justify-start gap-7">
            <div className="w-[60px] h-[60px]">
              <img src='./rejected.png' className="w-full h-full object-contain mx-auto" />
            </div>
            <div className="text-left">
              <p className="text-[20px] text-[#666464] font-poppins font-medium">
                Rejected Templates
              </p>
              <p className="font-poppins font-semibold pt-3 text-[21px]">
                2
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table />
    </div>
  )
}

export default Templates;
