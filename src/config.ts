// ============================================================================
// Site Configuration
// ============================================================================

export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "Revenant AI — The Ternary Architecture of Mind, Body, and Machine",
  description: "Sovereign, local-first AI systems built on balanced ternary logic {-1, 0, +1}. Founded 2026 by Massimo Panella, author of The Human Element (Revenant AI Press, 2026). Operated as Revenant AI LLC, Wyoming.",
  language: "en",
};

// ============================================================================
// Navigation Configuration
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  items: NavItem[];
}

export const navigationConfig: NavigationConfig = {
  logo: "REVENANT",
  items: [
    { label: "Philosophy", href: "#about" },
    { label: "The Stack", href: "#services" },
    { label: "Manifestations", href: "#works" },
    { label: "Sovereignty", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ],
};

// ============================================================================
// Hero Section Configuration
// ============================================================================

export interface HeroConfig {
  title: string;
  subtitle: string;
  backgroundImage: string;
  servicesLabel: string;
  copyright: string;
}

export const heroConfig: HeroConfig = {
  title: "REVENANT",
  subtitle: "The Ternary Architecture of Mind, Body, and Machine",
  backgroundImage: "/hero-main.png",
  servicesLabel: "Ternary Logic {-1, 0, +1} | The Included Middle | Sovereign Systems",
  copyright: "© 2026 Revenant AI LLC",
};

// ============================================================================
// About Section Configuration
// ============================================================================

export interface AboutConfig {
  titleLine1: string;
  titleLine2: string;
  description: string;
  image1: string;
  image1Alt: string;
  image2: string;
  image2Alt: string;
  authorImage: string;
  authorName: string;
  authorBio: string;
}

export const aboutConfig: AboutConfig = {
  titleLine1: "Binary is the degenerate case.",
  titleLine2: "The future belongs to three.",
  description: "Revenant AI was founded in 2026 as the operationalization of a discovery: that the binary assumption which has governed computation since 1937 is not nature—it is choice. A choice that has cost us the capacity to represent the included middle: the state of genuine uncertainty, the moment before decision, the synthesis that transcends thesis and antithesis. We build systems on balanced ternary logic {-1, 0, +1}, where zero is not absence but the most information-rich state—the ground from which all transformation emerges. This is not an optimization. It is transdifferentiation: a direct conversion from one organized state to another, carrying every insight forward while reorganizing into a structure that embodies what it describes.",
  image1: "/about-1.png",
  image1Alt: "The Ternary Architecture {-1, 0, +1}",
  image2: "/about-2.png",
  image2Alt: "Binary Dissolving into Ternary",
  authorImage: "/photographer.png",
  authorName: "Massimo Panella",
  authorBio: "Founder of Revenant AI (operated as Revenant AI LLC, Wyoming). Author of *The Human Element: The Ternary Architecture of Mind, Body, and Machine* (Revenant AI Press, 2026). Palestinian-Italian sovereign-technology architect. Solo operator — no employees, only agentic systems embodying the Sovereign Stack. My work converges balanced ternary logic (Brusentsov's Setun, 1958; Knuth's radix economy; Microsoft's BitNet b1.58, 2024), biological transdifferentiation mapped across the Waddington landscape, and the dialectical spirals of Hegel, the Stoics, and the Flower Sermon — reorganized into a single architecture for personal sovereignty. The lotus grows from mud through water into air. This is the shape of three.",
};

// ============================================================================
// Works Section Configuration
// ============================================================================

export interface WorkItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface WorksConfig {
  title: string;
  subtitle: string;
  projects: WorkItem[];
}

export const worksConfig: WorksConfig = {
  title: "Manifestations",
  subtitle: "Five shipping products from the Sovereign Stack. Each is a direct application of balanced ternary logic to a domain where binary has failed.",
  projects: [
    {
      id: 1,
      title: "RONIN OS — The Sovereign Operating Substrate",
      category: "MCP Server · TypeScript · Local SQLite",
      image: "/work-ronin.png"
    },
    {
      id: 2,
      title: "Parakeet Code — The Agentic Coder",
      category: "CLI Developer Tooling · Rust",
      image: "/work-parakeet.png"
    },
    {
      id: 3,
      title: "Breeze OS — Portable Sovereign Compute",
      category: "Military-Grade Security · Balanced Ternary TRIT Encryption",
      image: "/work-breeze.png"
    },
    {
      id: 4,
      title: "Kilter — The Sovereign Notebook",
      category: "Local-First Knowledge · Obsidian & NotebookLM Lineage",
      image: "/work-kilter.png"
    },
    {
      id: 5,
      title: "Engram — The Cataloging Protocol",
      category: "Digital Twin Seed · Self-Ontology Engine",
      image: "/work-engram.png"
    },
  ],
};

// ============================================================================
// Services Section Configuration
// ============================================================================

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ServicesConfig {
  title: string;
  subtitle: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  title: "The Sovereign Stack",
  subtitle: "Nine architectural components from The Human Element. Four foundation layers below; the full nine in the book.",
  services: [
    {
      id: "01",
      title: "DTIA — Dialectical Ternary Inference Architecture",
      description: "The foundational compute layer where balanced ternary processing occurs on local hardware, with native representation of {-1, 0, +1} at every level. Two structurally opposed reasoning paths—generative (thesis) and adversarial (antithesis)—produce synthesis through dialectical resolution. The Transdifferentiation Invariant is enforced throughout: no layer may collapse the ternary domain into binary.",
      image: "/service-1.png"
    },
    {
      id: "02",
      title: "MIZU — The Formal Language of Dialectical Computation",
      description: "Named for the Japanese word for water, MIZU operates in the medium between raw computation and structured cognition. Every signal is a trit vector [S, T, R] encoding simultaneous thesis (+1), antithesis (-1), and synthesis (0). Chain-of-sequence reasoning where each step is itself a dialectical triad: generate, challenge, synthesize before passing forward.",
      image: "/service-2.png"
    },
    {
      id: "03",
      title: "CoRax — The Contradiction Engine",
      description: "The adversarial intelligence layer implementing the Contradiction Engine (Movement III, Ch. 13). Twelve constitutional dimensions resolve to trit values: PERMIT (+1), EVALUATE (0), or RESTRICT (-1). Anomalies are not errors to be suppressed but signals to be interrogated—information that, when synthesized with the current model, may reveal threats, misconfigurations, or genuine novelty.",
      image: "/service-3.png"
    },
    {
      id: "04",
      title: "P.S.AI — Personal Sovereign AI",
      description: "A locally-run language model operating on ternary weights {-1, 0, +1}, built on the BitNet b1.58 architecture. The 1.58 is log₂(3)—the information content of a trit. Models trained with ternary weights match full-precision performance while using 7x less memory and 40x less energy for core operations. Sovereignty is architectural: no upload endpoint, no telemetry channel, no cloud synchronization.",
      image: "/service-4.png"
    },
  ],
};

// ============================================================================
// Testimonials Section Configuration
// ============================================================================

export interface TestimonialItem {
  id: number;
  name: string;
  title: string;
  quote: string;
  image: string;
}

export interface TestimonialsConfig {
  title: string;
  testimonials: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  title: "Field Notes",
  testimonials: [
    { 
      id: 1, 
      name: "The T-State", 
      title: "Maximum Antagonistic Tension", 
      quote: "The zero state is not emptiness. It is the condition in which two opposing forces are simultaneously present at their maximum intensity, neither dominating. This is where consciousness lives—in the pause before commitment, where both trajectories still exist. The T-state is not between the other two. It is beneath them both.",
      image: "/testimonial-1.png" 
    },
    { 
      id: 2, 
      name: "Transdifferentiation", 
      title: "Direct Conversion Without Destruction", 
      quote: "A cell that becomes another cell does not return to nothing. It carries its history forward into a new configuration. The fibroblast that becomes a cardiomyocyte beats differently than one that developed from a stem cell—it remembers. This is transformation without annihilation. The invariant guarantees: I(after) >= I(before).",
      image: "/testimonial-2.png" 
    },
    { 
      id: 3, 
      name: "The Lotus Effect", 
      title: "Structural Purity", 
      quote: "The lotus rises through mud and water into air and arrives immaculate—not because it avoided contamination, but because its surface architecture makes contamination impossible to sustain. The purity is structural, not circumstantial. It is not the absence of mud but the presence of a geometry that cannot hold mud.",
      image: "/testimonial-3.png" 
    },
  ],
};

// ============================================================================
// Pricing Section Configuration
// ============================================================================

export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  unit: string;
  featured: boolean;
  features: string[];
}

