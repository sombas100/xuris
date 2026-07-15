import { Link } from "react-router-dom";

import logo from "../public/xuris-logo-dark-no-bg.png";

const Footer = () => {
  return (
    <footer className="relative isolate mt-32 overflow-hidden border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-16 left-1/4 size-64 rounded-full bg-primary/15 blur-[100px]" />

        <div className="absolute -bottom-20 right-1/4 size-64 rounded-full bg-white/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 text-center md:flex-row md:text-left">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Xuris" className="mt-2 size-10 object-contain" />

          <span className="text-2xl font-semibold tracking-wide text-white">
            Xuris
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
          <Link to="/privacy" className="transition-colors hover:text-white">
            Privacy
          </Link>

          <Link to="/terms" className="transition-colors hover:text-white">
            Terms
          </Link>

          <Link to="/contact" className="transition-colors hover:text-white">
            Contact
          </Link>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-5">
          <p className="text-center text-sm text-white/40">
            © 2026 <span className="font-medium text-white/70">Xuris</span> |
            Built &amp; Designed in London, UK by{" "}
            <span className="ml-1 font-medium text-primary">Corey Clarke</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
