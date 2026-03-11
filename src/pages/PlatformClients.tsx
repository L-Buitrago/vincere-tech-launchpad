import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { motion } from "framer-motion";
import { Search, Filter, X, MessageCircle, Eye, Trash2, Send, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, type Client } from "@/data/platformMockData";
import { toast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; cls: string; pulse?: boolean }> = {
  "Cliente Ativo": { label: "Ativo", cls: "text-platform-green bg-platform-green/10" },
  "Lead": { label: "Lead", cls: "text-platform-orange bg-platform-orange/10 animate-pulse", pulse: true },
  "Negociação": { label: "Negociação", cls: "text-platform-blue bg-platform-blue/10 animate-pulse", pulse: true },
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

export default function PlatformClients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { orgId, isAdmin } = useOrganization();
  const queryClient = useQueryClient();

  // New client modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStatus, setNewStatus] = useState("Lead");
  const [isAdding, setIsAdding] = useState(false);

  const addClient = async () => {
    if (!newName || !newEmail) {
      toast({ title: "Preencha nome e email", variant: "destructive" });
      return;
    }
    setIsAdding(true);
    const { error } = await supabase.from('customers' as any).insert({
      name: newName,
      email: newEmail,
      phone: newPhone || null,
      status: newStatus,
      org_id: orgId || null,
    });
    setIsAdding(false);
    if (error) {
      toast({ title: "Erro ao adicionar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "\u2705 Cliente adicionado!", description: `${newName} foi cadastrado.` });
      setNewName(""); setNewEmail(""); setNewPhone(""); setNewStatus("Lead");
      setShowAddModal(false);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-customers'] });
    }
  };

  const importCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) {
      toast({ title: "Arquivo vazio ou inválido", variant: "destructive" });
      return;
    }
    // Skip header row, parse each line
    const rows = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      return {
        name: cols[0] || 'Sem nome',
        email: cols[1] || `import_${Date.now()}@temp.csv`,
        phone: cols[2] || null,
        status: cols[3] || 'Lead',
        org_id: orgId || null,
      };
    });
    const { error } = await supabase.from('customers' as any).insert(rows);
    if (error) {
      toast({ title: "Erro no import", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `\u2705 ${rows.length} clientes importados!` });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-customers'] });
    }
    e.target.value = '';
  };

  const deleteClient = async (client: Customer) => {
    const confirmed = window.confirm(`Tem certeza que quer remover "${client.name}"?`);
    if (!confirmed) return;

    const { error } = await supabase
      .from('customers' as any)
      .delete()
      .eq('id', client.id);

    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Cliente removido", description: `${client.name} foi removido do CRM.` });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-customers'] });
      if (selected?.id === client.id) setSelected(null);
    }
  };

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['customers', orgId, isAdmin],
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

  const filtered = clients.filter((c) => {
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
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input type="file" accept=".csv" className="hidden" onChange={importCSV} />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-[#ccc] hover:bg-white/5 transition-colors">
              <Upload className="w-4 h-4" /> Importar CSV
            </div>
          </label>
          <Button
            className="bg-platform-green hover:bg-platform-green/90 text-black font-semibold gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" /> Novo Cliente
          </Button>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Novo Cliente</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#888] hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#888] mb-1 block">Nome *</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome do cliente" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#888] mb-1 block">Email *</label>
                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@cliente.com" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#888] mb-1 block">Telefone</label>
                <Input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="(11) 99999-9999" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-[#888] mb-1 block">Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm">
                  <option value="Lead">Lead</option>
                  <option value="Negociação">Negociação</option>
                  <option value="Cliente Ativo">Cliente Ativo</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <Button
                className="w-full bg-platform-green hover:bg-platform-green/90 text-black font-semibold"
                onClick={addClient}
                disabled={isAdding}
              >
                {isAdding ? "Salvando..." : "Salvar Cliente"}
              </Button>
            </div>
          </div>
        </div>
      )}

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
          {["todos", "Cliente Ativo", "Lead", "Negociação", "Cancelado"].map((s) => (
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#888]">Carregando clientes...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#888]">Nenhum cliente cadastrado no banco de dados.</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#888]">Nenhum cliente encontrado com estes filtros.</td>
                </tr>
              ) : (
                paginated.map((c) => {
                  const sc = statusConfig[c.status || 'Cliente Ativo'] || statusConfig['Cliente Ativo'];
                  return (
                    <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-medium text-[#ccc]">
                            {c.name.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#888]">{c.email}</td>
                      <td className="px-5 py-3.5 text-[#ccc]">{c.status}</td> {/* Assuming initial status is the same as current status for now */}
                      <td className="px-5 py-3.5 text-[#888] text-xs">
                        {new Date(c.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-3.5 text-white font-medium">{formatCurrency(c.total_spent || 0)}</td>
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
                          <button
                            onClick={() => deleteClient(c)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#888] hover:text-red-400 transition-colors"
                            title="Remover cliente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* Detail Panel */}
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
                  {selected.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{selected.name}</p>
                  <p className="text-sm text-[#888]">{selected.email}</p>
                  <p className="text-sm text-[#888]">{selected.phone || 'Sem telefone'}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#111] border border-white/5">
                    <p className="text-xs text-[#888] mb-1">Gasto Total</p>
                    <p className="text-sm text-white font-medium">{formatCurrency(selected.total_spent)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#111] border border-white/5">
                    <p className="text-xs text-[#888] mb-1">Status</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selected.status || 'Cliente Ativo']?.cls || ''}`}>
                      {statusConfig[selected.status || 'Cliente Ativo']?.label || selected.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {selected.phone && (
                  <Button
                    className="w-full bg-platform-green hover:bg-platform-green/90 text-black font-semibold gap-2"
                    onClick={() => {
                      const cleanPhone = selected.phone?.replace(/\D/g, '');
                      window.open(`https://wa.me/${cleanPhone}?text=Olá ${selected.name}, tudo bem?`, "_blank");
                      toast({ title: "WhatsApp aberto!" });
                    }}
                  >
                    <MessageCircle className="w-4 h-4" /> Enviar WhatsApp
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-white bg-transparent hover:bg-white/5 gap-2"
                  onClick={() => toast({ title: "Acesso reenviado!", description: `Email enviado para ${selected.email}` })}
                >
                  <Send className="w-4 h-4" /> Reenviar Acesso
                </Button>
              </div>

              {/* Timeline */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-white mb-4">Registro CRM</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-platform-green mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white">Criado como {selected.status}</p>
                      <p className="text-[10px] text-[#666]">{new Date(selected.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  {selected.last_order_date && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-platform-green mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs text-white">Última compra</p>
                        <p className="text-[10px] text-[#666]">{new Date(selected.last_order_date).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
    </div>
  );
}
