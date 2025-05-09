
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateImagesManager } from "@/components/TemplateImagesManager";

const SettingsPage = () => {
  const { isAdmin, logout } = useApp();
  const [currentTab, setCurrentTab] = useState("appearance");
  
  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">الإعدادات</h1>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="text-center text-red-500">غير مصرح لك بالوصول إلى هذه الصفحة.</p>
            <p className="text-center mt-2">يرجى تسجيل الدخول أولاً.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">الإعدادات</h1>
          <Button variant="outline" onClick={logout}>تسجيل الخروج</Button>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="appearance">المظهر والخطوط</TabsTrigger>
            <TabsTrigger value="templates">القوالب والمحتوى الافتراضي</TabsTrigger>
            <TabsTrigger value="export">التصدير والرقابة</TabsTrigger>
            <TabsTrigger value="general">إعدادات عامة</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">إدارة المظهر والخطوط</h2>
              <p className="text-muted-foreground">سيتم إضافة إعدادات المظهر والخطوط هنا</p>
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">إدارة القوالب والمحتوى الافتراضي</h2>
              <TemplateImagesManager />
            </div>
          </TabsContent>
          
          <TabsContent value="export">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">إعدادات التصدير والرقابة</h2>
              <p className="text-muted-foreground">سيتم إضافة إعدادات التصدير والرقابة هنا</p>
            </div>
          </TabsContent>
          
          <TabsContent value="general">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">الإعدادات العامة</h2>
              <p className="text-muted-foreground">سيتم إضافة الإعدادات العامة هنا</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
