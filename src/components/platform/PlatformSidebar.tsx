import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CreditCard, Package, ShoppingCart, Store,
  TrendingUp, GitBranch, Settings, ShoppingBag, HelpCircle, Headset,
  LogOut, Menu, X, ChevronRight, Crown
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
  { label: "Configurações", icon: Settings, path: "/plataforma/dashboard" },
  { label: "Minhas Compras", icon: ShoppingBag, path: "/plataforma/dashboard" },
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <span className="text-base font-semibold text-white tracking-tight">Vincere</span>
          )}
        </div>
        <NotificationBell />
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
              isActive(item.path)
                ? "bg-white/10 text-white"
                : "text-[#888] hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && isActive(item.path) && (
              <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
            )}
          </Link>
        ))}

        {/* Admin link - only visible to admins */}
        {isAdmin && (
          <Link
            to="/plataforma/admin"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
              isActive("/plataforma/admin")
                ? "bg-purple-500/10 text-purple-400"
                : "text-purple-400/60 hover:text-purple-400 hover:bg-purple-500/5"
            }`}
          >
            <Crown className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Painel Admin</span>}
            {!collapsed && isActive("/plataforma/admin") && (
              <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
            )}
          </Link>
        )}
      </nav>

      {/* Bottom Menu */}
      <div className="px-3 pb-3 space-y-1 border-t border-white/5 pt-3">
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#888] hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>

      {/* User Badge */}
      {!collapsed && (
        <div className="p-4 mx-3 mb-3 rounded-lg bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-platform-green/20 text-platform-green flex items-center justify-center text-xs font-bold">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{userName}</p>
              <p className="text-[10px] text-[#666] truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
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
