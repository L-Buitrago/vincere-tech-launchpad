import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, MessageCircle, Eye, Ban, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockClients, formatCurrency, type Client } from "@/data/platformMockData";
import { toast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; cls: string; pulse?: boolean }> = {
  ativo: { label: "Ativo", cls: "text-platform-green bg-platform-green/10" },
  pendente: { label: "Pendente", cls: "text-platform-orange bg-platform-orange/10 animate-pulse" , pulse: true },
  vencido: { label: "Vencido", cls: "text-platform-red bg-platform-red/10 animate-pulse", pulse: true },
  cancelado: { label: "Cancelado", cls: "text-[#888] bg-white/5" },
};

export default function PlatformClients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selected, setSelected] = useState<Client | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = mockClients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-sm text-[#888] mt-1">{filtered.length} clientes encontrados</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#111] border-white/10 text-white placeholder:text-[#666] h-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {["todos", "ativo", "pendente", "vencido", "cancelado"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s ? "bg-white/10 text-white" : "text-[#888] hover:text-white hover:bg-white/5"
              }`}
            >
              {s === "todos" ? "Todos" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Cliente</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Email</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Produto</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Data</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Valor</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => {
                const sc = statusConfig[c.status];
                return (
                  <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-medium text-[#ccc]">
                          {c.avatar}
                        </div>
                        <span className="text-white font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#888]">{c.email}</td>
                    <td className="px-5 py-3.5 text-[#ccc]">{c.product}</td>
                    <td className="px-5 py-3.5 text-[#888] text-xs">{new Date(c.purchaseDate).toLocaleDateString("pt-BR")}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(c.amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(c)} className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast({ title: "Mensagem enviada!", description: `WhatsApp enviado para ${c.name}` })}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-platform-red transition-colors">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-[#0A0A0A] border-l border-white/5 p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-white">Detalhes do Cliente</h2>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/5 text-[#888]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-lg font-bold text-[#ccc]">
                  {selected.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{selected.name}</p>
                  <p className="text-sm text-[#888]">{selected.email}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl bg-[#111] border border-white/5">
                  <p className="text-xs text-[#888] mb-1">Produto</p>
                  <p className="text-sm text-white font-medium">{selected.product}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#111] border border-white/5">
                    <p className="text-xs text-[#888] mb-1">Valor</p>
                    <p className="text-sm text-white font-medium">{formatCurrency(selected.amount)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#111] border border-white/5">
                    <p className="text-xs text-[#888] mb-1">Status</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selected.status].cls}`}>
                      {statusConfig[selected.status].label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-platform-green hover:bg-platform-green/90 text-black font-semibold gap-2"
                  onClick={() => {
                    window.open(`https://wa.me/${selected.phone}?text=Olá ${selected.name}, identificamos uma pendência...`, "_blank");
                    toast({ title: "WhatsApp aberto!" });
                  }}
                >
                  <MessageCircle className="w-4 h-4" /> Enviar cobrança no WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-white bg-transparent hover:bg-white/5 gap-2"
                  onClick={() => toast({ title: "Acesso reenviado!", description: `Email enviado para ${selected.email}` })}
                >
                  <Send className="w-4 h-4" /> Reenviar acesso
                </Button>
              </div>

              {/* Timeline */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-white mb-4">Atividade recente</h3>
                <div className="space-y-4">
                  {[
                    { date: selected.purchaseDate, text: `Comprou ${selected.product}` },
                    { date: selected.purchaseDate, text: "Acesso liberado automaticamente" },
                    { date: "2026-03-10", text: "Acessou a plataforma" },
                  ].map((ev, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-platform-green mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white">{ev.text}</p>
                        <p className="text-[10px] text-[#666]">{new Date(ev.date).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
