import Hero from "@/components/landing/Hero";
import Navbar from "../Navbar";
import Footer from "@/Footer";
import DashboardShowcase from "@/components/dashboard/DashboardShowcase";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto mt-30 flex w-full max-w-4xl flex-col items-center justify-center px-4 text-white sm:px-6 lg:px-8">
        <span className="flex items-center justify-center rounded-full border-white bg-white/17 px-2">
          <h1 className="p-1 text-sm font-medium text-white">
            AI-powered career growth
          </h1>
        </span>

        <Hero />
      </section>

      <DashboardShowcase />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
