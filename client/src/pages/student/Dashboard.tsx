import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useWorkouts } from "@/hooks/use-api";
import { getStudentStatus, formatDate } from "@/lib/utils";
import { Dumbbell, Calendar, Trophy, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";
import logoUrl from "@assets/WhatsApp_Image_2026-03-10_at_12.04.23_1773181799103.jpeg";

export default function StudentDashboard() {
  const { student } = useAuth();
  const { data: workouts, isLoading } = useWorkouts();

  if (!student) return null;

  const status = getStudentStatus(student.dueDate);
  const myWorkouts = workouts?.filter(w => w.studentId === student.id) || [];
  
  return (
    <AppLayout>
      <div className="mb-10 text-center pt-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-32 h-32 mx-auto rounded-full bg-zinc-900 border-4 border-teal-500/30 p-1 mb-6 shadow-2xl shadow-teal-500/20 overflow-hidden">
           <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
        </motion.div>
        <h1 className="text-3xl font-display font-bold">Olá, {student.name.split(' ')[0]}!</h1>
        <p className="text-zinc-400 mt-2">Acompanhe seu progresso e plano.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Calendar className="w-24 h-24" />
          </div>
          <h3 className="text-lg font-display text-zinc-400 mb-6 flex items-center gap-2"><Clock className="w-5 h-5" /> Status do Plano</h3>
          
          <div className="space-y-4 relative z-10">
            <div>
              <p className="text-sm text-zinc-500">Vencimento</p>
              <p className="text-2xl font-bold text-zinc-100">{formatDate(student.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500 mb-2">Situação Atual</p>
              <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium border ${status.bg}`}>
                {status.label}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-panel p-8 rounded-3xl relative overflow-hidden border-teal-500/20">
          <div className="absolute top-0 right-0 p-6 opacity-10 text-teal-500">
            <Trophy className="w-24 h-24" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
          
          <h3 className="text-lg font-display text-zinc-400 mb-6 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Seus Pontos</h3>
          
          <div className="relative z-10 flex flex-col justify-center h-[120px]">
            <div className="text-6xl font-display font-bold text-amber-400 text-glow mb-2">{student.points}</div>
            <p className="text-zinc-500 text-sm">Continue treinando para subir no ranking!</p>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-panel rounded-3xl p-8">
        <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-3">
          <Dumbbell className="w-6 h-6 text-teal-400" />
          Histórico de Treinos
        </h3>
        
        {isLoading ? (
          <div className="p-10 flex justify-center"><div className="w-6 h-6 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : myWorkouts.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 bg-black/20 rounded-2xl border border-white/5">
            Nenhum treino registrado ainda. Vá à recepção para registrar seu check-in!
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {myWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(workout => (
              <div key={workout.id} className="flex justify-between items-center p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-200">Check-in de Treino</div>
                    <div className="text-xs text-zinc-500">{formatDate(workout.date)}</div>
                  </div>
                </div>
                <div className="text-amber-500 font-bold text-sm bg-amber-500/10 px-3 py-1 rounded-full">+10 pt</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
