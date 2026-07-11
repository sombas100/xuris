import Hero from "@/components/landing/Hero";
import Navbar from "../Navbar";

export function LandingPage() {
  return (
    <main className=" min-h-screen p-2 bg-background max-w-full w-full">
      <Navbar />

      <section className="flex flex-col items-center justify-center text-white mt-30 max-w-4xl mx-auto w-full">
        <span className="flex items-center border-white justify-center bg-white/17 rounded-full px-2">
          <h1 className="text-white p-1 font-medium text-sm">
            AI-powered career growth
          </h1>
        </span>

        <Hero />
      </section>
    </main>
  );
}
