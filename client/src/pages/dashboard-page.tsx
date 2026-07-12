import { ClerkTokenTest } from "@/components/ClerkTokenTest";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";

// type DashboardSummary = {
//   resumeAnalyses: number;
//   jobComparisons: number;
//   interviewSessions: number;
//   applications: number;
//   recentActivity: DashboardActivity[];
//   insights: DashboardInsight[];
// };

export function DashboardPage() {
  return (
    <div className="space-y-8 ">
      {/* <ClerkTokenTest /> */}
      <section>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Your career workspace
        </h2>

        <p className="mt-3 max-w-2xl text-white/60">
          Everything you need to analyse your resume, prepare for interviews,
          optimise applications and track your progress.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Resume analyses"
          value="0"
          description="AI resume reviews completed"
        />

        <DashboardStatCard
          title="Job comparisons"
          value="0"
          description="Compared against job adverts"
        />

        <DashboardStatCard
          title="Interview sessions"
          value="0"
          description="Interview prep generated"
        />

        <DashboardStatCard
          title="Applications"
          value="0"
          description="Tracked applications"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/3 p-6 xl:col-span-2">
          <h3 className="text-lg font-semibold text-white">Recent activity</h3>

          <div className="mt-6 flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/10">
            <p className="text-white/40">
              Your recent AI analyses will appear here.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/3 p-6">
          <h3 className="text-lg font-semibold text-white">AI insights</h3>

          <div className="mt-6 flex h-72 items-center justify-center rounded-2xl border border-dashed border-primary/20">
            <p className="max-w-xs text-center text-white/40">
              Resume suggestions, ATS improvements and interview tips will
              appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
