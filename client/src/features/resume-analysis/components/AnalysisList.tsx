import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Search,
  Target,
} from "lucide-react";

import { cn } from "@/lib/utils";

type AnalysisListTone =
  | "positive"
  | "negative"
  | "improvement"
  | "keyword"
  | "neutral";

type AnalysisListProps = {
  title: string;
  items: string[] | null;
  emptyMessage: string;
  tone?: AnalysisListTone;
};

const toneConfig = {
  positive: {
    icon: CheckCircle2,
    container: "border-green-500/20 bg-green-500/[0.04]",
    iconWrapper: "bg-green-500/10 text-green-300",
    bullet: "bg-green-400",
  },

  negative: {
    icon: AlertTriangle,
    container: "border-red-500/20 bg-red-500/[0.04]",
    iconWrapper: "bg-red-500/10 text-red-300",
    bullet: "bg-red-400",
  },

  improvement: {
    icon: Lightbulb,
    container: "border-amber-500/20 bg-amber-500/[0.04]",
    iconWrapper: "bg-amber-500/10 text-amber-300",
    bullet: "bg-amber-400",
  },

  keyword: {
    icon: Search,
    container: "border-blue-500/20 bg-blue-500/[0.04]",
    iconWrapper: "bg-blue-500/10 text-blue-300",
    bullet: "bg-blue-400",
  },

  neutral: {
    icon: Target,
    container: "border-white/10 bg-background/50",
    iconWrapper: "bg-primary/10 text-primary",
    bullet: "bg-primary",
  },
} satisfies Record<
  AnalysisListTone,
  {
    icon: typeof CheckCircle2;
    container: string;
    iconWrapper: string;
    bullet: string;
  }
>;

export function AnalysisList({
  title,
  items,
  emptyMessage,
  tone = "neutral",
}: AnalysisListProps) {
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <section className={cn("rounded-3xl border p-6", config.container)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            config.iconWrapper,
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
                  config.bullet,
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
