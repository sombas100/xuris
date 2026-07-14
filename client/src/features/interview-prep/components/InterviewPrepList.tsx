import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type InterviewPrepListTone = "warning" | "positive" | "neutral";

type InterviewPrepListProps = {
  title: string;
  items: string[] | null;
  icon: LucideIcon;
  tone?: InterviewPrepListTone;
  emptyMessage: string;
};

const toneClasses = {
  warning: {
    container: "border-amber-500/20 bg-amber-500/[0.04]",
    icon: "bg-amber-500/10 text-amber-300",
    bullet: "bg-amber-400",
  },

  positive: {
    container: "border-green-500/20 bg-green-500/[0.04]",
    icon: "bg-green-500/10 text-green-300",
    bullet: "bg-green-400",
  },

  neutral: {
    container: "border-primary/20 bg-primary/[0.04]",
    icon: "bg-primary/10 text-primary",
    bullet: "bg-primary",
  },
};

export function InterviewPrepList({
  title,
  items,
  icon: Icon,
  tone = "neutral",
  emptyMessage,
}: InterviewPrepListProps) {
  const classes = toneClasses[tone];

  return (
    <section className={cn("rounded-3xl border p-6", classes.container)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            classes.icon,
          )}
        >
          <Icon className="size-5" />
        </div>

        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>

      {items && items.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex gap-3 text-sm leading-6 text-white/65"
            >
              <span
                className={cn(
                  "mt-2 size-1.5 shrink-0 rounded-full",
                  classes.bullet,
                )}
              />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-white/40">{emptyMessage}</p>
      )}
    </section>
  );
}
