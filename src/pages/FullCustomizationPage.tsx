
import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DesignCanvas } from "@/components/DesignCanvas";
import { TextStyleControls } from "@/components/TextStyleControls";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const FullCustomizationPage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 1080, height: 1080 });
  const [textBoxes, setTextBoxes] = useState<Array<{ id: number; text: string; x: number; y: number; styles: object }>>([]);
  const [selectedTextBox, setSelectedTextBox] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logos } = useApp();
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleImageFile(file);
  };
  
  const handleImageFile = (file?: File) => {
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: "الرجاء اختيار ملف صورة (.jpg, .png, .webp, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Create object URL for the image
    const imageUrl = URL.createObjectURL(file);
    
    // Get dimensions of the image
    const img = new Image();
    img.onload = () => {
      setOriginalImageDimensions({ width: img.width, height: img.height });
      setBackgroundImage(imageUrl);
      
      toast({
        title: "تم تحميل الصورة بنجاح",
        description: `تم تحميل الصورة بأبعاد ${img.width}×${img.height}`,
      });
    };
    img.onerror = () => {
      toast({
        title: "فشل تحميل الصورة",
        description: "حدث خطأ أثناء محاولة تحميل الصورة",
        variant: "destructive",
      });
    };
    img.src = imageUrl;
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Use logo as background
  const useLogoAsBackground = (type: "horizontal" | "square") => {
    const logoUrl = logos[type];
    
    if (!logoUrl) {
      toast({
        title: "الشعار غير متوفر",
        description: "لم يتم تعيين الشعار. يمكنك رفع شعار من صفحة الإعدادات.",
        variant: "destructive",
      });
      return;
    }
    
    // Get dimensions of the logo
    const img = new Image();
    img.onload = () => {
      setOriginalImageDimensions({ width: img.width || 800, height: img.height || 800 });
      setBackgroundImage(logoUrl);
    };
    img.src = logoUrl;
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">تخصيص كامل</h1>
        <p className="text-muted-foreground">صمم منشورات خاصة باستخدام صورك ونصوصك المخصصة</p>
      </div>
      
      {!backgroundImage ? (
        <div 
          className={`bg-gray-50 dark:bg-gray-800 border-2 border-dashed ${
            isDragOver ? "border-primary" : "border-gray-300 dark:border-gray-600"
          } rounded-lg p-12 text-center`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          
          <div className="mb-8">
            <div className="mx-auto bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">رفع صورة</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">اسحب وأفلت صورة هنا، أو انقر لاختيار صورة</p>
            <Button onClick={triggerFileUpload} className="mb-4">اختيار صورة</Button>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold mb-4">أو استخدم شعار</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" onClick={() => useLogoAsBackground("horizontal")}>
                <ImageIcon className="h-4 w-4 ml-2" />
                الشعار الأفقي
              </Button>
              <Button variant="outline" onClick={() => useLogoAsBackground("square")}>
                <ImageIcon className="h-4 w-4 ml-2" />
                الشعار المربع
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Canvas and tools */}
          <div className="md:col-span-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setBackgroundImage(undefined)}>
                  اختيار صورة أخرى
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => useLogoAsBackground("horizontal")}>
                    الشعار الأفقي
                  </Button>
                  <Button variant="outline" onClick={() => useLogoAsBackground("square")}>
                    الشعار المربع
                  </Button>
                </div>
              </div>
              
              <DesignCanvas 
                backgroundImage={backgroundImage} 
                width={originalImageDimensions.width} 
                height={originalImageDimensions.height}
                textBoxes={textBoxes}
                setTextBoxes={setTextBoxes}
                selectedTextBox={selectedTextBox}
                setSelectedTextBox={setSelectedTextBox}
              />
            </div>
          </div>
          
          {/* Text styling panel */}
          <div className="md:col-span-4">
            <TextStyleControls 
              selectedTextBox={selectedTextBox}
              textBoxes={textBoxes}
              setTextBoxes={setTextBoxes}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FullCustomizationPage;
