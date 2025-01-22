import clsx from "clsx";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/constants/helpers";

export const AccordionElem = ({
  title,
  content,
  isExpanded,
  onExpand,
  className,
}: {
  title: any;
  content: any;
  isExpanded?: boolean;
  onExpand?: (value: boolean) => void;
  className?: string;
}) => {
  const [toggle, setToggle] = useState(false);

  return (
    <div
      className={cn(
        (isExpanded ?? toggle) ? "" : "max-h-20",
        "  rounded-md  transition-all duration-300",
      )}
    >
      <div
        className={cn(
          "flex justify-between items-start p-6 cursor-pointer ",
          className ?? "",
        )}
        onClick={() => {
          if (isExpanded !== undefined && onExpand !== undefined) {
            onExpand(!isExpanded);
          } else setToggle((prevState) => !prevState);
        }}
      >
        <span className="text-2xl font-semibold">{title}</span>
        <ChevronRight
          className={clsx(
            (isExpanded ?? toggle) ? "rotate-90" : "",
            "text-2xl transition-all duration-300",
          )}
        />
      </div>

      <div
        className={clsx(
          (isExpanded ?? toggle)
            ? "opacity-100 max-h-96 "
            : "opacity-0 hidden max-h-20",
          "mt-7 px-5 pb-5 overflow-auto transition-all duration-300",
        )}
      >
        <div>{content}</div>
      </div>
    </div>
  );
};
