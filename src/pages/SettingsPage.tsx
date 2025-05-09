
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateImagesManager } from "@/components/TemplateImagesManager";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash, Check, Palette, Type, FileImage, FileOutput, Settings, Edit, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState("appearance");
  const { toast } = useToast();
  const { 
    theme, setTheme, 
    fonts, defaultTextSettings,
    colors, 
    watermarkEnabled, setWatermarkEnabled,
    autoSaveEnabled, setAutoSaveEnabled,
    defaultExportFormat, setDefaultExportFormat,
    defaultExportQuality, setDefaultExportQuality,
    applicationName, setApplicationName,
    applicationDescription, setApplicationDescription,
    censorshipRules, addCensorshipRule, removeCensorshipRule, updateCensorshipRule
  } = useApp();
  
  const [selectedFont, setSelectedFont] = useState(defaultTextSettings.font);
  const [selectedColor, setSelectedColor] = useState(defaultTextSettings.color);
  const [fontSize, setFontSize] = useState(defaultTextSettings.size.toString());
  
  // New states for censorship rule management
  const [newRuleOriginal, setNewRuleOriginal] = useState("");
  const [newRuleReplacement, setNewRuleReplacement] = useState("");
  
  // New states for custom fonts
  const [customFontName, setCustomFontName] = useState("");
  const [customFontUrl, setCustomFontUrl] = useState("");

  // New states for site settings
  const [siteNameInput, setSiteNameInput] = useState(applicationName);
  const [siteDescInput, setSiteDescInput] = useState(applicationDescription);
  const [siteFaviconUrl, setSiteFaviconUrl] = useState("");
  
  // Save appearance settings
  const saveAppearanceSettings = () => {
    localStorage.setItem('defaultTextSettings', JSON.stringify({
      font: selectedFont,
      color: selectedColor,
      size: parseInt(fontSize)
    }));
    
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات المظهر والخطوط بنجاح",
    });
  };
  
  // Save custom font
  const saveCustomFont = () => {
    if (!customFontName.trim() || !customFontUrl.trim()) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى إدخال اسم الخط ورابط ملف CSS",
        variant: "destructive"
      });
      return;
    }
    
    // Add font link to head
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = customFontUrl;
    document.head.appendChild(linkElement);
    
    // Save to local storage
    const customFonts = JSON.parse(localStorage.getItem('customFonts') || '[]');
    customFonts.push({ name: customFontName, url: customFontUrl });
    localStorage.setItem('customFonts', JSON.stringify(customFonts));
    
    toast({
      title: "تم إضافة الخط",
      description: `تم إضافة الخط ${customFontName} بنجاح`
    });
    
    // Reset form
    setCustomFontName("");
    setCustomFontUrl("");
  };
  
  // Add censorship rule
  const handleAddCensorshipRule = () => {
    if (!newRuleOriginal.trim() || !newRuleReplacement.trim()) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى إدخال الكلمة الأصلية والكلمة البديلة",
        variant: "destructive"
      });
      return;
    }
    
    addCensorshipRule(newRuleOriginal, newRuleReplacement);
    
    toast({
      title: "تم إضافة القاعدة",
      description: `تم إضافة قاعدة استبدال الكلمة "${newRuleOriginal}" بالكلمة "${newRuleReplacement}"`
    });
    
    setNewRuleOriginal("");
    setNewRuleReplacement("");
  };
  
  // Save site settings
  const saveSiteSettings = () => {
    if (!siteNameInput.trim()) {
      toast({
        title: "اسم الموقع مطلوب",
        description: "يرجى إدخال اسم للموقع",
        variant: "destructive"
      });
      return;
    }
    
    setApplicationName(siteNameInput);
    setApplicationDescription(siteDescInput);
    
    // Update favicon if provided
    if (siteFaviconUrl.trim()) {
      const faviconLink = document.querySelector('link[rel="icon"]');
      if (faviconLink) {
        faviconLink.setAttribute('href', siteFaviconUrl);
        localStorage.setItem('siteFavicon', siteFaviconUrl);
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = siteFaviconUrl;
        document.head.appendChild(newLink);
        localStorage.setItem('siteFavicon', siteFaviconUrl);
      }
    }
    
    toast({
      title: "تم حفظ إعدادات الموقع",
      description: "تم تحديث اسم الموقع ووصفه وأيقونته بنجاح"
    });
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">الإعدادات</h1>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-1 md:grid-cols-5">
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
            <TabsTrigger value="site">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>إعدادات الموقع</span>
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
                    {colors.map((color) => (
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

            {/* Custom Web Fonts */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>إضافة خطوط ويب مخصصة</CardTitle>
                <CardDescription>إضافة خطوط من مصادر خارجية مثل Google Fonts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fontName">اسم الخط</Label>
                  <Input
                    id="fontName"
                    value={customFontName}
                    onChange={(e) => setCustomFontName(e.target.value)}
                    placeholder='مثال: "Roboto" أو "Noto Sans Arabic"'
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontUrl">رابط CSS للخط</Label>
                  <Input
                    id="fontUrl"
                    value={customFontUrl}
                    onChange={(e) => setCustomFontUrl(e.target.value)}
                    placeholder="https://fonts.googleapis.com/css2?family=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    يمكنك الحصول على رابط من Google Fonts أو أي مصدر آخر للخطوط
                  </p>
                </div>
                <Button onClick={saveCustomFont}>إضافة الخط</Button>
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
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات التصدير</CardTitle>
                  <CardDescription>تخصيص إعدادات تصدير التصميمات</CardDescription>
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>إدارة قواعد الرقابة النصية</CardTitle>
                  <CardDescription>تخصيص قواعد استبدال الكلمات عند استخدام أداة الرقابة النصية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add new rule */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalWord">الكلمة الأصلية</Label>
                      <Input 
                        id="originalWord" 
                        value={newRuleOriginal}
                        onChange={e => setNewRuleOriginal(e.target.value)}
                        placeholder="أدخل الكلمة المراد استبدالها"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="replacementWord">الكلمة البديلة</Label>
                      <Input 
                        id="replacementWord" 
                        value={newRuleReplacement}
                        onChange={e => setNewRuleReplacement(e.target.value)}
                        placeholder="أدخل النص البديل"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full" onClick={handleAddCensorshipRule}>
                        <Plus className="ml-2 h-4 w-4" /> إضافة قاعدة
                      </Button>
                    </div>
                  </div>
                  
                  {/* Current Rules */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">قواعد الاستبدال الحالية</h3>
                    <Card>
                      <CardContent className="p-0">
                        <ScrollArea className="h-60">
                          {censorshipRules.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              لا توجد قواعد استبدال. أضف قواعد جديدة من الأعلى.
                            </div>
                          ) : (
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-right p-3">الكلمة الأصلية</th>
                                  <th className="text-right p-3">الكلمة البديلة</th>
                                  <th className="p-3 w-20">إجراءات</th>
                                </tr>
                              </thead>
                              <tbody>
                                {censorshipRules.map((rule, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-3">{rule.original}</td>
                                    <td className="p-3">{rule.replacement}</td>
                                    <td className="p-3 text-center">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => removeCensorshipRule(index)}
                                      >
                                        <Trash className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الموقع</CardTitle>
                <CardDescription>تخصيص معلومات الموقع الأساسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Site Name */}
                <div className="space-y-2">
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={siteNameInput}
                    onChange={(e) => setSiteNameInput(e.target.value)}
                    placeholder="أدخل اسم الموقع"
                  />
                  <p className="text-xs text-muted-foreground">
                    سيظهر في عنوان الصفحة والعلامة المائية
                  </p>
                </div>

                {/* Site Description */}
                <div className="space-y-2">
                  <Label htmlFor="siteDesc">وصف الموقع</Label>
                  <Textarea
                    id="siteDesc"
                    value={siteDescInput}
                    onChange={(e) => setSiteDescInput(e.target.value)}
                    placeholder="أدخل وصفاً مختصراً للموقع"
                    rows={3}
                  />
                </div>

                {/* Site Favicon */}
                <div className="space-y-2">
                  <Label htmlFor="siteFavicon">أيقونة الموقع (favicon)</Label>
                  <Input
                    id="siteFavicon"
                    value={siteFaviconUrl}
                    onChange={(e) => setSiteFaviconUrl(e.target.value)}
                    placeholder="أدخل رابط الأيقونة (مثلاً: /favicon.ico)"
                  />
                  <p className="text-xs text-muted-foreground">
                    أدخل رابط الأيقونة التي ستظهر في علامة التبويب
                  </p>
                </div>

                <Button onClick={saveSiteSettings} className="mt-4">
                  حفظ إعدادات الموقع
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
