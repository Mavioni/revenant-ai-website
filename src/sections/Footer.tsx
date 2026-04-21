import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Github, Mail, ArrowUpRight } from 'lucide-react';
import { footerConfig } from '../config';

/**
 * Transform footer hrefs so they work from any route.
 *   - "#about"           → Link to "/#about"   (hash anchor → home + scroll)
 *   - "http..."          → <a> external, new tab
 *   - "/something"       → Link to "/something" (internal route)
 *   - "#" (placeholder)  → stays as "#" (no-op)
 */
function resolveFooterHref(href: string): {
  isExternal: boolean;
  isPlaceholder: boolean;
  to: string;
} {
  if (href === '#') return { isExternal: false, isPlaceholder: true, to: '#' };
  if (/^https?:\/\//i.test(href)) {
    return { isExternal: true, isPlaceholder: false, to: href };
  }
  if (href.startsWith('#')) {
    return { isExternal: false, isPlaceholder: false, to: `/${href}` };
  }
  return { isExternal: false, isPlaceholder: false, to: href };
}

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Github,
  Mail,
};

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const linksCol1Ref = useRef<(HTMLAnchorElement | null)[]>([]);
  const linksCol2Ref = useRef<(HTMLAnchorElement | null)[]>([]);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  if (!footerConfig.copyright) return null;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Marquee fade in
        tl.fromTo(
          marqueeRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'power2.out' }
        );

        // Top border draw
        tl.fromTo(
          borderRef.current,
          { width: 0 },
          { width: '100%', duration: 0.8, ease: 'expo.inOut' },
          '-=0.5'
        );

        // Links column 1 stagger
        linksCol1Ref.current.forEach((link, i) => {
          if (link) {
            tl.fromTo(
              link,
              { x: -25, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
              `-=${0.3 - i * 0.08}`
            );
          }
        });

        // Links column 2 stagger
        linksCol2Ref.current.forEach((link, i) => {
          if (link) {
            tl.fromTo(
              link,
              { x: 25, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
              `-=${0.3 - i * 0.08}`
            );
          }
        });

        // Copyright fade up
        tl.fromTo(
          copyrightRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.2'
        );
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  const marqueeText = footerConfig.marqueeText;
  const highlightChars = footerConfig.marqueeHighlightChars;

  return (
    <footer
      ref={sectionRef}
      className="relative pt-16 md:pt-20 pb-8 md:pb-12 px-6 lg:px-16 bg-black overflow-hidden"
      aria-label="Footer"
    >
      {/* Marquee section */}
      <div
        ref={marqueeRef}
        className="relative mb-12 md:mb-16 overflow-hidden"
      >
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Marquee content */}
        <div className="marquee-container">
          <div className="marquee-content flex items-center gap-6 md:gap-8 text-[40px] md:text-[80px] lg:text-[112px] font-medium whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="flex items-center gap-6 md:gap-8">
                {marqueeText.split('').map((char, j) => (
                  <span
                    key={j}
                    className={
                      highlightChars.includes(char)
                        ? 'text-highlight'
                        : 'text-white'
                    }
                    style={
                      highlightChars.includes(char)
                        ? { textShadow: '0 0 30px rgba(234, 0, 0, 0.5)' }
                        : undefined
                    }
                  >
                    {char}
                  </span>
                ))}
                <span className="text-white/30 mx-2 md:mx-4">&bull;</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top border */}
      <div
        ref={borderRef}
        className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12 md:mb-16"
        style={{ willChange: 'width' }}
      />

      {/* Footer content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Column 1 - Nav links */}
          <nav className="space-y-3 md:space-y-4" aria-label="Footer navigation">
            {footerConfig.navLinks1.map((link, i) => {
              const resolved = resolveFooterHref(link.href);
              const className =
                "block text-body text-white/60 hover:text-white transition-colors duration-300 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-black rounded";
              const labelSpans = (
                <>
                  <span className="block group-hover:-translate-y-full transition-transform duration-400">
                    {link.label}
                  </span>
                  <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-400 text-white">
                    {link.label}
                  </span>
                </>
              );
              if (resolved.isExternal || resolved.isPlaceholder) {
                return (
                  <a
                    key={link.label}
                    ref={(el) => {
                      linksCol1Ref.current[i] = el;
                    }}
                    href={resolved.to}
                    className={className}
                    target={resolved.isExternal ? '_blank' : undefined}
                    rel={resolved.isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {labelSpans}
                  </a>
                );
              }
              return (
                <Link
                  key={link.label}
                  ref={(el) => {
                    linksCol1Ref.current[i] = el;
                  }}
                  to={resolved.to}
                  className={className}
                >
                  {labelSpans}
                </Link>
              );
            })}
          </nav>

          {/* Column 2 - More links */}
          <nav className="space-y-3 md:space-y-4" aria-label="Footer links">
            {footerConfig.navLinks2.map((link, i) => {
              const IconComponent = link.icon ? iconMap[link.icon] : null;
              const resolved = resolveFooterHref(link.href);
              const className =
                "flex items-center gap-2 text-body text-white/60 hover:text-white transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-black rounded";
              const content = (
                <>
                  {IconComponent && (
                    <IconComponent className="w-4 h-4 group-hover:text-highlight transition-colors duration-200" />
                  )}
                  <span className="relative overflow-hidden">
                    <span className="block group-hover:-translate-y-full transition-transform duration-400">
                      {link.label}
                    </span>
                    <span className="absolute top-full left-0 block group-hover:-translate-y-full transition-transform duration-400 text-white">
                      {link.label}
                    </span>
                  </span>
                </>
              );
              if (resolved.isExternal || resolved.isPlaceholder) {
                return (
                  <a
                    key={link.label}
                    ref={(el) => {
                      linksCol2Ref.current[i] = el;
                    }}
                    href={resolved.to}
                    className={className}
                    target={resolved.isExternal ? '_blank' : undefined}
                    rel={resolved.isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <Link
                  key={link.label}
                  ref={(el) => {
                    linksCol2Ref.current[i] = el;
                  }}
                  to={resolved.to}
                  className={className}
                >
                  {content}
                </Link>
              );
            })}
          </nav>

          {/* Column 3-4 - CTA */}
          <div className="col-span-2 lg:text-right mt-6 lg:mt-0">
            {(() => {
              const resolved = resolveFooterHref(footerConfig.ctaHref);
              const className =
                "inline-flex items-center gap-3 text-h5 md:text-h4 text-white font-medium group hover:text-highlight transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-black rounded";
              const inner = (
                <>
                  {footerConfig.ctaText}
                  <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-highlight group-hover:bg-highlight/10 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </>
              );
              if (resolved.isExternal || resolved.isPlaceholder) {
                return (
                  <a href={resolved.to} className={className}>
                    {inner}
                  </a>
                );
              }
              return (
                <Link to={resolved.to} className={className}>
                  {inner}
                </Link>
              );
            })()}
          </div>
        </div>

        {/* Copyright */}
        <div
          ref={copyrightRef}
          className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4"
        >
          {/* Copyright + tagline — opacity raised from /40 + /30 to /60 + /55
              for WCAG AA contrast on 14px small-caps text against black. */}
          <p className="text-body-sm text-white/60">
            {footerConfig.copyright}
          </p>
          <p className="text-body-sm text-white/55">
            {footerConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
