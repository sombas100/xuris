import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardInsights from "../features/dashboard/DashboardInsights";
import DashboardPanel from "@/components/dashboard/DashboardPanel";
import DashboardRecentActivity from "../features/dashboard/DashboardRecentActivity";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

import { useDashboardSummary } from "@/features/dashboard/hooks/use-dashboard-summary";
import { useDocumentTitle } from "@/hooks/use-document-title";

export function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { data: summary, isPending, isError, error } = useDashboardSummary();

  return (
    <DashboardContent>
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Your career workspace
          </h2>

          <p className="mt-3 max-w-2xl text-white/60">
            Everything you need to analyse your resume, prepare for interviews,
            optimise applications and track your progress.
          </p>
        </section>

        {isPending && (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-3xl border border-white/10 bg-background/50"
              />
            ))}
          </section>
        )}

        {isError && (
          <section className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-destructive">{error.message}</p>
          </section>
        )}

        {summary && (
          <>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <DashboardStatCard
                title="Resume analyses"
                value={String(summary.counts.resumeAnalyses)}
                description="AI resume reviews completed"
              />

              <DashboardStatCard
                title="Job comparisons"
                value={String(summary.counts.jobComparisons)}
                description="Compared against job adverts"
              />

              <DashboardStatCard
                title="Interview sessions"
                value={String(summary.counts.interviewSessions)}
                description="Interview prep generated"
              />

              <DashboardStatCard
                title="Applications"
                value={String(summary.counts.applications)}
                description="Tracked applications"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <DashboardPanel title="Recent activity" className="xl:col-span-2">
                <DashboardRecentActivity activities={summary.recentActivity} />
              </DashboardPanel>

              <DashboardPanel title="AI insights">
                <DashboardInsights insights={summary.insights} />
              </DashboardPanel>
            </section>
          </>
        )}
      </div>
    </DashboardContent>
  );
}
