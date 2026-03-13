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
  { name: "Jan", thisYear: 400, lastYear: 240 },
  { name: "Feb", thisYear: 1200, lastYear: 1398 },
  { name: "Mar", thisYear: 900, lastYear: 9800 },
  { name: "Apr", thisYear: 1500, lastYear: 3908 },
  { name: "May", thisYear: 2100, lastYear: 4800 },
  { name: "Jun", thisYear: 1800, lastYear: 3800 },
  { name: "Jul", thisYear: 2400, lastYear: 4300 },
  { name: "Aug", thisYear: 2000, lastYear: 2400 },
  { name: "Sep", thisYear: 2800, lastYear: 2400 },
  { name: "Oct", thisYear: 3200, lastYear: 2400 },
  { name: "Nov", thisYear: 3000, lastYear: 2400 },
  { name: "Dec", thisYear: 3800, lastYear: 2400 },
];

const carriersData = [
  { name: "Trucks", value: 57, color: "#682EC7" },
  { name: "Cargo Vans", value: 18, color: "#7DE260" },
  { name: "Last Mile", value: 15, color: "#FF9F0A" },
  { name: "Others", value: 10, color: "#31335A" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-premium-purple px-4 py-2 rounded-2xl shadow-xl border border-white/20 relative">
        <p className="text-white font-bold text-sm whitespace-nowrap">
          ${payload[0].value.toLocaleString()} <span className="text-white/70 font-normal">per month</span>
        </p>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-premium-purple rotate-45 border-r border-b border-white/20" />
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, subtext, icon: Icon, variant = "ghost" }: any) => (
  <Card className={`overflow-hidden border-white/5 relative group transition-all duration-500 hover:translate-y-[-4px] ${
    variant === "premium" 
      ? "bg-[#1C1D3A]" 
      : "bg-premium-card text-white"
  }`}>
    {variant === "premium" && (
      <div className="absolute inset-0 bg-gradient-to-br from-premium-purple/40 to-transparent pointer-events-none" />
    )}
    <CardContent className="p-6 relative z-10">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
            variant === "premium" ? "bg-white/10" : "bg-[#252644]"
          }`}>
            <Icon className={`w-6 h-6 ${variant === "premium" ? "text-white" : "text-premium-purple"}`} />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            <p className="text-sm font-medium text-premium-text-muted">
              {title}
            </p>
          </div>
        </div>
        <div className="p-1 rounded-md hover:bg-white/5 cursor-pointer">
          <MoreHorizontal className="w-4 h-4 text-premium-text-muted" />
        </div>
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
          <h1 className="text-2xl font-bold tracking-tight font-display">Analytics</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-text-muted" />
            <Input 
              className="bg-[#15162D] border-white/5 pl-10 w-64 text-sm rounded-xl focus-visible:ring-premium-purple" 
              placeholder="Pesquisar..." 
            />
          </div>

          <div className="flex items-center gap-3">
             <button className="p-2.5 bg-premium-card border border-white/5 rounded-xl relative hover:bg-white/5 transition-colors">
               <Bell className="w-4 h-4 text-premium-text-muted" />
               <span className="absolute top-2 right-2 w-4 h-4 bg-[#FF4444] text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-[#0A0A0A]">2</span>
             </button>

             <div className="flex items-center gap-3 pl-3 border-l border-white/10 ml-3">
                <div className="w-10 h-10 rounded-xl bg-premium-purple/20 text-premium-purple flex items-center justify-center font-bold text-sm border border-premium-purple/20">
                  {initials}
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 pt-4 space-y-8">
        
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard 
              title="Total amount of orders" 
              value="1174" 
              icon={FileText} 
              variant="premium" 
           />
           <StatCard 
              title="Total money paid" 
              value="$8,126,420" 
              icon={Wallet} 
           />
           <StatCard 
              title="Available courier" 
              value="29" 
              icon={Truck} 
           />
           <StatCard 
              title="Hours on the road" 
              value="89,011" 
              icon={Clock} 
           />
        </section>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Revenue Chart */}
           <Card className="lg:col-span-2 bg-premium-card border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 pb-0 flex items-center justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Monthly Revenue</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-premium-purple flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-premium-purple" />
                      </div>
                      <span className="text-xs font-bold text-white">Last Year</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full border-2 border-premium-card-light flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-premium-card-light" />
                      </div>
                      <span className="text-xs font-bold text-white">Previous Year</span>
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md hover:bg-white/5 cursor-pointer">
                  <MoreHorizontal className="w-5 h-5 text-premium-text-muted" />
                </div>
              </div>
              <div className="h-[400px] w-full p-4 mt-8 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#682EC7" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#682EC7" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="highlightBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#682EC7" stopOpacity={0.15}/>
                          <stop offset="100%" stopColor="#682EC7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                      
                      {/* Highlight Bar for May */}
                      <Area 
                        type="step"
                        dataKey={(d) => d.name === "May" ? 10000 : 0}
                        stroke="none"
                        fill="url(#highlightBar)"
                        isAnimationActive={false}
                      />

                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={({ x, y, payload }) => (
                          <g transform={`translate(${x},${y})`}>
                            <text 
                              x={0} 
                              y={0} 
                              dy={16} 
                              textAnchor="middle" 
                              className={`text-[11px] font-bold ${payload.value === "May" ? "bg-premium-purple px-2 py-1 rounded fill-white" : "fill-[#74769A]"}`}
                            >
                              {payload.value}
                            </text>
                            {payload.value === "May" && (
                              <rect x={-15} y={6} width={30} height={18} rx={4} className="fill-premium-purple/20 -z-10" />
                            )}
                          </g>
                        )}
                        interval={0}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#74769A", fontSize: 10, fontWeight: "bold" }}
                        tickFormatter={(v) => `$${v.toLocaleString()}`}
                        domain={[0, 10000]}
                        ticks={[100, 1000, 2000, 5000, 10000]}
                      />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#682EC7', strokeWidth: 2, strokeDasharray: '5 5' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="thisYear" 
                        stroke="#682EC7" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorThisYear)" 
                        animationDuration={2000}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lastYear" 
                        stroke="#4B4E6D" 
                        strokeWidth={4}
                        fill="none"
                        animationDuration={2000}
                      />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Top Carriers / Projects Status */}
           <Card className="bg-premium-card border-white/5 rounded-3xl overflow-hidden p-8 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-bold">Top Carriers</h3>
                <button className="bg-[#252644] px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-2 hover:bg-[#2e2f56] transition-colors">
                  See All <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-6 relative">
                <div className="relative w-56 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={carriersData}
                        innerRadius={75}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={10}
                      >
                        {carriersData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold tracking-tighter text-white">100%</span>
                    <span className="text-xs text-premium-text-muted font-bold uppercase tracking-widest mt-1">Total</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                {carriersData.map((item) => (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold px-1">
                      <span className="text-[#9CA3AF]">{item.name}</span>
                      <span className="text-white">{item.value}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#1F203D] rounded-full overflow-hidden p-0.5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.value}%` }}
                         transition={{ duration: 1.5, ease: "easeOut" }}
                         className="h-full rounded-full" 
                         style={{ backgroundColor: item.color }} 
                       />
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        </section>

        {/* List Areas */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-8">
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

              <Card className="bg-premium-card border-white/5 rounded-3xl overflow-hidden p-0 shadow-xl">
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

              <Card className="bg-premium-card border-white/5 rounded-3xl overflow-hidden p-0 shadow-xl">
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
                                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: p.status === 'completed' ? '100%' : '45%' }}
                                        transition={{ duration: 1, ease: "easeInOut" }}
                                        className={`h-full rounded-full ${p.status === 'completed' ? 'bg-premium-green' : 'bg-premium-purple'}`} 
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
