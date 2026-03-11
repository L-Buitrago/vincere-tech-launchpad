import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Plus, Edit, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, type Product } from "@/data/platformMockData";
import { toast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

const typeColors: Record<string, string> = {
  Curso: "text-blue-400 bg-blue-400/10",
  Serviço: "text-purple-400 bg-purple-400/10",
  Assinatura: "text-platform-green bg-platform-green/10",
  "Produto físico": "text-platform-orange bg-platform-orange/10",
};

export default function PlatformProducts() {
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database snake_case to frontend camelCase
      return data.map(p => ({
        ...p,
        totalSales: p.total_sales
      })) as Product[];
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-sm text-[#888] mt-1">{products.length} produtos cadastrados</p>
        </div>
        <Button
          className="bg-platform-green hover:bg-platform-green/90 text-black font-semibold gap-2"
          onClick={() => toast({ title: "Em breve!", description: "Cadastro de produtos será implementado." })}
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-[#888]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#444]" />
          <p>Carregando produtos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-[#888] bg-[#111] rounded-2xl border border-white/5">
          <p>Nenhum produto cadastrado no banco de dados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial="hidden" animate="visible" variants={fadeUp} custom={i}
              className="p-5 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                  {p.image || "📦"}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeColors[p.type] || 'text-[#888] bg-white/5'}`}>
                  {p.type}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{p.name}</h3>
              <p className="text-lg font-bold text-white mb-1">{formatCurrency(p.price || 0)}</p>
              <p className="text-xs text-[#888] mb-5">{p.totalSales || 0} vendas realizadas</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-white/10 text-white bg-transparent hover:bg-white/5 gap-1.5 text-xs h-8">
                  <Edit className="w-3 h-3" /> Editar
                </Button>
                <Button variant="outline" size="sm" className="border-white/10 text-[#888] bg-transparent hover:bg-white/5 h-8 w-8 p-0">
                  <ExternalLink className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline" size="sm"
                  className="border-white/10 text-[#888] bg-transparent hover:bg-white/5 h-8 w-8 p-0"
                  onClick={() => toast({ title: "Produto duplicado!" })}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
