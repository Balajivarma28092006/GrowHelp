import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import Dashboard from "./pages/Dashboard";
import NewEntry from "./pages/NewEntry";
import History from "./pages/History";
import EntryDetail from "./pages/EntryDetail";
import Lessons from "./pages/Lessons";
import MoodTrends from "./pages/MoodTrends";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewEntry />} />
          <Route path="/history" element={<History />} />
          <Route path="/entry/:id" element={<EntryDetail />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/trends" element={<MoodTrends />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
