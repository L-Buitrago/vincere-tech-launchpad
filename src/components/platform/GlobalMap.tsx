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
          
          {/* Main Dot Grid (The landmass effect) */}
          <div className="absolute inset-0">
            <svg 
              className="w-full h-full opacity-30 text-white" 
              viewBox="0 0 1000 500" 
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="dotPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                </pattern>
                <mask id="worldMask">
                  <path 
                    d="M174.4,124.7c-9.1-1.3-17.6-3.8-25.5-7.5c-7.9-3.7-14.8-8.5-20.7-14.4s-10.7-12.8-14.4-20.7c-3.7-7.9-6.2-16.4-7.5-25.5H89.4 c1.3,9.1,3.8,17.6,7.5,25.5c3.7,7.9,8.5,14.8,14.4,20.7s12.8,10.7,20.7,14.4c7.9,3.7,16.4,6.2,25.5,7.5V124.7z M367.5,145.4 c-42.3,0-81.5-16.1-111.3-45.2c-29.8-29.1-46.1-67.7-46.1-108.9h27.3c0,34.2,13.5,66.2,38.1,90.3c24.6,24.1,57.1,37.3,92.1,37.3 c35,0,67.5-13.3,92.1-37.3c24.6-24.1,38.1-56.1,38.1-90.3h27.3c0,41.2-16.3,79.8-46.1,108.9C449,129.3,409.8,145.4,367.5,145.4z" 
                    fill="white"
                  />
                  {/* Simplified World Path */}
                  <path 
                    fill="white"
                    d="M180,100 L250,90 L280,110 L320,105 L350,130 L380,110 L420,120 L450,110 L480,90 L550,80 L600,90 L650,100 L700,90 L750,110 L800,90 L850,110 L900,100 L950,90 L950,150 L900,180 L850,170 L800,200 L750,220 L700,210 L650,230 L600,220 L550,250 L500,240 L450,260 L400,240 L350,270 L300,250 L250,280 L200,260 L150,290 L100,270 L50,290 L20,250 L50,200 L100,180 L150,190 L180,150 Z"
                  />
                  {/* South America */}
                  <path fill="white" d="M250,280 L350,270 L340,350 L300,450 L270,450 L240,350 Z" />
                  {/* Africa */}
                  <path fill="white" d="M480,240 L600,220 L620,380 L550,450 L500,450 L480,350 Z" />
                  {/* Australia */}
                  <path fill="white" d="M800,350 L920,340 L930,420 L850,450 L800,430 Z" />
                  {/* North America Extension */}
                  <path fill="white" d="M50,100 L150,80 L250,100 L200,180 L100,200 L50,150 Z" />
                </mask>
              </defs>
              <rect x="0" y="0" width="1000" height="500" fill="url(#dotPattern)" mask="url(#worldMask)" />
            </svg>
          </div>

          {/* Dimmest background grid for context */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }}
          />

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
                  <div className="bg-[#1a1a1a] border border-white/10 px-2 py-1 rounded-md whitespace-nowrap shadow-2xl">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{loc.name}</span>
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
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl font-bold tracking-tighter">12+</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Uptime Global</p>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl font-bold tracking-tighter">99.9%</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <Users className="w-5 h-5 text-violet-400" />
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none mb-1">Pagamentos Internacionais</p>
                <p className="text-[10px] text-[#666]">USD, EUR, BRL, GBP e 50+ moedas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Icons for Tech feel */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
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
             <Zap className="w-4 h-4 text-[#444]" />
             <span className="text-[11px] font-bold text-[#444] uppercase tracking-widest">Latency &lt; 100ms</span>
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
