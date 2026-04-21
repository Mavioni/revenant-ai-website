import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug, PROJECTS } from "../data/projects";
import { ProjectHero } from "../components/project/ProjectHero";
import { ProjectSection } from "../components/project/ProjectSection";
import { ProjectCTA } from "../components/project/ProjectCTA";
import { TechBadges } from "../components/project/TechBadges";
import { Footer } from "../sections/Footer";

/**
 * Data-driven project detail page at /manifestations/:slug. Reads the registry
 * entry and composes Hero → Problem → Architecture → How It's Built → CTA.
 * Unknown slugs redirect to the home page (sections with #works anchor).
 */
export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  // Scroll to top on slug change — important because nav between project pages
  // via the "Other Manifestations" block shouldn't leave you mid-scroll.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  // Update document title for this project page
  useEffect(() => {
    if (project) {
      const prevTitle = document.title;
      document.title = `${project.name} — Yunis AI`;
      return () => {
        document.title = prevTitle;
      };
    }
  }, [project]);

  if (!project) {
    return <Navigate to="/#works" replace />;
  }

  // Other manifestations for the bottom rail (exclude current)
  const otherProjects = PROJECTS.filter((p) => p.slug !== project.slug);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back to manifestations */}
      <div className="pt-28 md:pt-32 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/#works"
            className="inline-flex items-center gap-2 text-body-sm text-white/50 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="uppercase tracking-widest">Back to Manifestations</span>
          </Link>
        </div>
      </div>

      <ProjectHero project={project} />

      {/* Body sections */}
      <div className="px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {project.problem && (
            <ProjectSection
              eyebrow="01 / The Problem"
              title="What this exists to solve."
              body={project.problem}
            />
          )}

          {project.architecture && (
            <ProjectSection
              eyebrow="02 / The Architecture"
              title="How it's shaped."
              body={project.architecture}
            />
          )}

          {project.howItsBuilt && (
            <ProjectSection
              eyebrow="03 / How It's Built"
              title="Stack choices, deliberately."
              body={project.howItsBuilt}
            >
              <TechBadges items={project.techStack} className="mt-6" />
            </ProjectSection>
          )}

          {project.bookReferences && project.bookReferences.length > 0 && (
            <section className="py-8 md:py-10 border-t border-white/10">
              <p className="text-body-sm uppercase tracking-[0.3em] text-highlight/80 mb-4">
                In the book
              </p>
              <ul className="space-y-2 text-body text-white/60">
                {project.bookReferences.map((ref, i) => (
                  <li key={i}>
                    <span className="text-white/40 mr-3">→</span>
                    <span>{ref}</span>
                  </li>
                ))}
              </ul>
              <p className="text-body-sm text-white/40 mt-4 italic">
                From <span className="text-white/60">The Human Element: The Ternary Architecture of Mind, Body, and Machine</span> — Yunis AI Press, 2026.
              </p>
            </section>
          )}

          <ProjectCTA project={project} />

          {/* Other Manifestations rail */}
          <section className="py-16 md:py-20 border-t border-white/10">
            <h3 className="text-h4 md:text-h3 text-white font-medium mb-8 md:mb-10">
              Other Manifestations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherProjects.map((p) => (
                <Link
                  key={p.slug}
                  to={p.launchUrl ?? `/manifestations/${p.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] bg-[#0a0a0a] overflow-hidden mb-4">
                    <img
                      src={p.heroImage}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <p className="text-body-sm uppercase tracking-widest text-white/50 group-hover:text-highlight transition-colors duration-200 mb-1">
                    {p.category}
                  </p>
                  <h4 className="text-h5 text-white font-medium group-hover:text-highlight transition-colors duration-200">
                    {p.name}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
