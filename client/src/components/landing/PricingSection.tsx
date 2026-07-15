import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const freeFeatures = [
  "5 AI generations per month",
  "Resume uploads and management",
  "Resume analysis",
  "Job comparison",
  "Interview preparation",
  "Cover letter generation",
  "Application tracking",
];

const proFeatures = [
  "Unlimited AI generations",
  "Everything included in Free",
  "Unlimited resume analysis",
  "Unlimited job comparisons",
  "Unlimited interview preparation",
  "Unlimited cover letters",
  "Full application tracking workspace",
  "Priority access to future features",
];

const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 size-135 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[180px]" />

        <div className="absolute -left-20 top-1/3 size-72 rounded-full bg-white/[0.035] blur-[130px]" />

        <div className="absolute -right-20 bottom-1/4 size-72 rounded-full bg-primary/[0.07] blur-[130px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
            Simple pricing
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Start free. Upgrade when your job search gets serious.
          </h2>

          <p className="mt-6 text-base leading-8 text-white/50 sm:text-lg">
            Use every core Xuris feature for free, with five AI generations each
            month. Upgrade to Pro for unlimited access.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Free */}
          <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/2.5 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/4 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 size-52 rounded-full bg-white/[0.035] blur-[90px]"
            />

            <div className="relative flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-white/70">
                    <Sparkles className="size-5" />
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold text-white">
                    Free
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Explore the full Xuris workflow at no cost.
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs font-medium text-white/50">
                  Starter
                </span>
              </div>

              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-semibold text-white">£0</span>

                <span className="pb-1.5 text-sm text-white/40">forever</span>
              </div>

              <p className="mt-4 text-sm text-white/50">
                Includes 5 AI generations every month.
              </p>

              <div className="mt-8 h-px bg-white/10" />

              <ul className="mt-8 space-y-4">
                {freeFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-6 text-white/60"
                  >
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/4">
                      <Check className="size-3 text-white/70" />
                    </div>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <p className="mb-3 text-center text-xs text-white/35">
                  No payment details required.
                </p>

                <SignedOut>
                  <SignUpButton mode="redirect">
                    <Button
                      type="button"
                      variant="secondaryAction"
                      className="w-full cursor-pointer"
                    >
                      Start for free
                    </Button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <Link to="/dashboard" className="block">
                    <Button
                      type="button"
                      variant="secondaryAction"
                      className="w-full cursor-pointer"
                    >
                      Open dashboard
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </div>
          </article>

          {/* Pro */}
          <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-primary/30 bg-primary/6.5 p-7 shadow-[0_30px_100px_rgba(204,93,232,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-primary/8.5 hover:shadow-[0_35px_120px_rgba(204,93,232,0.18)] sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 size-64 rounded-full bg-primary/15 blur-[100px]"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-16 left-1/3 size-56 rounded-full bg-white/5 blur-[100px]"
            />

            <div className="relative flex flex-1 flex-col">
              <div className="absolute right-0 top-0 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary">
                <Crown className="size-3.5" />
                Most popular
              </div>

              <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/15 text-primary shadow-lg shadow-primary/10">
                <Zap className="size-5" />
              </div>

              <h3 className="mt-6 text-2xl font-semibold text-white">Pro</h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
                Unlimited access for active job seekers who want the full Xuris
                experience.
              </p>

              <div className="mt-8 flex items-end gap-2">
                <span className="text-5xl font-semibold text-white">£9.99</span>

                <span className="pb-1.5 text-sm text-white/40">/ month</span>
              </div>

              <p className="mt-4 text-sm text-primary/80">
                Unlimited AI generations across every feature.
              </p>

              <div className="mt-8 h-px bg-primary/20" />

              <ul className="mt-8 space-y-4">
                {proFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-6 text-white/70"
                  >
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/15">
                      <Check className="size-3 text-primary" />
                    </div>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <p className="mb-3 text-center text-xs text-white/35">
                  Cancel anytime.
                </p>

                <SignedOut>
                  <SignUpButton mode="redirect">
                    <Button type="button" className="w-full cursor-pointer">
                      Start with Pro
                    </Button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <Button
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={() => {
                      document.getElementById("pricing")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                  >
                    Upgrade to Pro
                  </Button>
                </SignedIn>
              </div>
            </div>
          </article>
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-white/35">
          AI usage resets monthly. Unlimited usage is subject to fair-use
          protections to prevent misuse.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
