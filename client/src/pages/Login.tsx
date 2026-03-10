import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Dumbbell, Lock, User } from "lucide-react";
import logoUrl from "@assets/WhatsApp_Image_2026-03-10_at_12.04.23_1773181799103.jpeg";

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#09090b]">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-panel p-10 rounded-3xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-zinc-800 p-1 bg-zinc-950 shadow-xl shadow-teal-500/10">
               <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <h1 className="text-3xl font-display font-bold text-center">Acesso ao Sistema</h1>
            <p className="text-zinc-500 mt-2 text-sm text-center">Bem-vindo à Plenitude Academia</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-teal-400 transition-colors" />
                <input 
                  type="text"
                  placeholder="Usuário ou Telefone"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-12"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-teal-400 transition-colors" />
                <input 
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
            >
              {isLoggingIn ? "Autenticando..." : "Entrar"}
              {!isLoggingIn && <Dumbbell className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
