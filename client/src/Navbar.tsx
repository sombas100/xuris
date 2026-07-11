import { navLinks } from "./constants";
import { Link } from "react-router-dom";
import logo from "../public/xuris-logo-dark.png";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./components/ui/button";

const Navbar = () => {
  return (
    <nav className="max-w-7xl mx-auto px-4 text-white">
      <div className="flex items-center justify-between">
        <Link to={"/"}>
          <div className="flex items-center justify-center">
            <img className="w-10 h-10 mt-2" src={logo} />
            <h1 className="text-white text-3xl font-semibold tracking-wide">
              Xuris
            </h1>
          </div>
        </Link>

        <div className="flex items-center justify-center gap-20 text-white font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className="relative after:absolute after:left-0 after:-bottom-1
              after:h-0.5 after:w-0 after:bg-primary after:transition-all
              hover:after:w-full tracking-wide"
              to={`/${link.href}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-5 font-semibold">
          <SignedOut>
            <SignInButton mode="redirect">
              <Button
                className={"text-white cursor-pointer hover:bg-gray-700"}
                variant="outline"
                type="button"
              >
                Sign in
              </Button>
            </SignInButton>

            <SignUpButton mode="redirect">
              <Button
                className="text-white bg-primary hover:bg-secondary transition-all cursor-pointer"
                variant={"ghost"}
                type="button"
              >
                Get started
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link to="/dashboard">
              <Button className={"cursor-pointer"}>Dashboard</Button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
