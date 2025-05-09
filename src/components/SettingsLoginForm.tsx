
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";

export const SettingsLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(!localStorage.getItem("admin_username"));
  const [loading, setLoading] = useState(false);
  
  const { login } = useApp();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // If this is the first time, use default values if fields are empty
      const finalUsername = username.trim() || "admin";
      const finalPassword = password.trim() || "asdqwe123#";
      
      const success = await login(finalUsername, finalPassword);
      
      if (success && isFirstTime) {
        toast({
          title: "تم إعداد حساب المسؤول بنجاح",
          description: "يمكنك الآن الوصول إلى صفحة الإعدادات",
        });
        setIsFirstTime(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isFirstTime ? "إعداد حساب المسؤول" : "تسجيل الدخول للإعدادات"}
        </CardTitle>
        <CardDescription className="text-center">
          {isFirstTime 
            ? "قم بإنشاء حساب للوصول إلى إعدادات التطبيق"
            : "يرجى تسجيل الدخول للوصول إلى إعدادات التطبيق"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">اسم المستخدم</Label>
            <Input
              id="username"
              type="text"
              placeholder={isFirstTime ? "admin (افتراضي)" : "اسم المستخدم"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              placeholder={isFirstTime ? "asdqwe123# (افتراضي)" : "كلمة المرور"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isFirstTime && (
            <p className="text-sm text-muted-foreground">
              إذا تركت الحقول فارغة، سيتم استخدام القيم الافتراضية: اسم المستخدم: admin وكلمة المرور: asdqwe123#
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "جاري المعالجة..." : isFirstTime ? "إنشاء الحساب" : "تسجيل الدخول"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
