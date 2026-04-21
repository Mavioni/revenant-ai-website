import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });

      // Fade out progress
      tl.to(progressRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in'
      });

      // Scale and fade logo
      tl.to(logoRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, '-=0.2');

      // Slide up container
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'expo.inOut'
      }, '-=0.3');
    }
  }, [isLoading, onComplete]);

  // Animate progress bar
  useEffect(() => {
    if (progressBarRef.current && isLoading) {
      gsap.to(progressBarRef.current, {
        width: '100%',
        duration: 2.5,
        ease: 'power2.out'
      });
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Logo */}
      <div ref={logoRef} className="relative mb-12">
        <div className="text-[80px] md:text-[120px] font-medium tracking-tight text-white">
          {'YUNIS'.split('').map((char, i) => (
            <span
              key={i}
              className="inline-block animate-pulse"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s'
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-highlight to-transparent" />
      </div>

      {/* Progress */}
      <div ref={progressRef} className="w-64 md:w-80">
        <div className="flex justify-between text-body-sm text-white/50 mb-2">
          <span>Initializing</span>
          <span>Ternary Architecture</span>
        </div>
        <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-highlight rounded-full"
            style={{ width: '0%' }}
          />
        </div>
        <div className="mt-4 text-center text-body-sm text-white/30">
          {-1} &nbsp; 0 &nbsp; +1
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-8 text-body-sm text-white/20">
        © 2026
      </div>
      <div className="absolute bottom-8 right-8 text-body-sm text-white/20">
        The Human Element
      </div>
    </div>
  );
}
