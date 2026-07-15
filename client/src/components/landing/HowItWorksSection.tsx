import { BriefcaseBusiness, FileSearch, FileUp, Send } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload your resume",
    description:
      "Upload a PDF or DOCX resume. Xuris extracts the content and prepares it for analysis.",
    icon: FileUp,
  },
  {
    number: "02",
    title: "Understand what needs improvement",
    description:
      "Receive ATS, formatting, clarity, skills, experience, project, education, and grammar feedback.",
    icon: FileSearch,
  },
  {
    number: "03",
    title: "Tailor your application",
    description:
      "Paste a real job advert to uncover matching strengths, missing requirements, keywords, and recommended changes.",
    icon: BriefcaseBusiness,
  },
  {
    number: "04",
    title: "Apply with confidence",
    description:
      "Generate tailored cover letters, prepare for interviews, and track every application in one workspace.",
    icon: Send,
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[170px]" />

        <div className="absolute -left-24 top-1/3 size-64 rounded-full bg-white/[0.03] blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
            How Xuris works
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            From resume to interview, all in one workspace.
          </h2>

          <p className="mt-6 text-base leading-8 text-white/50 sm:text-lg">
            Xuris guides you through every stage of the application process,
            helping you improve your documents, understand each opportunity, and
            stay organised.
          </p>
        </div>

        {/* Desktop timeline */}
        <div className="relative mt-20 hidden lg:block">
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-9 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent"
          />

          <div className="grid grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 flex size-18 items-center justify-center rounded-full border border-primary/20 bg-background shadow-[0_0_40px_rgba(204,93,232,0.08)] transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/[0.08] group-hover:shadow-[0_0_45px_rgba(204,93,232,0.16)]">
                    <Icon className="size-6 text-primary" />
                  </div>

                  <span className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                    Step {step.number}
                  </span>

                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-4 max-w-xs text-sm leading-7 text-white/50">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Mobile and tablet timeline */}
        <div className="relative mt-16 space-y-5 lg:hidden">
          <div
            aria-hidden="true"
            className="absolute bottom-10 left-6 top-10 w-px bg-linear-to-b from-primary/40 via-primary/20 to-transparent"
          />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative grid grid-cols-[3rem_minmax(0,1fr)] gap-4"
              >
                <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-primary/20 bg-background shadow-lg shadow-primary/5 transition-colors group-hover:border-primary/40 group-hover:bg-primary/[0.08]">
                  <Icon className="size-5 text-primary" />
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/[0.035]">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Step {step.number}
                  </span>

                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/50">
                    {step.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
