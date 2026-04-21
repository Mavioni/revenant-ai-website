import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Download, Rocket, Mail } from "lucide-react";
import type { Project } from "../../data/projects";

interface ProjectCTAProps {
  project: Project;
}

/**
 * Adaptive CTA block. Buttons appear only when the corresponding URL exists
 * on the project. The Launch button (for embedded apps like Engram) is the
 * primary/featured action when present; otherwise Repo is primary.
 */
export function ProjectCTA({ project }: ProjectCTAProps) {
  const { launchUrl, repoUrl, downloadUrl } = project;

  return (
    <section className="py-12 md:py-16 border-t border-white/10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-body-sm uppercase tracking-[0.3em] text-highlight/80 mb-2">
            Take it from here
          </p>
          <h3 className="text-h4 md:text-h3 text-white font-normal max-w-xl">
            {launchUrl
              ? `Launch ${project.name} inside this site, or open the repo.`
              : downloadUrl
                ? `Download the build, clone the repo, or reach out.`
                : `Check the repo. Reach out if it maps to something you're building.`}
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {launchUrl && (
            <Link
              to={launchUrl}
              className="inline-flex items-center gap-2 px-5 py-3 bg-highlight text-white font-medium hover:bg-white hover:text-black transition-colors duration-300 group"
            >
              <Rocket className="w-4 h-4" />
              <span>Launch {project.name}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-3 border transition-colors duration-300 group ${
                launchUrl
                  ? "border-white/30 text-white hover:bg-white hover:text-black"
                  : "border-highlight text-white hover:bg-highlight"
              }`}
            >
              <Github className="w-4 h-4" />
              <span>View repository</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          )}
          {downloadUrl && (
            <a
              href={downloadUrl}
              className="inline-flex items-center gap-2 px-5 py-3 border border-white/30 text-white hover:bg-white hover:text-black transition-colors duration-300 group"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          )}
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 px-5 py-3 text-white/60 hover:text-white transition-colors duration-300 group"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
