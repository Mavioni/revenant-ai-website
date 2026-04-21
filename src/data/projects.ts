// ============================================================================
// Projects Registry — Single source of truth for all Manifestations
// ============================================================================
//
// Each entry drives both the Works section tile and the full project detail
// page at /manifestations/<slug>. Entries with a `launchUrl` (like Engram)
// are treated as "launchable apps" — their tiles and CTAs navigate to the
// launch route instead of the static doc page when appropriate.
//
// To add a new Manifestation, add an entry to PROJECTS below and drop a hero
// image in app/public/. No other code changes required.

export type ProjectStatus = "shipping" | "alpha" | "private-beta" | "concept";

export interface Project {
  slug: string; // url segment, e.g. "ronin-os"
  name: string; // short name displayed in tile + page hero
  tagline: string; // one-line positioning, shown under name
  category: string; // small label on tile + page (e.g. "MCP Server · TypeScript")
  status: ProjectStatus;
  summary: string; // 2-3 sentence card/hero description
  heroImage: string; // /work-*.png in public/
  techStack: string[]; // pill badges on project page
  problem?: string; // page body — "The Problem" section
  architecture?: string; // page body — "The Architecture" section
  howItsBuilt?: string; // page body — "How It's Built" section
  bookReferences?: string[]; // chapters from The Human Element, e.g. ["Movement V, Ch. 23"]
  repoUrl?: string;
  launchUrl?: string; // internal route like "/engram" — causes tile CTA to launch the app
  downloadUrl?: string; // future: installer/binary URL (public/downloads/* or CDN)
  docsUrl?: string; // future: per-project docs sub-route
}

