import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  LogOut, Plus, FileText, FolderOpen, Loader2, Search, 
  Bell, Moon, Zap, Wallet, Truck, Clock, MoreHorizontal,
  TrendingUp, ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, 
  Cell, PieChart, Pie
} from "recharts";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  in_progress: "Em andamento",
  completed: "Concluído",
  paused: "Pausado",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  approved: "bg-premium-green/10 text-premium-green",
  rejected: "bg-red-500/10 text-red-500",
  in_progress: "bg-blue-500/10 text-blue-500",
  completed: "bg-premium-green/10 text-premium-green",
  paused: "bg-premium-text-muted text-premium-text-muted",
};

const revenueData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 1200 },
  { name: "Mar", value: 900 },
  { name: "Apr", value: 1500 },
  { name: "May", value: 2100 },
  { name: "Jun", value: 1800 },
  { name: "Jul", value: 2400 },
  { name: "Aug", value: 2000 },
  { name: "Sep", value: 2800 },
  { name: "Oct", value: 3200 },
  { name: "Nov", value: 3000 },
  { name: "Dec", value: 3800 },
];

const carriersData = [
  { name: "Trucks", value: 57, color: "#682EC7" },
  { name: "Cargo Vans", value: 18, color: "#7DE260" },
  { name: "Others", value: 25, color: "#282939" },
];

