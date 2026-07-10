import { Routes, Route } from "react-router-dom";
import { SignInPage } from "../pages/sign-in-page";
import { SignUpPage } from "../pages/sign-up-page";
import { ProtectedRoute } from "./Protected-route";
import { DashboardPage } from "../pages/dashboard-page";
import { LandingPage } from "../pages/landing-page";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default AppRoutes;
