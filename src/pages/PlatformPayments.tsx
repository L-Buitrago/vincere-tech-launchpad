import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Eye, RefreshCw } from "lucide-react";
import { formatCurrency, type Transaction } from "@/data/platformMockData";

const statusColors: Record<string, string> = {
  aprovado: "text-platform-green bg-platform-green/10",
  pendente: "text-platform-orange bg-platform-orange/10",
  recusado: "text-platform-red bg-platform-red/10",
  estornado: "text-[#888] bg-white/5",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PlatformPayments() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map(t => ({
        ...t,
        clientName: t.client_name
      })) as Transaction[];
    }
  });

  const paginated = transactions.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(transactions.length / perPage);

  const totals = {
    aprovado: transactions.filter(t => t.status === "aprovado").reduce((s, t) => s + (t.amount || 0), 0),
    pendente: transactions.filter(t => t.status === "pendente").reduce((s, t) => s + (t.amount || 0), 0),
    estornado: transactions.filter(t => t.status === "estornado").reduce((s, t) => s + (t.amount || 0), 0),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Pagamentos</h1>
        <p className="text-sm text-[#888] mt-1">Todas as transações da sua conta.</p>
      </div>

      {/* Totals */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#111] border border-white/5">
          <p className="text-xs text-[#888] mb-1">Total Aprovado</p>
          <p className="text-xl font-bold text-platform-green">{formatCurrency(totals.aprovado)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111] border border-white/5">
          <p className="text-xs text-[#888] mb-1">Total Pendente</p>
          <p className="text-xl font-bold text-platform-orange">{formatCurrency(totals.pendente)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#111] border border-white/5">
          <p className="text-xs text-[#888] mb-1">Total Estornado</p>
          <p className="text-xl font-bold text-[#888]">{formatCurrency(totals.estornado)}</p>
        </div>
      </motion.div>

      {/* Table */}
      <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
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
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-[#888]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#444]" />
                    Carregando pagamentos...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-[#888]">
                    Nenhum pagamento encontrado no banco de dados.
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-[#888] font-mono text-xs">{tx.id.substring(0, 8)}...</td>
                    <td className="px-5 py-3.5 text-white">{tx.clientName}</td>
                    <td className="px-5 py-3.5 text-[#ccc]">{tx.product}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(tx.amount || 0)}</td>
                    <td className="px-5 py-3.5 text-[#888]">{tx.gateway}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[tx.status || ''] || 'text-[#888] bg-white/5'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#888] text-xs">
                      {new Date(tx.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-white/5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  page === i + 1 ? "bg-white/10 text-white" : "text-[#888] hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
