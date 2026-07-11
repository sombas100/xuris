import { Routes, Route } from "react-router-dom";
import { SignInPage } from "../pages/sign-in-page";
import { SignUpPage } from "../pages/sign-up-page";
import { ProtectedRoute } from "./Protected-route";
import { DashboardPage } from "../pages/dashboard-page";
import { LandingPage } from "../pages/landing-page";
import DashboardLayout from "@/layouts/DashboardLayout";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
