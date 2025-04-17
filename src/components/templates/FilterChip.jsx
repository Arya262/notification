const FilterChip = ({ label, count, bgColor, borderColor, textColor = "text-black" }) => (
    <div className={`flex items-center border ${borderColor} h-[44px] rounded-[3.66px] overflow-hidden font-poppins`}>
      <div className="text-[#898989] font-medium text-[17px] px-3 bg-white flex-grow">
        {label}
      </div>
      <div className={`text-[16px] w-[44px] h-[44px] font-normal flex items-center justify-center ml-3 rounded-tl-[5px] rounded-tr-[5px] rounded-br-[5px] ${bgColor} ${textColor}`}>
        {count}
      </div>
    </div>
  );
  
  export default FilterChip;
  