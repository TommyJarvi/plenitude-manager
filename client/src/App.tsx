import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

// Pages
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import Students from "@/pages/admin/Students";
import StudentDetails from "@/pages/admin/StudentDetails";
import Ranking from "@/pages/admin/Ranking";
import Challenges from "@/pages/admin/Challenges";
import StudentDashboard from "@/pages/student/Dashboard";

// Role guards
function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-zinc-950" />;
  if (!user || user.role !== "admin") return <Redirect to="/login" />;
  return <Component />;
}

function StudentRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, student, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-zinc-950" />;
  if (!user || !student) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <Switch>
      <Route path="/" component={() => <Redirect to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} />} />
      <Route path="/login" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={() => <AdminRoute component={AdminDashboard} />} />
      <Route path="/admin/students" component={() => <AdminRoute component={Students} />} />
      <Route path="/admin/students/:id" component={() => <AdminRoute component={StudentDetails} />} />
      <Route path="/admin/workouts" component={() => <AdminRoute component={Students} />} /> {/* Redirecting workouts to students list since check-in is done on student profile or via search */}
      <Route path="/admin/ranking" component={() => <AdminRoute component={Ranking} />} />
      <Route path="/admin/challenges" component={() => <AdminRoute component={Challenges} />} />

      {/* Student Routes */}
      <Route path="/student" component={() => <StudentRoute component={StudentDashboard} />} />
      <Route path="/student/ranking" component={() => <StudentRoute component={Ranking} />} />
      <Route path="/student/challenges" component={() => <StudentRoute component={Challenges} />} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
