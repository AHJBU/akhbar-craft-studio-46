
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useApp, FontFamily } from "@/contexts/AppContext";
import { LogOut, AlertTriangle, Upload, HelpCircle, Palette, RefreshCcw, Type, Settings, Image } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const { 
    isAuthenticated,
    logout,
    fonts,
    setFonts,
    colors, 
    setColors,
    censorshipPairs,
    setCensorshipPairs,
    defaultTextSettings,
    setDefaultTextSettings,
    resetToDefaults,
    applicationName,
    setApplicationName,
    applicationDescription,
    setApplicationDescription,
    applicationIcon,
    setApplicationIcon
  } = useApp();
  
  const { toast } = useToast();
  
  // If not authenticated, redirect to login page
  // (This is a fallback - routing should handle this normally)
  if (!isAuthenticated) {
    window.location.href = '/settings-login';
    return null;
  }
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [newColor, setNewColor] = useState("#000000");
  const [editingCensorshipPairIndex, setEditingCensorshipPairIndex] = useState<number | null>(null);
  const [newCensorshipOriginal, setNewCensorshipOriginal] = useState("");
  const [newCensorshipReplacement, setNewCensorshipReplacement] = useState("");
  
  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "كلمة المرور غير متطابقة",
        description: "تأكد من إدخال كلمة المرور الجديدة بشكل صحيح في الحقلين.",
        variant: "destructive",
      });
      return;
    }
    
    const storedPassword = localStorage.getItem('admin_password');
    
    if (currentPassword !== storedPassword) {
      toast({
        title: "كلمة المرور الحالية غير صحيحة",
        description: "الرجاء إدخال كلمة المرور الحالية بشكل صحيح.",
        variant: "destructive",
      });
      return;
    }
    
    // Update password
    localStorage.setItem('admin_password', newPassword);
    
    toast({
      title: "تم تغيير كلمة المرور",
      description: "تم تغيير كلمة المرور بنجاح.",
    });
    
    // Clear form
    setNewPassword("");
    setConfirmNewPassword("");
    setCurrentPassword("");
  };
  
  // Handle adding a custom font
  const handleAddFont = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fontName = formData.get('fontName') as FontFamily | undefined;
    
    if (!fontName) {
      toast({
        title: "اسم الخط مطلوب",
        description: "الرجاء إدخال اسم الخط.",
        variant: "destructive",
      });
      return;
    }
    
    if (fonts.includes(fontName)) {
      toast({
        title: "الخط موجود بالفعل",
        description: "هذا الخط موجود بالفعل في القائمة.",
        variant: "destructive",
      });
      return;
    }
    
    // Add new font
    setFonts([...fonts, fontName]);
    
    toast({
      title: "تمت إضافة الخط",
      description: `تمت إضافة الخط "${fontName}" بنجاح.`,
    });
    
    // Clear form
    form.reset();
  };
  
  // Handle removing a font
  const handleRemoveFont = (fontToRemove: string) => {
    if (fonts.length <= 1) {
      toast({
        title: "لا يمكن حذف كل الخطوط",
        description: "يجب أن يبقى خط واحد على الأقل.",
        variant: "destructive",
      });
      return;
    }
    
    const newFonts = fonts.filter(font => font !== fontToRemove);
    setFonts(newFonts);
    
    toast({
      title: "تم حذف الخط",
      description: `تم حذف الخط "${fontToRemove}" بنجاح.`,
    });
  };
  
  // Handle adding a new color
  const handleAddColor = () => {
    if (colors.length >= 10) {
      toast({
        title: "الحد الأقصى للألوان",
        description: "لا يمكن إضافة أكثر من 10 ألوان.",
        variant: "destructive",
      });
      return;
    }
    
    if (colors.includes(newColor)) {
      toast({
        title: "اللون موجود بالفعل",
        description: "هذا اللون موجود بالفعل في القائمة.",
        variant: "destructive",
      });
      return;
    }
    
    // Add new color
    setColors([...colors, newColor]);
    
    toast({
      title: "تمت إضافة اللون",
      description: "تمت إضافة اللون الجديد بنجاح.",
    });
  };
  
  // Handle removing a color
  const handleRemoveColor = (colorToRemove: string) => {
    if (colors.length <= 3) {
      toast({
        title: "لا يمكن حذف كل الألوان",
        description: "يجب أن يبقى 3 ألوان على الأقل.",
        variant: "destructive",
      });
      return;
    }
    
    const newColors = colors.filter(color => color !== colorToRemove);
    setColors(newColors);
    
    toast({
      title: "تم حذف اللون",
      description: "تم حذف اللون بنجاح.",
    });
  };
  
  // Handle adding censorship pair
  const handleAddCensorshipPair = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCensorshipOriginal || !newCensorshipReplacement) {
      toast({
        title: "حقول فارغة",
        description: "الرجاء إدخال النص الأصلي والبديل.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingCensorshipPairIndex !== null) {
      // Update existing pair
      const newPairs = [...censorshipPairs];
      newPairs[editingCensorshipPairIndex] = {
        original: newCensorshipOriginal,
        replacement: newCensorshipReplacement
      };
      setCensorshipPairs(newPairs);
      
      toast({
        title: "تم تحديث زوج الرقابة",
        description: "تم تحديث زوج الرقابة بنجاح.",
      });
    } else {
      // Add new pair
      setCensorshipPairs([...censorshipPairs, {
        original: newCensorshipOriginal,
        replacement: newCensorshipReplacement
      }]);
      
      toast({
        title: "تمت إضافة زوج الرقابة",
        description: "تمت إضافة زوج الرقابة الجديد بنجاح.",
      });
    }
    
    // Reset form
    setNewCensorshipOriginal("");
    setNewCensorshipReplacement("");
    setEditingCensorshipPairIndex(null);
  };
  
  // Handle editing censorship pair
  const handleEditCensorshipPair = (index: number) => {
    const pair = censorshipPairs[index];
    setNewCensorshipOriginal(pair.original);
    setNewCensorshipReplacement(pair.replacement);
    setEditingCensorshipPairIndex(index);
  };
  
  // Handle removing censorship pair
  const handleRemoveCensorshipPair = (index: number) => {
    const newPairs = [...censorshipPairs];
    newPairs.splice(index, 1);
    setCensorshipPairs(newPairs);
    
    toast({
      title: "تم حذف زوج الرقابة",
      description: "تم حذف زوج الرقابة بنجاح.",
    });
  };
  
  // Handle application icon upload
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: "الرجاء اختيار ملف صورة (.jpg, .png, .ico, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Create object URL for the image
    const iconUrl = URL.createObjectURL(file);
    setApplicationIcon(iconUrl);
    
    toast({
      title: "تم تغيير أيقونة التطبيق",
      description: "تم تغيير أيقونة التطبيق بنجاح.",
    });
  };
  
  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">إعدادات التطبيق</h1>
          <p className="text-muted-foreground">قم بتخصيص إعدادات التطبيق وتفضيلاتك الشخصية</p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="h-4 w-4 ml-2" />
          تسجيل الخروج
        </Button>
      </div>
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 ml-2" />
            المظهر والخطوط
          </TabsTrigger>
          <TabsTrigger value="content">
            <Image className="h-4 w-4 ml-2" />
            المحتوى والقوالب
          </TabsTrigger>
          <TabsTrigger value="censorship">
            <Type className="h-4 w-4 ml-2" />
            الرقابة والتصدير
          </TabsTrigger>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 ml-2" />
            إعدادات عامة
          </TabsTrigger>
        </TabsList>
        
        {/* Appearance & Fonts Tab */}
        <TabsContent value="appearance" className="space-y-6">
          {/* Fonts Management */}
          <Card>
            <CardHeader>
              <CardTitle>إدارة الخطوط</CardTitle>
              <CardDescription>
                إدارة الخطوط المتاحة في التطبيق لاستخدامها في تصميماتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">الخطوط الحالية</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {fonts.map((font) => (
                      <div key={font} className="flex items-center justify-between p-2 border rounded">
                        <span style={{ fontFamily: font }}>{font}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFont(font)}
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <form onSubmit={handleAddFont} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Input
                      name="fontName"
                      placeholder="اسم الخط"
                      list="availableFonts"
                    />
                    <datalist id="availableFonts">
                      <option value="cairo" />
                      <option value="tajawal" />
                      <option value="almarai" />
                      <option value="changa" />
                      <option value="notoKufi" />
                      <option value="lateef" />
                      <option value="scheherazade" />
                      <option value="arefRuqaa" />
                      <option value="elMessiri" />
                    </datalist>
                  </div>
                  <Button type="submit">إضافة خط</Button>
                </form>
              </div>
            </CardContent>
          </Card>
          
          {/* Colors Management */}
          <Card>
            <CardHeader>
              <CardTitle>إدارة الألوان</CardTitle>
              <CardDescription>
                تخصيص الألوان المتاحة في أدوات تحرير النصوص
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">الألوان الحالية</Label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <div 
                        key={color}
                        className="flex flex-col items-center"
                      >
                        <div 
                          className="w-10 h-10 rounded border flex items-center justify-center"
                          style={{ backgroundColor: color }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity bg-white/70"
                            onClick={() => handleRemoveColor(color)}
                          >
                            ✕
                          </Button>
                        </div>
                        <span className="text-xs mt-1">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-10 h-10 rounded border" style={{ backgroundColor: newColor }}></div>
                    <Input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddColor}>إضافة لون</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content & Templates Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تخصيص الصور الافتراضية</CardTitle>
              <CardDescription>
                تغيير الصور والقوالب الافتراضية المستخدمة في التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">قوالب الأخبار</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>خبر عاجل - مربع</Label>
                      <div className="mt-2 border rounded p-2">
                        <div className="aspect-square bg-gray-200 rounded flex items-center justify-center mb-2">
                          <img src="/templates/breaking-news-square.png" alt="قالب" className="max-w-full max-h-full object-contain" />
                        </div>
                        <Label htmlFor="breakingNewsSquare" className="cursor-pointer block text-center py-2 bg-primary text-white rounded">
                          تغيير الصورة
                        </Label>
                        <Input
                          id="breakingNewsSquare"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={() => {
                            toast({
                              title: "تم تحديث القالب",
                              description: "تم تحديث قالب الخبر العاجل (مربع) بنجاح.",
                            });
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>خبر عاجل - ستوري</Label>
                      <div className="mt-2 border rounded p-2">
                        <div className="aspect-[9/16] bg-gray-200 rounded flex items-center justify-center mb-2">
                          <img src="/templates/breaking-news-story.png" alt="قالب" className="max-w-full max-h-full object-contain" />
                        </div>
                        <Label htmlFor="breakingNewsStory" className="cursor-pointer block text-center py-2 bg-primary text-white rounded">
                          تغيير الصورة
                        </Label>
                        <Input
                          id="breakingNewsStory"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={() => {
                            toast({
                              title: "تم تحديث القالب",
                              description: "تم تحديث قالب الخبر العاجل (ستوري) بنجاح.",
                            });
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>خبر عاجل - منشور</Label>
                      <div className="mt-2 border rounded p-2">
                        <div className="aspect-[4/5] bg-gray-200 rounded flex items-center justify-center mb-2">
                          <img src="/templates/breaking-news-post.png" alt="قالب" className="max-w-full max-h-full object-contain" />
                        </div>
                        <Label htmlFor="breakingNewsPost" className="cursor-pointer block text-center py-2 bg-primary text-white rounded">
                          تغيير الصورة
                        </Label>
                        <Input
                          id="breakingNewsPost"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={() => {
                            toast({
                              title: "تم تحديث القالب",
                              description: "تم تحديث قالب الخبر العاجل (منشور) بنجاح.",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">الشعارات</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>الشعار الأفقي</Label>
                      <div className="mt-2 border rounded p-2">
                        <div className="aspect-[2/1] bg-gray-200 rounded flex items-center justify-center mb-2">
                          <img src="/logos/horizontal-logo.png" alt="شعار" className="max-w-full max-h-full object-contain" />
                        </div>
                        <Label htmlFor="horizontalLogo" className="cursor-pointer block text-center py-2 bg-primary text-white rounded">
                          تغيير الصورة
                        </Label>
                        <Input
                          id="horizontalLogo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={() => {
                            toast({
                              title: "تم تحديث الشعار",
                              description: "تم تحديث الشعار الأفقي بنجاح.",
                            });
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>الشعار المربع</Label>
                      <div className="mt-2 border rounded p-2">
                        <div className="aspect-square bg-gray-200 rounded flex items-center justify-center mb-2">
                          <img src="/logos/square-logo.png" alt="شعار" className="max-w-full max-h-full object-contain" />
                        </div>
                        <Label htmlFor="squareLogo" className="cursor-pointer block text-center py-2 bg-primary text-white rounded">
                          تغيير الصورة
                        </Label>
                        <Input
                          id="squareLogo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={() => {
                            toast({
                              title: "تم تحديث الشعار",
                              description: "تم تحديث الشعار المربع بنجاح.",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Censorship & Export Tab */}
        <TabsContent value="censorship" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إدارة قائمة رقابة النصوص</CardTitle>
              <CardDescription>
                تخصيص قائمة الكلمات التي سيتم تطبيق الرقابة عليها تلقائيًا
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">إضافة أو تعديل زوج رقابة</h3>
                  <form onSubmit={handleAddCensorshipPair} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="originalText">النص الأصلي</Label>
                        <Input
                          id="originalText"
                          value={newCensorshipOriginal}
                          onChange={(e) => setNewCensorshipOriginal(e.target.value)}
                          placeholder="مثال: فلسطين"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="replacementText">النص البديل</Label>
                        <Input
                          id="replacementText"
                          value={newCensorshipReplacement}
                          onChange={(e) => setNewCensorshipReplacement(e.target.value)}
                          placeholder="مثال: فلسـطين"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit">
                      {editingCensorshipPairIndex !== null ? "تحديث" : "إضافة"}
                    </Button>
                  </form>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">أزواج الرقابة الحالية</h3>
                  <div className="border rounded overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="p-2 text-right">النص الأصلي</th>
                          <th className="p-2 text-right">النص البديل</th>
                          <th className="p-2 text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {censorshipPairs.map((pair, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{pair.original}</td>
                            <td className="p-2">{pair.replacement}</td>
                            <td className="p-2 text-center">
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditCensorshipPair(index)}
                                >
                                  تعديل
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => handleRemoveCensorshipPair(index)}
                                >
                                  حذف
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {censorshipPairs.length === 0 && (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-gray-500">
                              لا توجد أزواج رقابة بعد
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* Default Text Settings */}
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النص الافتراضية</CardTitle>
              <CardDescription>
                تخصيص الإعدادات الافتراضية المطبقة على النصوص الجديدة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="defaultFont">الخط الافتراضي</Label>
                  <Select
                    value={defaultTextSettings.font}
                    onValueChange={(value) => setDefaultTextSettings({
                      ...defaultTextSettings,
                      font: value
                    })}
                  >
                    <SelectTrigger id="defaultFont">
                      <SelectValue placeholder="اختر الخط" />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="defaultSize">الحجم الافتراضي</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="defaultSize"
                      type="number"
                      min="8"
                      max="72"
                      value={defaultTextSettings.size}
                      onChange={(e) => setDefaultTextSettings({
                        ...defaultTextSettings,
                        size: parseInt(e.target.value) || 18
                      })}
                      className="w-20"
                    />
                    <span>بكسل</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="defaultColor">اللون الافتراضي</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: defaultTextSettings.color }}
                    ></div>
                    <Input
                      id="defaultColor"
                      type="color"
                      value={defaultTextSettings.color}
                      onChange={(e) => setDefaultTextSettings({
                        ...defaultTextSettings,
                        color: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Application Settings */}
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التطبيق الأساسية</CardTitle>
              <CardDescription>
                تخصيص الإعدادات الأساسية للتطبيق
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appName">اسم التطبيق</Label>
                  <Input
                    id="appName"
                    value={applicationName}
                    onChange={(e) => setApplicationName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="appDescription">وصف التطبيق</Label>
                  <Input
                    id="appDescription"
                    value={applicationDescription}
                    onChange={(e) => setApplicationDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="appIcon">أيقونة التطبيق</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded border flex items-center justify-center">
                    <img src={applicationIcon} alt="أيقونة التطبيق" className="max-w-full max-h-full" />
                  </div>
                  <Label htmlFor="iconUpload" className="cursor-pointer py-2 px-4 bg-primary text-white rounded inline-flex items-center">
                    <Upload className="h-4 w-4 ml-2" />
                    تغيير الأيقونة
                  </Label>
                  <Input
                    id="iconUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleIconUpload}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle>تغيير كلمة المرور</CardTitle>
              <CardDescription>
                تغيير كلمة المرور المستخدمة للوصول إلى صفحة الإعدادات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">تغيير كلمة المرور</Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Reset Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                إعادة تعيين الإعدادات
              </CardTitle>
              <CardDescription>
                إعادة تعيين جميع الإعدادات إلى القيم الافتراضية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                سيؤدي هذا الإجراء إلى إعادة تعيين جميع الإعدادات التي قمت بتخصيصها إلى القيم الافتراضية الأصلية. لن يتم إعادة تعيين كلمة المرور الخاصة بك.
              </p>
              <Button 
                variant="destructive"
                onClick={() => setIsResetDialogOpen(true)}
              >
                <RefreshCcw className="h-4 w-4 ml-2" />
                إعادة تعيين جميع الإعدادات
              </Button>
              
              <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد من إعادة تعيين جميع الإعدادات؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      تحذير: سيتم إعادة تعيين جميع إعدادات التطبيق إلى الوضع الافتراضي. هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => {
                        resetToDefaults();
                        setIsResetDialogOpen(false);
                      }}
                    >
                      نعم، أعد التعيين
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default SettingsPage;
