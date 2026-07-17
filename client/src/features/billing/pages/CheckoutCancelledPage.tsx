import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CheckoutCancelledPage() {
  return (
    <DashboardContent>
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-10">
        <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/2.5 p-7 text-center backdrop-blur-xl sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]"
          />

          <div className="relative">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_30px_rgba(204,93,232,0.12)]">
              <CreditCard className="size-7" />
            </div>

            <p className="mt-7 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Checkout cancelled
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              No payment was taken.
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/50 sm:text-base">
              You left Stripe Checkout before completing your Xuris Pro
              subscription. Your current plan and billing details have not
              changed.
            </p>

            <div className="mx-auto mt-8 flex max-w-md items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 text-left">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium text-white/75">
                  Your account is unchanged
                </p>

                <p className="mt-1 text-xs leading-6 text-white/40">
                  You can return to billing and restart Checkout whenever you
                  are ready.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/dashboard/billing"
                className={cn(
                  buttonVariants({
                    variant: "default",
                  }),
                  "cursor-pointer",
                )}
              >
                <ArrowLeft className="size-4" />
                Return to billing
              </Link>

              <Link
                to="/dashboard"
                className={cn(
                  buttonVariants({
                    variant: "secondaryAction",
                  }),
                  "cursor-pointer",
                )}
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardContent>
  );
}