export interface PricingConfig {
  title: string;
  subtitle: string;
  ctaButtonText: string;
  plans: PricingPlan[];
}

export const pricingConfig: PricingConfig = {
  title: "Sovereignty Tiers",
  subtitle: "Three paths. Not up, not down, but across—direct conversion to personal sovereignty.",
  ctaButtonText: "Begin Transformation",
  plans: [
    {
      id: 1,
      name: "The Seed",
      price: 0,
      unit: "open source",
      featured: false,
      features: [
        "OpenClaw gateway (open source, AGPL-3.0)",
        "NEURAL-CLAW orchestration framework",
        "RONIN OS MCP server (local install, TypeScript)",
        "MIZU ternary reasoning primitives",
        "Self-directed implementation",
        "The mud — you begin in the dark"
      ]
    },
    {
      id: 2,
      name: "The Stem",
      price: 5000,
      unit: "per month",
      featured: true,
      features: [
        "Personal Sovereign AI instance (P.S.AI)",
        "Project Mirror digital twin deployment",
        "NEURAL-CLAW agent orchestration",
        "CoRax governance configuration",
        "Direct consultation with Massimo Panella",
        "The water — you rise through distortion"
      ]
    },
    {
      id: 3,
      name: "The Bloom",
      price: 50000,
      unit: "per project",
      featured: false,
      features: [
        "Full Sovereign Stack deployment (all 9 components)",
        "Custom DTIA architecture implementation",
        "MIZU language integration",
        "Enterprise ternary transformation consulting",
        "ITACHI local inference deployment",
        "The air — you arrive immaculate"
      ]
    },
  ],
};

