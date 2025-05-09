
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

// Default news design templates
const DEFAULT_TEMPLATES = {
  breakingNews: {
    square: '/templates/breaking-news-square.png',
    story: '/templates/breaking-news-story.png',
    post: '/templates/breaking-news-post.png',
  },
  general: {
    square: '/templates/general-square.png',
    story: '/templates/general-story.png',
    post: '/templates/general-post.png',
  },
  update: {
    square: '/templates/update-square.png',
    story: '/templates/update-story.png',
    post: '/templates/update-post.png',
  }
};

// Default logos
const DEFAULT_LOGOS = {
  horizontal: '/logos/horizontal-logo.png',
  square: '/logos/square-logo.png',
};

// Default text censorship pairs
const DEFAULT_CENSORSHIP_PAIRS = [
  { original: "فلسطين", replacement: "فلسـطين" },
  { original: "حماس", replacement: "حمـ.ـاس" },
  { original: "الاحتلال", replacement: "الآحـتلال" },
];

// Default colors for text editing
const DEFAULT_COLORS = [
  "#e63946", // Red
  "#457b9d", // Blue
  "#1d3557", // Dark blue
  "#ffffff", // White
  "#000000", // Black
];

// Default text settings
const DEFAULT_TEXT_SETTINGS = {
  font: "cairo",
  size: 18,
  color: "#000000",
};

export type AppTheme = 'light' | 'dark';
export type FontFamily = 'cairo' | 'tajawal' | 'almarai' | 'changa' | 'notoKufi';

interface CensorshipPair {
  original: string;
  replacement: string;
}

