import { Routes, Route } from "react-router-dom";
import { SignInPage } from "../pages/sign-in-page";
import { SignUpPage } from "../pages/sign-up-page";
import { ProtectedRoute } from "./Protected-route";
import { DashboardPage } from "../pages/dashboard-page";
import { LandingPage } from "../pages/landing-page";
import DashboardLayout from "@/layouts/DashboardLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

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
        {/* <Route path="resumes" element={<ResumesPage />} /> */}
        {/* <Route path="jobs" element={<JobsPage />} /> */}
        {/* <Route path="interview-prep" element={<InterviewPrepPage />} /> */}
        {/* <Route path="applications" element={<ApplicationsPage />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
