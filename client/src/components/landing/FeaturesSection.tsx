import { FileSearch, Scale, Sparkles } from "lucide-react";

const features = [
  {
    title: "Understand ATS weaknesses",
    description:
      "See where your resume may struggle with formatting, clarity, keywords, and role relevance before you apply.",
    icon: FileSearch,
  },
  {
    title: "Compare against real roles",
    description:
      "Match your resume with a job advert and uncover missing requirements, keywords, strengths, and risk areas.",
    icon: Scale,
  },
  {
    title: "Take action with AI",
    description:
      "Turn feedback into stronger applications with tailored cover letters, interview preparation, and practical improvements.",
    icon: Sparkles,
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="relative isolate overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-0 top-1/3 size-80 rounded-full bg-primary/10 blur-[150px]" />

        <div className="absolute right-0 top-1/2 size-72 rounded-full bg-white/4 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
              Why Xuris
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Most resumes never make it to a recruiter.
            </h2>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-lg leading-8 text-white/55 sm:text-xl">
              Applications disappear into ATS systems every day.
            </p>

            <p className="mt-4 text-lg leading-8 text-white/75 sm:text-xl">
              Xuris helps you understand why—and gives you actionable
              improvements before you click Apply.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/2.5
                  p-6
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-primary/25
                  hover:bg-primary/4
                  hover:shadow-[0_24px_70px_rgba(0,0,0,0.28)]
                "
              >
                <div
                  aria-hidden="true"
                  className="absolute right-5 top-4 text-6xl font-semibold text-white/2.5"
                >
                  0{index + 1}
                </div>

                <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/8 text-primary shadow-lg shadow-primary/5">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-8 text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/50">
                  {feature.description}
                </p>

                <div className="mt-8 h-px w-12 bg-primary/40 transition-all duration-300 group-hover:w-20" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
