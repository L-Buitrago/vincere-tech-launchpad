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
              className="absolute inset-x-0 inset-y-4 flex"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{ width: "200%" }}
            >
              {[1, 2].map((i) => (
                <div key={i} className="relative w-1/2 h-full">
                  {/* Detailed World Map Silhouette */}
                  <svg viewBox="0 0 1000 500" className="w-full h-full text-violet-500/40 fill-current opacity-80">
                    {/* North America */}
                    <path d="M124.5,91c-2.4-1.1-4.8-2.2-7.1-3.6c-4.6-2.8-9.3-5.5-13.9-8.3c-2.3-1.4-4.5-2.7-6.8-4c-2.3-1.3-4.5-2.6-6.8-3.9 C87.6,69.9,85.3,68.7,83,67.5c-2.3-1.2-4.6-2.5-6.9-3.7C74.6,63,73.1,62.1,71.5,61.3c-1.5-0.8-3.1-1.6-4.6-2.5 c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.2-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 C31.1,39.5,28,37.8,24.9,36.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 C-1.5,21.8-4.6,20.1-7.7,18.4c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-3.1-1.7-6.2-3.4-9.3-5.1 c-1.6-0.8-3.1-1.7-4.7-2.5C-84,10.1-85.6,9.2-87.1,8.4c-1.5-0.8-3.1-1.7-4.6-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-3.1-1.7-6.2-3.4-9.3-5.1 C-113.6-6-116.7-7.7-119.8-9.4c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 C-146.3-23.7-149.4-25.4-152.5-27.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 C-201-57.9-204.1-59.6-207.2-61.3c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5 c-1.6-0.8-3.1-1.7-4.7-2.5s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1s-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5 s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5 s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5 s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5 s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5 s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5 s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5 s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5 s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1s-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5s-3.1-1.7-4.7-2.5 c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 c-3.1-1.7-6.2-3.4-9.3-5.1c-1.6-0.8-3.1-1.7-4.7-2.5c-1.6-0.8-3.1-1.7-4.7-2.5s-3.1-1.7-4.7-2.5c-3.1-1.7-6.2-3.4-9.3-5.1 c-1.6-0.3-3.1-0.7-4.6-1.1c-1.5-0.4-3-0.8-4.5-1.2l0,0c1.5,0.4,3,0.8,4.5,1.2c1.6,0.4,3.1,0.8,4.6,1.1 C-636.5-155.6-635-155.2-633.4-154.8z" />
                    <path d="M150,150 L250,140 L280,180 L350,220 L280,350 L220,380 L150,280 Z" />
                    <path d="M450,150 L600,120 L680,250 L630,420 L550,450 L480,350 Z" />
                    <path d="M500,50 L620,30 L700,80 L650,150 L520,160 Z" />
                    <path d="M750,100 L950,80 L980,250 L880,300 L750,250 Z" />
                    <path d="M850,350 L960,340 L970,420 L880,450 Z" />
                  </svg>
                  {/* Cyberspace Matrix Dot Overlay */}
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '6px 6px', opacity: 0.08 }}></div>
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
