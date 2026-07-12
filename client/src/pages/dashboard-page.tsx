import { ClerkTokenTest } from "@/components/ClerkTokenTest";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardPanel from "@/components/dashboard/DashboardPanel";
import DashboardPlaceholder from "@/components/dashboard/DashboardPlaceholder";
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
    <DashboardContent>
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
          <DashboardPanel title="Recent activity" className="xl:col-span-2">
            <DashboardPlaceholder message="Your recent AI analyses will appear here." />
          </DashboardPanel>

          <DashboardPanel title="AI insights">
            <DashboardPlaceholder
              className="border-primary/20"
              message="Resume suggestions, ATS improvements and interview tips will appear here."
            />
          </DashboardPanel>
        </section>
      </div>
    </DashboardContent>
  );
}
