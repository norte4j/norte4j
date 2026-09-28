import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import EventDetails from "./pages/EventDetails.tsx";
import Login from "./pages/cms/Login.tsx";
import CmsLayout from "./components/cms/CmsLayout.tsx";
import ProtectedRoute from "./components/cms/ProtectedRoute.tsx";
import Dashboard from "./pages/cms/Dashboard.tsx";
import CmsEvents from "./pages/cms/CmsEvents.tsx";
import CmsGallery from "./pages/cms/CmsGallery.tsx";
import CmsPartners from "./pages/cms/CmsPartners.tsx";
import CmsTexts from "./pages/cms/CmsTexts.tsx";
import CmsContacts from "./pages/cms/CmsContacts.tsx";
import CmsTeam from "./pages/cms/CmsTeam.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/evento/:slug" element={<EventDetails />} />
            <Route path="/cms/login" element={<Login />} />
            <Route
              path="/cms"
              element={
                <ProtectedRoute>
                  <CmsLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="eventos" element={<CmsEvents />} />
              <Route path="workshops" element={<CmsEvents kind="workshops" />} />
              <Route path="galeria" element={<CmsGallery />} />
              <Route path="parceiros" element={<CmsPartners />} />
              <Route path="equipe" element={<CmsTeam />} />
              <Route path="textos" element={<CmsTexts />} />
              <Route path="contatos" element={<CmsContacts />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
