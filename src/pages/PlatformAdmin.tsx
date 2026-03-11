import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Users, DollarSign, TrendingUp, Crown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

type Org = {
  id: string;
  name: string;
  owner_email: string;
  plan: string;
  status: string;
  created_at: string;
};

export default function PlatformAdmin() {
  const { isAdmin } = useOrganization();

  // Only admins can see this page
  if (!isAdmin) return <Navigate to="/plataforma/dashboard" replace />;

  // Fetch all organizations
  const { data: orgs = [], isLoading: orgsLoading } = useQuery({
    queryKey: ['admin-orgs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[] as Org[];
    }
  });

  // Fetch all customers for global stats
  const { data: allCustomers = [] } = useQuery({
    queryKey: ['admin-all-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers' as any)
        .select('*');
      if (error) throw error;
      return data as any[];
    }
  });

  const totalRevenue = allCustomers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  const totalClients = allCustomers.length;
  const totalActive = allCustomers.filter(c => c.status === 'Cliente Ativo').length;
  const totalLeads = allCustomers.filter(c => c.status === 'Lead').length;

  // Group customers by org for per-org stats
  const orgStats = orgs.map(org => {
    const orgCustomers = allCustomers.filter(c => c.org_id === org.id);
    return {
      ...org,
      customerCount: orgCustomers.length,
      revenue: orgCustomers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
      activeCount: orgCustomers.filter(c => c.status === 'Cliente Ativo').length,
    };
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Crown className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
            <p className="text-sm text-[#888]">Visão geral de todas as empresas na plataforma Vincere.</p>
          </div>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Organizações", value: orgs.length, icon: Building2, color: "purple-400" },
          { label: "Total de Clientes", value: totalClients, icon: Users, color: "platform-green" },
          { label: "Clientes Ativos", value: totalActive, icon: TrendingUp, color: "blue-400" },
          { label: "Receita Global", value: formatCurrency(totalRevenue), icon: DollarSign, color: "platform-green" },
        ].map((met, i) => (
          <motion.div
            key={met.label}
            initial="hidden" animate="visible" variants={fadeUp} custom={i}
            className="p-5 rounded-2xl bg-[#111] border border-white/5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#888] font-medium">{met.label}</span>
              <div className={`w-8 h-8 rounded-lg bg-${met.color}/10 flex items-center justify-center`}>
                <met.icon className={`w-4 h-4 text-${met.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {typeof met.value === "number" ? met.value.toLocaleString("pt-BR") : met.value}
            </p>
            <p className="text-[10px] text-[#666] mt-1">dados em tempo real</p>
          </motion.div>
        ))}
      </div>

      {/* Leads overview */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={4}
        className="p-5 rounded-2xl bg-gradient-to-r from-platform-orange/5 to-transparent border border-platform-orange/10 mb-8 flex items-center justify-between"
      >
        <div>
          <p className="text-sm font-semibold text-white">📥 {totalLeads} Leads capturados</p>
          <p className="text-xs text-[#888] mt-1">Leads coletados pela Vi e formulários de todas as empresas</p>
        </div>
      </motion.div>

      {/* Organizations Table */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={5}
        className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden"
      >
        <div className="p-5 border-b border-white/5">
          <h3 className="text-base font-semibold text-white">Organizações Assinantes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Empresa</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Dono</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Plano</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Clientes</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Receita</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Criada em</th>
              </tr>
            </thead>
            <tbody>
              {orgsLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#888]">Carregando organizações...</td>
                </tr>
              ) : orgStats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#888]">
                    Nenhuma organização criada ainda. Elas aparecerão automaticamente quando alguém assinar pelo Stripe.
                  </td>
                </tr>
              ) : (
                orgStats.map((org, i) => (
                  <motion.tr
                    key={org.id}
                    initial="hidden" animate="visible" variants={fadeUp} custom={i}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-white font-medium">{org.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#888]">{org.owner_email}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-platform-green bg-platform-green/10 capitalize">
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white font-medium">{org.customerCount}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(org.revenue)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        org.status === 'active'
                          ? 'text-platform-green bg-platform-green/10'
                          : 'text-[#888] bg-white/5'
                      }`}>
                        {org.status === 'active' ? 'Ativa' : org.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#888] text-xs">
                      {new Date(org.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