export const PROJECTS: Project[] = [
  // ---------------------------------------------------------------------------
  // RONIN OS — the shipping flagship
  // ---------------------------------------------------------------------------
  {
    slug: "ronin-os",
    name: "RONIN OS",
    tagline: "Your sovereign second brain, accountability engine, and operational agent.",
    category: "MCP Server · TypeScript · Local SQLite",
    status: "shipping",
    summary:
      "A Model Context Protocol server that operates as your sovereign second brain, accountability engine, and strategic intelligence layer. Three tiers, ternary-native, entirely local. Ships today.",
    heroImage: "/work-ronin.png",
    techStack: [
      "TypeScript",
      "Hono.js",
      "MCP SDK",
      "better-sqlite3",
      "Zod",
      "Docker",
    ],
    problem:
      "Solo operators drown in fragmentation. Ideas, commitments, daily proof-of-work, and strategic assessments get scattered across Notion, calendars, notes apps, and Slack — all of them cloud-hosted, all of them subject to someone else's terms of service. The cost is not inconvenience. The cost is that the operator stops trusting their own state. Without a single place that holds the ONE Thing, the domino chain, the trit-scored captures, and the war-room assessment together, every morning starts with the question 'where am I?' rather than 'what's the ONE Thing?'",
    architecture:
      "RONIN sits between Claude Elevated and the OpenClaw Gateway as a stdio-connected MCP server, exposing three layers of tools. Layer 1 (Accountability Engine) tracks the ONE Thing, sequential domino chains, timed work blocks, and generates daily proof-of-work reports. Layer 2 (Second Brain) captures anything with trit-scoring — +1 (explicit), 0 (implied), -1 (inferred) — and supports semantic search across the knowledge graph. Layer 3 (Strategic Intelligence) runs trit-vote consensus, war-room assessments drawing from Musashi, Sun Tzu, Zeland, Sadhguru, and Christian & Griffiths, plus energy/pendulum/habit tracking. All state lives in a local SQLite database. No cloud sync, no telemetry, no external dependencies.",
    howItsBuilt:
      "Written in TypeScript with Hono.js for its HTTP surface and the MCP SDK for stdio/JSON-RPC tool protocol. Persistence is better-sqlite3 — one file, no server, durable. Every tool call is schema-validated via Zod before touching the database. Docker image ships for one-command deployment into the Nexus project's docker-compose. The philosophical frameworks (Keller's ONE Thing, Hardy's Compound Effect, the Book of Five Rings, Art of War, Reality Transurfing, Inner Engineering, Algorithms to Live By) are built into the prompt templates, not as marketing copy — they shape how RONIN reasons.",
    bookReferences: [
      "Movement V, Ch. 22 — The Sovereign Doctrine",
      "Movement V, Ch. 25 — The Vectorized Self",
    ],
  },

  // ---------------------------------------------------------------------------
  // Parakeet Code — the agentic coder with a pixel companion
  // ---------------------------------------------------------------------------
  {
    slug: "parakeet-code",
    name: "Parakeet Code",
    tagline: "A sovereign, self-improving agentic CLI coder. Ternary mind, lime green soul.",
    category: "Agentic Coder · Rust · Local LLMs",
    status: "private-beta",
    summary:
      "A terminal-native AI coding agent built in Rust, powered by local LLMs, driven by ternary cognition. A pixel parakeet lives in your CLI — Coder, Auditor, and Companion in one persistent pane beneath your prompt.",
    heroImage: "/work-parakeet.png",
    techStack: [
      "Rust",
      "ratatui",
      "Ollama",
      "Gemma 4",
      "VERITAS Ternary Engine",
      "GPL-3.0",
    ],
    problem:
      "Every agentic coding tool today makes the same two errors: it pretends certainty it doesn't have, and it forgets you're there. When Claude-the-tool writes code that looks right but is subtly wrong, the binary confidence model gives you nothing to push back against. When Copilot ships suggestions, there's no continuous presence — no companion watching the build, reacting to a failed test, flagging a vulnerability in code you just wrote. The tool disappears the moment it finishes a call. What's missing is a coder that tells you when it doesn't know, that audits what it ships through a structurally-opposed lens, and that stays with you as a persistent thing on screen rather than a chat box that scrolls away.",
    architecture:
      "Parakeet is three things in one CLI pane. As Coder, it runs an agentic loop (prompt → LLM → tool calls → results → repeat) with Gemma 4 via Ollama, streaming responses through a ratatui TUI. As Auditor, every file it touches passes through the VERITAS ternary cognition engine — True (ship it), False (block and fix), Uncertain (flag for human judgment). Confidence scores are assigned to the model's own output, and adversarial thinking (OWASP Top 10, secrets scanning, auth-flow review) is the default stance, not an opt-in. As Companion, a pixel parakeet rendered in Unicode blocks + ANSI color lives in a persistent pane below the input prompt — preening, reacting, celebrating passing builds, ruffling when tests fail, vigilant-scanning during security audits.",
    howItsBuilt:
      "Three Rust crates: parakeet-cli (the binary — TUI, REPL, companion renderer), parakeet-core (LLM provider abstraction, tool system, query engine), and parakeet-veritas (ternary cognition and audit logic). One install command pulls Rust via rustup, installs Ollama, pulls the ~5 GB Gemma 4 model, and cargo-installs the parakeet binary. The lime green (#32CD32) aesthetic isn't decoration — it's a constant visual signature of the companion's presence. GPL-3.0 to keep the ternary commons open.",
    bookReferences: [
      "Movement III, Ch. 9 — Thesis, Antithesis, Synthesis — Operationalized",
      "Movement III, Ch. 13 — The Contradiction Engine",
    ],
    repoUrl: "https://github.com/Mavioni/Parakeet-Code",
  },

  // ---------------------------------------------------------------------------
  // Breeze OS — portable sovereign security OS
  // ---------------------------------------------------------------------------
  {
    slug: "breeze-os",
    name: "Breeze OS",
    tagline: "The first OS where the interface IS the security mechanism.",
    category: "Portable Sovereign OS · Arch Linux + Rust · PQC",
    status: "alpha",
    summary:
      "BREEZE is Balanced-ternary Runtime Environment for Encrypted Zero-trust Execution — a portable Arch Linux security OS that boots from a 2TB SSD on any x86_64 machine. Every state is +1/0/-1. Trust, integrity, firewall — all ternary, all real-time, all visible.",
    heroImage: "/work-breeze.png",
    techStack: [
      "Arch Linux",
      "Rust",
      "Hyprland",
      "Wayland",
      "ratatui TUI",
      "Cap'n Proto IPC",
      "ML-KEM-768",
      "ML-DSA-65",
      "LUKS2",
      "btrfs",
    ],
    problem:
      "Security distros today treat security as a set of tools you run, not the shape of the operating system itself. Kali ships a menu of exploits. Tails ships anonymity as a mode. Qubes ships isolation as geometry. None of them make the operational security posture legible at a glance — none answer the question 'what is the system's current trust state?' in real time, visually, without having to run a command. And none of them operate on a dimensionally-honest logic. Boolean trust means 'trusted or not trusted,' which collapses the space of probationary, uncertain, and unknown states that every real adversarial engagement lives inside.",
    architecture:
      "Breeze is organized in six stacked layers. The kernel (Linux 6.x with the BORE scheduler, MGLRU, io_uring) boots through UEFI in under three seconds on NVMe. Above it, the TRIT Security Engine is five Rust crates — trit-core, trit-trust, trit-integrity, trit-firewall, trit-ipc — communicating over Cap'n Proto Unix domain sockets with zero-copy serialization. VERITAS is the hardware-adaptive AI layer, auto-selecting from five model tiers (down to BitNet 1-bit ternary on GPU-less hardware) to expose an OpenAI-compatible local API. On top: Hyprland (Wayland tiling compositor) with per-mode border colors, Eww HUD widgets, and a Ratatui TUI dashboard for headless or SSH operation. Finally, Koi — a persistent animated companion with voice interaction, Socratic dialogue, and personality that adapts over time — plus Kilter as the sovereign knowledge engine.",
    howItsBuilt:
      "Post-quantum crypto everywhere: ML-KEM-768 for key encapsulation, ML-DSA-65 for signatures, Shamir's Secret Sharing for recovery, LUKS2 + Argon2id for full-disk encryption. Five operational modes (Defense, Recon, Offense, Stealth, Maintenance) each reconfigure trust thresholds, integrity intervals, firewall policy, workspace layout, and Hyprland border color atomically via a single command — trit mode offense. Seventeen specification documents define every subsystem in detail. Deployed via a scripted install that partitions the SSD, lays down the Arch base, and layers the engine + AI + interface. No host OS required — the SSD boots independently on any x86_64 UEFI machine.",
    bookReferences: [
      "Movement V, Ch. 22 — The Sovereign Doctrine",
      "Movement V, Ch. 24 — The Transdifferentiation Invariant",
      "Appendix A — The Sovereign Stack",
    ],
    repoUrl: "https://github.com/Mavioni/breeze-os",
  },

  // ---------------------------------------------------------------------------
  // Kilter — local-first AI notebook
  // ---------------------------------------------------------------------------
  {
    slug: "kilter",
    name: "Kilter",
    tagline: "A local-first AI notebook. Your thoughts, your machine, your rules.",
    category: "Sovereign Notebook · Tauri + React + Ollama",
    status: "shipping",
    summary:
      "A desktop note-taking app with AI superpowers that runs entirely on your computer. No cloud, no subscriptions, no data leaving your machine. Semantic search, local LLM chat over your notes, Obsidian import, PDF export — and it works on a plane.",
    heroImage: "/work-kilter.png",
    techStack: [
      "Tauri 2.x",
      "React 19",
      "Vite",
      "FastAPI",
      "Python",
      "SQLite + sqlite-vec",
      "Ollama",
      "MIT",
    ],
    problem:
      "The current generation of AI-first notebooks — Notion AI, NotebookLM, Obsidian Smart Connections — all route your thoughts through someone else's cloud to add intelligence. The tradeoff is lopsided. You gain semantic search and chat over your notes, and you lose jurisdiction over your own cognition. Every idea you've ever written becomes training data, marketing signal, or a future re-pricing lever held by someone who is not you. The only way to get AI-powered knowledge management without that tradeoff is to run the models locally, keep the database on your machine, and never introduce a sync layer that crosses your trust boundary.",
    architecture:
      "Kilter is a Tauri desktop app (React 19 frontend, Rust shell, Python backend) with a SQLite + sqlite-vec database as the single source of truth. Notes are markdown files on disk first, with embeddings computed locally via a FastAPI backend and stored in the same SQLite file as a vector index. Semantic search uses sqlite-vec's vector similarity. AI chat talks to a local Ollama instance — no API keys, no network calls. Wiki-style [[Note Title]] linking auto-resolves or offers to create the missing note. Obsidian imports (including YAML frontmatter) are one click in the sidebar. PDF export is rendered HTML piped through the browser print pipeline.",
    howItsBuilt:
      "Four architectural commitments: files over databases (your markdown stays yours, export anytime), simple over clever (works reliably beats works amazingly), local over cloud (privacy by default, not by option), and markdown over proprietary (future-proof your notes). Tauri 2.x gives native performance with a tiny footprint compared to Electron. The Python FastAPI backend handles embeddings and RAG because Python's ML ecosystem is still where the best libraries live — the Tauri Rust shell invokes it as a sidecar. Kilter is also embedded inside Breeze OS as the Knowledge Engine (with LadybugDB and PQC-signed entries in that context).",
    bookReferences: [
      "Movement IV, Ch. 18 — The Adjacent Sight",
      "Movement IV, Ch. 20 — Learning as Dialectical Confrontation",
    ],
    repoUrl: "https://github.com/Mavioni/Kilter",
  },

  // ---------------------------------------------------------------------------
  // Engram — personality-tracking PWA (embedded as /engram route)
  // ---------------------------------------------------------------------------
  {
    slug: "engram",
    name: "Engram",
    tagline: "Catalog yourself. The 24-facet IRIS map meets the daily journal.",
    category: "Sovereign PWA · React + Supabase + Claude",
    status: "shipping",
    summary:
      "A local-first personality-tracking PWA that pairs a 24-facet IRIS personality map with a daily, emoji-driven journal and Claude-powered insights. All data stays in your browser by default — cloud sync, AI insights, and subscriptions activate only when you turn them on.",
    heroImage: "/work-engram.png",
    techStack: [
      "React 18",
      "React Router",
      "Zustand",
      "Recharts",
      "Three.js",
      "PWA (vite-plugin-pwa)",
      "Supabase",
      "Stripe",
      "Anthropic Claude",
    ],
    problem:
      "Self-knowledge is currently a subscription. Every modern personality-tracking or journaling tool — Day One, Daylio, Reflectly, Finch — locks your emotional history behind a monthly fee and a cloud account you don't own. The data is the point of the product, and the product is optimized to never give you an easy export. The quiet cost is that the longer you use these tools, the more hostage your own history becomes. A tool that catalogs you should default to local storage, degrade gracefully without a backend, and let you bring your own API keys when you want AI commentary on your patterns.",
    architecture:
      "Engram is a browser-only PWA by default — everything (mood check-ins, activity tags, journal notes, IRIS results) lives in IndexedDB-backed localStorage via Zustand. Charts (mood sparkline, activity bars, GitHub-style consistency grid, IRIS domain radar) render from that local state with Recharts and Three.js. When you configure Supabase credentials, an env-gated sync layer turns on cross-device state. When you add Anthropic keys, Supabase Edge Functions proxy calls to Claude Sonnet for daily/weekly/monthly insights — the browser never sees the Anthropic key. Stripe (optional) handles Engram Pro ($4.99/mo or $39/yr) billing through Edge Functions and webhooks.",
    howItsBuilt:
      "The ternary logic isn't window dressing — src/lib/ternary.js is load-bearing. A branchless classifier (low/mid/high via two threshold comparisons) routes every IRIS facet interpretation through the same three-valued logic, including the in-product 3D visualization and the downloadable HTML profile card. Deployed to GitHub Pages via a GitHub Actions workflow on every push (git push origin main is the entire shipping story). Fully Trusted-Web-Activity compatible once pointed at a custom domain. Live at mavioni.github.io/Project-Engram/ — and inside this site at /engram.",
    bookReferences: [
      "Movement IV, Ch. 21 — The Plateau as Signal",
      "Movement V, Ch. 23 — The Digital Twin",
      "Movement V, Ch. 25 — The Vectorized Self",
    ],
    repoUrl: "https://github.com/Mavioni/Project-Engram",
    launchUrl: "/engram", // embedded via iframe at this site route
  },
];

// Lookup helpers
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getLaunchableProjects(): Project[] {
  return PROJECTS.filter((p) => p.launchUrl !== undefined);
}
