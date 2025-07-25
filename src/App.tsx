
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthWrapper } from "@/components/AuthWrapper";
import Index from "./pages/Index";
import Routine from "./pages/Routine";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Rewards from "./pages/Rewards";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Punishments from "./pages/Punishments";
import RemindersNotes from "./pages/RemindersNotes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthWrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/reminders-notes" element={<RemindersNotes />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/punishments" element={<Punishments />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
