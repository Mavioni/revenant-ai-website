import type { Project } from "../../data/projects";
import { StatusBadge } from "./StatusBadge";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 lg:px-16 overflow-hidden">
      {/* Background decorative glow, matches site aesthetic */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-highlight/5 rounded-full blur-[160px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Text column */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <StatusBadge status={project.status} />
              <span className="text-body-sm text-white/50 uppercase tracking-widest">
                {project.category}
              </span>
            </div>

            <h1 className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium leading-[1.05] mb-5">
              {project.name}
            </h1>

            <p className="text-h5 md:text-h4 text-white/70 font-light leading-snug mb-8 max-w-2xl">
              {project.tagline}
            </p>

            <p className="text-body-lg text-white/60 leading-relaxed max-w-2xl">
              {project.summary}
            </p>
          </div>

          {/* Image column */}
          <div className="lg:col-span-5 order-1 lg:order-2 w-full">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0a0a] shadow-2xl shadow-black/50">
              <img
                src={project.heroImage}
                alt={`${project.name} illustration`}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div
                className="absolute inset-0 border border-white/10 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
