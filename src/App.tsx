
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Index from "./pages/Index";
import NewsDesignPage from "./pages/NewsDesignPage";
import FullCustomizationPage from "./pages/FullCustomizationPage";
import TextCensorshipPage from "./pages/TextCensorshipPage";
import SettingsLoginPage from "./pages/SettingsLoginPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/settings-login" replace />;
  }
  
  return <>{element}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/news-design" element={<NewsDesignPage />} />
      <Route path="/custom-design" element={<FullCustomizationPage />} />
      <Route path="/text-censorship" element={<TextCensorshipPage />} />
      <Route path="/settings-login" element={<SettingsLoginPage />} />
      <Route 
        path="/settings" 
        element={<ProtectedRoute element={<SettingsPage />} />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
