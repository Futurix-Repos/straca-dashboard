import React from "react";

export const renderFileInputField = (
  input: {
    id: any;
    label: any;
    placeholder?: string;
    type?: "file"; // New "file" type
    options?: string[] | undefined;
  },
  handleChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void,
  className?: string,
) => {
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
        {input.type === "file" && (
          <div className="w-full">
            <label
              htmlFor={input.id}
              className="w-full p-2 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer"
            >
              Choose a file
            </label>
            <input
              type="file"
              id={input.id}
              onChange={handleChange} // Pass the handleChange callback here
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};
