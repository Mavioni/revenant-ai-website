import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { faqConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  if (!faqConfig.title || faqConfig.faqs.length === 0) return null;

  const toggleItem = useCallback((index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  }, [openIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title scale in
        tl.fromTo(
          titleRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' }
        );

        // FAQ items stagger from alternating sides
        itemsRef.current.forEach((item, i) => {
          if (item) {
            const isLeft = i % 2 === 0;
            tl.fromTo(
              item,
              {
                x: isLeft ? -60 : 60,
                opacity: 0,
              },
              {
                x: 0,
                opacity: 1,
                duration: 0.7,
                ease: 'expo.out',
              },
              `-=${0.55 - i * 0.1}`
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

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-24 md:py-32 px-6 lg:px-16 bg-black overflow-hidden"
      aria-labelledby="faq-title"
    >
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h2
          ref={titleRef}
          id="faq-title"
          className="text-h2 md:text-h1 lg:text-display-xl text-white font-medium text-center mb-12 md:mb-16"
        >
          {faqConfig.title}
        </h2>

        {/* FAQ items */}
        <div className="space-y-4 md:space-y-6">
          {faqConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className={`${
                  isLeft ? 'lg:pr-12' : 'lg:pl-12'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full text-left p-5 md:p-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-black rounded ${
                    isOpen
                      ? 'bg-white/5'
                      : 'bg-transparent hover:bg-white/[0.02]'
                  }`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  {/* Question */}
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={`text-h5 md:text-h4 font-normal transition-colors duration-300 ${
                        isOpen ? 'text-white' : 'text-white/80'
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-6 h-6 flex-shrink-0 transition-transform duration-500 ${
                        isOpen ? 'rotate-180 text-highlight' : 'text-white/50'
                      }`}
                    />
                  </div>

                  {/* Answer */}
                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'max-h-[500px] mt-4 md:mt-5' : 'max-h-0'
                    }`}
                  >
                    <p className="text-body text-white/60 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </button>

                {/* Bottom border */}
                <div
                  className={`h-px bg-gradient-to-r ${
                    isLeft
                      ? 'from-white/20 via-white/10 to-transparent'
                      : 'from-transparent via-white/10 to-white/20'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
