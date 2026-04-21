import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Maximize2, Minimize2 } from "lucide-react";

/**
 * Engram embedded route. Loads the Engram PWA inside an iframe so the user
 * stays on revenant.ai while interacting with a fully separate Engram build.
 *
 * Source precedence:
 *   1. VITE_ENGRAM_URL env var (for prod: e.g. https://engram.revenant.ai)
 *   2. /engram-placeholder.html (static "coming soon" page in public/)
 *
 * When Engram's own GitHub Pages deploy is the target, just set
 * VITE_ENGRAM_URL=https://mavioni.github.io/Project-Engram/ in .env.local
 * (or in the deploy environment) and the iframe picks it up on next build.
 */
export function Engram() {
  const envUrl = (import.meta.env.VITE_ENGRAM_URL as string | undefined) ?? "";
  const src = envUrl.trim() || "/engram-placeholder.html";
  const hasLiveEngram = src !== "/engram-placeholder.html";

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Engram — Yunis AI";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top control bar — hidden in fullscreen */}
      {!isFullscreen && (
        <div className="fixed top-0 left-0 right-0 z-40 px-6 lg:px-16 py-4 md:py-5 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm pointer-events-none">
          <Link
            to="/#works"
            className="inline-flex items-center gap-2 text-body-sm text-white/70 hover:text-white transition-colors duration-300 group pointer-events-auto"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="uppercase tracking-widest">Exit Engram</span>
          </Link>
          <div className="flex items-center gap-2 pointer-events-auto">
            {hasLiveEngram && (
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-body-sm text-white/70 hover:text-white border border-white/20 hover:border-highlight/40 transition-colors duration-200"
                aria-label="Open Engram in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Open in new tab</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-body-sm text-white/70 hover:text-white border border-white/20 hover:border-highlight/40 transition-colors duration-200"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">
                {isFullscreen ? "Windowed" : "Fullscreen"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Iframe container */}
      <main
        className={`flex-1 w-full ${isFullscreen ? "fixed inset-0 z-50 bg-black" : "pt-16 md:pt-20"}`}
      >
        <iframe
          src={src}
          title="Engram"
          className="w-full h-full min-h-[calc(100vh-5rem)]"
          style={isFullscreen ? { height: "100vh", minHeight: "100vh" } : undefined}
          // Sandbox: the minimum Engram needs to run as a PWA at its own origin.
          //   allow-scripts       — run the PWA's JS
          //   allow-same-origin   — access its own origin's IndexedDB/localStorage/cookies (NOT the parent's)
          //   allow-forms         — form submits (auth, checkout, etc.)
          //   allow-popups        — "Open billing portal" style popups (Stripe)
          //   allow-popups-to-escape-sandbox — OAuth redirects need full privileges
          //   allow-downloads     — export / download user data
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation"
          // Permissions policy for device/feature access. Orthogonal to sandbox.
          allow="clipboard-read; clipboard-write; fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
        />
      </main>

      {/* Floating exit button when fullscreen */}
      {isFullscreen && (
        <button
          type="button"
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-[60] w-10 h-10 rounded-full bg-black/80 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:border-highlight transition-colors duration-200"
          aria-label="Exit fullscreen"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
