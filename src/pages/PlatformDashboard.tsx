import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Clock, XCircle, CalendarIcon
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/data/platformMockData";

// Temporary mock data for charts/metrics until we build aggregations
import { dashboardMetrics, revenueChartData } from "@/data/platformMockData";
const periods = ["Ontem", "Hoje", "Semana", "Mês", "Ano", "Todos"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

const statusColors: Record<string, string> = {
  aprovado: "text-platform-green bg-platform-green/10",
  pendente: "text-platform-orange bg-platform-orange/10",
  recusado: "text-platform-red bg-platform-red/10",
  estornado: "text-[#888] bg-white/5",
};

export default function PlatformDashboard() {
  const [activePeriod, setActivePeriod] = useState("Semana");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const m = dashboardMetrics;
  const totalChart = revenueChartData.reduce((s, d) => s + d.value, 0);

  const metrics = [
    {
      label: "Total de Vendas", value: m.totalSales.value, change: m.totalSales.change,
      icon: ShoppingCart, color: "platform-green", prefix: ""
    },
    {
      label: "Receita Total", value: formatCurrency(m.totalRevenue.value), change: m.totalRevenue.change,
      icon: DollarSign, color: "platform-green", prefix: ""
    },
    {
      label: "Vendas Pendentes", value: m.pending.value, change: m.pending.change,
      icon: Clock, color: "platform-orange", prefix: "", sub: "aguardando pagamento"
    },
    {
      label: "Vendas Falhadas", value: m.failed.value, change: m.failed.change,
      icon: XCircle, color: "platform-red", prefix: ""
    },
  ];

  // Fetch recent transactions
  const { data: recentTransactions = [], isLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data as any[];
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#888] mt-1">Visão geral das suas vendas e métricas.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activePeriod === p
                  ? "bg-white/10 text-white"
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
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((met, i) => (
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
            <p className="text-2xl font-bold text-white mb-1">
              {typeof met.value === "number" ? met.value.toLocaleString("pt-BR") : met.value}
            </p>
            <div className="flex items-center gap-2">
              {met.change !== 0 ? (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${
                  met.change > 0 ? "text-platform-green" : "text-platform-red"
                }`}>
                  {met.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {met.change > 0 ? "+" : ""}{met.change}%
                </span>
              ) : (
                <span className="text-xs text-[#888]">—</span>
              )}
              {met.sub && <span className="text-[10px] text-[#666]">{met.sub}</span>}
              {!met.sub && <span className="text-[10px] text-[#666]">vs período anterior</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={4}
        className="p-6 rounded-2xl bg-[#111] border border-white/5 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-[#888] mb-1">Vendas — Receita no período selecionado</h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-white">{formatCurrency(totalChart)}</span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-platform-green/10 text-platform-green text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                +206.6%
              </span>
            </div>
          </div>
        </div>
        <div className="h-[300px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="chartGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C37F" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00C37F" stopOpacity={0} />
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
                stroke="#00C37F"
                strokeWidth={2}
                fill="url(#chartGreen)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUp} custom={5}
        className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden"
      >
        <div className="p-5 border-b border-white/5">
          <h3 className="text-base font-semibold text-white">Transações recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">ID</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Cliente</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Produto</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Valor</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Gateway</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#888]">Carregando transações...</td>
                </tr>
              ) : recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#888]">Nenhuma transação encontrada no banco de dados.</td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-[#888] font-mono text-xs">{tx.id.substring(0, 8)}...</td>
                    <td className="px-5 py-3.5 text-white">{tx.client_name}</td>
                    <td className="px-5 py-3.5 text-[#ccc]">{tx.product}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(tx.amount || 0)}</td>
                    <td className="px-5 py-3.5 text-[#888]">{tx.gateway}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[tx.status || '']} || 'text-[#888] bg-white/5'`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#888] text-xs">
                      {new Date(tx.date).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
