import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useChallenges, useCreateChallenge } from "@/hooks/use-api";
import { Flame, Plus, Target, Gift, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Challenges() {
  const { data: challenges, isLoading } = useChallenges();
  const createChallenge = useCreateChallenge();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ title: "", description: "", reward: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createChallenge.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setFormData({ title: "", description: "", reward: "" });
      }
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            Desafios Ativos
          </h1>
          <p className="text-zinc-400 mt-1">Engaje os alunos com metas e recompensas.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary py-3 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/20 hover:shadow-orange-500/40">
          <Plus className="w-5 h-5" /> Novo Desafio
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges?.map((challenge) => (
            <motion.div key={challenge.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-[30px] group-hover:bg-orange-500/20 transition-colors pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                  <Target className="w-6 h-6" />
                </div>
                {challenge.isActive ? 
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">Ativo</span> : 
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-medium">Encerrado</span>
                }
              </div>
              
              <h3 className="text-xl font-bold text-zinc-100 mb-2">{challenge.title}</h3>
              <p className="text-zinc-400 text-sm mb-6 min-h-[60px]">{challenge.description}</p>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <Gift className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-amber-400 text-sm">{challenge.reward}</span>
              </div>
            </motion.div>
          ))}
          {challenges?.length === 0 && (
            <div className="col-span-full p-20 text-center glass-panel rounded-3xl text-zinc-500">
              Nenhum desafio ativo no momento. Crie um para motivar os alunos!
            </div>
          )}
        </div>
      )}

      {/* Modal Novo Desafio */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md glass-panel rounded-3xl p-8 border border-orange-500/20">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Lançar Desafio</h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1 ml-1">Título do Desafio</label>
                  <input required type="text" className="input-field focus:ring-orange-500/20 focus:border-orange-500" placeholder="Ex: Projeto Verão" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1 ml-1">Descrição / Regras</label>
                  <textarea required className="input-field min-h-[100px] focus:ring-orange-500/20 focus:border-orange-500" placeholder="Ex: Venha treinar 20 dias no mês..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1 ml-1">Recompensa</label>
                  <input required type="text" className="input-field focus:ring-orange-500/20 focus:border-orange-500" placeholder="Ex: 1 Mês Grátis + Squeeze" value={formData.reward} onChange={e => setFormData({...formData, reward: e.target.value})} />
                </div>
                <button type="submit" disabled={createChallenge.isPending} className="btn-primary w-full py-3 mt-4 bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/20 hover:shadow-orange-500/40">
                  {createChallenge.isPending ? "Salvando..." : "Publicar Desafio"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