const StatCard = ({ title, value, subtext, icon: Icon, variant = "ghost" }: any) => (
  <Card className={`overflow-hidden border-white/5 ${
    variant === "premium" 
      ? "bg-gradient-to-br from-premium-purple to-premium-purple/80 text-white" 
      : "bg-premium-card text-white"
  }`}>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Icon className={`w-5 h-5 ${variant === "premium" ? "text-white" : "text-premium-purple"}`} />
          </div>
          <div className="pt-2">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            <p className={`text-xs font-medium uppercase tracking-wider ${
              variant === "premium" ? "text-white/70" : "text-premium-text-muted"
            }`}>
              {title}
            </p>
          </div>
        </div>
        {variant !== "premium" && (
           <div className="p-1 rounded-md hover:bg-white/5 cursor-pointer">
              <MoreHorizontal className="w-4 h-4 text-premium-text-muted" />
           </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newQuoteOpen, setNewQuoteOpen] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const { data: quotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createQuote = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("quotes").insert({
        user_id: user!.id,
        service_type: serviceType,
        description,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast({ title: "Orçamento solicitado!" });
      setNewQuoteOpen(false);
      setServiceType("");
      setDescription("");
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      {/* Header Area */}
      <header className="flex items-center justify-between p-6 px-8 bg-transparent sticky top-0 z-30 backdrop-blur-sm border-b border-white/5">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-xs text-premium-text-muted">Dados e insights da plataforma</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-text-muted" />
            <Input 
              className="bg-premium-card border-white/5 pl-10 w-64 text-sm rounded-xl focus-visible:ring-premium-purple" 
              placeholder="Pesquisar..." 
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-premium-text-muted px-1.5 py-0.5 border border-white/10 rounded">F</span>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center bg-premium-card p-1 rounded-xl border border-white/5">
               <button className="p-2 bg-transparent text-premium-text-muted hover:text-white transition-colors">
                 <Zap className="w-4 h-4" />
               </button>
               <button className="p-2 bg-premium-purple/20 text-premium-purple rounded-lg">
                 <Moon className="w-4 h-4" />
               </button>
             </div>
             
             <button className="p-2.5 bg-premium-card border border-white/5 rounded-xl relative hover:bg-white/5 transition-colors">
               <Bell className="w-4 h-4 text-premium-text-muted" />
               <span className="absolute top-2 right-2 w-4 h-4 bg-[#FF4444] text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-[#0A0A0A]">2</span>
             </button>

             <div className="flex items-center gap-3 pl-3 border-l border-white/10 ml-3">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold">{fullName}</span>
                  <span className="text-[10px] text-premium-text-muted uppercase tracking-wider">Membro</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-premium-purple/20 text-premium-purple flex items-center justify-center font-bold text-sm border border-premium-purple/20">
                  {initials}
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 pt-4 space-y-8">
        
        {/* Welcome Section */}
        <section className="relative overflow-hidden p-8 rounded-3xl bg-premium-card border border-white/5 group">
           <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-premium-purple/10 to-transparent pointer-events-none" />
           <div className="relative z-10 space-y-4 max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight leading-tight">
                Seu Perfil está Atualmente no <span className="text-premium-purple">Plano Gratuito</span>
              </h2>
              <p className="text-premium-text-muted text-sm leading-relaxed">
                Adquira recursos exclusivos e impulsione seu negócio com nossos planos avançados. 
                Comece agora e veja a diferença.
              </p>
              <Button className="bg-premium-purple hover:bg-premium-purple/90 font-bold px-8 rounded-xl shadow-lg shadow-premium-purple/20">
                Ver Planos
              </Button>
           </div>
           
           {/* Abstract Background Elements */}
           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-premium-purple/5 rounded-full blur-3xl pointer-events-none group-hover:bg-premium-purple/10 transition-all duration-700" />
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard 
              title="Total de Pedidos" 
              value={quotes.length + projects.length} 
              icon={FileText} 
              variant="premium" 
           />
           <StatCard 
              title="Total Investido" 
              value="R$ 8.126" 
              icon={Wallet} 
           />
           <StatCard 
              title="Entregas Ativas" 
              value="29" 
              icon={Truck} 
           />
           <StatCard 
              title="Horas em Produção" 
              value="89.011" 
              icon={Clock} 
           />
        </section>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Revenue Chart */}
           <Card className="lg:col-span-2 bg-premium-card border-white/5 rounded-3xl overflow-hidden">
              <div className="p-8 pb-0 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Faturamento Mensal</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-premium-purple" />
                    <span className="text-xs text-premium-text-muted">Este Ano</span>
                    <div className="w-2 h-2 rounded-full bg-premium-card-light ml-2" />
                    <span className="text-xs text-premium-text-muted">Ano Anterior</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">
                   <TrendingUp className="w-4 h-4 text-premium-green" />
                   <span className="text-premium-green">+12.5%</span>
                </div>
              </div>
              <div className="h-[350px] w-full p-4 mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#682EC7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#682EC7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#74769A", fontSize: 10 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#74769A", fontSize: 10 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#191A30", 
                          borderColor: "#ffffff10", 
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "#fff"
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#682EC7" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Top Carriers / Projects Status */}
           <Card className="bg-premium-card border-white/5 rounded-3xl overflow-hidden p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Status Projetos</h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-premium-purple flex items-center gap-1 hover:opacity-80 transition-opacity">
                  Ver Todos <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-6">
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={carriersData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {carriersData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold tracking-tighter">100%</span>
                    <span className="text-[10px] text-premium-text-muted uppercase">Concluído</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {carriersData.map((item) => (
                  <div key={item.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-premium-text-muted font-medium">{item.name}</span>
                      <span className="font-bold">{item.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full rounded-full" 
                         style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                       />
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        </section>

        {/* Existing Logic Integration: Quotes Table */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-premium-purple" />
                  Últimos Orçamentos
                </h3>
                <Dialog open={newQuoteOpen} onOpenChange={setNewQuoteOpen}>
                  <DialogTrigger asChild>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-premium-purple flex items-center gap-1 hover:opacity-80 transition-opacity">
                      Novo <Plus className="h-3 w-3" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-premium-card border-white/10 text-white rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Solicitar Orçamento</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        createQuote.mutate();
                      }}
                      className="space-y-6 pt-4"
                    >
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest text-premium-text-muted font-bold">Tipo de Serviço</Label>
                        <Select value={serviceType} onValueChange={setServiceType} required>
                          <SelectTrigger className="bg-white/5 border-white/5 rounded-xl h-12">
                            <SelectValue placeholder="Selecione o serviço..." />
                          </SelectTrigger>
                          <SelectContent className="bg-premium-card border-white/10 text-white">
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="app">Aplicativo</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="sistema">Sistema Web</SelectItem>
                            <SelectItem value="consultoria">Consultoria</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest text-premium-text-muted font-bold">Descrição</Label>
                        <Textarea 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          placeholder="Descreva o que seu projeto precisa..." 
                          rows={4} 
                          className="bg-white/5 border-white/5 rounded-xl focus-visible:ring-premium-purple resize-none"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-premium-purple hover:bg-premium-purple/90 h-12 font-bold rounded-xl text-md transition-all duration-300" disabled={createQuote.isPending || !serviceType}>
                        {createQuote.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar Solicitação
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="bg-premium-card border-white/5 rounded-3xl overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Serviço</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Status</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {quotesLoading ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-premium-text-muted">
                               <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            </td>
                          </tr>
                        ) : quotes.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-premium-text-muted italic text-xs">
                               Nenhum orçamento solicitado.
                            </td>
                          </tr>
                        ) : (
                          quotes.slice(0, 5).map((q: any) => (
                            <tr key={q.id} className="group hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="capitalize font-bold text-sm tracking-tight">{q.service_type}</span>
                                  <span className="text-[10px] text-premium-text-muted uppercase">{new Date(q.created_at).toLocaleDateString("pt-BR")}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={`${statusColors[q.status] || "bg-white/5 text-white"} border-none rounded-lg px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wider`}>
                                  {statusLabels[q.status] || q.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <button className="p-2 rounded-lg hover:bg-white/5 text-premium-text-muted hover:text-white transition-all">
                                  <ArrowUpRight className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                    </tbody>
                  </table>
                </div>
              </Card>
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-premium-green" />
                  Projetos Ativos
                </h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-premium-text-muted flex items-center gap-1 hover:text-white transition-colors">
                  Ver Todos
                </button>
              </div>

              <Card className="bg-premium-card border-white/5 rounded-3xl overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Projeto</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Progresso</th>
                          <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-premium-text-muted">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {projectsLoading ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-premium-text-muted">
                               <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            </td>
                          </tr>
                        ) : projects.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-premium-text-muted italic text-xs">
                               Nenhum projeto em andamento.
                            </td>
                          </tr>
                        ) : (
                          projects.slice(0, 5).map((p: any) => (
                            <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm tracking-tight">{p.title}</span>
                                  <span className="text-[10px] text-premium-text-muted uppercase">Previsão: {p.end_date ? new Date(p.end_date).toLocaleDateString("pt-BR") : "---"}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1.5 min-w-[100px]">
                                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${p.status === 'completed' ? 'bg-premium-green' : 'bg-premium-purple'}`} 
                                        style={{ width: p.status === 'completed' ? '100%' : '45%' }} 
                                      />
                                   </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={`${statusColors[p.status] || "bg-white/5 text-white"} border-none rounded-lg px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wider`}>
                                  {statusLabels[p.status] || p.status}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        )}
                    </tbody>
                  </table>
                </div>
              </Card>
           </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
