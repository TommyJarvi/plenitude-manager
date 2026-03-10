import { AppLayout } from "@/components/layout/AppLayout";
import { useStudents, useWorkouts } from "@/hooks/use-api";
import { Users, AlertTriangle, XCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { getStudentStatus } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: students, isLoading: loadingStudents } = useStudents();
  const { data: workouts, isLoading: loadingWorkouts } = useWorkouts();

  if (loadingStudents || loadingWorkouts) {
    return <AppLayout><div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div></AppLayout>;
  }

  const allStudents = students || [];
  
  // Calculate stats
  let active = 0;
  let expiring = 0;
  let expired = 0;

  allStudents.forEach(s => {
    if (!s.isActive) return;
    const status = getStudentStatus(s.dueDate);
    if (status.label === "Ativo") active++;
    else if (status.label === "Vence em breve") expiring++;
    else expired++;
  });

  const stats = [
    { title: "Total de Alunos", value: allStudents.filter(s => s.isActive).length, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Planos Ativos", value: active, icon: CheckCircle2, color: "text-teal-400", bg: "bg-teal-400/10" },
    { title: "A Vencer (5 dias)", value: expiring, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10" },
    { title: "Vencidos", value: expired, icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  ];

  return (
    <AppLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-display">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Visão geral do sistema Plenitude.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-2xl flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">{stat.title}</p>
              <h3 className="text-3xl font-bold font-display mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Alunos que precisam de atenção</h2>
            <Link href="/admin/students" className="text-sm text-teal-400 hover:text-teal-300">Ver todos</Link>
          </div>
          
          <div className="space-y-4">
            {allStudents
              .filter(s => s.isActive && getStudentStatus(s.dueDate).label !== "Ativo")
              .slice(0, 5)
              .map(student => {
                const status = getStudentStatus(student.dueDate);
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <h4 className="font-semibold text-zinc-200">{student.name}</h4>
                      <p className="text-sm text-zinc-500">Telefone: {student.phone}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.bg}`}>
                        {status.label}
                      </span>
                      <Link href={`/admin/students/${student.id}`}>
                        <button className="btn-outline text-sm py-1.5">Gerenciar</button>
                      </Link>
                    </div>
                  </div>
                );
              })}
              {allStudents.filter(s => s.isActive && getStudentStatus(s.dueDate).label !== "Ativo").length === 0 && (
                <div className="text-center py-8 text-zinc-500">Nenhum aluno vencido ou prestes a vencer! 🎉</div>
              )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-display font-semibold">Treinos Hoje</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-10 bg-teal-500/5 rounded-xl border border-teal-500/10">
            <span className="text-5xl font-display font-bold text-teal-400 text-glow mb-2">
              {workouts?.filter(w => new Date(w.date).toDateString() === new Date().toDateString()).length || 0}
            </span>
            <span className="text-zinc-400">check-ins realizados hoje</span>
          </div>
          
          <Link href="/admin/workouts" className="block mt-6">
            <button className="btn-primary w-full py-3">Registrar Novo Treino</button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
