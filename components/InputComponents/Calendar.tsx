import { cn } from "@/constants/helpers";
import {
  CaptionProps,
  DayFlag,
  DayPicker,
  MonthCaptionProps,
} from "react-day-picker";
import "react-day-picker/style.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("", className)}
      classNames={{
        month: "space-y-4 w-full",
        months: "flex flex-col sm:flex-row space-y-4  sm:space-y-0 w-full",

        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "font-semibold text-base capitalize",
        nav: "space-x-1 flex items-center",
        button_previous:
          "z-[5] absolute top-1 left-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-blue-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        button_next:
          "z-[5] absolute top-1 right-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-blue-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        //day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-green-100 [&:has([aria-selected])]:bg-green-200 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-blue-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 p-0 font-normal hover:bg-blue-100 hover:text-blue-800 aria-selected:opacity-100 aria-selected:hover:text-white aria-today:hover:text-red-600",
        range_end: "day-range-end",
        selected:
          "bg-blue-500 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-600 focus:text-white ",
        today: " text-red-600 hover:text-red-600 font-semibold",
        outside:
          "day-outside text-gray-400 opacity-50 aria-selected:bg-green-100 aria-selected:text-gray-600 aria-selected:opacity-30",
        disabled: "text-gray-400 opacity-50",
        range_middle: "aria-selected:bg-green-200 aria-selected:text-green-900",
        hidden: "invisible",
      }}
      components={{}}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