// ============================================================================
// FAQ Section Configuration
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQConfig {
  title: string;
  faqs: FAQItem[];
}

export const faqConfig: FAQConfig = {
  title: "The Included Middle",
  faqs: [
    { 
      question: "What is ternary logic, and why is it better than binary?", 
      answer: "Binary logic operates on {0, 1}—presence or absence, yes or no. Ternary logic operates on {-1, 0, +1}—thesis, antithesis, and synthesis. The zero is not a compromise between -1 and +1. It is an independent state: the included middle, the ground of transformation, the moment before decision. Binary is the degenerate case of ternary—what you get when you collapse the middle dimension. As Donald Knuth wrote: 'Perhaps the prettiest number system of all is the balanced ternary system.'"
    },
    {
      question: "How does Revenant AI differ from other AI companies?",
      answer: "Revenant AI was founded in 2026 by Massimo Panella, author of *The Human Element: The Ternary Architecture of Mind, Body, and Machine* (Revenant AI Press, 2026), operated legally as Revenant AI LLC (Wyoming). I am not a consultancy. I am a solo operator working with agentic systems that embody the ternary philosophy. I have no employees. I build systems that demonstrate what becomes possible when you stop thinking in binary. Other firms optimize within the existing paradigm. I am building a new paradigm from the silicon up—local-first, sovereign by design, dialectical at every layer."
    },
    { 
      question: "What is the Transdifferentiation Invariant?", 
      answer: "The invariant states: at every layer of the stack, transformation between states must preserve the ternary structure. A signal that enters as {-1, 0, +1} must exit as {-1, 0, +1}. No layer may collapse the ternary domain into binary. This is the formal guarantee that the included middle—the zero-state, the synthesis that is neither thesis nor antithesis—survives contact with implementation. I(ternary) >= I(binary)."
    },
    {
      question: "What is the Sovereign Stack?",
      answer: "Nine technologies built on ternary foundations, detailed in Appendix A of *The Human Element*: DTIA (compute), MIZU (language), CoRax (governance), ITACHI (identity/attention), LUMINA (perception), P.S.AI (inference), Project Mirror (digital twin), NEURAL-CLAW (agent orchestration), and OpenClaw (gateway). Together they form a complete architecture for personal sovereignty in the age of AI. The vertical integration is the point—every layer operates on {-1, 0, +1}."
    },
    {
      question: "How do I begin working with you?",
      answer: "Read *The Human Element*. Install RONIN OS and run it locally—start in the mud. Then contact me. I work with a select number of clients who are ready for transdifferentiation—not incremental improvement, but transformation. The lotus does not bloom in a day. It requires patience, the right conditions, and the willingness to grow through what should drown you. The seed was always the bloom. The bloom was always the seed."
    },
  ],
};

