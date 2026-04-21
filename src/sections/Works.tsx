import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Rocket } from "lucide-react";
import { PROJECTS, type Project } from "../data/projects";
import { worksConfig } from "../config";
import { ProjectHologram } from "../components/animations/ProjectHologram";

gsap.registerPlugin(ScrollTrigger);

/**
 * Layout map for the 5 Manifestations:
 *
 *   row 1:  [     1 wide hero (span-6)     ]    ← RONIN OS (shipping flagship)
 *   row 2:  [    span-3    ][    span-3    ]
 *   row 3:  [    span-3    ][    span-3    ]
 *
 * On mobile this collapses to a single column. If the project count changes,
 * the layout degrades sensibly because unused slots just render nothing.
 */
const SPANS: Array<string> = [
  "md:col-span-6", // hero
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-3",
];
const ASPECTS: Array<string> = [
  "aspect-[21/9]", // hero — cinematic widescreen
  "aspect-[4/5]",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "aspect-[4/5]",
];

export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Use the registry as the source of truth. Empty check happens after all
  // hooks are declared so we don't violate Rules of Hooks.
  const projects: Project[] = PROJECTS;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      const card = cardsRef.current[index];
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateX: -y * 8,
        rotateY: x * 12,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    [],
  );

  const handleMouseLeave = useCallback((index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "expo.out",
    });
    setHoveredIndex(null);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => {
        const tl = gsap.timeline();
        if (titleRef.current) {
          const chars = titleRef.current.querySelectorAll(".char");
          tl.fromTo(
            chars,
            { scale: 0.8, opacity: 0, y: 20 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.05,
              ease: "back.out(1.5)",
            },
          );
        }
        tl.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.3",
        );
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          tl.fromTo(
            card,
            { rotateY: i === 0 ? 0 : i % 2 === 1 ? -60 : 60, opacity: 0, y: 40 },
            {
              rotateY: 0,
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "expo.out",
            },
            `-=${0.75 - i * 0.1}`,
          );
        });
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  const titleChars = (worksConfig.title || "Manifestations").split("");

  if (projects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative py-24 md:py-32 px-6 lg:px-16 bg-white overflow-hidden"
      style={{ perspective: "1200px" }}
      aria-labelledby="works-title"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 md:mb-16">
        <h2
          ref={titleRef}
          id="works-title"
          className="text-h2 md:text-h1 lg:text-display-xl text-black font-medium mb-4 md:mb-6"
        >
          {titleChars.map((char, i) => (
            <span key={i} className="char inline-block">
              {char}
            </span>
          ))}
        </h2>
        <p ref={subtitleRef} className="text-body-lg text-black/60 max-w-2xl">
          {worksConfig.subtitle ||
            "Five shipping products from the Sovereign Stack. Each is a direct application of balanced ternary logic to a domain where binary has failed."}
        </p>
      </div>

      {/* Pyramid grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-8">
          {projects.slice(0, 5).map((project, index) => {
            const spanClass = SPANS[index] ?? "md:col-span-3";
            const aspectClass = ASPECTS[index] ?? "aspect-[4/5]";
            const to = project.launchUrl ?? `/manifestations/${project.slug}`;
            const isLaunch = Boolean(project.launchUrl);

            return (
              <div
                key={project.slug}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`relative group preserve-3d ${spanClass}`}
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                  transform:
                    hoveredIndex !== null && hoveredIndex !== index
                      ? "scale(0.985)"
                      : "scale(1)",
                  transition:
                    hoveredIndex !== null
                      ? "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                      : "none",
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                role="article"
                aria-label={project.name}
              >
                <Link
                  to={to}
                  className={`block relative ${aspectClass} overflow-hidden bg-[#1a1a1a] shadow-xl shadow-black/10 focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-white`}
                  // No aria-label: the visible title + category inside the link
                  // IS the accessible name (satisfies WCAG 2.5.3 label-in-name).
                >
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
                    <img src={project.heroImage} alt={project.name} className="w-full h-full object-cover grayscale brightness-[0.7]" />
                  </div>
                  <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-80">
                    <ProjectHologram seed={project.slug} />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                  {/* Status + category row */}
                  <div className="absolute top-5 left-5 md:top-6 md:left-6 flex items-center gap-2 z-10">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-body-sm text-white/80 uppercase tracking-widest">
                      {project.status === "shipping"
                        ? "Shipping"
                        : project.status === "alpha"
                          ? "Alpha"
                          : project.status === "private-beta"
                            ? "Private Beta"
                            : "Concept"}
                    </span>
                  </div>

                  {/* Main content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 lg:p-8">
                    <p className="text-body-sm text-white/70 mb-2 group-hover:text-highlight transition-colors duration-300 uppercase tracking-widest">
                      {project.category}
                    </p>
                    <h3
                      className={`text-white font-medium group-hover:-translate-y-1 transition-transform duration-300 ${
                        index === 0
                          ? "text-h3 md:text-h2 lg:text-h1"
                          : "text-h4 md:text-h3"
                      }`}
                    >
                      {project.name}
                    </h3>
                    {index === 0 && (
                      <p className="text-body md:text-body-lg text-white/70 mt-3 max-w-2xl hidden md:block">
                        {project.tagline}
                      </p>
                    )}
                  </div>

                  {/* Action icon */}
                  <div className="absolute top-5 right-5 md:top-6 md:right-6 z-10">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-highlight group-hover:scale-110 transition-all duration-300">
                      {isLaunch ? (
                        <Rocket className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      )}
                    </div>
                  </div>

                  {/* Hover border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-highlight/40 transition-colors duration-500 pointer-events-none" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute top-20 left-0 w-32 h-32 bg-highlight/5 -translate-x-1/2 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-0 w-48 h-48 bg-black/5 translate-x-1/3 rounded-full blur-3xl"
        aria-hidden="true"
      />
    </section>
  );
}
