import PricingSection from "@/components/landing/PricingSection";
import { useDocumentTitle } from "@/hooks/use-document-title";

export function PricingPage() {
  useDocumentTitle("Pricing");
  return <PricingSection />;
}