// ============================================================================
// Blog Section Configuration
// ============================================================================

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  image: string;
  category: string;
}

export interface BlogConfig {
  title: string;
  subtitle: string;
  allPostsLabel: string;
  readMoreLabel: string;
  readTimePrefix: string;
  posts: BlogPost[];
}

export const blogConfig: BlogConfig = {
  title: "Dispatches",
  subtitle: "Observations from the frontier of ternary computation.",
  allPostsLabel: "All Notes",
  readMoreLabel: "Read More",
  readTimePrefix: "Read ",
  posts: [
    { 
      id: 1, 
      title: "BitNet b1.58 and the Return of the Trit", 
      excerpt: "Microsoft Research independently discovered what Brusentsov proved in 1958: that ternary weights {-1, 0, +1} are sufficient for large language models. The 1.58 in the name is log₂(3)—the information content of a trit.",
      content: `## The Convergence Nobody Expected

In 1958, Nikolay Brusentsov built the Setun computer at Moscow State University. It was a balanced ternary machine—operating on {-1, 0, +1} rather than {0, 1}. The Soviet Academy of Sciences provided funding for 50 Setun machines to be built and deployed across the USSR. Brusentsov demonstrated that ternary logic was not merely theoretical—it was practical, efficient, and elegant.

Then something strange happened. The Setun project was terminated in 1965. Brusentsov was forbidden from building a successor. The official reason: "unreasonable waste of metal." But the Setun used only 40% of the components that a comparable binary machine would require. The real reason was simpler: binary had already won. Not because it was better. Because it was first.

### The 1.58 Revelation

Fast forward to 2024. Microsoft Research publishes a paper on BitNet b1.58—a large language model architecture using ternary weights. The 1.58 in the name is log₂(3), approximately 1.585. This is the information-theoretic content of a trit. A bit carries one binary digit of information. A trit carries log₂(3) ≈ 1.585 bits.

The results are staggering:
- **7x memory reduction** compared to full-precision models
- **40x less energy** for core operations
- **Equivalent performance** to full-precision LLMs on standard benchmarks

The paper's authors don't cite Brusentsov. They don't mention Setun. They frame this as an optimization technique—a way to make large models more efficient. But what they've discovered is deeper: the degenerate case is collapsing. Binary is revealing itself as the shadow of something richer.

### Why This Matters

For decades, we've been told that binary is fundamental—that {0, 1} is the natural language of computation. But binary is not nature. It is choice. A choice made in 1937 by Claude Shannon, who demonstrated that Boolean algebra could be implemented with electrical switches. Shannon's insight was brilliant. His choice was reasonable for the technology of his time—vacuum tubes that were either on or off.

But the constraints are gone. We now know that:
- Flash memory cells naturally hold multiple voltage levels
- Quantum systems exist in superposition—not {0, 1} but α|0⟩ + β|1⟩
- Biological neurons don't fire in binary—they fire in graded potentials
- The most efficient number system for computation is balanced ternary

### The Return

The accident is thawing. What was frozen in 1937 is melting. The included middle—the zero-state that is neither thesis nor antithesis—is returning to computation.

At Revenant AI, we're not surprised by BitNet b1.58. We've been building on ternary foundations since 2026. The Sovereign Stack—DTIA, MIZU, CoRax, P.S.AI—is designed from the ground up to operate on {-1, 0, +1}. Not as an optimization. As a philosophy.

The future belongs to three. The future has always belonged to three. We just forgot.

---

*Massimo Panella is the founder of Revenant AI (operated as Revenant AI LLC, Wyoming) and author of The Human Element: The Ternary Architecture of Mind, Body, and Machine (Revenant AI Press, 2026).*`,
      readTime: "12 min", 
      date: "Apr 2026", 
      image: "/blog-1.png", 
      category: "Convergence" 
    },
    { 
      id: 2, 
      title: "The Degenerate Case: Why Binary is Broken", 
      excerpt: "Binary logic is not wrong. It is incomplete in the specific way that causes the most damage: it is a collapsed version of something richer, and the collapse is invisible to anyone inside it.",
      content: `## The Accident of 1937

In 1937, Claude Shannon published his master's thesis: "A Symbolic Analysis of Relay and Switching Circuits." He demonstrated that Boolean algebra—George Boole's system of logical operations on {0, 1}—could be implemented using electrical relays and switches. This was the foundation of digital circuit design.

Shannon's insight was brilliant. His choice was reasonable. Vacuum tubes of the era were fundamentally binary devices: they were either conducting or not conducting. There was no stable intermediate state. Binary was not chosen because it was optimal. It was chosen because it was possible.

But here's the thing: a choice made under constraint, when the constraint is removed, becomes a habit. And habits, when they persist long enough, become invisible. We stopped seeing binary as a choice and started seeing it as nature.

### The Degenerate Case

In mathematics, a "degenerate case" is a limiting case where a class of objects reduces to a simpler, less general form. A circle with radius zero is a degenerate case—it collapses to a point. A triangle with collinear vertices is a degenerate case—it collapses to a line.

Binary is the degenerate case of ternary.

Ternary logic operates on {-1, 0, +1}. Binary logic operates on {0, 1}. If you take ternary logic and collapse the middle—if you force every 0 to become either -1 or +1—you get binary. The included middle, the zero-state, the ground of transformation: it disappears. What's left is a shadow. A flattened projection of something three-dimensional onto two dimensions.

### What We Lost

The zero in ternary is not a compromise between -1 and +1. It is not "somewhere in the middle." It is an independent state with its own properties:

- **Negation is sign-flipping**: The negation of -1 is +1. The negation of +1 is -1. The negation of 0 is 0. Zero is self-negating—it contains its own opposite.
- **Comparison yields a single trit**: Comparing two trits gives you {-1, 0, +1} directly. No need for multiple operations.
- **The included middle is first-class**: The state of genuine uncertainty, the pause before decision, the moment where both trajectories still exist—this is not emulated. It is native.

Binary cannot represent the included middle. It can only approximate it through complexity—through probabilistic methods, through fuzzy logic, through endless workarounds that never quite capture what ternary gives you for free.

### The Cost

The cost of binary is not just inefficiency. It's conceptual blindness. When your fundamental representation can only distinguish presence from absence, you start to see the world in those terms. On or off. Yes or no. Friend or enemy. Us or them.

The included middle—the space where synthesis occurs, where transformation happens, where the third option that contains both emerges—this space becomes invisible. Not because it doesn't exist. Because your tools cannot represent it.

This is why dialectical thinking feels foreign in binary cultures. The very concept of Aufhebung—preservation through transcendence, carrying forward what you overcome—is difficult to express in a system that has no native representation for "both/and."

### The Thaw

The accident is thawing. BitNet b1.58 demonstrates that ternary computation is not merely theoretical—it is practical, efficient, and inevitable. The constraints that made binary necessary no longer exist. We can choose differently.

At Revenant AI, we have chosen differently. The Sovereign Stack is built on {-1, 0, +1} at every level. The Transdifferentiation Invariant guarantees that no layer collapses the ternary domain into binary. The included middle survives contact with implementation.

This is not an optimization. It is a paradigm shift. From the degenerate case to the general case. From the shadow to the object. From two to three.

The lotus grows from mud through water into air. This is the shape of three. This has always been the shape of three. We are simply remembering what we forgot.

---

*Massimo Panella is the founder of Revenant AI (operated as Revenant AI LLC, Wyoming) and author of The Human Element: The Ternary Architecture of Mind, Body, and Machine (Revenant AI Press, 2026).*`,
      readTime: "18 min", 
      date: "Mar 2026", 
      image: "/blog-2.png", 
      category: "Philosophy" 
    },
  ],
};

