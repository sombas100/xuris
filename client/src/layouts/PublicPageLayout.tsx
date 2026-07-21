import { Outlet } from "react-router-dom";

import Footer from "@/Footer";
import Navbar from "@/Navbar";

export function PublicPageLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 -top-52 size-150 rounded-full bg-primary/15 blur-[190px]" />

        <div className="absolute -right-50 top-[30%] size-125 rounded-full bg-primary/[0.07] blur-[170px]" />

        <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-white/3 blur-[150px]" />
      </div>

      <header className="h-20">
        <Navbar />
      </header>

      <main className="px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
