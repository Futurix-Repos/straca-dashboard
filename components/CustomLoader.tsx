import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { cn } from "@/constants/helpers";

export default function CustomLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "min-h-[calc(60vh)] flex items-center justify-center",
        className,
      )}
    >
      <Loader2 className="animate-spin" color="black" size={50} />
    </div>
  );
}