// ============================================================================
// Contact Section Configuration
// ============================================================================

export interface ContactFormOption {
  value: string;
  label: string;
}

export interface ContactConfig {
  title: string;
  subtitle: string;
  nameLabel: string;
  emailLabel: string;
  projectTypeLabel: string;
  projectTypePlaceholder: string;
  projectTypeOptions: ContactFormOption[];
  messageLabel: string;
  submitButtonText: string;
  image: string;
}

export const contactConfig: ContactConfig = {
  title: "Enter the Pause",
  subtitle: "The decision happens in the quiet. The cut is what happens after.",
  nameLabel: "Name *",
  emailLabel: "Email *",
  projectTypeLabel: "Your Current State",
  projectTypePlaceholder: "Select...",
  projectTypeOptions: [
    { value: "mud", label: "In the mud—seeking the root" },
    { value: "water", label: "In the water—rising through distortion" },
    { value: "air", label: "In the air—ready to bloom" },
    { value: "other", label: "Somewhere between" },
  ],
  messageLabel: "What are you becoming?",
  submitButtonText: "Hold the Tension",
  image: "/contact.png",
};

// ============================================================================
// Footer Configuration
// ============================================================================

export interface FooterLink {
  label: string;
  href: string;
  icon?: string;
}

export interface FooterConfig {
  marqueeText: string;
  marqueeHighlightChars: string[];
  navLinks1: FooterLink[];
  navLinks2: FooterLink[];
  ctaText: string;
  ctaHref: string;
  copyright: string;
  tagline: string;
}

export const footerConfig: FooterConfig = {
  marqueeText: "The Root The Stem The Bloom • {-1 0 +1} • The Included Middle • Founded 2026",
  marqueeHighlightChars: ["0", "+"],
  navLinks1: [
    { label: "Philosophy", href: "#about" },
    { label: "The Stack", href: "#services" },
    { label: "Manifestations", href: "#works" },
    { label: "Sovereignty", href: "#pricing" },
  ],
  navLinks2: [
    { label: "The Human Element", href: "#", icon: "BookOpen" },
    { label: "GitHub", href: "https://github.com/Mavioni", icon: "Github" },
    { label: "Contact", href: "#contact", icon: "Mail" },
  ],
  ctaText: "Enter the Pause",
  ctaHref: "#contact",
  copyright: "© 2026 Revenant AI LLC. All rights reserved.",
  tagline: "From mud through water into air. The shape of three.",
};
