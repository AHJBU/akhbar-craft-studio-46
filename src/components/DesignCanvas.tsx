
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/contexts/AppContext";
import { ZoomIn, ZoomOut, Grid, Download, Move, Type } from "lucide-react";
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fileName, setFileName] = useState("my-news-design");
  
  const { defaultTextSettings } = useApp();
  
  // Adjust initial zoom to fit canvas in viewport (with some margin)
  useEffect(() => {
    const calculateZoom = () => {
      if (!canvasRef.current) return;
      
      const containerRect = canvasRef.current.parentElement?.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      
      // Calculate available space (with margins)
      const availableWidth = containerRect.width - 40; // 20px margin on each side
      const availableHeight = window.innerHeight * 0.6; // 60% of viewport height
      
      // Calculate zoom factors
      const widthZoom = availableWidth / width;
      const heightZoom = availableHeight / height;
      
      // Take the smaller zoom factor to ensure entire canvas is visible
      const newZoom = Math.min(widthZoom, heightZoom, 1); // Cap at 1 to prevent too large
      
      setZoom(Math.max(newZoom, 0.1)); // Minimum zoom of 0.1
      
      // Center the canvas
      setPosition({
        x: (availableWidth - width * newZoom) / 2,
        y: 0
      });
    };
    
    calculateZoom();
    window.addEventListener('resize', calculateZoom);
    
    return () => {
      window.removeEventListener('resize', calculateZoom);
    };
  }, [width, height]);
  
  // Handle adding a new text box
  const addTextBox = () => {
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
    setTextBoxes([...textBoxes, newTextBox]);
    setSelectedTextBox(newTextBox.id);
  };
  
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
  }, [textBoxes]);
  
  // Export the design
  const handleExport = async () => {
    if (!canvasRef.current) return;
    
    toast({
      title: "جاري التصدير...",
      description: "يتم الآن تصدير التصميم كصورة.",
    });
    
    try {
      // Use html2canvas to convert the design to an image
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: backgroundImage ? 'transparent' : '#ffffff',
        scale: 2, // Higher quality
        useCORS: true, // Allow cross-origin images
        logging: false,
        allowTaint: true,
        removeContainer: false
      });
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "تم التصدير بنجاح",
        description: `تم حفظ التصميم باسم ${fileName}.png`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "destructive",
        title: "فشل التصدير",
        description: "حدث خطأ أثناء محاولة تصدير التصميم.",
      });
    }
  };
  
  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };
  
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
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
                  min={50}
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
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">.png</span>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleExport}>
                    <Download className="h-4 w-4 ml-2" />
                    تصدير
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
      
      {/* Canvas area with auto-fit sizing */}
      <div 
        className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 relative"
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
              className="relative origin-top-left"
              style={{
                width: width,
                height: height,
                transform: `scale(${zoom})`,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundColor: backgroundImage ? 'transparent' : '#ffffff',
              }}
            >
              {showGrid && (
                <div className="absolute inset-0 grid" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  pointerEvents: 'none'
                }} />
              )}
              
              {textBoxes.map((textBox) => (
                <div
                  key={textBox.id}
                  className={`absolute text-box p-2 ${selectedTextBox === textBox.id ? 'border-2 border-primary' : ''}`}
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
        
        {/* Pan hint */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-lg opacity-70 flex items-center space-x-2">
          <Move className="h-4 w-4" />
          <span className="text-xs">انقر واسحب للتحريك</span>
        </div>
      </div>
    </div>
  );
};