interface AppContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  fonts: FontFamily[];
  setFonts: (fonts: FontFamily[]) => void;
  colors: string[];
  setColors: (colors: string[]) => void;
  templates: typeof DEFAULT_TEMPLATES;
  setTemplates: (templates: typeof DEFAULT_TEMPLATES) => void;
  logos: typeof DEFAULT_LOGOS;
  setLogos: (logos: typeof DEFAULT_LOGOS) => void;
  censorshipPairs: CensorshipPair[];
  setCensorshipPairs: (pairs: CensorshipPair[]) => void;
  defaultTextSettings: typeof DEFAULT_TEXT_SETTINGS;
  setDefaultTextSettings: (settings: typeof DEFAULT_TEXT_SETTINGS) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  applicationName: string;
  setApplicationName: (name: string) => void;
  applicationDescription: string;
  setApplicationDescription: (desc: string) => void;
  applicationIcon: string;
  setApplicationIcon: (icon: string) => void;
  resetToDefaults: () => void;
  applyTextCensorship: (text: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<AppTheme>('light');
  const [fonts, setFonts] = useState<FontFamily[]>(['cairo', 'tajawal', 'almarai', 'changa', 'notoKufi']);
  const [colors, setColors] = useState<string[]>([...DEFAULT_COLORS]);
  const [templates, setTemplates] = useState({ ...DEFAULT_TEMPLATES });
  const [logos, setLogos] = useState({ ...DEFAULT_LOGOS });
  const [censorshipPairs, setCensorshipPairs] = useState<CensorshipPair[]>([...DEFAULT_CENSORSHIP_PAIRS]);
  const [defaultTextSettings, setDefaultTextSettings] = useState({ ...DEFAULT_TEXT_SETTINGS });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applicationName, setApplicationName] = useState('أخبار كرافت ستوديو');
  const [applicationDescription, setApplicationDescription] = useState('استوديو تصميم أخبار احترافي');
  const [applicationIcon, setApplicationIcon] = useState('/favicon.ico');

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Check if user is already authenticated
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
    
    // Load saved settings from localStorage
    const loadSettings = () => {
      try {
        const savedFonts = localStorage.getItem('fonts');
        const savedColors = localStorage.getItem('colors');
        const savedDefaultTextSettings = localStorage.getItem('defaultTextSettings');
        const savedTheme = localStorage.getItem('theme');
        const savedCensorshipPairs = localStorage.getItem('censorshipPairs');
        const savedApplicationName = localStorage.getItem('applicationName');
        const savedApplicationDescription = localStorage.getItem('applicationDescription');
        const savedApplicationIcon = localStorage.getItem('applicationIcon');
        
        if (savedFonts) setFonts(JSON.parse(savedFonts));
        if (savedColors) setColors(JSON.parse(savedColors));
        if (savedDefaultTextSettings) setDefaultTextSettings(JSON.parse(savedDefaultTextSettings));
        if (savedTheme) setTheme(savedTheme as AppTheme);
        if (savedCensorshipPairs) setCensorshipPairs(JSON.parse(savedCensorshipPairs));
        if (savedApplicationName) setApplicationName(savedApplicationName);
        if (savedApplicationDescription) setApplicationDescription(savedApplicationDescription);
        if (savedApplicationIcon) setApplicationIcon(savedApplicationIcon);
        
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: "خطأ في تحميل الإعدادات",
          description: "حدث خطأ أثناء محاولة تحميل الإعدادات المحفوظة.",
          variant: "destructive",
        });
      }
    };
    
    loadSettings();
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('fonts', JSON.stringify(fonts));
      localStorage.setItem('colors', JSON.stringify(colors));
      localStorage.setItem('defaultTextSettings', JSON.stringify(defaultTextSettings));
      localStorage.setItem('theme', theme);
      localStorage.setItem('censorshipPairs', JSON.stringify(censorshipPairs));
      localStorage.setItem('applicationName', applicationName);
      localStorage.setItem('applicationDescription', applicationDescription);
      localStorage.setItem('applicationIcon', applicationIcon);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [fonts, colors, defaultTextSettings, theme, censorshipPairs, applicationName, applicationDescription, applicationIcon]);
  
  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // Check if this is the first login
    const storedUsername = localStorage.getItem('admin_username');
    const storedPassword = localStorage.getItem('admin_password');
    
    if (!storedUsername || !storedPassword) {
      // First time setup - store the credentials
      localStorage.setItem('admin_username', username);
      localStorage.setItem('admin_password', password);
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      toast({
        title: "تم إنشاء الحساب",
        description: "تم إنشاء حساب المسؤول بنجاح.",
      });
      return true;
    }
    
    // Regular login
    if (username === storedUsername && password === storedPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      toast({
        title: "تم تسجيل الدخول",
        description: "تم تسجيل الدخول بنجاح.",
      });
      return true;
    }
    
    toast({
      title: "فشل تسجيل الدخول",
      description: "اسم المستخدم أو كلمة المرور غير صحيحة.",
      variant: "destructive",
    });
    return false;
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح.",
    });
  };
  
  // Reset all settings to defaults
  const resetToDefaults = () => {
    setFonts(['cairo', 'tajawal', 'almarai', 'changa', 'notoKufi']);
    setColors([...DEFAULT_COLORS]);
    setTemplates({ ...DEFAULT_TEMPLATES });
    setLogos({ ...DEFAULT_LOGOS });
    setCensorshipPairs([...DEFAULT_CENSORSHIP_PAIRS]);
    setDefaultTextSettings({ ...DEFAULT_TEXT_SETTINGS });
    setApplicationName('أخبار كرافت ستوديو');
    setApplicationDescription('استوديو تصميم أخبار احترافي');
    setApplicationIcon('/favicon.ico');
    
    toast({
      title: "تمت إعادة التعيين",
      description: "تم إعادة تعيين جميع الإعدادات إلى القيم الافتراضية.",
    });
  };
  
  // Apply text censorship
  const applyTextCensorship = (text: string): string => {
    let censoredText = text;
    censorshipPairs.forEach(pair => {
      const regex = new RegExp(pair.original, 'g');
      censoredText = censoredText.replace(regex, pair.replacement);
    });
    return censoredText;
  };
  
  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      fonts,
      setFonts,
      colors,
      setColors,
      templates,
      setTemplates,
      logos,
      setLogos,
      censorshipPairs,
      setCensorshipPairs,
      defaultTextSettings,
      setDefaultTextSettings,
      isAuthenticated,
      setIsAuthenticated,
      login,
      logout,
      applicationName,
      setApplicationName,
      applicationDescription,
      setApplicationDescription,
      applicationIcon,
      setApplicationIcon,
      resetToDefaults,
      applyTextCensorship
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
