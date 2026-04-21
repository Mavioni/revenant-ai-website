import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function ResonanceOrb({ className = '' }: { className?: string }) {
  const outerOrbRef = useRef<HTMLDivElement>(null);
  const innerOrbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Breathing animation loop
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(outerOrbRef.current, {
        scale: 1.2,
        opacity: 0.1,
        duration: 2,
        ease: 'sine.inOut'
    })
    .to(outerOrbRef.current, {
        scale: 0.8,
        opacity: 0.3,
        duration: 2,
        ease: 'sine.inOut'
    });

    const t2 = gsap.timeline({ repeat: -1 });
    t2.to(innerOrbRef.current, {
        scale: 1.05,
        opacity: 0.8,
        duration: 2,
        ease: 'sine.inOut',
        delay: 0.2
    })
    .to(innerOrbRef.current, {
        scale: 0.95,
        opacity: 1,
        duration: 2,
        ease: 'sine.inOut'
    });

    return () => {
      tl.kill();
      t2.kill();
    };
  }, []);

  return (
    <div className={`w-full h-full relative bg-[#050505] overflow-hidden flex items-center justify-center ${className}`}>
        {/* Core highlight blur */}
        <div ref={outerOrbRef} className="absolute w-[80%] h-[80%] max-w-[200px] max-h-[200px] bg-highlight/20 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        {/* Inner solid Orb */}
        <div ref={innerOrbRef} className="absolute w-[40%] h-[40%] max-w-[100px] max-h-[100px] bg-gradient-to-br from-white/90 to-white/20 rounded-full shadow-[0_0_20px_#fff] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        {/* Sparkles / dust */}
        <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-white rounded-full opacity-50 blur-[1px]" />
        <div className="absolute top-[80%] left-[70%] w-1.5 h-1.5 bg-highlight rounded-full opacity-50 blur-[2px]" />
        <div className="absolute top-[30%] left-[80%] w-2 h-2 bg-white/30 rounded-full blur-[2px]" />
    </div>
  );
}
