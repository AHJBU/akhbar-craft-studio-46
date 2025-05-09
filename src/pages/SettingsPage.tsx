
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateImagesManager } from "@/components/TemplateImagesManager";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Check, Palette, Type, FileImage, FileOutput, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState("appearance");
  const { toast } = useToast();
  const { 
    theme, setTheme, 
    fonts, defaultTextSettings, setDefaultTextSettings,
    colors, 
    watermarkEnabled, setWatermarkEnabled,
    autoSaveEnabled, setAutoSaveEnabled,
    defaultExportFormat, setDefaultExportFormat,
    defaultExportQuality, setDefaultExportQuality
  } = useApp();
  
  const [selectedFont, setSelectedFont] = useState(defaultTextSettings.font);
  const [selectedColor, setSelectedColor] = useState(defaultTextSettings.color);
  const [fontSize, setFontSize] = useState(defaultTextSettings.size.toString());
  
  // Save appearance settings
  const saveAppearanceSettings = () => {
    setDefaultTextSettings({
      font: selectedFont,
      color: selectedColor,
      size: parseInt(fontSize)
    });
    
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات المظهر والخطوط بنجاح",
    });
  };
  
  // Save export settings
  const saveExportSettings = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات التصدير والرقابة بنجاح",
    });
  };
  
  // Save general settings
  const saveGeneralSettings = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ الإعدادات العامة بنجاح",
    });
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">الإعدادات</h1>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="appearance">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>المظهر والخطوط</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="templates">
              <div className="flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                <span>القوالب والمحتوى</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="export">
              <div className="flex items-center gap-2">
                <FileOutput className="h-4 w-4" />
                <span>التصدير والرقابة</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="general">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>إعدادات عامة</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المظهر والخطوط</CardTitle>
                <CardDescription>تخصيص المظهر والخطوط الافتراضية في التطبيق</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label>المظهر</Label>
                  <RadioGroup defaultValue={theme} onValueChange={setTheme} className="flex gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">فاتح</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark">داكن</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system">حسب النظام</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Default Font */}
                <div className="space-y-2">
                  <Label>الخط الافتراضي</Label>
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map(font => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Default Font Size */}
                <div className="space-y-2">
                  <Label>حجم الخط الافتراضي</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48].map(size => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Default Text Color */}
                <div className="space-y-2">
                  <Label>اللون الافتراضي للنصوص</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.map(color => (
                      <Button
                        key={color}
                        variant="outline"
                        className="w-8 h-8 p-0 rounded-full relative"
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      >
                        {selectedColor === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </Button>
                    ))}
                    <label className="flex items-center justify-center w-8 h-8 rounded-full border cursor-pointer overflow-hidden">
                      <Input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="opacity-0 absolute w-8 h-8"
                      />
                    </label>
                  </div>
                </div>
                
                <Button onClick={saveAppearanceSettings} className="mt-4">
                  حفظ إعدادات المظهر
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">إدارة القوالب والمحتوى الافتراضي</h2>
              <TemplateImagesManager />
            </div>
          </TabsContent>
          
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات التصدير والرقابة</CardTitle>
                <CardDescription>تخصيص إعدادات تصدير التصميمات والرقابة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Default Export Format */}
                <div className="space-y-2">
                  <Label>صيغة التصدير الافتراضية</Label>
                  <Select 
                    value={defaultExportFormat} 
                    onValueChange={setDefaultExportFormat}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Export Quality */}
                <div className="space-y-2">
                  <Label>جودة التصدير</Label>
                  <Select 
                    value={defaultExportQuality} 
                    onValueChange={setDefaultExportQuality}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفضة</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Watermark */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="watermark" 
                    checked={watermarkEnabled} 
                    onCheckedChange={setWatermarkEnabled} 
                  />
                  <Label htmlFor="watermark">إضافة العلامة المائية إلى التصميمات</Label>
                </div>
                
                <Button onClick={saveExportSettings} className="mt-4">
                  حفظ إعدادات التصدير
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات العامة</CardTitle>
                <CardDescription>إعدادات عامة للتطبيق</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto Save */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="auto-save" 
                    checked={autoSaveEnabled} 
                    onCheckedChange={setAutoSaveEnabled} 
                  />
                  <Label htmlFor="auto-save">حفظ تلقائي للتغييرات</Label>
                </div>
                
                <Button onClick={saveGeneralSettings} className="mt-4">
                  حفظ الإعدادات العامة
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
