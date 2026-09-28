import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Image, Handshake, FileText, LogOut, LayoutDashboard, GraduationCap, Mail } from "lucide-react";
import logo from "@/assets/norte4j-logo.png";

const navItems = [
  { label: "Dashboard", href: "/cms", icon: LayoutDashboard, end: true },
  { label: "Eventos", href: "/cms/eventos", icon: Calendar },
  { label: "Workshops", href: "/cms/workshops", icon: GraduationCap },
  { label: "Galeria", href: "/cms/galeria", icon: Image },
  { label: "Parceiros", href: "/cms/parceiros", icon: Handshake },
  { label: "Textos", href: "/cms/textos", icon: FileText },
  { label: "Contatos", href: "/cms/contatos", icon: Mail },
];

const CmsLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/cms/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-5 border-b border-border flex items-center gap-3">
          <img src={logo} alt="Norte4j" className="w-8 h-8" />
          <span className="font-display font-bold text-foreground">CMS Norte4j</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-sm text-muted-foreground mb-2 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CmsLayout;
