
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/contexts/AppContext";

export const TemplateImagesManager = () => {
  const { toast } = useToast();
  const { templates, updateTemplateImage, logos, updateLogo } = useApp();
  const [activeTab, setActiveTab] = useState("breaking");
  
  // Template types and sizes
  const templateTypes = [
    { id: "breakingNews", label: "خبر عاجل", tab: "breaking" },
    { id: "general", label: "تصميم عام", tab: "general" },
    { id: "update", label: "تحديث إخباري", tab: "update" }
  ];
  
  const templateSizes = [
    { id: "square", label: "مربع (1080×1080)" },
    { id: "story", label: "ستوري (1080×1920)" },
    { id: "post", label: "منشور (1080×1350)" }
  ];
  
  // Handle image upload for templates
  const handleTemplateImageUpload = (templateType: string, size: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "نوع ملف غير صالح",
        description: "يرجى اختيار ملف صورة فقط",
        variant: "destructive"
      });
      return;
    }
    
    // File size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "حجم الملف كبير جدًا",
        description: "يرجى اختيار ملف بحجم أقل من 5 ميجابايت",
        variant: "destructive"
      });
      return;
    }
    
    // Convert to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // Update the template image
        updateTemplateImage(templateType, size as "square" | "story" | "post", event.target.result as string);
        
        toast({
          title: "تم تحديث الصورة بنجاح",
          description: `تم تحديث صورة ${templateSizes.find(s => s.id === size)?.label} لقالب ${templateTypes.find(t => t.id === templateType)?.label}`
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle logo upload
  const handleLogoUpload = (logoType: "horizontal" | "square", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "نوع ملف غير صالح",
        description: "يرجى اختيار ملف صورة فقط",
        variant: "destructive"
      });
      return;
    }
    
    // File size limit (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "حجم الملف كبير جدًا",
        description: "يرجى اختيار ملف بحجم أقل من 2 ميجابايت",
        variant: "destructive"
      });
      return;
    }
    
    // Convert to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // Update the logo
        updateLogo(logoType, event.target.result as string);
        
        toast({
          title: "تم تحديث الشعار بنجاح",
          description: `تم تحديث الشعار ${logoType === "horizontal" ? "الأفقي" : "المربع"}`
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة صور القوالب والشعارات</CardTitle>
        <CardDescription>قم بتحميل صور مخصصة للقوالب المختلفة والشعارات</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-4">
            {templateTypes.map(type => (
              <TabsTrigger key={type.tab} value={type.tab}>{type.label}</TabsTrigger>
            ))}
            <TabsTrigger value="logos">الشعارات</TabsTrigger>
          </TabsList>
          
          {templateTypes.map(templateType => (
            <TabsContent key={templateType.tab} value={templateType.tab}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templateSizes.map(size => {
                  const currentImage = templates[templateType.id]?.[size.id];
                  
                  return (
                    <div key={size.id} className="flex flex-col items-center">
                      <h3 className="text-md font-medium mb-2">{size.label}</h3>
                      <div 
                        className="relative w-full aspect-square md:aspect-auto md:h-48 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden mb-2 border border-gray-300 dark:border-gray-600"
                        style={{
                          backgroundImage: currentImage ? `url(${currentImage})` : 'none',
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        {!currentImage && (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            لا توجد صورة
                          </div>
                        )}
                      </div>
                      <label className="w-full">
                        <Button variant="outline" className="w-full" asChild>
                          <div>تحميل صورة جديدة</div>
                        </Button>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleTemplateImageUpload(templateType.id, size.id, e)}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
          
          <TabsContent value="logos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: "horizontal", label: "الشعار الأفقي" },
                { id: "square", label: "الشعار المربع" }
              ].map(logo => {
                const currentLogo = logos[logo.id as "horizontal" | "square"];
                
                return (
                  <div key={logo.id} className="flex flex-col items-center">
                    <h3 className="text-md font-medium mb-2">{logo.label}</h3>
                    <div 
                      className="relative w-full aspect-video md:h-48 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden mb-2 border border-gray-300 dark:border-gray-600"
                      style={{
                        backgroundImage: currentLogo ? `url(${currentLogo})` : 'none',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    >
                      {!currentLogo && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          لا يوجد شعار
                        </div>
                      )}
                    </div>
                    <label className="w-full">
                      <Button variant="outline" className="w-full" asChild>
                        <div>تحميل شعار جديد</div>
                      </Button>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(logo.id as "horizontal" | "square", e)}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
