import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';
import { testimonialsConfig } from '../config';
import { TerminalVisualizer } from '../components/animations/TerminalVisualizer';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  if (!testimonialsConfig.title || testimonialsConfig.testimonials.length === 0) return null;

  const testimonials = testimonialsConfig.testimonials;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title reveal
        tl.fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }
        );

        // Cards stagger
        cardsRef.current.forEach((card, i) => {
          if (card) {
            const isCenter = i === 1;
            tl.fromTo(
              card,
              {
                y: 80,
                rotateX: 15,
                opacity: 0,
              },
              {
                y: 0,
                rotateX: 0,
                opacity: 1,
                duration: isCenter ? 1 : 0.8,
                ease: isCenter ? 'back.out(1.5)' : 'expo.out',
              },
              `-=${isCenter ? 0.5 : 0.6}`
            );
          }
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

  const handleCardHover = useCallback((index: number, isEntering: boolean) => {
    const card = cardsRef.current[index];
    if (!card) return;

    setActiveIndex(isEntering ? index : null);

    if (isEntering) {
      gsap.to(card, {
        y: -10,
        z: 30,
        duration: 0.4,
        ease: 'expo.out',
      });
    } else {
      gsap.to(card, {
        y: 0,
        z: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-24 md:py-32 px-6 lg:px-16 bg-black overflow-hidden"
      aria-labelledby="testimonials-title"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            ref={titleRef}
            id="testimonials-title"
            className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium"
          >
            {testimonialsConfig.title}
          </h2>
        </div>

        {/* Cards grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          style={{ perspective: '1000px' }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`relative p-6 md:p-8 bg-[#0a0a0a] border border-white/10 transition-all duration-300 ${
                activeIndex !== null && activeIndex !== index
                  ? 'opacity-50'
                  : 'opacity-100'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                boxShadow: activeIndex === index
                  ? '0 30px 60px rgba(0,0,0,0.4)'
                  : '0 10px 30px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={() => handleCardHover(index, true)}
              onMouseLeave={() => handleCardHover(index, false)}
              role="article"
              aria-label={`${testimonial.name} - ${testimonial.title}`}
            >
              {/* Quote icon */}
              <div className="mb-4 md:mb-6">
                <Quote className="w-8 h-8 md:w-10 md:h-10 text-highlight/40" />
              </div>

              {/* Quote text */}
              <blockquote className="text-body text-white/80 leading-relaxed mb-6 md:mb-8">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-highlight/30">
                  <TerminalVisualizer context="client-node" className="opacity-90" />
                </div>
                <div>
                  <p className="text-body font-medium text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-body-sm text-white/50">
                    {testimonial.title}
                  </p>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-highlight/20 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
