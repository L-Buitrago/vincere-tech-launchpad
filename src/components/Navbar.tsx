import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const navLinks = [
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Equipe", href: "#equipe" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Plataforma", href: "#demo" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-lg shadow-black/10" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <a href="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          Vincere
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <a href="/admin">
              <Button size="sm" variant="outline" className="font-display font-semibold">Admin</Button>
            </a>
          )}
          {user ? (
            <a href="/plataforma">
              <Button size="sm" className="font-display font-semibold">Meu Dashboard</Button>
            </a>
          ) : (
            <>
              <a href="/auth">
                <Button size="sm" variant="ghost" className="font-display font-semibold">Entrar / Cadastrar</Button>
              </a>
              <a href="#pacotes" onClick={(e) => { e.preventDefault(); document.getElementById('pacotes')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                <Button size="sm" className="font-display font-semibold">Solicitar Orçamento</Button>
              </a>
            </>
          )}
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border">
            <SheetTitle className="font-display text-lg">Menu</SheetTitle>
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {isAdmin && (
                <a href="/admin" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full font-display font-semibold">Admin</Button>
                </a>
              )}
              {user ? (
                <a href="/plataforma" onClick={() => setOpen(false)}>
                  <Button className="w-full font-display font-semibold">Meu Dashboard</Button>
                </a>
              ) : (
                <>
                  <a href="/auth" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full font-display font-semibold">Entrar / Cadastrar</Button>
                  </a>
                  <a href="#pacotes" onClick={(e) => { e.preventDefault(); setOpen(false); document.getElementById('pacotes')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                    <Button className="w-full font-display font-semibold">Solicitar Orçamento</Button>
                  </a>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
