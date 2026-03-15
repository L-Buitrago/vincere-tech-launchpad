import { motion } from "framer-motion";
import { Globe, Users, Orbit } from "lucide-react";

const locations = [
  { id: 1, x: "25%", y: "45%", name: "Estados Unidos", label: "USA" },
  { id: 2, x: "32%", y: "75%", name: "Brasil", label: "BR", pulse: true },
  { id: 3, x: "50%", y: "38%", name: "Europa", label: "EU" },
  { id: 4, x: "55%", y: "55%", name: "Nigéria", label: "NG" },
  { id: 5, x: "75%", y: "45%", name: "China", label: "CN" },
  { id: 6, x: "85%", y: "75%", name: "Austrália", label: "AU" },
];

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
            <Globe className="w-3 h-3" />
            Escalabilidade Global
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            A Vincere não tem fronteiras.
          </h2>
          <p className="text-[#888] text-lg max-w-2xl mx-auto">
            Processamos vendas e automatizamos operações para centenas de negócios em todo o mundo. 
            Sua empresa pronta para o mercado internacional.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto rounded-3xl border border-white/5 bg-[#0D0D0D]/50 backdrop-blur-sm overflow-hidden group">
          
          {/* Dot Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* World Map SVG (Simplified path or just the overlay) */}
          <svg className="absolute inset-0 w-full h-full text-white/5" viewBox="0 0 1000 500" fill="currentColor">
            {/* World Map Mask/Path would go here. For a "premium" feel, we use the points as the map */}
          </svg>

          {/* Location Markers */}
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="absolute"
              style={{ left: loc.x, top: loc.y }}
            >
              <div className="relative">
                {/* Pulse Effect */}
                <motion.div
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute -inset-4 rounded-full ${loc.pulse ? 'bg-violet-500/40' : 'bg-white/20'}`}
                />
                
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className={`w-2.5 h-2.5 rounded-full relative z-10 ${loc.pulse ? 'bg-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.6)]' : 'bg-white/40'}`}
                />

                {/* Tooltip / Label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-[#1a1a1a] border border-white/10 px-2 py-1 rounded-md whitespace-nowrap">
                    <span className="text-[10px] font-bold text-white uppercase">{loc.label}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Stats Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-between items-end gap-6 z-20">
            <div className="flex gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Países Ativos</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">12+</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Uptime Global</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">99.9%</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Users className="w-4 h-4 text-violet-400" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-white leading-none">Venda em qualquer moeda</p>
                <p className="text-[9px] text-[#666]">USD, EUR, BRL, GBP e mais</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Icons for Tech feel */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
           <div className="flex items-center gap-3 justify-center">
             <Orbit className="w-5 h-5 text-[#444]" />
             <span className="text-xs font-medium text-[#444]">Multi-Cloud</span>
           </div>
           <div className="flex items-center gap-3 justify-center">
             <Globe className="w-5 h-5 text-[#444]" />
             <span className="text-xs font-medium text-[#444]">CDN Global</span>
           </div>
           <div className="flex items-center gap-3 justify-center">
             <Users className="w-5 h-5 text-[#444]" />
             <span className="text-xs font-medium text-[#444]">SLA Internacional</span>
           </div>
           <div className="flex items-center gap-3 justify-center">
             <Zap className="w-5 h-5 text-[#444]" />
             <span className="text-xs font-medium text-[#444]">Sub-100ms Latency</span>
           </div>
        </div>
      </div>
    </section>
  );
}

const Zap = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
