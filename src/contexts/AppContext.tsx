
import React, { createContext, useContext, useState, useEffect } from "react";
import { defaultTemplates, defaultLogos } from "@/data/dummyData";

// Define types for our context
interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isAdmin: boolean;
  fonts: string[];
  colors: string[];
  defaultTextSettings: {
    size: number;
    font: string;
    color: string;
  };
  templates: {
    [key: string]: {
      [key: string]: string;
    };
  };
  updateTemplateImage: (templateType: string, size: "square" | "story" | "post", imageUrl: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  applicationName: string;
  setApplicationName: (name: string) => void;
  applicationDescription: string;
  setApplicationDescription: (desc: string) => void;
  logos: {
    horizontal: string;
    square: string;
  };
  updateLogo: (type: "horizontal" | "square", imageUrl: string) => void;
  applyTextCensorship: (text: string) => string;
  censorshipRules: Array<{ original: string; replacement: string }>;
  addCensorshipRule: (original: string, replacement: string) => void;
  removeCensorshipRule: (index: number) => void;
  updateCensorshipRule: (index: number, original: string, replacement: string) => void;
  watermarkEnabled: boolean;
  setWatermarkEnabled: (enabled: boolean) => void;
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
  defaultExportFormat: string;
  setDefaultExportFormat: (format: string) => void;
  defaultExportQuality: string;
  setDefaultExportQuality: (quality: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || "light";
  });
  
  // Application info with localStorage persistence
  const [applicationName, setApplicationName] = useState(() => {
    return localStorage.getItem('applicationName') || "تطبيق تصميم الأخبار";
  });
  
  const [applicationDescription, setApplicationDescription] = useState(() => {
    return localStorage.getItem('applicationDescription') || "منصة متكاملة لتصميم المحتوى الإخباري بسهولة وإحترافية";
  });
  
  // Available fonts
  const fonts = ["Cairo", "Tajawal", "Almarai", "Changa", "Noto Kufi Arabic"];
  
  // Available colors
  const colors = ["#000000", "#FFFFFF", "#D32F2F", "#1976D2", "#388E3C", "#FBC02D"];
  
  // Default text settings with localStorage persistence
  const [defaultTextSettings, setDefaultTextSettings] = useState(() => {
    const savedSettings = localStorage.getItem('defaultTextSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      size: 24,
      font: "Cairo",
      color: "#000000"
    };
  });
  
  // Logo images for custom design with localStorage persistence
  const [logos, setLogos] = useState(() => {
    const savedLogos = localStorage.getItem('logos');
    return savedLogos ? JSON.parse(savedLogos) : defaultLogos;
  });
  
  // Template images with localStorage persistence
  const [templates, setTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem('templates');
    return savedTemplates ? JSON.parse(savedTemplates) : defaultTemplates;
  });

  // Censorship rules with localStorage persistence
  const [censorshipRules, setCensorshipRules] = useState(() => {
    const savedRules = localStorage.getItem('censorshipRules');
    return savedRules ? JSON.parse(savedRules) : [
      { original: "فلسطين", replacement: "فلسـطين" },
      { original: "حماس", replacement: "حمـ.ـاس" },
      { original: "الاحتلال", replacement: "الآحـتلال" }
    ];
  });

  // Export settings with localStorage persistence
  const [watermarkEnabled, setWatermarkEnabled] = useState(() => {
    return localStorage.getItem('watermarkEnabled') === 'true';
  });
  
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    return localStorage.getItem('autoSaveEnabled') !== 'false'; // Default to true
  });
  
  const [defaultExportFormat, setDefaultExportFormat] = useState(() => {
    return localStorage.getItem('defaultExportFormat') || "png";
  });
  
  const [defaultExportQuality, setDefaultExportQuality] = useState(() => {
    return localStorage.getItem('defaultExportQuality') || "high";
  });
  
  // Persist theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Persist application settings to localStorage
  useEffect(() => {
    localStorage.setItem('applicationName', applicationName);
    localStorage.setItem('applicationDescription', applicationDescription);
    localStorage.setItem('defaultTextSettings', JSON.stringify(defaultTextSettings));
    localStorage.setItem('templates', JSON.stringify(templates));
    localStorage.setItem('logos', JSON.stringify(logos));
    localStorage.setItem('censorshipRules', JSON.stringify(censorshipRules));
    localStorage.setItem('watermarkEnabled', watermarkEnabled.toString());
    localStorage.setItem('autoSaveEnabled', autoSaveEnabled.toString());
    localStorage.setItem('defaultExportFormat', defaultExportFormat);
    localStorage.setItem('defaultExportQuality', defaultExportQuality);
    
    // Update document title when application name changes
    document.title = applicationName;
  }, [
    applicationName, 
    applicationDescription, 
    defaultTextSettings, 
    templates, 
    logos, 
    censorshipRules,
    watermarkEnabled,
    autoSaveEnabled,
    defaultExportFormat,
    defaultExportQuality
  ]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Update template image
  const updateTemplateImage = (templateType: string, size: "square" | "story" | "post", imageUrl: string) => {
    setTemplates(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        [size]: imageUrl
      }
    }));
  };

  // Update logo
  const updateLogo = (type: "horizontal" | "square", imageUrl: string) => {
    setLogos(prev => ({
      ...prev,
      [type]: imageUrl
    }));
  };

  // Add censorship rule
  const addCensorshipRule = (original: string, replacement: string) => {
    setCensorshipRules(prev => [...prev, { original, replacement }]);
  };

  // Remove censorship rule
  const removeCensorshipRule = (index: number) => {
    setCensorshipRules(prev => prev.filter((_, i) => i !== index));
  };

  // Update censorship rule
  const updateCensorshipRule = (index: number, original: string, replacement: string) => {
    setCensorshipRules(prev => prev.map((rule, i) => 
      i === index ? { original, replacement } : rule
    ));
  };

  // Apply text censorship
  const applyTextCensorship = (text: string): string => {
    let censoredText = text;
    
    censorshipRules.forEach(rule => {
      const regex = new RegExp(rule.original, "g");
      censoredText = censoredText.replace(regex, rule.replacement);
    });

    return censoredText;
  };
  
  // Define the value for the context provider
  const contextValue: AppContextType = {
    darkMode,
    toggleDarkMode,
    isAdmin,
    fonts,
    colors,
    defaultTextSettings,
    templates,
    updateTemplateImage,
    theme,
    setTheme,
    applicationName,
    setApplicationName,
    applicationDescription,
    setApplicationDescription,
    logos,
    updateLogo,
    applyTextCensorship,
    censorshipRules,
    addCensorshipRule,
    removeCensorshipRule,
    updateCensorshipRule,
    watermarkEnabled,
    setWatermarkEnabled,
    autoSaveEnabled,
    setAutoSaveEnabled,
    defaultExportFormat,
    setDefaultExportFormat,
    defaultExportQuality,
    setDefaultExportQuality
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
