import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useStudents, useCreateStudent } from "@/hooks/use-api";
import { getStudentStatus, formatDate, cn } from "@/lib/utils";
import { Search, Plus, X, Phone, User as UserIcon, Calendar, Activity } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Students() {
  const { data: students, isLoading } = useStudents();
  const [search, setSearch] = useState("");
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const createStudent = useCreateStudent();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    enrollmentDate: new Date().toISOString().split('T')[0],
    plan: "Mensal",
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
  });

  const filteredStudents = students?.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.phone.includes(search)
  ).sort((a, b) => b.isActive === a.isActive ? 0 : a.isActive ? -1 : 1) || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createStudent.mutate(formData, {
      onSuccess: () => setIsNewStudentModalOpen(false)
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display">Alunos</h1>
          <p className="text-zinc-400 mt-1">Gerencie as matrículas e mensalidades.</p>
        </div>
        <button 
          onClick={() => setIsNewStudentModalOpen(true)}
          className="btn-primary py-3 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Cadastrar Aluno
        </button>
      </div>

      <div className="glass-panel p-2 rounded-2xl mb-6 flex items-center px-4">
        <Search className="w-5 h-5 text-zinc-500 mr-3" />
        <input 
          type="text" 
          placeholder="Buscar aluno por nome ou telefone..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 py-3 outline-none"
        />
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-zinc-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Nome</th>
                  <th className="p-4 font-medium">Plano</th>
                  <th className="p-4 font-medium">Vencimento</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((student) => {
                  const status = getStudentStatus(student.dueDate);
                  return (
                    <tr key={student.id} className={cn("hover:bg-white/5 transition-colors", !student.isActive && "opacity-50 grayscale")}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-teal-500 font-bold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-100">{student.name}</div>
                            <div className="text-xs text-zinc-500">{student.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-300">{student.plan}</td>
                      <td className="p-4 text-zinc-300">{formatDate(student.dueDate)}</td>
                      <td className="p-4">
                        {student.isActive ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${status.bg}`}>
                            {status.label}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium border bg-zinc-800/50 border-zinc-700 text-zinc-500">
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/students/${student.id}`}>
                          <button className="btn-outline text-sm py-1.5 px-3">Detalhes</button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="p-10 text-center text-zinc-500">Nenhum aluno encontrado.</div>
            )}
          </div>
        )}
      </div>

      {/* Modal Novo Aluno */}
      <AnimatePresence>
        {isNewStudentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsNewStudentModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-panel rounded-3xl p-8 border border-white/10"
            >
              <button 
                onClick={() => setIsNewStudentModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-display font-bold mb-6">Cadastrar Novo Aluno</h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1 ml-1">Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input required type="text" className="input-field pl-10" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-zinc-400 mb-1 ml-1">Telefone (Whatsapp)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input required type="text" className="input-field pl-10" placeholder="(00) 00000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 ml-1">Servirá como senha de acesso do aluno.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1 ml-1">Data Matrícula</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input required type="date" className="input-field pl-10" value={formData.enrollmentDate} onChange={e => setFormData({...formData, enrollmentDate: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1 ml-1">Vencimento</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input required type="date" className="input-field pl-10" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1 ml-1">Plano</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <select required className="input-field pl-10 appearance-none" value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})}>
                      <option value="Mensal">Mensal</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={createStudent.isPending} className="btn-primary w-full py-3 mt-4">
                  {createStudent.isPending ? "Salvando..." : "Salvar Aluno"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
