import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, CreditCard, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function PlatformSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");

  const tabs = [
    { id: "perfil", label: "Perfil", icon: User },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "seguranca", label: "Segurança", icon: Shield },
    { id: "pagamento", label: "Pagamento", icon: CreditCard },
    { id: "aparencia", label: "Aparência", icon: Palette },
  ];

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-6 h-6 text-[#888]" />
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:w-48 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-[#888] hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 bg-[#111] border border-white/5 rounded-2xl p-6">
            {activeTab === "perfil" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white mb-4">Informações do Perfil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#888] block mb-1.5">Nome completo</label>
                    <input defaultValue={user?.user_metadata?.full_name || ""} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-platform-green/30" />
                  </div>
                  <div>
                    <label className="text-xs text-[#888] block mb-1.5">Email</label>
                    <input defaultValue={user?.email || ""} disabled className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#666] cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-xs text-[#888] block mb-1.5">Telefone</label>
                    <input placeholder="(11) 99999-9999" className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-platform-green/30" />
                  </div>
                  <div>
                    <label className="text-xs text-[#888] block mb-1.5">Empresa</label>
                    <input placeholder="Nome da empresa" className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-platform-green/30" />
                  </div>
                </div>
                <Button onClick={handleSave} className="bg-platform-green hover:bg-platform-green/90 text-black font-semibold gap-2">
                  <Save className="w-4 h-4" /> Salvar alterações
                </Button>
              </div>
            )}

            {activeTab === "notificacoes" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white mb-4">Preferências de Notificação</h2>
                {["Novas vendas", "Pagamentos pendentes", "Atualizações do sistema", "Resumo semanal por email"].map((item) => (
                  <div key={item} className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-sm text-[#ccc]">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-platform-green" />
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "seguranca" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white mb-4">Segurança</h2>
                <div>
                  <label className="text-xs text-[#888] block mb-1.5">Senha atual</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-platform-green/30" />
                </div>
                <div>
                  <label className="text-xs text-[#888] block mb-1.5">Nova senha</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-platform-green/30" />
                </div>
                <Button onClick={handleSave} className="bg-platform-green hover:bg-platform-green/90 text-black font-semibold gap-2">
                  <Save className="w-4 h-4" /> Atualizar senha
                </Button>
              </div>
            )}

            {activeTab === "pagamento" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white mb-4">Método de Pagamento</h2>
                <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-platform-green" />
                    <div>
                      <p className="text-sm text-white">•••• •••• •••• 4242</p>
                      <p className="text-xs text-[#666]">Expira em 12/2028</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-transparent">
                  Atualizar cartão
                </Button>
              </div>
            )}

            {activeTab === "aparencia" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white mb-4">Aparência</h2>
                <p className="text-sm text-[#888]">Tema atual: <span className="text-white font-medium">Dark Mode</span></p>
                <p className="text-xs text-[#666]">Mais opções de tema em breve.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
