import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return format(parsed, "dd/MM/yyyy", { locale: ptBR });
}

export function getStudentStatus(dueDate: string | Date | null | undefined): { label: string; color: string; bg: string } {
  if (!dueDate) return { label: "Desconhecido", color: "text-zinc-400", bg: "bg-zinc-400/10 border-zinc-400/20" };
  
  const parsed = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  const today = new Date();
  const daysDiff = differenceInDays(parsed, today);

  if (daysDiff < 0) {
    return { label: "Vencido", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20 text-red-400" };
  } else if (daysDiff <= 5) {
    return { label: "Vence em breve", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20 text-amber-400" };
  } else {
    return { label: "Ativo", color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/20 text-teal-400" };
  }
}
