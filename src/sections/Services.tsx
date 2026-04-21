import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesConfig } from '../config';
import { ServiceNodeNetwork } from '../components/animations/ServiceNodeNetwork';

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const triggersRef = useRef<ScrollTrigger[]>([]);

  if (!servicesConfig.title || servicesConfig.services.length === 0) return null;

  // Smooth mouse tracking for floating image
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current || activeIndex === null) return;

    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current = { x, y };

    gsap.to(imageRef.current, {
      x: x - 150,
      y: y - 200,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, [activeIndex]);

  const handleItemEnter = useCallback((index: number) => {
    setActiveIndex(index);
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'expo.out',
      });
    }
  }, []);

  const handleItemLeave = useCallback(() => {
    setActiveIndex(null);
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Entry animation
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title slide in
        tl.fromTo(
          titleRef.current,
          { y: 60, opacity: 0, letterSpacing: '15px' },
          {
            y: 0,
            opacity: 1,
            letterSpacing: '0px',
            duration: 0.9,
            ease: 'expo.out',
          }
        );

        // Subtitle blur
        tl.fromTo(
          subtitleRef.current,
          { filter: 'blur(15px)', opacity: 0 },
          { filter: 'blur(0)', opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.5'
        );

        // Service items stagger
        itemsRef.current.forEach((item, i) => {
          if (item) {
            const line = item.querySelector('.service-line');
            const number = item.querySelector('.service-number');
            const content = item.querySelector('.service-content');

            tl.fromTo(
              line,
              { width: 0 },
              { width: '100%', duration: 0.8, ease: 'expo.inOut' },
              `-=${0.65 - i * 0.15}`
            );

            tl.fromTo(
              number,
              { scale: 0.5, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
              `-=0.5`
            );

            if (content) {
              tl.fromTo(
                content,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
                `-=0.3`
              );
            }
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

  const services = servicesConfig.services;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 md:py-32 px-6 lg:px-16 bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
      aria-labelledby="services-title"
    >
      {/* Floating image preview */}
      <div
        ref={imageRef}
        className="fixed pointer-events-none z-50 w-[280px] h-[380px] opacity-0 hidden lg:block"
        style={{
          willChange: 'transform, opacity',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {activeIndex !== null && (
          <ServiceNodeNetwork />
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <h2
            ref={titleRef}
            id="services-title"
            className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium mb-4 md:mb-6"
          >
            {servicesConfig.title}
          </h2>
          <p
            ref={subtitleRef}
            className="text-body-lg text-white/60 max-w-2xl"
          >
            {servicesConfig.subtitle}
          </p>
        </div>

        {/* Services list */}
        <div className="space-y-0" role="list">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="group relative"
              onMouseEnter={() => handleItemEnter(index)}
              onMouseLeave={handleItemLeave}
              role="listitem"
            >
              {/* Top border line */}
              <div
                className="service-line h-px bg-white/15 group-hover:bg-highlight transition-colors duration-500"
                style={{ willChange: 'width' }}
              />

              {/* Content */}
              <div className="service-content py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 cursor-pointer">
                <div className="flex items-center gap-6 md:gap-10">
                  {/* Number — opacity bumped from /30 to /55 to pass WCAG AA contrast */}
                  <span
                    className="service-number text-h5 md:text-h4 text-white/55 font-light group-hover:text-highlight group-hover:scale-110 transition-all duration-300"
                    style={{ willChange: 'transform, color' }}
                  >
                    [{service.id}]
                  </span>

                  {/* Title */}
                  <h3
                    className={`text-h4 md:text-h3 text-white font-normal transition-all duration-400 ${
                      activeIndex !== null && activeIndex !== index
                        ? 'opacity-40'
                        : 'opacity-100'
                    } ${
                      activeIndex === index
                        ? 'text-shadow-glow'
                        : ''
                    }`}
                    style={{
                      textShadow: activeIndex === index
                        ? '0 0 30px rgba(234, 0, 0, 0.3)'
                        : 'none',
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p
                  className={`text-body text-white/50 max-w-md md:text-right transition-all duration-300 ${
                    activeIndex !== null && activeIndex !== index
                      ? 'opacity-40'
                      : 'opacity-100'
                  }`}
                >
                  {service.description}
                </p>
              </div>

              {/* Bottom border for last item */}
              {index === services.length - 1 && (
                <div className="service-line h-px bg-white/15" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-highlight/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true" />
    </section>
  );
}
