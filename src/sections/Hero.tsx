import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';
import { UniverseSimulation } from '../components/animations/UniverseSimulation';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  if (!heroConfig.title) return null;

  // Mouse parallax effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current || !imageRef.current) return;
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPercent = (clientX / innerWidth - 0.5) * 2;
    const yPercent = (clientY / innerHeight - 0.5) * 2;
    
    gsap.to(imageRef.current, {
      rotateY: xPercent * 3,
      rotateX: -yPercent * 3,
      duration: 0.8,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
    // Entry animation timeline
    const tl = gsap.timeline({ delay: 0.3 });

    // Initial states
    gsap.set([titleRef.current, subtitleRef.current, servicesRef.current, copyrightRef.current], {
      opacity: 0,
    });
    gsap.set(lineRef.current, { height: 0 });
    gsap.set(imageRef.current, { scale: 1.1, opacity: 0 });

    // Image scale + fade with slight delay
    tl.to(imageRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: 'expo.out',
    });

    // Title characters animation with stagger
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll('.char');
      gsap.set(chars, { rotateY: -90, y: 60, opacity: 0 });
      
      tl.to(chars, {
        rotateY: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'back.out(1.4)',
      }, '-=1');
    }

    // Subtitle blur reveal
    tl.to(subtitleRef.current, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.5');

    // Services slide in
    tl.to(servicesRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'expo.out',
    }, '-=0.5');

    // Line grow
    tl.to(lineRef.current, {
      height: 200,
      duration: 1.2,
      ease: 'expo.inOut',
    }, '-=0.6');

    // Copyright fade
    tl.to(copyrightRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.8');

    // Scroll effects
    const trigger1 = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '50% top',
      scrub: 1,
      onUpdate: (self) => {
        if (imageRef.current) {
          gsap.set(imageRef.current, {
            y: `${self.progress * 30}%`,
            opacity: 1 - self.progress * 0.5,
          });
        }
      },
    });
    triggersRef.current.push(trigger1);

    const trigger2 = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '40% top',
      scrub: 1,
      onUpdate: (self) => {
        if (titleRef.current) {
          gsap.set(titleRef.current, {
            rotateX: -10 * self.progress,
            z: -80 * self.progress,
            opacity: 1 - self.progress * 0.8,
          });
        }
      },
    });
    triggersRef.current.push(trigger2);

    const trigger3 = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: '10% top',
      end: '50% top',
      scrub: 1,
      onUpdate: (self) => {
        if (subtitleRef.current) {
          gsap.set(subtitleRef.current, {
            opacity: 1 - self.progress,
            y: -20 * self.progress,
          });
        }
        if (overlayRef.current) {
          gsap.set(overlayRef.current, {
            opacity: 0.3 + self.progress * 0.4,
          });
        }
      },
    });
    triggersRef.current.push(trigger3);

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      tl.kill();
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const titleChars = heroConfig.title.split('');

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ perspective: '1200px' }}
      aria-label="Hero section"
    >
      {/* Vignette overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
          opacity: 0.3,
        }}
        aria-hidden="true"
      />

      {/* Main background image with 3D container */}
      <div
        className="absolute inset-0 z-0"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          ref={imageRef}
          className="w-full h-full"
          style={{ 
            willChange: 'transform, opacity',
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="w-full h-full object-cover absolute inset-0 bg-black" style={{ filter: 'brightness(0.85)' }}>
            <UniverseSimulation />
          </div>
        </div>
      </div>

      {/* Content container */}
      <div
        className="relative z-20 h-full w-full flex flex-col justify-center items-center px-6"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Main title */}
        <h1
          ref={titleRef}
          className="text-[80px] sm:text-[100px] md:text-[140px] lg:text-[168px] font-medium text-white tracking-tight mb-4 md:mb-6"
          style={{
            textShadow: '0 0 60px rgba(234, 0, 0, 0.25), 0 0 120px rgba(234, 0, 0, 0.1)',
            willChange: 'transform, opacity',
            transformStyle: 'preserve-3d',
          }}
        >
          {titleChars.map((char, i) => (
            <span
              key={i}
              className="char inline-block"
              style={{
                transform: `translateY(${(i % 2 === 0 ? -1 : 1) * 6}px)`,
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-h4 sm:text-h3 md:text-h2 font-light text-white/90 tracking-[0.2em] uppercase"
          style={{ 
            willChange: 'filter, opacity',
            filter: 'blur(10px)',
          }}
        >
          {heroConfig.subtitle}
        </p>

        {/* Decorative accent line */}
        <div
          className="absolute left-1/2 bottom-24 md:bottom-32 w-px bg-gradient-to-b from-highlight to-transparent z-30"
          ref={lineRef}
          style={{
            transform: 'translateX(-50%)',
            willChange: 'height',
            boxShadow: '0 0 20px rgba(234, 0, 0, 0.5)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Services label - vertical left */}
      <div
        ref={servicesRef}
        className="absolute left-4 md:left-8 bottom-24 md:bottom-32 z-30 flex flex-col items-center gap-4"
        style={{ 
          writingMode: 'vertical-rl', 
          textOrientation: 'mixed',
          transform: 'translateX(-20px)',
        }}
        aria-label="Services"
      >
        <span className="text-body-sm text-white/60 tracking-widest uppercase">
          {heroConfig.servicesLabel}
        </span>
      </div>

      {/* Copyright - bottom right */}
      <div
        ref={copyrightRef}
        className="absolute right-4 md:right-8 bottom-6 md:bottom-8 z-30"
        style={{ transform: 'translateY(20px)' }}
      >
        <span className="text-body-sm text-white/40">{heroConfig.copyright}</span>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
