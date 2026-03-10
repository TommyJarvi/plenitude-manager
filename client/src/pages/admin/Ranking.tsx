import { AppLayout } from "@/components/layout/AppLayout";
import { useStudents } from "@/hooks/use-api";
import { Trophy, Medal, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Ranking() {
  const { data: students, isLoading } = useStudents();

  if (isLoading) return <AppLayout><div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div></AppLayout>;

  // Sort by points descending
  const rankedStudents = [...(students || [])]
    .filter(s => s.points > 0)
    .sort((a, b) => b.points - a.points);

  return (
    <AppLayout>
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Ranking Geral</h1>
        <p className="text-zinc-400 mt-4 text-lg">Os alunos mais dedicados da Plenitude Academia.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {rankedStudents.length === 0 ? (
          <div className="text-center text-zinc-500 p-10 glass-panel rounded-3xl">Nenhum aluno pontuou ainda.</div>
        ) : (
          rankedStudents.map((student, index) => {
            const isTop3 = index < 3;
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={student.id} 
                className={`glass-panel p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden ${isTop3 ? 'border-amber-500/30 shadow-lg shadow-amber-500/5' : ''}`}
              >
                {isTop3 && <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />}
                
                <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center font-display font-bold text-xl
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-600 text-black shadow-lg shadow-amber-500/20' : 
                    index === 1 ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-black' : 
                    index === 2 ? 'bg-gradient-to-br from-amber-700 to-orange-800 text-white' : 
                    'bg-white/5 text-zinc-400'}`}
                >
                  {index + 1}º
                </div>

                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-teal-500 font-bold border border-white/5">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    {student.name}
                    {index === 0 && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                  </h3>
                  <p className="text-sm text-zinc-500">{student.plan}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-amber-400 text-glow">{student.points}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Pontos</div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
}
