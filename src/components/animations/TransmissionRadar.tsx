import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function TransmissionRadar({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Rotating radar scanner
    const tl = gsap.to(scannerRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 4,
      ease: 'linear'
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full relative bg-[#020202] overflow-hidden flex items-center justify-center ${className}`}>
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: `20px 20px`,
            backgroundPosition: `center center`
        }}></div>

        {/* Concentric circles */}
        <div className="absolute w-[80%] h-[80%] max-w-[400px] max-h-[400px] border border-highlight/20 rounded-full" />
        <div className="absolute w-[60%] h-[60%] max-w-[300px] max-h-[300px] border border-highlight/30 rounded-full" />
        <div className="absolute w-[40%] h-[40%] max-w-[200px] max-h-[200px] border border-highlight/40 rounded-full" />
        <div className="absolute w-[20%] h-[20%] max-w-[100px] max-h-[100px] border border-white/20 rounded-full" />

        {/* Core dot */}
        <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />

        {/* Scanner sweep */}
        <div 
          ref={scannerRef}
          className="absolute top-1/2 left-1/2 w-full h-[2px] origin-left bg-gradient-to-r from-highlight to-transparent opacity-80"
          style={{ width: '50vw' }}
        />
        
        {/* Blips */}
        <div className="absolute top-[30%] left-[60%] w-1.5 h-1.5 bg-highlight rounded-full animate-ping opacity-80" />
        <div className="absolute top-[70%] left-[40%] w-1.5 h-1.5 bg-highlight rounded-full animate-ping opacity-80" style={{ animationDelay: '1s' }} />
    </div>
  );
}
