import { useParams, Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useStudent, useRenewStudent, useDeactivateStudent, useRegisterWorkout } from "@/hooks/use-api";
import { getStudentStatus, formatDate } from "@/lib/utils";
import { ArrowLeft, MessageCircle, CalendarClock, Dumbbell, AlertOctagon, Trophy, ShieldBan } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentDetails() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const { data: student, isLoading } = useStudent(id);
  
  const renewStudent = useRenewStudent();
  const deactivateStudent = useDeactivateStudent();
  const registerWorkout = useRegisterWorkout();

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div></AppLayout>;
  }

  if (!student) {
    return <AppLayout><div className="text-center text-zinc-500 mt-20">Aluno não encontrado.</div></AppLayout>;
  }

  const status = getStudentStatus(student.dueDate);
  const isExpired = status.label === "Vencido";
  
  const handleWhatsApp = () => {
    const phone = student.phone.replace(/\D/g, '');
    const msg = `Olá ${student.name}, sua mensalidade da academia PLENITUDE venceu. Entre em contato para renovar.`;
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AppLayout>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/students" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-zinc-400">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display">{student.name}</h1>
          <p className="text-zinc-400 mt-1">Detalhes e gerenciamento do aluno</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50" />
            
            <div className="w-24 h-24 mx-auto rounded-full bg-zinc-800 flex items-center justify-center text-3xl text-teal-500 font-bold mb-4 shadow-xl shadow-teal-500/10">
              {student.name.charAt(0).toUpperCase()}
            </div>
            
            <h2 className="text-xl font-bold text-zinc-100">{student.name}</h2>
            <p className="text-zinc-400 mb-6">{student.phone}</p>
            
            {student.isActive ? (
              <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium border ${status.bg} w-full`}>
                Status: {status.label}
              </div>
            ) : (
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium border bg-zinc-800/50 border-zinc-700 text-zinc-500 w-full">
                Status: Inativo
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="font-display font-semibold text-lg border-b border-white/5 pb-2 mb-4">Plano & Matrícula</h3>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Plano Atual</span>
              <span className="text-zinc-200 font-medium">{student.plan}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Data Matrícula</span>
              <span className="text-zinc-200">{formatDate(student.enrollmentDate)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Vencimento</span>
              <span className={`font-medium ${isExpired ? 'text-red-400' : 'text-zinc-200'}`}>{formatDate(student.dueDate)}</span>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Pontos</span>
              <span className="text-xl font-bold text-amber-500 text-glow">{student.points} pt</span>
            </div>
          </motion.div>
        </div>

        {/* Right Col - Actions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-8 rounded-3xl">
            <h3 className="font-display font-semibold text-xl mb-6">Ações Rápidas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => registerWorkout.mutate(student.id)}
                disabled={!student.isActive || registerWorkout.isPending}
                className="flex items-center gap-4 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group text-left"
              >
                <div className="p-3 bg-teal-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">Registrar Treino</div>
                  <div className="text-xs text-teal-500/70">+10 pontos no ranking</div>
                </div>
              </button>

              <button 
                onClick={() => renewStudent.mutate(student.id)}
                disabled={renewStudent.isPending}
                className="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group text-left"
              >
                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">Renovar Plano</div>
                  <div className="text-xs text-blue-500/70">Adiciona +30 dias</div>
                </div>
              </button>

              {isExpired && (
                <button 
                  onClick={handleWhatsApp}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all group text-left md:col-span-2"
                >
                  <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Cobrar via WhatsApp</div>
                    <div className="text-xs text-emerald-500/70">Envia mensagem padrão de cobrança</div>
                  </div>
                </button>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-8 rounded-3xl border-red-500/10">
            <h3 className="font-display font-semibold text-xl text-red-400 flex items-center gap-2 mb-4">
              <AlertOctagon className="w-5 h-5" /> Zona de Perigo
            </h3>
            <p className="text-zinc-500 text-sm mb-6">Ações irreversíveis que afetam o acesso do aluno ao sistema.</p>
            
            <button 
              onClick={() => {
                if (confirm(`Tem certeza que deseja ${student.isActive ? 'desativar' : 'reativar'} este aluno?`)) {
                  deactivateStudent.mutate(student.id);
                }
              }}
              disabled={deactivateStudent.isPending}
              className="btn-outline border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full md:w-auto flex items-center justify-center gap-2"
            >
              <ShieldBan className="w-4 h-4" />
              {student.isActive ? "Desativar Aluno" : "Reativar Aluno"}
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
