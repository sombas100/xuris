import { Sparkles } from "lucide-react";

export function ProtectedRouteLoading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-48 size-140 rounded-full bg-primary/15 blur-[180px]" />

        <div className="absolute -right-48 -bottom-45 size-130 rounded-full bg-primary/8 blur-[180px]" />

        <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/2.5 blur-[120px]" />
      </div>

      <section className="relative flex w-full max-w-md flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-primary/25 blur-2xl" />

          <div className="relative flex size-20 items-center justify-center rounded-3xl border border-primary/25 bg-primary/10 shadow-[0_0_50px_rgba(204,93,232,0.16)] backdrop-blur-xl">
            <Sparkles className="size-8 animate-pulse text-primary" />
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-white">
          Preparing your workspace
        </h1>

        <p className="mt-3 text-sm leading-7 text-white/45">
          Securely loading your Xuris account and dashboard.
        </p>

        <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-1/2 animate-[xuris-loading_1.25s_ease-in-out_infinite] rounded-full bg-linear-to-r from-primary/40 via-primary to-primary/40" />
        </div>

        <p className="mt-4 text-xs text-white/30">
          This should only take a moment
        </p>
      </section>
    </main>
  );
}
