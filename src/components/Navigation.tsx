import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, Rocket } from "lucide-react";
import { navigationConfig } from "../config";

gsap.registerPlugin(ScrollTrigger);

/**
 * Route-aware navigation. On the home route, section links scroll the
 * on-page sections. On project / engram routes, the same links navigate
 * back to home with a hash that the HashScrollHandler in App.tsx resolves
 * after mount. The Engram launch item is a hard route (not an anchor).
 */
export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  if (!navigationConfig.logo) return null;

  // Scroll-based navbar background
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: "100px top",
      end: "max",
      onUpdate: (self) => {
        setIsScrolled(self.progress > 0);
      },
    });
    return () => trigger.kill();
  }, []);

  // Active-section tracking — only makes sense on home where the sections exist
  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }
    const triggers: ScrollTrigger[] = [];
    const sections = navigationConfig.items.map((item) =>
      item.href.replace("#", ""),
    );
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        triggers.push(
          ScrollTrigger.create({
            trigger: element,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveSection(`#${sectionId}`),
            onEnterBack: () => setActiveSection(`#${sectionId}`),
          }),
        );
      }
    });
    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [isHome]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleMobileItemClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Construct the "to" for a scroll-anchor item:
  //   href is like "#about" → we want "/#about" so it works cross-route.
  const anchorTo = (href: string): string => `/${href}`;

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-lg py-4 shadow-lg shadow-black/20"
            : "bg-transparent py-6"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex items-center justify-between">
          {/* Logo — always routes home. No aria-label so the visible text
              ("YUNIS") IS the accessible name (WCAG label-content-mismatch). */}
          <Link
            to="/"
            className="text-h6 font-medium text-white hover:text-highlight transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-black rounded px-2 -ml-2"
          >
            {navigationConfig.logo}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navigationConfig.items.map((item) => {
              const isActive = isHome && activeSection === item.href;
              return (
                <Link
                  key={item.label}
                  to={anchorTo(item.href)}
                  className={`text-body transition-colors duration-300 relative group focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 -mx-2 ${
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                  aria-current={isActive ? "location" : undefined}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-highlight transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Engram launcher — distinct styling signals "this is an app" */}
            <Link
              to="/engram"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-body border transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-black ${
                location.pathname === "/engram"
                  ? "bg-highlight border-highlight text-white"
                  : "border-highlight/60 text-white hover:bg-highlight hover:border-highlight"
              }`}
              aria-current={
                location.pathname === "/engram" ? "page" : undefined
              }
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Engram</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white hover:text-highlight transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-highlight rounded"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 pt-20">
          {navigationConfig.items.map((item, i) => {
            const isActive = isHome && activeSection === item.href;
            return (
              <Link
                key={item.label}
                to={anchorTo(item.href)}
                onClick={handleMobileItemClick}
                className={`text-h3 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-highlight rounded px-4 ${
                  isActive
                    ? "text-highlight"
                    : "text-white hover:text-highlight"
                }`}
                style={{
                  transform: isMobileMenuOpen
                    ? "translateY(0)"
                    : "translateY(30px)",
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transitionDelay: isMobileMenuOpen ? `${i * 0.08}s` : "0s",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Mobile Engram launcher */}
          <Link
            to="/engram"
            onClick={handleMobileItemClick}
            className="inline-flex items-center gap-2 px-5 py-3 border border-highlight text-white hover:bg-highlight transition-all duration-300 text-h5 mt-4"
            style={{
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 0.5s ease, transform 0.5s ease, background 0.3s ease",
              transitionDelay: isMobileMenuOpen
                ? `${navigationConfig.items.length * 0.08}s`
                : "0s",
            }}
          >
            <Rocket className="w-4 h-4" />
            <span>Launch Engram</span>
          </Link>

          {/* Mobile menu footer */}
          <div
            className="absolute bottom-8 left-0 right-0 text-center"
            style={{
              opacity: isMobileMenuOpen ? 1 : 0,
              transition: "opacity 0.5s ease",
              transitionDelay: isMobileMenuOpen ? "0.5s" : "0s",
            }}
          >
            <p className="text-body-sm text-white/40">
              © 2026 Revenant AI LLC
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
