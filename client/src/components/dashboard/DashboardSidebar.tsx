import { Link, useLocation } from "react-router-dom";
import { dashboardLinks } from "@/constants/index";
import logo from "../../../public/xuris-logo-dark.png";

const DashboardSidebar = () => {
  const location = useLocation();

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === href;
    }

    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className="
        group
        fixed
        left-4
        top-4
        z-40
        hidden
        h-[calc(100vh-2rem)]
        w-20
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-black/40
        shadow-xl
        backdrop-blur-xl
        transition-[width]
        duration-300
        ease-out
        hover:w-64
        lg:flex
        lg:flex-col
      "
    >
      <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-5">
        <Link
          to="/"
          className="flex items-center gap-3 whitespace-nowrap text-white"
        >
          <img
            src={logo}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary"
          />

          <span
            className="
              w-0
              overflow-hidden
              text-2xl
              font-semibold
              tracking-tight
              opacity-0
              transition-all
              duration-300
              group-hover:w-auto
              group-hover:opacity-100
            "
          >
            Xuris
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-3">
        {dashboardLinks.map((link) => {
          const active = isActiveLink(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              to={link.href}
              title={link.name}
              className={`
                relative
                flex
                h-12
                items-center
                gap-3
                overflow-hidden
                rounded-2xl
                px-3
                text-sm
                font-medium
                whitespace-nowrap
                transition-colors
                duration-200
                ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              {active && (
                <span
                  className="
                    absolute
                    inset-y-3
                    left-0
                    w-px
                    rounded-full
                    bg-primary
                    shadow-[0_0_10px_rgba(204,93,232,0.9)]
                  "
                />
              )}

              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                <Icon size={19} strokeWidth={1.8} />
              </div>

              <span
                className="
                  w-0
                  overflow-hidden
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:w-auto
                  group-hover:opacity-100
                "
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div
          className="
            flex
            min-h-14
            items-center
            gap-3
            overflow-hidden
            rounded-2xl
            border
            border-primary/20
            bg-primary/5
            px-3
          "
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            C
          </div>

          <div
            className="
              w-0
              overflow-hidden
              whitespace-nowrap
              opacity-0
              transition-all
              duration-300
              group-hover:w-auto
              group-hover:opacity-100
            "
          >
            <p className="text-sm font-medium text-white">Xuris account</p>
            <p className="text-xs text-white/40">Profile and billing</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
