import React from "react";

export const renderInputField = (
  input: {
    id: any;
    label: any;
    placeholder?: string;
    type?: "text" | "textarea" | "select" | "password" | "file";
    options?: string[] | undefined;
  },
  value: string,
  handleChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void,
  handleSelect?: (event: React.FormEvent<HTMLSelectElement>) => void,
  selectList?: any[],
  className?: string,
  showPass?: boolean,
  setShowPass?: (value: boolean) => void
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
        {input.type === "text" && (
          <input
            maxLength={300}
            id={input.id}
            value={value}
            onChange={handleChange}
            className="w-full p-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
            placeholder={input.placeholder}
          />
        )}
        {input.type === "password" && (
          <input
            maxLength={300}
            type={showPass ? "text" : "password"}
            id={input.id}
            value={value}
            onChange={handleChange}
            className="w-full p-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
            placeholder={input.placeholder}
          />
        )}
        {input.type === "select" && (
          <select
            id={input.id}
            onChange={handleSelect}
            value={value}
            className="w-[520px] p-2 pb-[10px] text-gray-900 bg-white border border-gray-200 rounded-lg"
          >
            {selectList?.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        )}
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
              onChange={handleChange} // You may want to handle the change event for file input if needed
              className="hidden"
            />
          </div>
        )}
        {input.id === "password" && (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (setShowPass) {
                setShowPass(!showPass);
              }
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <i
              className={`fa-solid ${
                showPass ? "fa-eye-slash" : "fa-eye"
              } text-gray-700`}
            ></i>
          </button>
        )}
      </div>
    </div>
  );
};
