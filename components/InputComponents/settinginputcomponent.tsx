import React from "react";

export const renderSettingsTextField = (
  input: {
    id: any;
    label: any;
    placeholder?: string;
   
  },
  value: string,
  handleChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void,
  className?: string
) => {
  return (
    <div className={`${className || "w-[60%]"} inline-flex flex-col items-start gap-[8px]`}>
      <div className="w-fit mt-2 [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
        {input.label}
      </div>
      <div className="relative w-full">
       
          <input
            maxLength={300}
            id={input.id}
            value={value}
            onChange={handleChange}
            className="w-full p-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
            placeholder={input.placeholder}
          />
    
      </div>
    </div>
  );
};
