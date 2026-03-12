import { motion } from "framer-motion";
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
    title: "Gestão Financeira",
    description: "Acompanhe suas vendas, assinaturas e faturamento em tempo real com gráficos intuitivos."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-purple-500" />,
    title: "Suporte ao Vivo",
    description: "Sistema de chat interno para comunicação direta e instantânea com seus clientes."
  },
  {
    icon: <Users className="w-6 h-6 text-orange-500" />,
    title: "CRM Integrado",
    description: "Gerencie seus leads e clientes de forma organizada em um pipeline de vendas moderno."
  }
];

export default function PlatformDemoSection() {
  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Zap className="w-3 h-3" />
            Ecossistema Vincere
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 font-display"
          >
            Sua operação em um <span className="text-gradient">único lugar.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400"
          >
            Nossa plataforma exclusiva foi desenhada para centralizar o que importa: suas vendas, seu atendimento e seus dados.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: CSS Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative lg:h-[500px] w-full"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-blue-500/20 rounded-[2rem] blur-3xl opacity-50" />
            
            {/* Dashboard Container */}
            <div className="relative h-full w-full bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col font-sans">
              {/* Fake Sidebar */}
              <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-white/5 bg-black/40 flex flex-col items-center py-4 gap-4">
                <div className="w-7 h-7 rounded bg-blue-500/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                </div>
                <div className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center transition-colors">
                  <Users className="w-4 h-4 text-gray-500" />
                </div>
                <div className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center transition-colors">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Fake Topbar */}
              <div className="h-12 border-b border-white/5 ml-12 px-4 flex items-center justify-between bg-black/20">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/40" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                  <div className="w-2 h-2 rounded-full bg-green-500/40" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-2 bg-white/5 rounded-full" />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600" />
                </div>
              </div>

              {/* Fake Content Area */}
              <div className="flex-1 ml-12 p-6 overflow-hidden">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Vendas Hoje</p>
                    <p className="text-xl font-bold text-white">R$ 12.450</p>
                    <div className="w-full h-1 bg-blue-500/20 rounded-full mt-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "70%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-blue-500 rounded-full" 
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Novos Leads</p>
                    <p className="text-xl font-bold text-white">48</p>
                    <div className="w-full h-1 bg-purple-500/20 rounded-full mt-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "45%" }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="h-full bg-purple-500 rounded-full" 
                      />
                    </div>
                  </div>
                </div>

                {/* Simulated CRM Pipeline */}
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-400 mb-2">Pipeline de Vendas</p>
                  {[
                    { name: "Nathan Silva", val: "R$ 2.500", status: "Propota" },
                    { name: "Escola Conecta", val: "R$ 15.000", status: "Em Negociação" },
                    { name: "Maria Oliveira", val: "R$ 900", status: "Novo Lead" }
                  ].map((lead, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + (i * 0.1) }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800" />
                        <span className="text-xs text-gray-300">{lead.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-blue-400 font-medium px-2 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20">{lead.status}</span>
                        <span className="text-xs font-bold text-white">{lead.val}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Interactive Chat Widget Preview */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-4 right-4 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] text-white font-medium">Suporte Vincere</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-white/5 rounded-full" />
                  <div className="w-2/3 h-2 bg-white/5 rounded-full" />
                  <div className="flex gap-1 mt-2">
                    <div className="flex-1 h-5 bg-blue-600 rounded-md flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">Responder</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full" />
          </motion.div>

          {/* Right Side: Features List */}
          <div className="space-y-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-5 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4"
            >
              <a href="#cta">
                <Button className="w-full md:w-auto h-12 px-8 text-base font-semibold group gap-2">
                  Começar agora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
