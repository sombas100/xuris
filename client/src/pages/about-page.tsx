import { BrainCircuit, BriefcaseBusiness, Heart, MapPin } from "lucide-react";

import { PublicPageHeader } from "@/components/public/PublicPageHeader";

const values = [
  {
    title: "Practical AI",
    description:
      "Xuris uses AI to provide clear, actionable guidance rather than vague scores or generic advice.",
    icon: BrainCircuit,
  },
  {
    title: "Built for real job searches",
    description:
      "Every feature is designed around the actual journey from improving a resume to tracking an application.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Designed with care",
    description:
      "Xuris is built to feel supportive, focused and simple during what can be a stressful process.",
    icon: Heart,
  },
];

export function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PublicPageHeader
        eyebrow="About Xuris"
        title="Helping job seekers apply with more clarity and confidence."
        description="Xuris is an AI-powered career workspace designed to help people understand their resumes, tailor stronger applications and stay organised throughout their job search."
      />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-white/10 bg-white/2.5 p-7 backdrop-blur-xl sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            The idea
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-white">
            Job seekers deserve more than another generic AI response.
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-white/55">
            <p>
              Applying for jobs can feel like sending applications into a black
              box. Candidates are often rejected without knowing whether their
              resume, keywords, experience or presentation held them back.
            </p>

            <p>
              Xuris was created to make that process easier to understand. It
              connects resume analysis, job matching, interview preparation,
              cover letter generation and application tracking into one focused
              workspace.
            </p>

            <p>
              The goal is not to replace the applicant. It is to help people
              present their real experience more clearly and approach each
              opportunity with better information.
            </p>
          </div>
        </article>

        <aside className="rounded-3xl border border-primary/20 bg-primary/5 p-7 backdrop-blur-xl sm:p-8">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <MapPin className="size-5" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-white">
            Built and designed in London
          </h2>

          <p className="mt-4 leading-8 text-white/55">
            Xuris is an independent product built by Corey Clarke, a full-stack
            software engineer focused on creating practical, user-centred
            applications.
          </p>
        </aside>
      </section>

      <section className="py-24">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="rounded-3xl border border-white/10 bg-white/2.5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-primary/4"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/8 text-primary">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
