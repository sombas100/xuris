import dashboard from "../../assets/dashboard-sharp.png";
import analysis from "../../assets/resume-analysis.png";
import comparison from "../../assets/job-match.png";

const DashboardShowcase = () => {
  return (
    <section
      id="dashboard-showcase"
      className="relative mt-24 flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[180px]" />
      </div>

      <div className="relative h-162.5 w-full max-w-7xl">
        <img
          src={analysis}
          alt=""
          className="
            absolute
            left-0
            top-28
            w-105
            rounded-2xl
            border
            border-white/10
            shadow-2xl
            rotate-[-10deg]
            opacity-80
            transition-all
            duration-500
            hover:rotate-[-7deg]
            hover:scale-105
          "
        />

        {/* Right */}

        <img
          src={comparison}
          alt=""
          className="
            absolute
            right-0
            top-28
            w-105
            rounded-2xl
            border
            border-white/10
            shadow-2xl
            rotate-10
            opacity-80
            transition-all
            duration-500
            hover:rotate-[7deg]
            hover:scale-105
          "
        />

        {/* Centre */}

        <img
          src={dashboard}
          alt=""
          className="
            absolute
            left-1/2
            top-0
            z-20
            w-225
            -translate-x-1/2
            rounded-3xl
            border
            border-white/10
            shadow-[0_40px_120px_rgba(0,0,0,0.5)]
            transition-all
            duration-500
            hover:-translate-y-2
          "
        />
      </div>
    </section>
  );
};

export default DashboardShowcase;
