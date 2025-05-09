
import { useApp } from '@/contexts/AppContext';
import { Moon, Sun, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme, setTheme, applicationName } = useApp();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            {applicationName}
          </Link>
          
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Languages className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تغيير اللغة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            جميع الحقوق محفوظة © {currentYear} تصميم وتطوير <a href="https://ahjbu.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ahjbu</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
