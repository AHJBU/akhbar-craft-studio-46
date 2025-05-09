
import { Layout } from "@/components/Layout";
import { SettingsLoginForm } from "@/components/SettingsLoginForm";

const SettingsLoginPage = () => {
  return (
    <Layout>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">صفحة الإعدادات</h1>
        <p className="text-muted-foreground">تحتاج إلى تسجيل الدخول للوصول إلى إعدادات التطبيق</p>
      </div>
      
      <div className="max-w-md mx-auto">
        <SettingsLoginForm />
      </div>
    </Layout>
  );
};

export default SettingsLoginPage;
