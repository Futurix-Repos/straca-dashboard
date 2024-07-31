import React from "react";
import Image from "next/image";
import Select from "react-select";

interface DropdownProps {
  input: {
    id: string;
    label: string;
    placeholder?: string;
    type?: "select";
  };
  value?: string;
  handleSelect?: (event: React.FormEvent<HTMLSelectElement>) => void;
  selectList?: { id: string; label: string }[];
  className?: string;
}

const DropdownComponent = ({
  input,
  value,
  handleSelect,
  selectList,
  className,
}: DropdownProps) => {
  return (
    <div
      className={`${
        className || "w-[45%]"
      } inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]`}
    >
      <div className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
        {input.label}
      </div>
      <div className="relative w-[100%]">
        <select
          id={input.id}
          onChange={handleSelect}
          value={value}
          className="w-full  p-2 pb-[10px] text-gray-900 bg-white border border-gray-200 rounded-lg"
        >
          <option value="" disabled hidden>
            {input.placeholder || "Select an option"}
          </option>
          {selectList?.map((item) => (
            <option key={item.id} value={item.id}>
              {/* Display both image and text */}
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownComponent;
