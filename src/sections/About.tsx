import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const authorImageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const authorTextRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  if (!aboutConfig.titleLine1) return null;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Entry animations
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Image 1 clip reveal
        tl.fromTo(
          image1Ref.current,
          { clipPath: 'inset(100% 0 0 0)', scale: 1.1 },
          {
            clipPath: 'inset(0% 0 0 0)',
            scale: 1,
            duration: 1.2,
            ease: 'expo.out',
          }
        );

        // Image 2 clip reveal
        tl.fromTo(
          image2Ref.current,
          { clipPath: 'inset(0 100% 0 0)', scale: 1.05 },
          {
            clipPath: 'inset(0 0% 0 0)',
            scale: 1,
            duration: 1.1,
            ease: 'expo.out',
          },
          '-=0.85'
        );

        // Title lines reveal
        if (titleRef.current) {
          const lines = titleRef.current.querySelectorAll('.title-line');
          tl.fromTo(
            lines,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: 'back.out(1.4)',
            },
            '-=0.7'
          );
        }

        // Red accent line
        tl.fromTo(
          lineRef.current,
          { width: 0 },
          { width: '100%', duration: 1, ease: 'expo.inOut' },
          '-=0.5'
        );

        // Text fade up
        tl.fromTo(
          textRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        );

        // Author image
        tl.fromTo(
          authorImageRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
          },
          '-=0.5'
        );

        // Author text words
        if (authorTextRef.current) {
          const words = authorTextRef.current.querySelectorAll('.word');
          tl.fromTo(
            words,
            { y: 10, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.02,
              ease: 'power2.out',
            },
            '-=0.4'
          );
        }
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    // Parallax on scroll
    const parallaxTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        if (image1Ref.current) {
          gsap.set(image1Ref.current, {
            y: 40 - self.progress * 80,
          });
        }
        if (image2Ref.current) {
          gsap.set(image2Ref.current, {
            y: -20 + self.progress * 40,
          });
        }
        if (authorImageRef.current) {
          gsap.set(authorImageRef.current, {
            y: 20 - self.progress * 40,
          });
        }
      },
    });
    triggersRef.current.push(parallaxTrigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  // Split author bio into words for animation
  const authorWords = aboutConfig.authorBio.split(' ');

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 px-6 lg:px-16 overflow-hidden bg-black"
      aria-labelledby="about-title"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black z-0" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left column - Images */}
          <div className="lg:col-span-5 relative">
            {/* Image 1 — book cover; contain + letterbox so cover displays fully */}
            <div
              ref={image1Ref}
              className="relative w-full aspect-[2/3] overflow-hidden group cursor-pointer bg-[#0a0a0a]"
              style={{ willChange: 'clip-path, transform' }}
            >
              <img
                src={aboutConfig.image1}
                alt={aboutConfig.image1Alt}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Image 2 — lotus architecture diagram; contain + letterbox for the square source */}
            <div
              ref={image2Ref}
              className="relative w-3/4 aspect-[2/3] -mt-24 md:-mt-32 ml-auto mr-4 overflow-hidden group cursor-pointer z-10 shadow-2xl shadow-black/50 bg-[#0a0a0a]"
              style={{ willChange: 'clip-path, transform' }}
            >
              <img
                src={aboutConfig.image2}
                alt={aboutConfig.image2Alt}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Right column - Content */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:pt-12">
            {/* Section title */}
            <h2
              ref={titleRef}
              id="about-title"
              className="text-h3 md:text-h2 text-white font-normal leading-tight mb-6"
            >
              <span className="title-line block text-white/90">
                {aboutConfig.titleLine1}
              </span>
              <span className="title-line block text-white/70">
                {aboutConfig.titleLine2}
              </span>
            </h2>

            {/* Red accent line */}
            <div
              ref={lineRef}
              className="h-[2px] bg-gradient-to-r from-highlight to-transparent mb-8"
              style={{ willChange: 'width', maxWidth: '300px' }}
              aria-hidden="true"
            />

            {/* About text */}
            <p
              ref={textRef}
              className="text-body-lg md:text-body-lg text-white/70 leading-relaxed mb-12 max-w-2xl"
            >
              {aboutConfig.description}
            </p>

            {/* Author section */}
            <div className="flex items-start gap-5 md:gap-6">
              {/* Author image */}
              <div
                ref={authorImageRef}
                className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-highlight/40 shadow-lg shadow-highlight/10"
                style={{ willChange: 'transform, opacity' }}
              >
                <img
                  src={aboutConfig.authorImage}
                  alt={aboutConfig.authorName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Author text */}
              <div ref={authorTextRef} className="text-body text-white/50 leading-relaxed max-w-lg">
                <span className="sr-only">{aboutConfig.authorBio}</span>
                <span aria-hidden="true">
                  {authorWords.map((word, i) => (
                    <span key={i} className="word inline-block mr-[0.3em]">
                      {word}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
