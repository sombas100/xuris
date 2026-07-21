import { Outlet } from "react-router-dom";
import Navbar from "@/Navbar";
import Footer from "@/Footer";

export function PublicPageLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
