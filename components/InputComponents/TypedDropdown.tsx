import React from "react";

interface DropdownProps<T extends { _id: string; label?: string; firstName?: string; imageUrl?: string }> {
    input: {
        id: string;
        label: string;
        placeholder?: string;
        type?: "select";
    };
    value?: string;
    handleSelect?: (selectedItem: T | null) => void; // Updated type signature
    selectList?: T[];
    className?: string;
}

const TypedDropdown = <T extends {
    flag?: any; _id: string; label?: string; firstName?: string; imageUrl?: string
}>({
    input,
    value,
    handleSelect,
    selectList,
    className,
}: DropdownProps<T>) => {
    const handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const selectedIndex = event.currentTarget.selectedIndex;
        if (selectedIndex !== 0 && selectList) {
            handleSelect?.(selectList[selectedIndex - 1]); // Adjust index to account for placeholder option
        } else {
            handleSelect?.(null); // Return null if no option is selected
        }
    };

    return (
        <div className={`${className || "w-[45%]"
            } inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]`}>
            <div className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[16px] tracking-[0] leading-[normal] whitespace-nowrap">
                {input.label}
            </div>
            <div className="relative w-[100%]">
                <select
                    id={input.id}
                    onChange={handleChange} // Use handleChange instead of handleSelect directly
                    value={value}
                    className="w-full  p-2 pb-[10px] text-gray-900 bg-white border border-gray-200 rounded-lg">
                    <option value="" disabled hidden>
                        {input.placeholder || "Select an item"}
                    </option>
                    <option value="">--------------</option>
                    {selectList?.map((item) => (
                        <option key={item._id} value={item.firstName || item.label || ""}>
                            {/* Display both image and text */}
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                {item.firstName || item.label || ""}
                            </span>
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default TypedDropdown;
