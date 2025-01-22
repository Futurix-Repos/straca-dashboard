import React, { forwardRef } from "react";

interface CustomDateInputProps {
  value?: string;
  onClick?: () => void;
  className?: string;
}

export const CustomDateInput = forwardRef<
  HTMLButtonElement,
  CustomDateInputProps
>(({ value, onClick, className }, ref) => (
  <button className={className} onClick={onClick} ref={ref}>
    {value}
  </button>
));

CustomDateInput.displayName = "CustomDateInput";
