
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { loadCustomFonts, initializeFavicon } from "@/utils/customFonts";
import Index from "./pages/Index";
import NewsDesignPage from "./pages/NewsDesignPage";
import FullCustomizationPage from "./pages/FullCustomizationPage";
import TextCensorshipPage from "./pages/TextCensorshipPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Main App component wrapper
const App = () => {
  // Initialize custom fonts and favicon on app start
  useEffect(() => {
    loadCustomFonts();
    initializeFavicon();
    
    // Set document title from localStorage or use default
    document.title = localStorage.getItem('applicationName') || "تطبيق تصميم الأخبار";
  }, []);
  
  return (
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
};

// App routes component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/news-design" element={<NewsDesignPage />} />
      <Route path="/custom-design" element={<FullCustomizationPage />} />
      <Route path="/text-censorship" element={<TextCensorshipPage />} />
      <Route path="/admin" element={<SettingsPage />} />
      <Route path="/settings" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
