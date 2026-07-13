type AnalysisScoreCardProps = {
  label: string;
  score: number | null;
};

function getScoreStyle(score: number | null) {
  if (score === null) {
    return "border-white/10 bg-white/5 text-white/50";
  }

  if (score >= 80) {
    return "border-green-500/20 bg-green-500/10 text-green-300";
  }

  if (score >= 60) {
    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }

  return "border-red-500/20 bg-red-500/10 text-red-300";
}

export function AnalysisScoreCard({ label, score }: AnalysisScoreCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/50 p-5">
      <p className="text-sm text-white/45">{label}</p>

      <div
        className={`mt-4 inline-flex rounded-xl border px-3 py-2 text-2xl font-semibold ${getScoreStyle(
          score,
        )}`}
      >
        {score ?? "—"}
        {score !== null && (
          <span className="ml-1 text-sm opacity-60">/100</span>
        )}
      </div>
    </div>
  );
}
