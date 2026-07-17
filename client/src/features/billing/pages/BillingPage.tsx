import {
  CalendarDays,
  Check,
  CreditCard,
  Crown,
  RefreshCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { Button } from "@/components/ui/button";

import { PlanBadge } from "../components/PlanBadge";
import { UsageProgress } from "../components/UsageProgress";
import { useBillingStatus } from "../hooks/use-billing-status";
import { useCheckoutSuccess } from "../hooks/use-checkout-success";
import { useCreateCheckout } from "../hooks/use-create-checkout";
import { useCreatePortal } from "../hooks/use-create-portal";
import { useUsageSummary } from "../hooks/use-usage-summary";

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
  }).format(parsedDate);
}

function formatStatus(status: string | undefined) {
  if (!status) {
    return "No subscription";
  }

  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function BillingPage() {
  const billingQuery = useBillingStatus();
  const usageQuery = useUsageSummary();

  const checkoutMutation = useCreateCheckout();
  const portalMutation = useCreatePortal();

  useCheckoutSuccess({
    billing: billingQuery.data,
    refetchBilling: billingQuery.refetch,
    refetchUsage: usageQuery.refetch,
  });

  const billing = billingQuery.data;
  const usage = usageQuery.data;

  const isPro = billing?.plan === "PRO" || billing?.plan === "TEAM";

  const subscription = billing?.subscription;

  const subscriptionDateLabel = subscription?.cancelAtPeriodEnd
    ? "Access ends"
    : "Next renewal";

  const subscriptionDate = subscription?.currentPeriodEnd;

  function handleUpgrade() {
    checkoutMutation.mutate(undefined, {
      onError: (error) => {
        toast.error("Could not open Stripe Checkout", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      },
    });
  }

  function handleManageBilling() {
    portalMutation.mutate(undefined, {
      onError: (error) => {
        toast.error("Could not open the billing portal", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      },
    });
  }

  if (billingQuery.isPending || usageQuery.isPending) {
    return (
      <DashboardContent>
        <div className="space-y-6">
          <div className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/2.5" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/2.5 lg:col-span-2" />

            <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/2.5" />
          </div>
        </div>
      </DashboardContent>
    );
  }

  if (billingQuery.isError || usageQuery.isError || !billing || !usage) {
    return (
      <DashboardContent>
        <div className="rounded-3xl border border-destructive/25 bg-destructive/[0.06] p-8">
          <h1 className="text-xl font-semibold text-white">
            Billing could not be loaded
          </h1>

          <p className="mt-2 text-sm text-white/45">
            Please refresh the page and try again.
          </p>

          <Button
            type="button"
            className="mt-6 cursor-pointer"
            onClick={() => {
              void billingQuery.refetch();
              void usageQuery.refetch();
            }}
          >
            <RefreshCcw className="size-4" />
            Try again
          </Button>
        </div>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <div className="space-y-8">
        <header>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <CreditCard className="size-5" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Billing and usage
              </h1>

              <p className="mt-1 text-sm text-white/45">
                Manage your subscription and monitor AI usage.
              </p>
            </div>
          </div>
        </header>

        <section
          className={[
            "relative overflow-hidden rounded-3xl border p-7 sm:p-8",
            isPro
              ? "border-primary/25 bg-primary/6"
              : "border-white/10 bg-white/2.5",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-primary/10 blur-[100px]"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold text-white">
                  {isPro ? "Xuris Pro" : "Xuris Free"}
                </h2>

                <PlanBadge plan={billing.plan} />
              </div>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/50">
                {isPro
                  ? "You have unlimited access to all Xuris AI features."
                  : "Your Free plan includes five AI generations every month."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {isPro ? (
                <Button
                  type="button"
                  variant="secondaryAction"
                  className="cursor-pointer"
                  disabled={portalMutation.isPending}
                  onClick={handleManageBilling}
                >
                  <CreditCard className="size-4" />

                  {portalMutation.isPending
                    ? "Opening portal..."
                    : "Manage subscription"}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="cursor-pointer"
                  disabled={checkoutMutation.isPending}
                  onClick={handleUpgrade}
                >
                  <Crown className="size-4" />

                  {checkoutMutation.isPending
                    ? "Opening checkout..."
                    : "Upgrade to Pro"}
                </Button>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-white/2.5 p-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap className="size-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">AI usage</h2>

                <p className="mt-1 text-sm text-white/40">
                  Your current monthly generation allowance.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <UsageProgress usage={usage} />
            </div>

            {!usage.unlimited && (
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />

                <div>
                  <p className="text-sm font-medium text-white/70">
                    Allowance reset
                  </p>

                  <p className="mt-1 text-sm text-white/40">
                    Your five AI generations reset on{" "}
                    {formatDate(usage.usageResetDate)}.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/2.5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white/70">
                <Sparkles className="size-5" />
              </div>

              <h2 className="text-lg font-semibold text-white">Subscription</h2>
            </div>

            <dl className="mt-7 space-y-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-white/40">Current plan</dt>

                <dd className="font-medium text-white/70">{billing.plan}</dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-white/40">Status</dt>

                <dd className="font-medium text-white/70">
                  {formatStatus(subscription?.status)}
                </dd>
              </div>

              {isPro && subscription && (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-white/40">{subscriptionDateLabel}</dt>

                    <dd className="max-w-[55%] text-right font-medium text-white/70">
                      {formatDate(subscriptionDate)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/40">Cancellation</dt>

                    <dd
                      className={
                        subscription.cancelAtPeriodEnd
                          ? "font-medium text-amber-300"
                          : "font-medium text-green-300"
                      }
                    >
                      {subscription.cancelAtPeriodEnd
                        ? "Scheduled"
                        : "Not scheduled"}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </section>
        </div>

        {!isPro && (
          <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-primary/6 p-7 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-16 size-56 rounded-full bg-primary/15 blur-[100px]"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <Crown className="size-5 text-primary" />

                  <h2 className="text-xl font-semibold text-white">
                    Upgrade to Xuris Pro
                  </h2>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                  Unlock unlimited resume analyses, job comparisons, interview
                  preparation sessions and cover letters for £9.99 per month.
                </p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    "Unlimited AI generations",
                    "Every Xuris feature",
                    "Cancel anytime",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm text-white/60"
                    >
                      <Check className="size-4 text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                className="cursor-pointer lg:min-w-44"
                disabled={checkoutMutation.isPending}
                onClick={handleUpgrade}
              >
                <Crown className="size-4" />

                {checkoutMutation.isPending
                  ? "Opening checkout..."
                  : "Upgrade to Pro"}
              </Button>
            </div>
          </section>
        )}

        {isPro && subscription?.cancelAtPeriodEnd && (
          <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
            <h2 className="font-semibold text-amber-200">
              Your subscription is scheduled to end
            </h2>

            <p className="mt-2 text-sm leading-7 text-white/50">
              You will retain Pro access until{" "}
              {formatDate(subscription.currentPeriodEnd)}. You can resume your
              subscription through the Stripe billing portal before that date.
            </p>

            <Button
              type="button"
              variant="secondaryAction"
              className="mt-5 cursor-pointer"
              disabled={portalMutation.isPending}
              onClick={handleManageBilling}
            >
              Manage subscription
            </Button>
          </section>
        )}
      </div>
    </DashboardContent>
  );
}
