import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Zap, Server, Shield, Activity, Sparkles, MapPin } from "lucide-react";

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
  active: boolean;
}

const nodes: Node[] = [
  { id: 1, x: 22, y: 32, label: "New York", active: true },
  { id: 2, x: 28, y: 72, label: "São Paulo", active: true },
  { id: 3, x: 48, y: 28, label: "London", active: true },
  { id: 4, x: 50, y: 55, label: "Johannesburg", active: true },
  { id: 5, x: 82, y: 25, label: "Tokyo", active: true },
  { id: 6, x: 88, y: 75, label: "Sydney", active: true },
  { id: 7, x: 72, y: 48, label: "Singapore", active: true },
  { id: 8, x: 12, y: 38, label: "Los Angeles", active: true },
];

export function GlobalMap() {
  const [activeConnections, setActiveConnections] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnections(prev => {
        const newConn = Math.floor(Math.random() * (nodes.length - 1)) + 1;
        if (prev.includes(newConn)) return prev.filter(id => id !== newConn);
        return [...prev.slice(-3), newConn];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[#0A0A0A] border-t border-white/5">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Dashboard Info */}
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-6"
            >
              <Activity className="w-3 h-3" />
              Global Infrastructure
            </motion.div>
            
            <h2 className="text-4xl font-bold mb-6 tracking-tight text-white leading-tight">
              Infraestrutura de <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">
                Classe Mundial.
              </span>
            </h2>
            
            <p className="text-[#888] text-lg mb-8 leading-relaxed">
              Nossa rede proprietária processa pagamentos e conteúdos através de nós estratégicos em todos os continentes, garantindo latência zero para seu negócio.
            </p>

            <div className="space-y-4">
              {[
                { icon: Shield, title: "Segurança Bancária", desc: "Criptografia de ponta a ponta em cada nó." },
                { icon: Server, title: "Uptime Garantido", desc: "99.9% de disponibilidade global." },
                { icon: Zap, title: "Edge Computing", desc: "Processamento instantâneo no local do cliente." }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-[#666] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Realistic Dashboard Visualization */}
          <div className="w-full lg:w-2/3">
            <div className="relative aspect-[16/10] bg-[#050505] rounded-3xl border border-white/5 overflow-hidden shadow-2xl shadow-purple-500/10">
              
              {/* Accurate World Map Background */}
              <div className="absolute inset-0 opacity-15 hover:opacity-20 transition-opacity duration-1000 p-8">
                <svg viewBox="0 0 1012 617" className="w-full h-full text-[#333] fill-current">
                   {/* Realistic Map Paths (High Fidelity 2D) */}
                   <path d="M512.674,502.797l3.526,2.403l1.046-0.052l8.757-3.008l0.994,3.206l-0.701,2.706l-1.893,1.503l-4.729-0.302l-6.769-4.158L512.674,502.797z" />
                   <path d="M528.466,468.135l0.753,3.008l8.522,0.752l0.596-6.172l1.644-0.897l0.448-2.257l-2.688,0.753l-2.99,4.521L528.466,468.135z" />
                   <path d="M545.85,435.383l1.374,10.771l3.423,0.752l0.32,1.937l-2.455,2.049l4.573,3.691l8.885-3.198l0.709-3.786l5.593-3.491l2.145-8.091l1.599-1.722l-1.659-2.887l5.412-3.347l-0.691-0.968l-2.498,0.155l-0.226,2.299l-3.354-0.033l-0.062-3.068l-1.079-1.288l-1.815,1.649l0.052,1.515l-2.739,1.036l-5.059-0.319l-6.568,6.881L545.85,435.383z" />
                   {/* Americas */}
                   <path d="M124.5,91 Q150,80 180,120 Q200,160 150,220 Q120,280 100,240 Z" />
                   <path d="M220,180 Q300,160 350,220 Q320,380 250,450 Q180,450 180,350 Z" />
                   {/* Africa / Europe */}
                   <path d="M480,180 Q620,160 650,280 Q620,420 540,460 Q480,420 450,300 Z" />
                   <path d="M480,100 Q550,60 620,100 Q600,160 520,170 Q480,150 480,100 Z" />
                   {/* Asia / Australia */}
                   <path d="M620,80 Q850,50 960,100 Q920,250 820,300 Q700,320 620,200 Z" />
                   <path d="M820,350 Q940,340 950,420 Q880,460 810,430 Z" />
                </svg>
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px]" />

              {/* Data Flow Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <AnimatePresence>
                  {activeConnections.map((nodeIdx) => {
                    const startNode = nodes[0]; // New York as hub
                    const endNode = nodes[nodeIdx];
                    return (
                      <motion.path
                        key={`conn-${nodeIdx}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        d={`M${startNode.x}% ${startNode.y}% Q${(startNode.x + endNode.x)/2}% ${(startNode.y + endNode.y)/2 - 10}% ${endNode.x}% ${endNode.y}%`}
                        stroke="url(#lineGrad)"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    );
                  })}
                </AnimatePresence>
              </svg>

              {/* Nodes */}
              {nodes.map((node) => (
                <div 
                  key={node.id} 
                  className="absolute"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="relative flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute w-6 h-6 rounded-full bg-violet-500"
                    />
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] relative z-10" />
                    
                    {/* Tooltip-like label */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-[8px] font-bold text-[#444] tracking-widest uppercase bg-black/50 px-2 py-0.5 rounded border border-white/5 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                        {node.label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* HUD Elements */}
              <div className="absolute top-6 left-6 flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#444] tracking-[0.2em] uppercase">Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#444] tracking-[0.2em] uppercase">Regional Lag</span>
                  <p className="text-xs font-bold text-violet-400">14ms AVG</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#444] tracking-[0.2em] uppercase">Encryption</span>
                  <p className="text-xs font-bold text-white">AES-256</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
