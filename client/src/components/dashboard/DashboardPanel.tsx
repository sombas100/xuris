import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type DashboardPanelProps = PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
}>;

const DashboardPanel = ({
  title,
  description,
  className,
  children,
}: DashboardPanelProps) => {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/10 bg-background/50 p-6",
        className,
      )}
    >
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>

        {description && (
          <p className="mt-1 text-sm text-white/45">{description}</p>
        )}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
};

export default DashboardPanel;
