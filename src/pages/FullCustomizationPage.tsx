
import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DesignCanvas } from "@/components/DesignCanvas";
import { TextStyleControls } from "@/components/TextStyleControls";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Image as ImageIcon, AlertCircle, Loader } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const FullCustomizationPage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 1080, height: 1080 });
  const [textBoxes, setTextBoxes] = useState<Array<{ id: number; text: string; x: number; y: number; styles: object }>>([]);
  const [selectedTextBox, setSelectedTextBox] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logos, defaultTextSettings } = useApp();
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleImageFile(file);
  };
  
  const handleImageFile = (file?: File) => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: "الرجاء اختيار ملف صورة (.jpg, .png, .webp, etc.)",
        variant: "destructive",
      });
      setIsLoading(false);
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
      setIsLoading(false);
      
      // إضافة مربع نص افتراضي إذا لم يتم إضافة نص بعد
      if (textBoxes.length === 0) {
        const defaultTextBox = {
          id: Date.now(),
          text: "أدخل النص هنا",
          x: 50,
          y: 50,
          styles: {
            fontSize: defaultTextSettings?.size + 'px' || '24px',
            fontFamily: defaultTextSettings?.font || 'Tajawal, sans-serif',
            color: defaultTextSettings?.color || '#ffffff',
            fontWeight: 'bold',
            direction: 'rtl',
            textAlign: 'right',
            padding: '10px',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '4px'
          }
        };
        setTextBoxes([defaultTextBox]);
      }
    };
    img.onerror = () => {
      setError("فشل تحميل الصورة. تأكد من أن الملف هو صورة صالحة.");
      toast({
        title: "فشل تحميل الصورة",
        description: "حدث خطأ أثناء محاولة تحميل الصورة",
        variant: "destructive",
      });
      setIsLoading(false);
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
    setIsLoading(true);
    setError(null);
    
    const logoUrl = logos[type];
    
    if (!logoUrl) {
      setError("الشعار غير متوفر. يمكنك تعيين الشعار من صفحة الإعدادات.");
      toast({
        title: "الشعار غير متوفر",
        description: "لم يتم تعيين الشعار. يمكنك رفع شعار من صفحة الإعدادات.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Get dimensions of the logo
    const img = new Image();
    img.onload = () => {
      setOriginalImageDimensions({ width: img.width || 800, height: img.height || 800 });
      setBackgroundImage(logoUrl);
      setIsLoading(false);
      
      // إضافة مربع نص افتراضي إذا لم يتم إضافة نص بعد
      if (textBoxes.length === 0) {
        const defaultTextBox = {
          id: Date.now(),
          text: "أدخل النص هنا",
          x: img.width / 2 - 150, 
          y: img.height / 2 - 30,
          styles: {
            fontSize: defaultTextSettings?.size + 'px' || '24px',
            fontFamily: defaultTextSettings?.font || 'Tajawal, sans-serif',
            color: defaultTextSettings?.color || '#ffffff',
            fontWeight: 'bold',
            direction: 'rtl',
            textAlign: 'right',
            padding: '10px',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '4px'
          }
        };
        setTextBoxes([defaultTextBox]);
      }
    };
    img.onerror = () => {
      setError(`فشل تحميل الشعار ${type}. تأكد من أنه تم تعيينه بشكل صحيح.`);
      toast({
        title: "فشل تحميل الشعار",
        description: "حدث خطأ أثناء محاولة تحميل الشعار",
        variant: "destructive",
      });
      setIsLoading(false);
    };
    img.src = logoUrl;
  };

  // Check if logos are available when component mounts
  useEffect(() => {
    console.log("Available logos:", logos);
  }, [logos]);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">تخصيص كامل</h1>
        <p className="text-muted-foreground">صمم منشورات خاصة باستخدام صورك ونصوصك المخصصة</p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!backgroundImage ? (
        <div 
          className={`bg-gray-50 dark:bg-gray-800 border-4 border-dashed ${
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
            <Button 
              onClick={triggerFileUpload} 
              className="mb-4" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 ml-2 animate-spin" />
                  جاري التحميل...
                </>
              ) : (
                'اختيار صورة'
              )}
            </Button>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold mb-4">أو استخدم شعار</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => useLogoAsBackground("horizontal")}
                disabled={isLoading}
              >
                <ImageIcon className="h-4 w-4 ml-2" />
                الشعار الأفقي
              </Button>
              <Button 
                variant="outline" 
                onClick={() => useLogoAsBackground("square")}
                disabled={isLoading}
              >
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
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setBackgroundImage(undefined);
                    // تنظيف عنوان URL الذي تم إنشاؤه بواسطة URL.createObjectURL
                    if (backgroundImage && backgroundImage.startsWith('blob:')) {
                      URL.revokeObjectURL(backgroundImage);
                    }
                  }}
                >
                  اختيار صورة أخرى
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => useLogoAsBackground("horizontal")}
                    disabled={isLoading}
                  >
                    الشعار الأفقي
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => useLogoAsBackground("square")}
                    disabled={isLoading}
                  >
                    الشعار المربع
                  </Button>
                </div>
              </div>
              
              <div className="border-4 border-primary dark:border-primary rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Loader className="animate-spin h-10 w-10 mx-auto mb-4 text-primary" />
                      <p>جاري تحميل الصورة...</p>
                    </div>
                  </div>
                ) : (
                  <DesignCanvas 
                    backgroundImage={backgroundImage} 
                    width={originalImageDimensions.width} 
                    height={originalImageDimensions.height}
                    textBoxes={textBoxes}
                    setTextBoxes={setTextBoxes}
                    selectedTextBox={selectedTextBox}
                    setSelectedTextBox={setSelectedTextBox}
                  />
                )}
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                أبعاد الصورة: {originalImageDimensions.width}×{originalImageDimensions.height} بكسل
              </div>
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
