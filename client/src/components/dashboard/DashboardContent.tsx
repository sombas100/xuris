import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type DashboardContentProps = PropsWithChildren<{
  className?: string;
}>;

const DashboardContent = ({ children, className }: DashboardContentProps) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-4xl",
        "border border-white/15",
        "bg-linear-to-br from-primary/4 via-white/2.5 to-background",
        "p-5 shadow-2xl shadow-black/30 backdrop-blur-sm",
        "sm:p-6 lg:p-8",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default DashboardContent;
