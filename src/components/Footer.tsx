import { Mail, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-display text-lg font-bold mb-1">
              Vincere<span className="text-primary">Tech</span>
            </p>
            <p className="text-muted-foreground text-sm">© 2026 Vincere Tech. Todos os direitos reservados.</p>
          </div>

          <div className="flex items-center gap-6">
            <a href="mailto:contato@vinceretech.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap justify-center">
            <Link to="/termos" className="hover:text-foreground transition-colors">Termos</Link>
            <Link to="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link>
            <Link to="/devolucoes" className="hover:text-foreground transition-colors">Trocas e Devoluções</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
