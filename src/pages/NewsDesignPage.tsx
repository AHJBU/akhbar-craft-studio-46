
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DesignCanvas } from "@/components/DesignCanvas";
import { TextStyleControls } from "@/components/TextStyleControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";

const NewsDesignPage = () => {
  const [templateType, setTemplateType] = useState<"breakingNews" | "general" | "update">("breakingNews");
  const [canvasSize, setCanvasSize] = useState<"square" | "story" | "post">("square");
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [textBoxes, setTextBoxes] = useState<Array<{ id: number; text: string; x: number; y: number; styles: object }>>([]);
  const [selectedTextBox, setSelectedTextBox] = useState<number | null>(null);
  
  const { templates } = useApp();
  
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
    const templateImage = templates[templateType][canvasSize];
    setBackgroundImage(templateImage);
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
  
  const dimensions = getCanvasDimensions();
  
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
          </CardContent>
        </Card>
        
        {/* Canvas and tools */}
        <div className="md:col-span-8">
          <div className="space-y-6">
            <DesignCanvas 
              backgroundImage={backgroundImage} 
              width={dimensions.width} 
              height={dimensions.height} 
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
    </Layout>
  );
};

export default NewsDesignPage;
