import { Routes, Route } from "react-router-dom";
import { SignInPage } from "../pages/sign-in-page";
import { SignUpPage } from "../pages/sign-up-page";
import { ProtectedRoute } from "./Protected-route";
import { DashboardPage } from "../pages/dashboard-page";
import { LandingPage } from "../pages/landing-page";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ResumesPage } from "@/pages/ResumesPage";
import { ResumeDetailsPage } from "@/features/resumes/pages/ResumeDetailsPage";
import { ResumeAnalysisPage } from "@/features/resume-analysis/pages/ResumeAnalysisPage";
import { JobComparisonPage } from "@/features/job-comparison/pages/JobComparisonPage";
import { InterviewPrepPage } from "@/features/interview-prep/pages/InterviewPrepPage";
import { CoverLettersPage } from "@/features/cover-letters/pages/CoverLetterPages";
import { ApplicationsPage } from "@/features/applications/pages/ApplicationsPage";
import { ApplicationDetailsPage } from "@/features/applications/pages/ApplicationDetailsPage";

import { AboutPage } from "@/pages/about-page";
import { ContactPage } from "@/pages/contact-page";
import { FAQPage } from "@/pages/faq-page";
import { PricingPage } from "@/pages/pricing-page";
import { PrivacyPage } from "@/pages/privacy-page";
import { TermsPage } from "@/pages/terms-page";
import { BillingPage } from "@/features/billing/pages/BillingPage";
import { CheckoutCancelledPage } from "@/features/billing/pages/CheckoutCancelledPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        {/* Upcoming feature routes */}
        <Route path="resumes" element={<ResumesPage />} />
        <Route path="resumes/:resumeId" element={<ResumeDetailsPage />} />
        <Route path="resume-analysis" element={<ResumeAnalysisPage />} />
        <Route path="job-comparison" element={<JobComparisonPage />} />
        <Route path="interview-prep" element={<InterviewPrepPage />} />
        <Route path="cover-letters" element={<CoverLettersPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="billing/cancelled" element={<CheckoutCancelledPage />} />
        <Route
          path="applications/:applicationId"
          element={<ApplicationDetailsPage />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
