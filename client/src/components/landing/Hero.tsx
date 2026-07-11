import { Button } from "@base-ui/react/button";
import { IoArrowDownOutline } from "react-icons/io5";

const Hero = () => {
  return (
    <div className="relative p-6 h-full">
      <div className="pointer-events-none absolute -top-240 -left-20 h-300 w-300 rounded-full bg-primary opacity-20 blur-[200px]" />
      <div className="pointer-events-none absolute -top-105 left-40 h-120 w-120 rounded-full bg-white/20 blur-[200px]" />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="max-w-4xl flex flex-col items-center justify-center text-center">
          <h1 className="text-7xl font-semibold text-hero-h1">
            Land more{" "}
            <span className="bg-linear-to-r from-primary to-white bg-clip-text text-transparent">
              interviews.
            </span>
          </h1>

          <h1 className="text-7xl font-semibold text-hero-h1">
            Not more{" "}
            <span className="bg-linear-to-r from-primary to-white bg-clip-text text-transparent">
              applications.
            </span>
          </h1>

          <p className="mt-8 text-xl text-text/75 text-muted-foreground">
            Xuris analyzes your resume against real job descriptions, identifies
            skill gaps, improves ATS performance, and helps you prepare for
            interviews with AI-powered insights.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 text-sm font-medium">
            <Button
              className="relative overflow-visible rounded-2xl border
      border-gray-700 px-4 py-2 text-text shadow-md transition-all duration-300
      ease-out cursor-pointer hover:border-primary/40 hover:text-white hover:shadow-[0_0_24px_rgba(204,93,232,0.45)]
      after:absolute after:-bottom-px after:left-1/2 after:h:px after:w-1/2
      after:-translate-x-1/2 after:rounded-full after:bg-primary/70 after:shadow-[0_0_10px_rgba(204,93,232,0.8)]
      after:transition-all after:duration-300 hover:after:w-3/4 hover:after:shadow-[0_0_18px_rgba(204,93,232,1)]"
            >
              Request access
            </Button>
            <Button className="group mt-10 flex flex-col items-center justify-center cursor-pointer text-text transition-colors hover:text-white">
              Learn more
              <IoArrowDownOutline
                size={20}
                className="mt-6 transition-transform duration-300 ease-out group-hover:translate-y-2"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
