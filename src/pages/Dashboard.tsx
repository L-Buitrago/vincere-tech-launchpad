import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { LogOut, Plus, FileText, FolderOpen, Loader2 } from "lucide-react";
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
  approved: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
  in_progress: "bg-blue-500/10 text-blue-500",
  completed: "bg-green-500/10 text-green-500",
  paused: "bg-muted text-muted-foreground",
};

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
          <a href="/" className="font-display text-xl font-bold tracking-tight text-foreground">
            Vincere<span className="text-primary">Tech</span>
          </a>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">{fullName}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto py-8 px-4 md:px-8">
        <h1 className="text-3xl font-display font-bold mb-6">Meu Painel</h1>

        <Tabs defaultValue="quotes">
          <TabsList>
            <TabsTrigger value="quotes" className="gap-2">
              <FileText className="h-4 w-4" /> Orçamentos
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderOpen className="h-4 w-4" /> Projetos
            </TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Seus Orçamentos</h2>
              <Dialog open={newQuoteOpen} onOpenChange={setNewQuoteOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Novo Orçamento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solicitar Orçamento</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createQuote.mutate();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label>Tipo de Serviço</Label>
                      <Select value={serviceType} onValueChange={setServiceType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Label>Descrição</Label>
                      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o que você precisa..." rows={4} />
                    </div>
                    <Button type="submit" className="w-full" disabled={createQuote.isPending || !serviceType}>
                      {createQuote.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Solicitar
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {quotesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : quotes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhum orçamento ainda. Clique em "Novo Orçamento" para começar.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {quotes.map((q: any) => (
                  <Card key={q.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg capitalize">{q.service_type}</CardTitle>
                        <Badge className={statusColors[q.status] || ""} variant="secondary">
                          {statusLabels[q.status] || q.status}
                        </Badge>
                      </div>
                      <CardDescription>{new Date(q.created_at).toLocaleDateString("pt-BR")}</CardDescription>
                    </CardHeader>
                    {q.description && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{q.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Seus Projetos</h2>
            {projectsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhum projeto em andamento.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projects.map((p: any) => (
                  <Card key={p.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{p.title}</CardTitle>
                        <Badge className={statusColors[p.status] || ""} variant="secondary">
                          {statusLabels[p.status] || p.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {p.start_date && `Início: ${new Date(p.start_date).toLocaleDateString("pt-BR")}`}
                        {p.end_date && ` • Previsão: ${new Date(p.end_date).toLocaleDateString("pt-BR")}`}
                      </CardDescription>
                    </CardHeader>
                    {p.description && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{p.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
