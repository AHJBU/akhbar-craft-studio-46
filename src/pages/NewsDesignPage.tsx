
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DesignCanvas } from "@/components/DesignCanvas";
import { TextStyleControls } from "@/components/TextStyleControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const NewsDesignPage = () => {
  const [templateType, setTemplateType] = useState<"breakingNews" | "general" | "update">("breakingNews");
  const [canvasSize, setCanvasSize] = useState<"square" | "story" | "post">("square");
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [textBoxes, setTextBoxes] = useState<Array<{ id: number; text: string; x: number; y: number; styles: object }>>([]);
  const [selectedTextBox, setSelectedTextBox] = useState<number | null>(null);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { templates } = useApp();
  const { toast } = useToast();
  
  // Calculate canvas dimensions based on size
  const getCanvasDimensions = () => {
    switch (canvasSize) {
      case "square": return { width: 1080, height: 1080 };
      case "story": return { width: 1080, height: 1920 };
      case "post": return { width: 1080, height: 1350 };
      default: return { width: 1080, height: 1080 };
    }
  };
  
  // Update background image when template type or canvas size changes
  const updateBackgroundImage = () => {
    try {
      setIsLoading(true);
      
      // فحص البيانات
      console.log("Templates data:", templates);
      console.log("Current template type:", templateType);
      console.log("Current canvas size:", canvasSize);
      
      // التحقق مما إذا كانت بيانات القوالب متاحة
      if (!templates) {
        console.error("Templates object is undefined");
        setCanvasError("عذراً، لم يتم تحميل بيانات القوالب بشكل صحيح");
        setBackgroundImage("/placeholder.svg");
        setIsLoading(false);
        return;
      }
      
      if (!templates[templateType]) {
        console.error(`Template not found for type: ${templateType}`);
        setCanvasError(`لم يتم العثور على القالب: ${templateType}`);
        setBackgroundImage("/placeholder.svg");
        setIsLoading(false);
        return;
      }
      
      const templateImage = templates[templateType]?.[canvasSize];
      console.log("Loading template image:", templateType, canvasSize, templateImage);
      
      if (!templateImage) {
        console.warn("Template image not found, using default placeholder");
        setBackgroundImage("/placeholder.svg");
        toast({
          title: "تنبيه",
          description: "لم يتم العثور على صورة الخلفية للقالب المحدد. سيتم استخدام خلفية افتراضية.",
        });
      } else {
        setBackgroundImage(templateImage);
      }
      
      setCanvasError(null);
    } catch (error) {
      console.error("Error updating background image:", error);
      setCanvasError("حدث خطأ في تحميل صورة الخلفية");
      setBackgroundImage("/placeholder.svg");
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل صورة الخلفية.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle template type change
  const handleTemplateTypeChange = (value: string) => {
    setTemplateType(value as "breakingNews" | "general" | "update");
  };
  
  // Handle canvas size change
  const handleCanvasSizeChange = (value: string) => {
    setCanvasSize(value as "square" | "story" | "post");
  };
  
  // Update background image when template type or canvas size changes
  useEffect(() => {
    updateBackgroundImage();
  }, [templateType, canvasSize, templates]);

  // Initial setup on component mount
  useEffect(() => {
    console.log("NewsDesignPage mounted");
    console.log("Available templates:", templates);
    
    // إضافة مربع نص افتراضي إذا لم يتم إضافة نص بعد
    if (textBoxes.length === 0) {
      const defaultTextBox = {
        id: Date.now(),
        text: "أدخل العنوان هنا",
        x: 50,
        y: 50,
        styles: {
          fontSize: '24px',
          fontFamily: 'Tajawal, sans-serif',
          color: '#ffffff',
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
  }, []);
  
  const dimensions = getCanvasDimensions();
  
  // إعادة تحميل الصورة عند الضغط على زر التحديث
  const handleRefresh = () => {
    updateBackgroundImage();
    toast({
      title: "جاري التحديث",
      description: "يتم الآن إعادة تحميل صورة الخلفية.",
    });
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">تصميم الأخبار</h1>
        <p className="text-muted-foreground">استخدم القوالب الجاهزة لتصميم منشورات إخبارية متنوعة</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Template and size selection */}
        <Card className="md:col-span-12">
          <CardContent className="flex flex-wrap gap-4 pt-6">
            <div className="w-full sm:w-auto flex-1">
              <Label>نوع القالب</Label>
              <Select value={templateType} onValueChange={handleTemplateTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakingNews">خبر عاجل</SelectItem>
                  <SelectItem value="general">تصميم عام</SelectItem>
                  <SelectItem value="update">تحديث إخباري</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto flex-1">
              <Label>أبعاد التصميم</Label>
              <Select value={canvasSize} onValueChange={handleCanvasSizeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">مربع (1080×1080)</SelectItem>
                  <SelectItem value="story">ستوري (1080×1920)</SelectItem>
                  <SelectItem value="post">منشور (1080×1350)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto mt-auto">
              <Button variant="outline" size="icon" onClick={handleRefresh} title="إعادة تحميل">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Canvas and tools */}
        <div className="md:col-span-8">
          <div className="space-y-6">
            {canvasError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ في تحميل الكانفاس</AlertTitle>
                <AlertDescription>
                  {canvasError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="border-4 border-primary dark:border-primary rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 min-h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <RefreshCw className="animate-spin h-10 w-10 mx-auto mb-4 text-primary" />
                    <p>جاري تحميل الكانفاس...</p>
                  </div>
                </div>
              ) : (
                <DesignCanvas 
                  backgroundImage={backgroundImage} 
                  width={dimensions.width} 
                  height={dimensions.height}
                  textBoxes={textBoxes}
                  setTextBoxes={setTextBoxes}
                  selectedTextBox={selectedTextBox}
                  setSelectedTextBox={setSelectedTextBox}
                />
              )}
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              أبعاد الكانفاس: {dimensions.width}×{dimensions.height} بكسل
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
    </Layout>
  );
};

export default NewsDesignPage;
