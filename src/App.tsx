import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QuizProvider } from "./contexts/QuizContext";
import Gate from "./pages/Gate";
import Home from "./pages/Home";
import Atelier from "./pages/Atelier";
import Documentation from "./pages/Documentation";
import QuizStart from "./pages/quiz/Start";
import QuizQuestion from "./pages/quiz/Question";
import QuizResults from "./pages/quiz/Results";
import Accompagnement from "./pages/Accompagnement";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <QuizProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gate" element={<Gate />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route path="/accompagnement" element={<Accompagnement />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/diagnostic" element={<QuizStart />} />
            <Route path="/diagnostic/question/:id" element={<QuizQuestion />} />
            <Route path="/diagnostic/resultats" element={<QuizResults />} />

            <Route path="/associations" element={<Navigate to="/" replace />} />
            <Route path="/artistes" element={<Navigate to="/diagnostic" replace />} />
            <Route path="/quiz/start" element={<Navigate to="/diagnostic" replace />} />
            <Route path="/quiz/:id" element={<Navigate to="/diagnostic/question/:id" replace />} />
            <Route path="/quiz/results" element={<Navigate to="/diagnostic/resultats" replace />} />
            <Route path="/programme" element={<Navigate to="/accompagnement" replace />} />
            <Route path="/abonnements" element={<Navigate to="/accompagnement#tarifs" replace />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QuizProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
