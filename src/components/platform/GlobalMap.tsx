import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Users, Orbit, Sparkles } from "lucide-react";

interface SubDot {
  id: number;
  x: number;
  y: number;
  scale: number;
}

export function GlobalMap() {
  const [dots, setDots] = useState<SubDot[]>([]);

  // Simulate real-time subscriptions popping up
  useEffect(() => {
    const interval = setInterval(() => {
      const newDot: SubDot = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // Avoid edges
        y: Math.random() * 60 + 20,
        scale: Math.random() * 0.5 + 0.5,
      };

      setDots((prev) => [...prev.slice(-10), newDot]); // Keep last 10 dots
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[#0A0A0A]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3 h-3" />
            Live Network
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Vendas em Tempo Real.
          </h2>
          <p className="text-[#888] text-lg max-w-2xl mx-auto">
            Nossa infraestrutura processa transações de todos os cantos do planeta, a cada segundo. 
            A Vincere é a engine do seu crescimento global.
          </p>
        </div>

        {/* Globe Container */}
        <div className="relative w-full max-w-[480px] aspect-square mx-auto flex items-center justify-center scale-90 sm:scale-100">
          
          {/* Main Sphere Body */}
          <div className="relative w-full h-full rounded-full border border-white/5 bg-[#050505] shadow-[0_0_100px_rgba(139,92,246,0.15)] overflow-hidden">
            
            {/* Spinning Landmass Layer (High-Fidelity Dot Matrix) */}
            <motion.div 
              className="absolute inset-0 flex"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ width: "200%" }}
            >
              {[1, 2].map((i) => (
                <div key={i} className="relative w-1/2 h-full">
                  {/* Detailed Dot-Grid Landmass representation */}
                  <svg viewBox="0 0 1000 500" className="w-full h-full text-violet-400/30 fill-current p-12">
                    {/* North America */}
                    <path d="M120,80 Q150,60 250,80 Q280,120 220,180 Q150,220 100,160 Z" />
                    {/* South America */}
                    <path d="M220,220 Q320,200 300,300 Q260,450 220,450 Q180,350 200,280 Z" />
                    {/* Africa */}
                    <path d="M480,180 Q620,160 650,280 Q620,420 540,460 Q480,420 450,300 Z" />
                    {/* Europe */}
                    <path d="M480,100 Q550,60 620,100 Q600,160 520,170 Q480,150 480,100 Z" />
                    {/* Asia */}
                    <path d="M620,80 Q850,50 960,100 Q920,250 820,300 Q700,320 620,200 Z" />
                    {/* Australia */}
                    <path d="M820,350 Q940,340 950,420 Q880,460 810,430 Z" />
                  </svg>
                  {/* Dense dot overlay that gives it the "Matrix" look */}
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '8px 8px', opacity: 0.1 }}></div>
                </div>
              ))}
            </motion.div>

            {/* Simulated Subscription Dots (Fusing onto the moving globe) */}
            <div className="absolute inset-0 pointer-events-none">
              <AnimatePresence>
                {dots.map((dot) => (
                  <motion.div
                    key={dot.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: dot.scale, opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 4, times: [0, 0.2, 0.8, 1] }}
                    className="absolute w-4 h-4"
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                  >
                    <div className="relative flex items-center justify-center w-full h-full">
                      <div className="absolute w-full h-full rounded-full bg-white opacity-40 animate-ping" />
                      <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_white]" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Spherical Depth & Lighting (The "NASA" Sauce) */}
            {/* 1. Deep Outer Shadow (Creates the sphere shape) */}
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] pointer-events-none" />
            
            {/* 2. Side Shadow (Left side darker) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* 3. Violet Bottom Glow (Reflected light) */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-violet-600/20 via-transparent to-transparent pointer-events-none" />
            
            {/* 4. Top/Right Atmospheric Light (The Sun/Star light) */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-radial-gradient from-white/10 to-transparent blur-3xl pointer-events-none" />
            
            {/* 5. Rim Light (White thin border glow) */}
            <div className="absolute inset-0 border border-white/10 rounded-full pointer-events-none" />
          </div>

          {/* Exterior Orbit & Atmosphere */}
          <div className="absolute inset-[-20px] rounded-full border border-violet-500/5 animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-[-60px] rounded-full border border-white/[0.02] animate-[spin_60s_linear_infinite_reverse]" />
          
          {/* Subtle "Aura" */}
          <div className="absolute inset-0 rounded-full bg-violet-500/5 blur-3xl -z-10 pointer-events-none" />
        </div>

        {/* Stats Overlay Bar */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 lg:gap-24 relative z-20">
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] mb-2">Países Ativos</p>
            <span className="text-3xl font-bold text-white tracking-tighter">12+</span>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] mb-2">Uptime Global</p>
            <span className="text-3xl font-bold text-white tracking-tighter">99.9%</span>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] mb-2">Moedas Aceitas</p>
            <span className="text-3xl font-bold text-white tracking-tighter">50+</span>
          </div>
        </div>

        {/* Floating Icons for Tech feel */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-40">
           <div className="flex items-center gap-2 justify-center">
             <Orbit className="w-4 h-4 text-[#444]" />
             <span className="text-[11px] font-bold text-[#444] uppercase tracking-widest">Multi-Cloud</span>
           </div>
           <div className="flex items-center gap-2 justify-center">
             <Globe className="w-4 h-4 text-[#444]" />
             <span className="text-[11px] font-bold text-[#444] uppercase tracking-widest">CDN Global</span>
           </div>
           <div className="flex items-center gap-2 justify-center">
             <Users className="w-4 h-4 text-[#444]" />
             <span className="text-[11px] font-bold text-[#444] uppercase tracking-widest">SLA Internacional</span>
           </div>
           <div className="flex items-center gap-2 justify-center">
             <Sparkles className="w-4 h-4 text-[#444]" />
             <span className="text-[11px] font-bold text-[#444] uppercase tracking-widest">Scaling Auto</span>
           </div>
        </div>
      </div>
    </section>
  );
}
