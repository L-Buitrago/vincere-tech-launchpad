import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CreditCard, Package, ShoppingCart, Store,
  TrendingUp, GitBranch, Settings, ShoppingBag, HelpCircle, Headset,
  LogOut, Menu, X, ChevronRight, Crown, Rocket
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NotificationBell from "./NotificationBell";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/plataforma/dashboard" },
  { label: "Pagamentos", icon: CreditCard, path: "/plataforma/pagamentos" },
  { label: "Produtos", icon: Package, path: "/plataforma/produtos" },
  { label: "Checkouts", icon: ShoppingCart, path: "/plataforma/checkouts" },
  { label: "Clientes", icon: Store, path: "/plataforma/clientes" },
  { label: "Upsell", icon: TrendingUp, path: "/plataforma/dashboard" },
  { label: "Funis", icon: GitBranch, path: "/plataforma/dashboard" },
];

const bottomItems = [
  { label: "Configurações", icon: Settings, path: "/plataforma/configuracoes" },
  { label: "Minhas Compras", icon: ShoppingBag, path: "/plataforma/compras" },
  { label: "Suporte", icon: Headset, path: "/plataforma/suporte" },
];

export default function PlatformSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useOrganization();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Saiu com sucesso");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const userName = user?.user_metadata?.full_name || "Membro";
  const userInitials = userName.substring(0, 2).toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#06071A]">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-premium-purple flex items-center justify-center">
             <span className="text-white font-bold text-xl">V</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-white tracking-tight font-display">Vincere</span>
          )}
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-3 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 group relative ${
              isActive(item.path)
                ? "bg-premium-purple/20 text-white shadow-[0_0_20px_rgba(104,46,199,0.15)]"
                : "text-premium-text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className={`w-[20px] h-[20px] shrink-0 ${isActive(item.path) ? "text-premium-purple" : ""}`} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
            {!collapsed && isActive(item.path) && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-premium-purple rounded-r-full"
              />
            )}
          </Link>
        ))}

        {isAdmin && (
          <Link
            to="/plataforma/admin"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 group ${
              isActive("/plataforma/admin")
                ? "bg-premium-purple/20 text-white"
                : "text-premium-purple/60 hover:text-premium-purple hover:bg-premium-purple/5"
            }`}
          >
            <Crown className="w-[20px] h-[20px] shrink-0" />
            {!collapsed && <span className="font-medium">Painel Admin</span>}
          </Link>
        )}
      </nav>

      {/* User & Premium Card */}
      <div className="px-3 pb-6 space-y-4">
        {!collapsed && (
           <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-premium-card to-[#0A0B1E] border border-white/5 group">
             {/* Rocket Animation Background */}
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-premium-purple/10 rounded-full blur-2xl group-hover:bg-premium-purple/20 transition-all duration-500" />
             
             <div className="relative z-10 flex flex-col items-center text-center gap-3">
               <div className="w-12 h-12 rounded-full bg-premium-purple/20 flex items-center justify-center">
                 <Rocket className="w-6 h-6 text-premium-purple animate-pulse" />
               </div>
               <div>
                 <h4 className="text-white font-bold text-sm">Seja Premium!</h4>
                 <p className="text-[10px] text-premium-text-muted mt-1 leading-relaxed">
                   Libere todos os recursos e impulsione seus resultados.
                 </p>
               </div>
               <button className="w-full py-2 bg-premium-purple hover:bg-premium-purple/90 text-white text-[11px] font-bold rounded-lg transition-all duration-300 shadow-lg shadow-premium-purple/20">
                 Upgrade Agora
               </button>
             </div>
           </div>
        )}

        <div className="space-y-1 border-t border-white/5 pt-4">
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-premium-text-muted hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#111] border border-white/10 text-white"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[260px] bg-[#0A0A0A] border-r border-white/5"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sticky top-0 h-screen border-r border-white/5 bg-[#0A0A0A] transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-[240px]"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
