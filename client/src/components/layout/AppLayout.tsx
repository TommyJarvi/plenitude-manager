import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#09090b]">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen relative overflow-x-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
