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
        <div className="relative w-full max-w-[500px] aspect-square mx-auto flex items-center justify-center">
          
          {/* Main Sphere Body */}
          <div className="relative w-full h-full rounded-full border border-white/5 bg-[#0D0D0D] shadow-[0_0_80px_rgba(139,92,246,0.1)] overflow-hidden">
            
            {/* Spinning Landmass Layer */}
            <motion.div 
              className="absolute inset-0 flex"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ width: "200%" }}
            >
              {[1, 2].map((i) => (
                <div key={i} className="relative w-1/2 h-full opacity-40">
                  <svg viewBox="0 0 1000 500" className="w-full h-full fill-white/60">
                    <path d="M100,100 L180,80 L280,100 L250,180 L180,210 L80,190 Z" />
                    <path d="M250,260 L350,250 L330,340 L290,450 L260,450 L230,350 Z" />
                    <path d="M450,110 L550,90 L600,110 L580,180 L530,210 L480,180 Z" />
                    <path d="M480,220 L620,200 L640,380 L570,480 L500,480 L470,350 Z" />
                    <path d="M600,90 L850,80 L950,110 L920,290 L800,320 L650,290 L600,180 Z" />
                    <path d="M820,380 L940,370 L950,450 L870,480 L810,460 Z" />
                  </svg>
                  {/* Dot texture overlay inside landmass */}
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)', backgroundSize: '12px 12px', opacity: 0.15 }}></div>
                </div>
              ))}
            </motion.div>

            {/* Simulated Subscription Dots */}
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
                      <div className="absolute w-full h-full rounded-full bg-white opacity-20 animate-ping" />
                      <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Spherical Depth Overlays */}
            {/* Dark shadow at the edge to give curvature */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] pointer-events-none" />
            {/* Subtle violet inner glow */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none" />
            {/* Atmospheric light at the top */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          </div>

          {/* Orbit rings for tech feel */}
          <div className="absolute inset-[-40px] border border-white/5 rounded-full pointer-events-none animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-[-80px] border border-white/[0.02] rounded-full pointer-events-none animate-[spin_35s_linear_infinite_reverse]" />
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
