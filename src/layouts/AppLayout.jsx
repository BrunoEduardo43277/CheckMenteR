import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  Menu,
  X,
  LayoutDashboard,
  Heart,
  BarChart3,
  Bell,
  Sparkles,
  Users,
  MessageCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";

function AppLayout({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  const links = [
    { nome: "Painel", path: "/dashboard", icon: <LayoutDashboard size={23} /> },
    { nome: "Check-in", path: "/checkin", icon: <Heart size={23} /> },
    { nome: "Relatórios", path: "/relatorios", icon: <BarChart3 size={23} /> },
    { nome: "Alertas", path: "/alertas", icon: <Bell size={23} /> },
    { nome: "IA Acolhimento", path: "/ia", icon: <Sparkles size={23} /> },
    { nome: "Alunos", path: "/alunos", icon: <Users size={23} /> },
    { nome: "Mensagens", path: "/mensagens", icon: <MessageCircle size={23} /> },
    { nome: "Meu Perfil", path: "/perfil", icon: <User size={23} /> },
    { nome: "Configurações", path: "/configuracoes", icon: <Settings size={23} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FCFA]">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-[#F2FBF7] text-[#2E7D6B] flex-col border-r border-[#DDEFE7]">
        <SidebarContent links={links} location={location} />
      </aside>

      {/* HEADER MOBILE */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#DDEFE7] px-5 py-4 flex items-center justify-between">
        <Logo />

        <button
          onClick={() => setMenuAberto(true)}
          className="text-[#1F3D35]"
        >
          <Menu size={30} />
        </button>
      </header>

      {/* MENU MOBILE */}
      {menuAberto && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            onClick={() => setMenuAberto(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside className="relative h-full w-[78%] max-w-sm bg-[#F2FBF7] text-[#2E7D6B] shadow-2xl">

            <div className="absolute right-[-52px] top-5">
              <button
                onClick={() => setMenuAberto(false)}
                className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#1F3D35] shadow"
              >
                <X size={25} />
              </button>
            </div>

            <SidebarContent
              links={links}
              location={location}
              onNavigate={() => setMenuAberto(false)}
            />

          </aside>
        </div>
      )}

      {/* CONTEÚDO */}
      <main className="lg:ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
          {children}
        </div>
      </main>

    </div>
  );
}

function SidebarContent({ links, location, onNavigate }) {
  return (
    <div className="h-full flex flex-col">

      {/* LOGO */}
      <div className="px-6 py-5 border-b border-[#DDEFE7]">
        <Logo />
      </div>

      {/* LINKS */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

        {links.map((item) => {
          const ativo = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                ativo
                  ? "bg-[#BFEFD5] text-[#167C5A] shadow-sm"
                  : "text-[#4B6B61] hover:bg-[#E5F7EE] hover:text-[#167C5A]"
              }`}
            >
              {item.icon}
              {item.nome}
            </Link>
          );
        })}

      </nav>

      {/* BOTÃO SAIR */}
      <div className="px-4 py-5 border-t border-[#DDEFE7]">

        <Link
          to="/login"
          className="flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold text-[#4B6B61] hover:bg-[#E5F7EE] transition-all duration-300"
        >
          <LogOut size={23} />
          Sair
        </Link>

      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">

      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5ED6A7] to-[#38B487] flex items-center justify-center text-white shadow-md">
        <Brain size={26} />
      </div>

      <h1 className="text-2xl font-bold text-[#1F3D35]">
        Check<span className="text-[#4CC38A]">Mente</span>
      </h1>

    </div>
  );
}

export default AppLayout;