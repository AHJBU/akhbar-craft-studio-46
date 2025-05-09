
import { Layout } from "@/components/Layout";
import { FeatureCard } from "@/components/FeatureCard";
import { Grid2X2, Type, Settings } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Index = () => {
  const { applicationName, applicationDescription } = useApp();
  
  return (
    <Layout>
      <section className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">{applicationName}</h1>
        <p className="text-xl text-muted-foreground">{applicationDescription}</p>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-zoom-in">
        <FeatureCard 
          title="تصميم الأخبار"
          description="استخدم قوالب جاهزة لتصميم منشورات إخبارية بأحجام متعددة"
          icon={Grid2X2}
          path="/news-design"
          tooltipText="انتقل إلى تصميم الأخبار باستخدام قوالب جاهزة"
        />
        
        <FeatureCard 
          title="تخصيص كامل"
          description="صمم منشورات خاصة باستخدام صورك ونصوصك المخصصة"
          icon={Settings}
          path="/custom-design"
          tooltipText="انتقل إلى التصميم المخصص باستخدام صورك الخاصة"
        />
        
        <FeatureCard 
          title="رقابة النصوص"
          description="راجع نصوصك وطبق عليها قواعد الرقابة قبل استخدامها"
          icon={Type}
          path="/text-censorship"
          tooltipText="انتقل إلى أداة رقابة النصوص"
        />
      </section>
    </Layout>
  );
};

export default Index;
