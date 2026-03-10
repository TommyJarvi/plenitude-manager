import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Trophy, 
  Flame,
  LogOut,
  UserCircle
} from "lucide-react";
import logoUrl from "@assets/WhatsApp_Image_2026-03-10_at_12.04.23_1773181799103.jpeg";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Alunos", icon: Users },
    { href: "/admin/workouts", label: "Treinos", icon: Dumbbell },
    { href: "/admin/ranking", label: "Ranking", icon: Trophy },
    { href: "/admin/challenges", label: "Desafios", icon: Flame },
  ];

  const studentLinks = [
    { href: "/student", label: "Meu Perfil", icon: UserCircle },
    { href: "/student/ranking", label: "Ranking", icon: Trophy },
    { href: "/student/challenges", label: "Desafios", icon: Flame },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="fixed inset-y-0 left-0 w-64 glass-panel border-r border-white/5 flex flex-col z-50">
      <div className="p-6 flex flex-col items-center border-b border-white/5">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-teal-500/30 p-1 shadow-lg shadow-teal-500/10">
          <img src={logoUrl} alt="Plenitude Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <h2 className="font-display font-bold text-xl text-center">PLENITUDE<br/><span className="text-teal-500 text-sm tracking-widest font-sans uppercase">Academia</span></h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href || (location.startsWith(link.href) && link.href !== "/admin" && link.href !== "/student");
          
          return (
            <Link key={link.href} href={link.href} className="block">
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer",
                isActive 
                  ? "bg-teal-500/10 text-teal-400 font-semibold" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              )}>
                <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                {link.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}
