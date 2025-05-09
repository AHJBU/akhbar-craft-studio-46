
/**
 * Utility for loading custom fonts from localStorage
 */

// Load custom fonts from localStorage and inject them into the document head
export const loadCustomFonts = () => {
  try {
    // Get custom fonts from localStorage
    const customFontsStr = localStorage.getItem('customFonts');
    if (!customFontsStr) return;
    
    const customFonts = JSON.parse(customFontsStr);
    
    // Add each font link to head
    customFonts.forEach((font: { name: string, url: string }) => {
      // Check if this font is already loaded
      const existingLinks = document.querySelectorAll(`link[href="${font.url}"]`);
      if (existingLinks.length === 0) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = font.url;
        document.head.appendChild(linkElement);
        console.log(`Loaded custom font: ${font.name}`);
      }
    });
  } catch (error) {
    console.error('Error loading custom fonts:', error);
  }
};

// Initialize favicon from localStorage
export const initializeFavicon = () => {
  try {
    const siteFavicon = localStorage.getItem('siteFavicon');
    if (!siteFavicon) return;
    
    let faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    
    faviconLink.setAttribute('href', siteFavicon);
  } catch (error) {
    console.error('Error initializing favicon:', error);
  }
};
