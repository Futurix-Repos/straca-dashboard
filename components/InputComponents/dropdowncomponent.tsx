import React from "react";

interface DropdownProps<T extends { _id: string; label?: string; firstName?: string; imageUrl?: string }> {
  input: {
    id: string;
    label: string;
    placeholder?: string;
    type?: "select";
  };
  value?: string;
  handleSelect?: (event: React.FormEvent<HTMLSelectElement>) => void;
  selectList?: T[];
  className?: string;
}

const DropdownComponent = <T extends {
  flag?: any; _id: string; label?: string; firstName?: string; imageUrl?: string 
}>({
  input,
  value,
  handleSelect,
  selectList,
  className,
}: DropdownProps<T>) => {
  return (
    <div className={`${
      className || "w-[45%]"
    } inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]`}>
      <div className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
        {input.label}
      </div>
      <div className="relative w-[100%]">
        <select
          id={input.id}
          onChange={handleSelect}
          value={value}
          className="w-full  p-2 pb-[10px] text-gray-900 bg-white border border-gray-200 rounded-lg">
          <option value="" disabled hidden>
            {input.placeholder || "Select an option"}
          </option>
          {selectList?.map((item) => (
            <option key={item._id} value={item.firstName || item.label || ""}>
              {/* Display both image and text */}
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.label} style={{ width: '24px', marginRight: '8px' }} />}
                {item.flag} {/* Render the flag emoji */}
                &nbsp; {/* Add space between the flag and country name */}
                {item.firstName || item.label || ""}
              </span>
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownComponent;
