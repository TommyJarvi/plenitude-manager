import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// ==== STUDENTS ====
export function useStudents() {
  return useQuery({
    queryKey: [api.students.list.path],
    queryFn: async () => {
      const res = await fetch(api.students.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch students");
      return api.students.list.responses[200].parse(await res.json());
    },
  });
}

export function useStudent(id: number | string) {
  return useQuery({
    queryKey: [api.students.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.students.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch student");
      return api.students.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.students.create.input>) => {
      const res = await fetch(api.students.create.path, {
        method: api.students.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao criar aluno");
      return api.students.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.students.list.path] });
      toast({ title: "Sucesso", description: "Aluno cadastrado com sucesso." });
    },
    onError: (err: any) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & z.infer<typeof api.students.update.input>) => {
      const url = buildUrl(api.students.update.path, { id });
      const res = await fetch(url, {
        method: api.students.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao atualizar aluno");
      return api.students.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.students.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.students.get.path, data.id] });
      toast({ title: "Sucesso", description: "Dados atualizados." });
    },
  });
}

export function useRenewStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.students.renew.path, { id });
      const res = await fetch(url, { method: api.students.renew.method, credentials: "include" });
      if (!res.ok) throw new Error("Erro ao renovar plano");
      return api.students.renew.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.students.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.students.get.path, data.id] });
      toast({ title: "Sucesso", description: "Plano renovado por +30 dias." });
    },
  });
}

export function useDeactivateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.students.deactivate.path, { id });
      const res = await fetch(url, { method: api.students.deactivate.method, credentials: "include" });
      if (!res.ok) throw new Error("Erro ao desativar aluno");
      return api.students.deactivate.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.students.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.students.get.path, data.id] });
      toast({ title: "Sucesso", description: "Aluno desativado." });
    },
  });
}

// ==== WORKOUTS ====
export function useWorkouts() {
  return useQuery({
    queryKey: [api.workouts.list.path],
    queryFn: async () => {
      const res = await fetch(api.workouts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch workouts");
      return api.workouts.list.responses[200].parse(await res.json());
    },
  });
}

export function useRegisterWorkout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (studentId: number) => {
      const res = await fetch(api.workouts.create.path, {
        method: api.workouts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao registrar treino");
      return api.workouts.create.responses[201].parse(await res.json());
    },
    onSuccess: (data, studentId) => {
      queryClient.invalidateQueries({ queryKey: [api.workouts.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.students.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.students.get.path, studentId] });
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] }); // update own points if student
      toast({ title: "Treino Registrado!", description: "+10 pontos adicionados.", className: "bg-teal-500 border-none text-white" });
    },
  });
}

// ==== CHALLENGES ====
export function useChallenges() {
  return useQuery({
    queryKey: [api.challenges.list.path],
    queryFn: async () => {
      const res = await fetch(api.challenges.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch challenges");
      return api.challenges.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.challenges.create.input>) => {
      const res = await fetch(api.challenges.create.path, {
        method: api.challenges.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao criar desafio");
      return api.challenges.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.challenges.list.path] });
      toast({ title: "Desafio Criado", description: "Novo desafio lançado com sucesso." });
    },
  });
}
