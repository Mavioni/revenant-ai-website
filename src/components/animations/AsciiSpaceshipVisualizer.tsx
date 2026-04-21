import { useEffect, useRef, useState } from 'react';

const SPACESHIP_ASCII = `
      /\\
     |  |
    /    \\
   |      |
  /        \\
 |  REVN-1  |
/            \\
|============|
 \\   /\\/\\   /
  \\/      \\/
`;

export function AsciiSpaceshipVisualizer({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<string[]>([]);
  
  useEffect(() => {
    let isActive = true;
    const width = 40;
    const height = 20;

    // Initialize random stars
    const generateRow = () => {
      let row = '';
      for(let i=0; i<width; i++) {
        const rand = Math.random();
        if (rand > 0.98) row += '*';
        else if (rand > 0.95) row += '+';
        else if (rand > 0.9) row += '.';
        else row += ' ';
      }
      return row;
    };

    const initialStars = Array.from({length: height}, generateRow);
    setStars(initialStars);

    // Scroll stars down
    const interval = setInterval(() => {
      if (!isActive) return;
      setStars(prev => [generateRow(), ...prev.slice(0, height - 1)]);
    }, 100);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`relative bg-[#0a0a0a] border border-[#1a1a1a] rounded overflow-hidden font-mono text-xs p-4 w-full h-full flex flex-col justify-end ${className}`}>
      <div className="absolute top-0 left-0 w-full h-6 bg-[#1a1a1a] flex items-center px-2 z-10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-900/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-900/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-900/50" />
        </div>
        <span className="text-[10px] text-white/30 ml-4 font-sans">exploration_kernel.exe</span>
      </div>
      
      <div ref={containerRef} className="overflow-hidden mt-6 flex-1 w-full flex flex-col items-center justify-center relative opacity-80">
        {/* Starfield */}
        <div className="absolute inset-0 flex flex-col pointer-events-none z-0 mt-4 leading-[1.1] items-center text-white/40 whitespace-pre">
          {stars.join('\\n')}
        </div>
        
        {/* Spaceship */}
        <div className="z-10 text-white font-bold leading-[1.1] whitespace-pre -mt-4 text-center">
            {SPACESHIP_ASCII}
        </div>
        
        {/* Thrust */}
        <div className="z-10 text-highlight animate-pulse font-bold leading-[1.1] whitespace-pre text-center">
{`   ||||||  
    ||||
     ||`}
        </div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] [background-size:100%_2px,3px_100%] z-20" />
    </div>
  );
}
