import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Users,
  Clock, UserPlus, CalendarIcon, Search, Bell, Sun, Moon
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const periods = ["Ontem", "Hoje", "Semana", "Mês", "Ano", "Todos"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

const statusConfig: Record<string, { label: string; cls: string }> = {
  "Cliente Ativo": { label: "Ativo", cls: "text-violet-400 bg-violet-500/10" },
  "Lead": { label: "Lead", cls: "text-platform-orange bg-platform-orange/10" },
  "Negociação": { label: "Negociação", cls: "text-blue-400 bg-blue-400/10" },
  "Cancelado": { label: "Cancelado", cls: "text-[#888] bg-white/5" },
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  total_spent: number;
  last_order_date: string | null;
  created_at: string;
};

export default function PlatformDashboard() {
  const [activePeriod, setActivePeriod] = useState("Todos");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const { orgId, isAdmin, org } = useOrganization();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const planName = useMemo(() => {
    if (isAdmin) return "Admin";
    if (!org?.plan) return "Starter";
    const mapped: Record<string, string> = {
      free: "Starter",
      pro: "Pro",
      enterprise: "Enterprise"
    };
    return mapped[org.plan.toLowerCase()] || org.plan;
  }, [org, isAdmin]);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setShowSuccess(true);
      toast({
        title: "🎉 Pagamento confirmado!",
        description: "Sua assinatura foi ativada com sucesso. Bem-vindo à Vincere!",
      });
      searchParams.delete('session_id');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['dashboard-customers', orgId, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('customers' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (!isAdmin && orgId) {
        query = query.eq('org_id', orgId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as any[] as Customer[];
    }
  });

  const totalClientes = customers.filter(c => c.status === 'Cliente Ativo').length;
  const totalLeads = customers.filter(c => c.status === 'Lead').length;
  const totalNegociacao = customers.filter(c => c.status === 'Negociação').length;
  const totalReceita = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);

  const metrics = [
    {
      label: "Clientes Ativos", value: totalClientes, change: 0,
      icon: Users, color: "violet", prefix: ""
    },
    {
      label: "Receita Total", value: formatCurrency(totalReceita), change: 0,
      icon: DollarSign, color: "violet", prefix: ""
    },
    {
      label: "Leads Capturados", value: totalLeads, change: 0,
      icon: UserPlus, color: "orange", prefix: "", sub: "pela Vi e formulários"
    },
    {
      label: "Em Negociação", value: totalNegociacao, change: 0,
      icon: Clock, color: "blue", prefix: ""
    },
  ];

  const chartData = (() => {
    const byDay: Record<string, number> = {};
    customers.forEach(c => {
      const day = new Date(c.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
      byDay[day] = (byDay[day] || 0) + (c.total_spent || 0);
    });
    return Object.entries(byDay)
      .map(([date, value]) => ({ date, value }))
      .slice(-11);
  })();
  const totalChart = chartData.reduce((s, d) => s + d.value, 0);

  const recentCustomers = customers.slice(0, 8);

  const getMetricColorClasses = (color: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      violet: { bg: "bg-violet-500/10", text: "text-violet-400" },
      orange: { bg: "bg-platform-orange/10", text: "text-platform-orange" },
      blue: { bg: "bg-blue-400/10", text: "text-blue-400" },
    };
    return map[color] || map.violet;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center gap-4"
        >
          <CheckCircle2 className="w-8 h-8 text-violet-400 shrink-0" />
          <div className="flex-1">
            <h3 className="text-white font-semibold">Pagamento Confirmado! 🎉</h3>
            <p className="text-sm text-[#aaa]">Sua assinatura foi ativada com sucesso. Aproveite todos os recursos da plataforma Vincere!</p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-[#888] hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/5 transition-colors">
            Fechar
          </button>
        </motion.div>
      )}

      <header className="flex items-center justify-between p-6 px-8 bg-transparent sticky top-0 z-30 backdrop-blur-sm border-b border-white/5 mx-[-2rem] mb-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">Dashboard</h1>
          <p className="text-sm text-[#888] mt-1">Visão geral do seu CRM e métricas reais.</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
            <Input
              className="bg-accent/50 border-border pl-10 w-64 text-sm rounded-xl focus-visible:ring-violet-500 text-foreground"
              placeholder="Pesquisar..."
            />
          </div>

          <div className="flex items-center gap-3">
             <button className="p-2.5 bg-accent/50 border border-border rounded-xl relative hover:bg-accent transition-colors">
               <Bell className="w-4 h-4 text-muted-foreground" />
               <span className="absolute top-2 right-2 w-4 h-4 bg-[#FF4444] text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-background text-white">2</span>
             </button>

             <div className="flex items-center gap-4 pl-3 border-l border-white/10 ml-3">
                {/* Theme Switcher */}
                <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2.5 bg-accent/50 border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <div className="flex flex-col items-end">
                   <span className="text-sm font-bold text-foreground leading-none">
                     {fullName}
                   </span>
                   <span className="text-[10px] text-[#888] mt-0.5">
                     {user?.email}
                   </span>
                   <Badge variant="outline" className="mt-1 h-5 text-[9px] uppercase tracking-widest font-bold border-violet-500/30 bg-violet-500/5 text-violet-400">
                     {planName}
                   </Badge>
                </div>
                <Avatar className="w-10 h-10 rounded-xl border border-white/10 shadow-xl">
                  <AvatarFallback className="bg-violet-500/20 text-violet-400 font-bold text-xs uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>
             </div>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-2 flex-wrap mb-8">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePeriod === p
                ? "bg-purple-500/10 text-violet-400"
                : "text-[#888] hover:text-white hover:bg-white/5"
            }`}
          >
            {p}
          </button>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="border-white/10 text-[#888] bg-transparent hover:bg-white/5 hover:text-white h-8 font-normal">
              <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
              {date ? format(date, "PPP", { locale: ptBR }) : <span>Calendário</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) setDate(d);
                setActivePeriod("");
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((met, i) => {
          const bgColors: Record<string, string> = {
            violet: "bg-violet-600",
            green: "bg-emerald-500",
            orange: "bg-amber-500",
            blue: "bg-sky-500",
          };
          const bgColor = bgColors[met.color] || "bg-[#111]";
          
          return (
            <motion.div
              key={met.label}
              initial="hidden" animate="visible" variants={fadeUp} custom={i}
              whileHover={{ y: -4 }}
              className={`p-6 rounded-2xl ${bgColor} text-white shadow-xl border-none relative overflow-hidden group transition-all duration-300`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-white/70 font-bold uppercase tracking-widest">{met.label}</span>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                    <met.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  {met.prefix}{typeof met.value === "number" ? met.value.toLocaleString("pt-BR") : met.value}
                </p>
                <div className="flex items-center gap-2">
                  {met.change !== 0 ? (
                    <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                      {met.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {met.change > 0 ? "+" : ""}{met.change}%
                    </span>
                  ) : (
                    <span className="text-xs text-white/50">sem alterações</span>
                  )}
                  <span className="text-[10px] text-white/40 font-medium">dados em tempo real</span>
                </div>
              </div>
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={4}
        className="p-6 rounded-2xl bg-card border border-border mb-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Faturamento — Por dia de registro</h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">{formatCurrency(totalChart)}</span>
            </div>
          </div>
        </div>
        <div className="h-[300px] sm:h-[350px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="chartPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" stroke="#444" tick={{ fill: "#666", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#444"
                  tick={{ fill: "#666", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#fff",
                    fontSize: 13,
                  }}
                  formatter={(v: number) => [formatCurrency(v), "Receita"]}
                  labelStyle={{ color: "#888" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fill="url(#chartPurple)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[#888] text-sm">
              Nenhum dado de faturamento ainda. Os gráficos aparecerão quando houver clientes com valores registrados.
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={5}
        className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm"
      >
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Últimos registros no CRM</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Cliente</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Email</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Telefone</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Gasto</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[#888]">Carregando dados do CRM...</td>
                </tr>
              ) : recentCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[#888]">Nenhum cliente cadastrado ainda. Os dados aparecerão quando a Vi capturar leads ou alguém pagar pelo Stripe.</td>
                </tr>
              ) : (
                recentCustomers.map((c) => {
                  const sc = statusConfig[c.status] || statusConfig['Lead'];
                  return (
                    <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-medium text-[#ccc]">
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#888]">{c.email}</td>
                      <td className="px-5 py-3.5 text-[#888]">{c.phone || '—'}</td>
                      <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(c.total_spent || 0)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${sc.cls}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#888] text-xs">
                        {new Date(c.created_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
