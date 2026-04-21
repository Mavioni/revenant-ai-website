import { useEffect, useRef, useState } from 'react';

const STATIC_CODE_CHUNKS: Record<string, string[]> = {
  default: [
    'INIT KERNEL MEMORY... OK',
    'LOADING MODULE: /core/inference',
    'ALLOCATING TRITS... 4096 ALLOCATED',
    '[WARN] BINARY DEGENERACY DETECTED',
    'CORRECTING TO TERNARY DOMAIN',
    '0x00FF2A -> {-1, 0, +1}',
    'EXECUTING DIRECT TRANS-DIFFERENTIATION',
    'STATUS: ACTIVE',
  ],
  ronin: [
    'BOOTING RONIN OS V1.0',
    'LOCAL SQLITE INIT... OK',
    'MOUNTING MCP SERVER',
    '> INCOMING REQUEST: get_context()',
    'RESOLVING... SUCCESS',
    'MEMORY FOOTPRINT: 12MB',
    '> STANDBY FOR CLAW INPUT',
  ],
  parakeet: [
    'SPAWNING PARAKEET AST AGENT',
    'LOADING RUST HYBRID COMPILER...',
    'ANALYZING AST GRAPH //',
    '[OK] GRAPH COMPILED',
    'APPLYING DIALECTICAL CHANGES...',
    'DIFF GENERATED -> src/main.rs',
    'WAITING FOR VERIFICATION...',
  ],
  breeze: [
    'BREEZE OS SECURE KERNEL INIT',
    'GENERATING TRIT ENCRYPTION KEYS...',
    '[+] KEY 02A: -1, 0, +1, 0, -1',
    'VERIFYING NON-BINARY ENTROPY',
    'CONNECTING MESH PEERS... 2 FOUND',
    'SECURE TUNNEL ESTABLISHED',
    'NO CLOUD DETECTED. SAFE.',
  ],
  engram: [
    'WAKING ENGRAM TOPOLOGY',
    'CONNECTING TO PROJECT MIRROR',
    'SYNCHRONIZING ONTOLOGY...',
    'PROCESSING NEW KNOWLEDGE NODES',
    '> FOUND 12 CONTRADICTIONS',
    '> SUMMONING CORAX ENGINE...',
    '> RESOLVED -> SYNTHESIS GRAPH',
  ]
};

export function TerminalVisualizer({ context = 'default', className = '' }: { context?: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const chunkPool = STATIC_CODE_CHUNKS[context] || STATIC_CODE_CHUNKS.default;
    let isActive = true;
    
    // Initial glitch / fast boot effect
    const initialLines = chunkPool.slice(0, 3);
    setLines(initialLines);

    // Stream lines over time
    let currentIndex = 3;
    const interval = setInterval(() => {
      if (!isActive) return;
      if (currentIndex >= chunkPool.length) {
        // Randomly repeat a random log entry simulating ongoing work
        const randomAction = ['> RESOLVING...', '[OK] KERNEL TICK', 'POLLING MEM...', '> IDLE LOOP'][Math.floor(Math.random() * 4)];
        setLines(prev => [...prev.slice(-10), randomAction]);
      } else {
        setLines(prev => [...prev.slice(-10), chunkPool[currentIndex]]);
        currentIndex++;
      }
      
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, Math.random() * 800 + 400); // random interval

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [context]);

  return (
    <div className={`relative bg-[#0a0a0a] border border-[#1a1a1a] rounded overflow-hidden font-mono text-xs sm:text-sm p-4 w-full h-full flex flex-col justify-end ${className}`}>
      {/* terminal header bar */}
      <div className="absolute top-0 left-0 w-full h-6 bg-[#1a1a1a] flex items-center px-2 z-10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-900/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-900/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-900/50" />
        </div>
        <span className="text-[10px] text-white/30 ml-4 font-sans">{context}.exe</span>
      </div>
      
      <div ref={containerRef} className="overflow-hidden mt-6 flex-1 w-full flex flex-col justify-end opacity-80">
        {lines.map((line, i) => (
          <div key={i} className="text-red-500/80 mb-1 leading-snug break-words">
            <span className="text-white/20 mr-2">{'>'}</span>{line}
          </div>
        ))}
        <div className="text-red-500/80 animate-pulse">
            <span className="text-white/20 mr-2">{'>'}</span>_
        </div>
      </div>
      
      {/* scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] [background-size:100%_2px,3px_100%] z-20" />
    </div>
  );
}
