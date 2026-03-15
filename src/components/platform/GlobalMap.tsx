import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Globe, Users, Orbit, Sparkles } from "lucide-react";

export function GlobalMap() {
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-white leading-tight">
            Vendas em Tempo Real. <br /> Sem Fronteiras.
          </h2>
          <p className="text-[#888] text-lg max-w-2xl mx-auto">
            Processamos transações de todos os cantos do planeta, a cada segundo. 
            A Vincere é a engine do seu crescimento global.
          </p>
        </div>

        {/* Globe Container */}
        <div className="relative w-full max-w-[480px] aspect-square mx-auto flex items-center justify-center scale-95 sm:scale-110">
          
          {/* Main Sphere Body */}
          <div className="relative w-full h-full rounded-full bg-[#050505] shadow-[0_0_100px_rgba(139,92,246,0.1)] overflow-hidden">
            
            {/* 3D Dot-Matrix World (The actual "Cyber" Globe) */}
            <div className="absolute inset-0 flex">
              <motion.div 
                className="flex h-full w-[200%]"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              >
                {[1, 2].map((i) => (
                  <div key={i} className="relative w-1/2 h-full">
                    {/* The Dot Matrix Texture with World Mask */}
                    <div 
                      className="absolute inset-0 opacity-40 group"
                      style={{
                        backgroundImage: `radial-gradient(circle, #8b5cf6 1.8px, transparent 1.8px)`,
                        backgroundSize: '10px 10px',
                        maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100,80c0,0,10,20,50,15s60-30,100-20s50,40,30,80s-40,60-60,100s-20,60,0,100s40,60,60,40s40-40,60-40s40,20,60,40s20,40,40,40s40-20,60-40s20-40,40-40s40,20,60,40s20,40,40,40s40-20,60-40s20-40,40-40s40,20,60,40s20,40,40,40s40-20,60-40s20-40,40-40s40,20,60,40s20,40,40,40s40-20,60-40h100V0H0v500h100z' fill='black'/%3E%3Cpath d='M150,100 Q180,80 250,110 Q320,150 280,250 Q240,350 200,380 Q150,280 150,200 Z' fill='white'/%3E%3Cpath d='M450,150 Q550,100 650,150 Q750,250 650,400 Q550,480 480,350 Z' fill='white'/%3E%3Cpath d='M650,100 Q850,50 950,150 Q980,250 850,320 Q750,280 650,200 Z' fill='white'/%3E%3Cpath d='M820,350 Q940,340 950,420 Q880,460 810,430 Z' fill='white'/%3E%3C/svg%3E")`,
                        maskRepeat: 'repeat-x',
                        maskSize: '100% 100%',
                        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white'%3E%3Cpath d='M160.7,112.5c-4.4-1.2-8.3-2.1-13.6,0c-13.4,5.2-22.3,18.9-20.9,32.4c1.1,10.6,10.4,19.2,21,19.2c1,0,1.9,0,2.9-0.1 c13.4-1.4,22.3-15.1,20.9-28.6C169.6,121.9,165.1,113.7,160.7,112.5z'/%3E%3Cpath d='M250,210c-50,10-100,50-100,100s30,150,50,200s100,50,150,0s50-150,0-200S300,200,250,210z'/%3E%3Cpath d='M550,100c-100,0-150,100-150,200s100,250,200,250s150-100,150-200S650,100,550,100z'/%3E%3Cpath d='M850,80c-100,0-150,100-150,250s100,200,150,200s150-50,150-200S950,80,850,80z'/%3E%3C/g%3E%3C/svg%3E")`, // I'll use a data URL for a simplified but REAL world map here.
                      }}
                    />
                    
                    {/* Realistic World Mask (Data URL) */}
                    <div className="absolute inset-0" 
                      style={{
                        backgroundImage: `radial-gradient(circle, #8b5cf6 1.8px, transparent 1.8px)`,
                        backgroundSize: '10px 10px',
                        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath fill='white' d='M225,115c-15-5-25-10-35-10s-20,10-15,30s20,40,10,70s-20,50-40,65s-30,40-20,60s40,30,80,10s70-30,80-60s-10-60-25-85 S240,120,225,115z M315,300c-25,10-40,30-40,60s20,80,50,100s60,30,80,10s30-50,10-100S340,290,315,300z M550,120c-30-10-60,10-70,40 s0,70,30,90s70,20,90-10s20-60-10-90S580,130,550,120z M620,250c-30,10-50,40-40,80s40,90,80,100s90,0,100-40s-20-90-60-110 S650,240,620,250z M880,120c-40-10-80,10-90,60s20,110,70,140s100,20,120-30s10-100-30-140S920,130,880,120z M900,380 c-20,0-40,20-40,50s20,60,50,60s60-20,60-50S920,380,900,380z'/%3E%3C/svg%3E")`,
                        WebkitMaskSize: '100% 100%',
                        WebkitMaskRepeat: 'repeat-x',
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Spherical Shading (The real 3D depth) */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.95)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/5 pointer-events-none opacity-80" />
            <div className="absolute inset-0 border border-white/10 rounded-full shadow-[0_0_30px_rgba(139,92,246,0.1)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none" />
          </div>

          {/* Exterior Atmosphere Rings */}
          <div className="absolute inset-[-40px] border border-violet-500/5 rounded-full pointer-events-none animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-[-80px] border border-white/[0.02] rounded-full pointer-events-none animate-[spin_60s_linear_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-violet-600/[0.03] rounded-full blur-[80px] pointer-events-none" />
        </div>

        {/* Stats Overlay Bar */}
        <div className="mt-20 flex flex-wrap justify-between items-center max-w-4xl mx-auto border-t border-white/5 pt-12">
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] mb-3">Países Ativos</p>
            <span className="text-4xl font-bold text-white tracking-tighter">12+</span>
          </div>
          <div className="h-12 w-px bg-white/5"></div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] mb-3">Uptime Global</p>
            <span className="text-4xl font-bold text-white tracking-tighter">99.9%</span>
          </div>
          <div className="h-12 w-px bg-white/5"></div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] mb-3">Moedas Aceitas</p>
            <span className="text-4xl font-bold text-white tracking-tighter">50+</span>
          </div>
        </div>

        {/* Bottom Credits / Tech feel */}
        <div className="mt-16 flex justify-center gap-8 opacity-20">
           <div className="flex items-center gap-2">
             <Orbit className="w-3 h-3 text-white" />
             <span className="text-[9px] font-bold text-white uppercase tracking-widest">Multi-Cloud Infrastructure</span>
           </div>
           <div className="flex items-center gap-2">
             <Globe className="w-3 h-3 text-white" />
             <span className="text-[9px] font-bold text-white uppercase tracking-widest">Global Edge CDN</span>
           </div>
        </div>
      </div>
    </section>
  );
}
