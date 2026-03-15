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
  { id: 1, x: 22, y: 35, label: "New York", active: true },
  { id: 2, x: 28, y: 65, label: "São Paulo", active: true },
  { id: 3, x: 48, y: 30, label: "London", active: true },
  { id: 4, x: 52, y: 38, label: "Lagos", active: true },
  { id: 5, x: 75, y: 35, label: "Tokyo", active: true },
  { id: 6, x: 82, y: 70, label: "Sydney", active: true },
  { id: 7, x: 65, y: 45, label: "Mumbai", active: true },
  { id: 8, x: 15, y: 40, label: "Los Angeles", active: true },
];

export function GlobalMap() {
  const [activeConnections, setActiveConnections] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnections(prev => {
        const newConn = Math.floor(Math.random() * nodes.length);
        if (prev.includes(newConn)) return prev.filter(id => id !== newConn);
        return [...prev.slice(-3), newConn];
      });
    }, 2000);
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

          {/* New Dashboard Visualization */}
          <div className="w-full lg:w-2/3">
            <div className="relative aspect-[16/10] bg-[#050505] rounded-3xl border border-white/5 overflow-hidden shadow-2xl shadow-purple-500/5">
              
              {/* Abstract World Map Background */}
              <div className="absolute inset-0 opacity-20 transition-opacity hover:opacity-30 duration-1000">
                <svg viewBox="0 0 1000 500" className="w-full h-full text-[#222] fill-current">
                   {/* Simplified Map Paths (Clean & Stylized) */}
                   <path d="M150,150 Q180,80 250,110 Q320,150 280,250 Q240,350 200,380 Q150,280 150,200 Z" />
                   <path d="M450,150 Q550,100 650,150 Q750,250 650,400 Q550,480 480,350 Z" />
                   <path d="M650,100 Q850,50 950,150 Q980,250 850,320 Q750,280 650,200 Z" />
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
