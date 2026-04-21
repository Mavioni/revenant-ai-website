import { lazy, Suspense, useEffect, useRef, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navigation } from "./components/Navigation";
import { CustomCursor } from "./components/CustomCursor";
import { ParticleField } from "./components/ParticleField";
import { LoadingScreen } from "./components/LoadingScreen";
import { Home } from "./pages/Home";
import { ProjectPage } from "./pages/ProjectPage";
import { Engram } from "./pages/Engram";
import { siteConfig } from "./config";

// CinematicIntro is heavy (Three.js); code-split it so bundle + first paint
// stay fast, especially for returning visitors who skip the intro.
const CinematicIntro = lazy(() =>
  import("./components/CinematicIntro").then((m) => ({
    default: m.CinematicIntro,
  })),
);

gsap.registerPlugin(ScrollTrigger);

/**
 * HashScrollHandler — when the location has a hash (e.g. /#works), scrolls
 * the target into view after React Router has rendered the page. Also handles
 * the case where navigation from a project page back to /#contact should land
 * at the right section, not at the top.
 */
function HashScrollHandler() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        // tiny delay lets route-transition + GSAP-ScrollTrigger settle
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 250);
      }
    } else {
      // On non-hash route changes (e.g. /manifestations/ronin-os → /) scroll
      // to top — ProjectPage already does this on mount for its own slug
      // changes, but nav-back needs coverage here too.
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);
  return null;
}

function AppShell() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    // Respect reduced motion: skip the cinematic intro entirely
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return false;
    return sessionStorage.getItem("REVENANT_intro_seen") !== "1";
  });

  // Single-fire guard for handleLoadingComplete — fixes stale-closure bug where
  // the fallback timer would unconditionally call handleLoadingComplete even
  // after images had already loaded.
  const loadingCompletedRef = useRef(false);

  const handleLoadingComplete = useCallback(() => {
    if (loadingCompletedRef.current) return;
    loadingCompletedRef.current = true;
    setIsLoading(false);
    setTimeout(() => {
      setIsReady(true);
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem("REVENANT_intro_seen", "1");
    } catch {
      /* storage can throw in privacy modes — ignore */
    }
    setShowIntro(false);
    // Restore focus to top of page for keyboard users
    // (intro overlay was pointer/keyboard-trapping while active)
    queueMicrotask(() => {
      const skipLink = document.querySelector<HTMLElement>('a[href="#hero"]');
      skipLink?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    if (siteConfig.title) document.title = siteConfig.title;
    if (siteConfig.language) document.documentElement.lang = siteConfig.language;

    const criticalImages = ["/hero-main.png", "/about-1.png"];
    let loadedCount = 0;
    const totalImages = criticalImages.length;

    criticalImages.forEach((src) => {
      const img = new Image();
      const done = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          setTimeout(handleLoadingComplete, 500);
        }
      };
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });

    // Fallback — fires once at 3s regardless; the ref guard inside
    // handleLoadingComplete makes this a no-op if images already loaded.
    const fallbackTimer = setTimeout(handleLoadingComplete, 3000);

    return () => clearTimeout(fallbackTimer);
    // Intentionally no isLoading in deps — we never want to re-register
    // image loaders mid-flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleLoadingComplete]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Loading (before intro or as reduced-motion fallback) */}
      <LoadingScreen isLoading={isLoading} onComplete={handleLoadingComplete} />

      {/* Cinematic intro (once per session, after images loaded) */}
      {!isLoading && showIntro && (
        <Suspense fallback={null}>
          <CinematicIntro onComplete={handleIntroComplete} />
        </Suspense>
      )}

      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Custom cursor — desktop only */}
      <CustomCursor />

      {/* Particle field background */}
      <ParticleField />

      {/* Navigation — route-aware, stays mounted across all routes */}
      <Navigation />

      {/* Hash scroll handler — runs on every location change */}
      <HashScrollHandler />

      {/* Main content — route outlet.
          `inert` (HTML attribute) removes the subtree from tab order AND the
          a11y tree during the intro, preventing focus-trap escapes that
          aria-hidden alone can't prevent. */}
      <main
        className={`transition-opacity duration-700 ${
          isReady && !showIntro ? "opacity-100" : "opacity-0"
        }`}
        inert={!isReady || showIntro}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manifestations/:slug" element={<ProjectPage />} />
          <Route path="/engram" element={<Engram />} />
          {/* Unknown routes bounce to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Skip to content link for accessibility */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
