import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Menu, X} from "lucide-react";

const navItems = [
  {label: "Inscrição", href: "#hero"},
  {label: "Eventos", href: "#eventos"},
  {label: "Galeria", href: "#galeria"},
  {label: "Parceiros", href: "#parcerias"},
  {label: "Equipe", href: "#equipe"},
  {label: "Sobre", href: "#sobre"},
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md shadow-card" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <a href="#" data-analytics-tag="nav_logo" className="flex items-center gap-2">
          {/*<img src={logo} alt="Norte4j" className="w-8 h-8" />*/}
          <span
            className={`font-display font-bold text-lg transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>Norte4j Community</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              data-analytics-tag={`nav_${item.href.slice(1)}`}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${scrolled ? "text-muted-foreground hover:text-foreground hover:bg-muted" : "text-primary-foreground/80 hover:text-primary-foreground"}`}
            >
              {item.label}
            </a>
          ))}
          {/*<button*/}
          {/*  onClick={() => setIsDark(!isDark)}*/}
          {/*  className={`ml-2 p-2 rounded-lg transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground hover:bg-muted" : "text-primary-foreground/80 hover:text-primary-foreground"}`}*/}
          {/*  aria-label="Alternar tema"*/}
          {/*>*/}
          {/*  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}*/}
          {/*</button>*/}
        </nav>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          {/*<button*/}
          {/*  onClick={() => setIsDark(!isDark)}*/}
          {/*  className={`p-2 rounded-lg transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground hover:bg-muted" : "text-primary-foreground/80 hover:text-primary-foreground"}`}*/}
          {/*  aria-label="Alternar tema"*/}
          {/*>*/}
          {/*  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}*/}
          {/*</button>*/}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-lg transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground hover:bg-muted" : "text-primary-foreground/80 hover:text-primary-foreground"}`}
            aria-label="Menu"
          >
            {isOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: "auto"}}
            exit={{opacity: 0, height: 0}}
            className="md:hidden bg-background/95 backdrop-blur-md border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  data-analytics-tag={`nav_mobile_${item.href.slice(1)}`}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
