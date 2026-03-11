import { motion } from "framer-motion";
import { Copy, Edit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockCheckouts } from "@/data/platformMockData";
import { toast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  }),
};

export default function PlatformCheckouts() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Checkouts</h1>
          <p className="text-sm text-[#888] mt-1">Gerencie seus checkouts de pagamento.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Checkout</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Produto</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Conversão</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Vendas</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Status</th>
                <th className="text-left text-xs text-[#888] font-medium px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockCheckouts.map((ck, i) => (
                <motion.tr
                  key={ck.id}
                  initial="hidden" animate="visible" variants={fadeUp} custom={i}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5 text-white font-medium">{ck.name}</td>
                  <td className="px-5 py-3.5 text-[#ccc]">{ck.product}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-platform-green font-medium">{ck.conversion}%</span>
                  </td>
                  <td className="px-5 py-3.5 text-white">{ck.totalSales}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      ck.status === "ativo" ? "text-platform-green bg-platform-green/10" : "text-[#888] bg-white/5"
                    }`}>
                      {ck.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ck.link);
                          toast({ title: "Link copiado!" });
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
