
import React, { createContext, useContext, useState } from "react";

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
  applicationDescription: string;
  logos: {
    horizontal: string;
    square: string;
  };
  applyTextCensorship: (text: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState("light");
  
  // Application info
  const applicationName = "تطبيق تصميم الأخبار";
  const applicationDescription = "منصة متكاملة لتصميم المحتوى الإخباري بسهولة وإحترافية";
  
  // Available fonts
  const fonts = ["Cairo", "Tajawal", "Almarai", "Changa", "Noto Kufi Arabic"];
  
  // Available colors
  const colors = ["#000000", "#FFFFFF", "#D32F2F", "#1976D2", "#388E3C", "#FBC02D"];
  
  // Default text settings
  const defaultTextSettings = {
    size: 24,
    font: "Cairo",
    color: "#000000"
  };
  
  // Logo images for custom design
  const logos = {
    horizontal: "/templates/logo_horizontal.png",
    square: "/templates/logo_square.png"
  };
  
  // Template images
  const [templates, setTemplates] = useState({
    breakingNews: {
      square: "/templates/breaking_square.png",
      story: "/templates/breaking_story.png",
      post: "/templates/breaking_post.png"
    },
    general: {
      square: "/templates/general_square.png",
      story: "/templates/general_story.png",
      post: "/templates/general_post.png"
    },
    update: {
      square: "/templates/update_square.png",
      story: "/templates/update_story.png",
      post: "/templates/update_post.png"
    }
  });
  
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

  // Apply text censorship
  const applyTextCensorship = (text: string): string => {
    // Default censorship rules
    const censorshipRules = [
      { original: "فلسطين", replacement: "فلسـطين" },
      { original: "حماس", replacement: "حمـ.ـاس" },
      { original: "الاحتلال", replacement: "الآحـتلال" }
    ];

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
    applicationDescription,
    logos,
    applyTextCensorship
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
