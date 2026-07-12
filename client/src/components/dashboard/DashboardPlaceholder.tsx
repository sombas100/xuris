import { cn } from "@/lib/utils";

type DashboardPlaceholderProps = {
  message: string;
  className?: string;
};

const DashboardPlaceholder = ({
  message,
  className,
}: DashboardPlaceholderProps) => {
  return (
    <div
      className={cn(
        "flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/10",
        className,
      )}
    >
      <p className="max-w-xs text-center text-white/40">{message}</p>
    </div>
  );
};

export default DashboardPlaceholder;
