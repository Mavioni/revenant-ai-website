import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight } from 'lucide-react';
import { pricingConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const plans = pricingConfig.plans;
  // Initialize with the target prices so there's no $0.00 flash before the
  // ScrollTrigger fires. When the section enters viewport, GSAP resets to 0
  // and animates up — so the counter effect still plays for users who scroll
  // into pricing, but users who see the section on initial render (before
  // scrolling) see real prices, not zeros.
  const [animatedPrices, setAnimatedPrices] = useState<number[]>(() =>
    plans.map((p) => p.price),
  );
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title fade up
        tl.fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }
        );

        // Subtitle
        tl.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.4'
        );

        // Cards 3D rotation entry
        cardsRef.current.forEach((card, i) => {
          if (card) {
            const rotateStart = i === 0 ? -35 : i === 2 ? 35 : 0;
            const translateX = i === 0 ? -80 : i === 2 ? 80 : 0;
            const translateY = i === 1 ? 60 : 0;
            const scaleStart = i === 1 ? 0.85 : 1;

            tl.fromTo(
              card,
              {
                rotateY: rotateStart,
                x: translateX,
                y: translateY,
                scale: scaleStart,
                opacity: 0,
              },
              {
                rotateY: 0,
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                duration: i === 1 ? 1 : 0.9,
                ease: i === 1 ? 'back.out(1.5)' : 'expo.out',
              },
              i === 1 ? '-=0.6' : `-=${0.7 - i * 0.1}`
            );

            // Red accent line for featured
            if (plans[i].featured) {
              const accentLine = card.querySelector('.accent-line');
              if (accentLine) {
                tl.fromTo(
                  accentLine,
                  { width: 0 },
                  { width: '100%', duration: 0.6, ease: 'expo.inOut' },
                  '-=0.4'
                );
              }
            }

            // Features stagger
            const features = card.querySelectorAll('.feature-item');
            tl.fromTo(
              features,
              { x: -15, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.06,
                ease: 'power2.out',
              },
              '-=0.5'
            );
          }
        });

        // Animate price counters — reset to 0 then count up to target for
        // the tactile counter effect. The initial state already shows real
        // prices, so first-paint is correct; this just replays the animation
        // when the user scrolls into view.
        plans.forEach((plan, i) => {
          const obj = { value: 0 };
          setAnimatedPrices((prev) => {
            const next = [...prev];
            next[i] = 0;
            return next;
          });
          gsap.to(obj, {
            value: plan.price,
            duration: 1.2,
            delay: 0.4,
            ease: 'power2.out',
            onUpdate: () => {
              setAnimatedPrices((prev) => {
                const newPrices = [...prev];
                newPrices[i] = Math.round(obj.value);
                return newPrices;
              });
            },
          });
        });
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, [plans]);

  if (!pricingConfig.title || pricingConfig.plans.length === 0) return null;

  const handleCardHover = useCallback((index: number, isEntering: boolean) => {
    const card = cardsRef.current[index];
    if (!card) return;

    if (isEntering) {
      gsap.to(card, {
        y: -12,
        z: 40,
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        duration: 0.4,
        ease: 'expo.out',
      });
    } else {
      gsap.to(card, {
        y: 0,
        z: 0,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-24 md:py-32 px-6 lg:px-16 bg-black overflow-hidden"
      aria-labelledby="pricing-title"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-highlight/5 rounded-full blur-[150px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            ref={titleRef}
            id="pricing-title"
            className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium mb-4"
          >
            {pricingConfig.title}
          </h2>
          <p ref={subtitleRef} className="text-body-lg text-white/60">
            {pricingConfig.subtitle}
          </p>
        </div>

        {/* Pricing cards */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          style={{ perspective: '1000px' }}
        >
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`relative p-6 md:p-8 lg:p-10 transition-colors duration-300 ${
                plan.featured
                  ? 'bg-white text-black'
                  : 'bg-[#1a1a1a] text-white hover:bg-[#222]'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform, box-shadow',
                boxShadow: plan.featured 
                  ? '0 20px 60px rgba(0,0,0,0.4)' 
                  : '0 10px 30px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={() => handleCardHover(index, true)}
              onMouseLeave={() => handleCardHover(index, false)}
              role="article"
              aria-label={`${plan.name} plan`}
            >
              {/* Featured accent line */}
              {plan.featured && (
                <div
                  className="accent-line absolute top-0 left-0 h-1 bg-highlight"
                  style={{ willChange: 'width' }}
                />
              )}

              {/* Featured badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-highlight text-white text-body-sm font-medium">
                  Recommended
                </div>
              )}

              {/* Plan name */}
              <h3
                className={`text-h5 mb-4 md:mb-6 ${
                  plan.featured ? 'text-black' : 'text-white/80'
                }`}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-6 md:mb-8">
                <span className="text-h3 md:text-h2 font-medium tabular-nums">
                  ${plan.price === 0 ? '0' : (animatedPrices[index] || 0).toLocaleString()}
                  {plan.price > 0 && <span className="text-h5">.00</span>}
                </span>
                <span
                  className={`text-body ml-2 ${
                    plan.featured ? 'text-black/60' : 'text-white/60'
                  }`}
                >
                  / {plan.unit}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className={`feature-item flex items-start gap-3 text-body ${
                      plan.featured ? 'text-black/70' : 'text-white/70'
                    }`}
                  >
                    <Check
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.featured ? 'text-highlight' : 'text-highlight'
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-4 px-6 text-body font-medium transition-all duration-300 flex items-center justify-center gap-2 group ${
                  plan.featured
                    ? 'bg-black text-white hover:bg-highlight'
                    : 'border border-white/30 text-white hover:bg-white hover:text-black hover:border-white'
                }`}
              >
                <span>{pricingConfig.ctaButtonText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
