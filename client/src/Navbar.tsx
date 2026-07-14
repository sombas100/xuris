import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

import logo from "../public/xuris-logo-dark-no-bg.png";
import { Button } from "./components/ui/button";
import { navLinks } from "./constants";
import { cn } from "./lib/utils";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <nav className="relative z-50 mx-auto w-full max-w-7xl px-4 text-white sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between">
        <Link
          to="/"
          className="flex shrink-0 items-center"
          onClick={closeMobileMenu}
        >
          <img className="size-10 mt-2 object-contain" src={logo} alt="Xuris" />

          <span className="text-2xl font-semibold tracking-wide sm:text-3xl">
            Xuris
          </span>
        </Link>

        <div className="hidden items-center justify-center gap-10 font-medium lg:flex xl:gap-20">
          {navLinks.map((link) => {
            const destination = `/${link.href}`;
            const active = location.pathname === destination;

            return (
              <Link
                key={link.href}
                to={destination}
                className={cn(
                  "relative tracking-wide text-white/70 transition-colors hover:text-white",
                  "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-primary after:transition-all",
                  active
                    ? "text-white after:w-full"
                    : "after:w-0 hover:after:w-full",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 font-semibold lg:flex">
          <SignedOut>
            <SignInButton mode="redirect">
              <Button
                type="button"
                variant="secondaryAction"
                className="cursor-pointer"
              >
                Sign in
              </Button>
            </SignInButton>

            <SignUpButton mode="redirect">
              <Button
                type="button"
                className="cursor-pointer bg-primary text-white transition-colors hover:bg-secondary"
              >
                Get started
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link to="/dashboard">
              <Button className="cursor-pointer">Dashboard</Button>
            </Link>

            <UserButton />
          </SignedIn>
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/3 text-white transition-colors hover:border-primary/25 hover:bg-primary/[0.08] lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] overflow-hidden rounded-3xl border border-white/10 bg-background/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:left-6 sm:right-6 lg:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const destination = `/${link.href}`;
              const active = location.pathname === destination;

              return (
                <Link
                  key={link.href}
                  to={destination}
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex min-h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-white/65 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="my-4 h-px bg-white/10" />

          <SignedOut>
            <div className="grid gap-3 sm:grid-cols-2">
              <SignInButton mode="redirect">
                <Button
                  type="button"
                  variant="secondaryAction"
                  className="w-full cursor-pointer"
                >
                  Sign in
                </Button>
              </SignInButton>

              <SignUpButton mode="redirect">
                <Button type="button" className="w-full cursor-pointer">
                  Get started
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex-1"
                onClick={closeMobileMenu}
              >
                <Button className="w-full cursor-pointer">
                  Open dashboard
                </Button>
              </Link>

              <div className="flex size-10 items-center justify-center">
                <UserButton />
              </div>
            </div>
          </SignedIn>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
