import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/contexts/AppContext";
import { ZoomIn, ZoomOut, Grid, Download, Move, Type, Loader, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import html2canvas from "html2canvas";

interface DesignCanvasProps {
  backgroundImage?: string;
  width?: number;
  height?: number;
  textBoxes: Array<{ id: number; text: string; x: number; y: number; styles: any }>;
  setTextBoxes: React.Dispatch<React.SetStateAction<Array<{ id: number; text: string; x: number; y: number; styles: any }>>>;
  selectedTextBox: number | null;
  setSelectedTextBox: React.Dispatch<React.SetStateAction<number | null>>;
}

export const DesignCanvas = ({ 
  backgroundImage, 
  width = 1080, 
  height = 1080, 
  textBoxes, 
  setTextBoxes, 
  selectedTextBox, 
  setSelectedTextBox 
}: DesignCanvasProps) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fileName, setFileName] = useState("my-news-design");
  const [imageError, setImageError] = useState(false);
  
  const { 
    defaultTextSettings, 
    watermarkEnabled, 
    defaultExportFormat, 
    defaultExportQuality,
    applicationName 
  } = useApp();

  // تشخيص التحميل
  useEffect(() => {
    console.log("DesignCanvas mounted", { 
      backgroundImage, 
      width, 
      height, 
      textBoxes,
      zoom,
      position
    });
  }, []);

  // تشخيص تحديث الصورة
  useEffect(() => {
    console.log("Background image updated:", backgroundImage);
    // Reset image error when background changes
    setImageError(false);
  }, [backgroundImage]);

  // Function to calculate ideal zoom based on container size
  const calculateIdealZoom = useCallback(() => {
    if (!canvasRef.current) return 0.5;
    
    const containerRect = canvasRef.current.parentElement?.parentElement?.getBoundingClientRect();
    if (!containerRect) return 0.5;
    
    // Calculate available space (with margins)
    const availableWidth = containerRect.width - 40; // 20px margin on each side
    const availableHeight = window.innerHeight * 0.6; // 60% of viewport height
    
    // Calculate zoom factors
    const widthZoom = availableWidth / width;
    const heightZoom = availableHeight / height;
    
    // Take the smaller zoom factor to ensure entire canvas is visible
    const newZoom = Math.min(widthZoom, heightZoom, 1); // Cap at 1 to prevent too large
    
    return Math.max(newZoom, 0.1); // Minimum zoom of 0.1
  }, [width, height]);
  
  // Adjust initial zoom to fit canvas in viewport (with some margin)
  useEffect(() => {
    const handleResize = () => {
      const newZoom = calculateIdealZoom();
      setZoom(newZoom);
      console.log("Calculated zoom:", newZoom);
      
      // Center the canvas
      if (canvasRef.current) {
        const containerRect = canvasRef.current.parentElement?.parentElement?.getBoundingClientRect();
        if (containerRect) {
          const availableWidth = containerRect.width - 40;
          const newPosition = {
            x: (availableWidth - width * newZoom) / 2,
            y: 0
          };
          console.log("New position:", newPosition);
          setPosition(newPosition);
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height, calculateIdealZoom]);
  
  // Handle adding a new text box
  const addTextBox = useCallback(() => {
    const newTextBox = {
      id: Date.now(),
      text: "أدخل النص هنا",
      x: Math.max(width / 2 - 100, 0), // Center horizontally
      y: Math.max(height / 2 - 20, 0), // Center vertically
      styles: {
        fontSize: defaultTextSettings.size + 'px',
        fontFamily: defaultTextSettings.font,
        color: defaultTextSettings.color,
        direction: 'rtl',
        textAlign: 'right',
      }
    };
    setTextBoxes(prev => [...prev, newTextBox]);
    setSelectedTextBox(newTextBox.id);
  }, [width, height, defaultTextSettings, setTextBoxes, setSelectedTextBox]);
  
  // Handle canvas dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if not clicking on a text box
    if ((e.target as HTMLElement).closest('.text-box') === null) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  // Handle image loading error
  const handleImageError = () => {
    console.error("Failed to load image:", backgroundImage);
    setImageError(true);
    toast({
      variant: "destructive",
      title: "خطأ في تحميل الصورة",
      description: "تعذر تحميل صورة الخلفية. سيتم استخدام خلفية بديلة.",
    });
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + T to add text box
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        addTextBox();
      }
      
      // Ctrl/Cmd + E to export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExport();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addTextBox]);
  
  // Export the design
  const handleExport = async () => {
    if (!canvasRef.current || isExporting) return;
    
    setIsExporting(true);
    
    toast({
      title: "جاري التصدير...",
      description: "يتم الآن تصدير التصميم كصورة.",
    });
    
    try {
      // Hide UI elements for export
      const editModeElements = canvasRef.current.querySelectorAll('.edit-ui-element');
      editModeElements.forEach(el => (el as HTMLElement).style.display = 'none');
      
      // Set quality based on settings
      const scale = defaultExportQuality === 'high' ? 3 : 
                   defaultExportQuality === 'medium' ? 2 : 1;
      
      // Use html2canvas to convert the design to an image
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: backgroundImage ? 'transparent' : '#ffffff',
        scale: scale, // Higher quality
        useCORS: true, // Allow cross-origin images
        logging: false,
        allowTaint: true,
        removeContainer: false
      });
      
      // Add watermark if enabled
      if (watermarkEnabled) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '14px Arial';
          ctx.textAlign = 'end';
          ctx.fillText(applicationName, canvas.width - 10, canvas.height - 10);
        }
      }
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `${fileName}.${defaultExportFormat}`;
      link.href = canvas.toDataURL(`image/${defaultExportFormat}`, defaultExportFormat === 'jpg' ? 0.9 : undefined);
      link.click();
      
      toast({
        title: "تم التصدير بنجاح",
        description: `تم حفظ التصميم باسم ${fileName}.${defaultExportFormat}`,
      });
      
      // Show UI elements again
      editModeElements.forEach(el => (el as HTMLElement).style.display = '');
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "destructive",
        title: "فشل التصدير",
        description: "حدث خطأ أثناء محاولة تصدير التصميم.",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };
  
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.1));
  };

  // Reset zoom and center canvas
  const handleResetZoom = () => {
    const newZoom = calculateIdealZoom();
    setZoom(newZoom);
    
    // Center the canvas
    if (canvasRef.current) {
      const containerRect = canvasRef.current.parentElement?.parentElement?.getBoundingClientRect();
      if (containerRect) {
        const availableWidth = containerRect.width - 40;
        setPosition({
          x: (availableWidth - width * newZoom) / 2,
          y: 0
        });
      }
    }
  };
  
  // Get background style based on image or fallback
  const getBackgroundStyle = () => {
    if (!backgroundImage || imageError) {
      // خلفية افتراضية إذا كانت الصورة غير متوفرة أو حدث خطأ في تحميلها
      return {
        backgroundColor: '#f0f0f0',
        backgroundImage: 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%), linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px'
      };
    }
    
    return {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundColor: 'transparent',
    };
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          {/* Left side toolbar */}
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={addTextBox}>
                    <Type className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>إضافة نص جديد (Ctrl+T)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowGrid(!showGrid)}>
                    <Grid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showGrid ? 'إخفاء' : 'إظهار'} الشبكة المساعدة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="w-24">
                <Slider
                  value={[zoom * 100]}
                  min={10}
                  max={300}
                  step={10}
                  className="w-full"
                  onValueChange={(value) => setZoom(value[0] / 100)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={handleResetZoom}>
                ضبط تلقائي
              </Button>
            </div>
          </div>
          
          {/* Right side toolbar */}
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="border rounded px-3 py-1 text-sm w-40"
                placeholder="اسم الملف"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">.{defaultExportFormat}</span>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleExport} disabled={isExporting}>
                    {isExporting ? (
                      <>
                        <Loader className="h-4 w-4 ml-2 animate-spin" />
                        جاري التصدير...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 ml-2" />
                        تصدير
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تصدير التصميم كصورة (Ctrl+E)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Canvas area with auto-fit sizing and visible border */}
      <div 
        className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 relative"
        style={{ height: "500px", maxHeight: "80vh" }}
      >
        <div className="absolute inset-0 overflow-auto">
          <div
            className="absolute cursor-move"
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
          >
            <div
              ref={canvasRef}
              className="relative origin-top-left shadow-lg"
              style={{
                width: width,
                height: height,
                transform: `scale(${zoom})`,
                ...getBackgroundStyle(),
                transition: 'transform 0.2s ease',
                border: '1px solid rgba(0,0,0,0.2)',
              }}
            >
              {imageError && backgroundImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
                  <div className="text-center p-4">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
                    <p className="text-red-600 font-medium">تعذر تحميل الصورة</p>
                  </div>
                </div>
              )}
              
              {showGrid && (
                <div className="absolute inset-0 grid edit-ui-element" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  pointerEvents: 'none'
                }} />
              )}
              
              {/* Image loader with onError handler */}
              {backgroundImage && !imageError && (
                <img 
                  src={backgroundImage}
                  className="hidden"
                  onError={handleImageError}
                  alt="preload"
                />
              )}
              
              {textBoxes.map((textBox) => (
                <div
                  key={textBox.id}
                  className={`absolute text-box ${selectedTextBox === textBox.id ? 'border-2 border-primary edit-ui-element' : ''}`}
                  style={{
                    top: textBox.y,
                    left: textBox.x,
                    minWidth: '100px',
                    minHeight: '40px',
                    cursor: 'text',
                    ...textBox.styles,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTextBox(textBox.id);
                  }}
                >
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newTextBoxes = textBoxes.map(tb => 
                        tb.id === textBox.id ? { ...tb, text: e.target.textContent || '' } : tb
                      );
                      setTextBoxes(newTextBoxes);
                    }}
                  >
                    {textBox.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Hint for empty canvas */}
        {textBoxes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center p-6 bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 rounded-lg">
              <Type className="mx-auto h-12 w-12 text-primary mb-2" />
              <p className="text-lg font-medium">أضف عناصر نص للبدء</p>
              <p className="text-sm text-muted-foreground mt-1">اضغط Ctrl+T أو انقر على زر "إضافة نص" لإضافة مربع نص</p>
            </div>
          </div>
        )}
        
        {/* Pan hint */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-lg opacity-70 flex items-center space-x-2 edit-ui-element">
          <Move className="h-4 w-4" />
          <span className="text-xs">انقر واسحب للتحريك</span>
        </div>
      </div>
    </div>
  );
};
