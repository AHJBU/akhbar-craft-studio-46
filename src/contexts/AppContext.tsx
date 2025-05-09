import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for our context
interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("admin_username"));
  
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
  
  // Template images
  const [templates, setTemplates] = useState(() => {
    // Check if we have templates in localStorage
    const savedTemplates = localStorage.getItem("news_templates");
    if (savedTemplates) {
      return JSON.parse(savedTemplates);
    }
    
    // Default templates
    return {
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
    };
  });
  
  useEffect(() => {
    // Save templates to localStorage when they change
    localStorage.setItem("news_templates", JSON.stringify(templates));
  }, [templates]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // Check if this is the first login
    const isFirstLogin = !localStorage.getItem("admin_username");
    
    if (isFirstLogin) {
      // First login - set the credentials
      localStorage.setItem("admin_username", username);
      localStorage.setItem("admin_password", password); // In a real app, use hashing
      setIsAdmin(true);
      return true;
    } else {
      // Check credentials
      const storedUsername = localStorage.getItem("admin_username");
      const storedPassword = localStorage.getItem("admin_password");
      
      if (username === storedUsername && password === storedPassword) {
        setIsAdmin(true);
        return true;
      }
    }
    
    return false;
  };
  
  // Logout function
  const logout = () => {
    setIsAdmin(false);
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
  
  // Define the value for the context provider
  const contextValue: AppContextType = {
    darkMode,
    toggleDarkMode,
    isAdmin,
    login,
    logout,
    fonts,
    colors,
    defaultTextSettings,
    templates,
    updateTemplateImage
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
