
import { Layout } from "@/components/Layout";
import { TextCensorshipTool } from "@/components/TextCensorshipTool";

const TextCensorshipPage = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">رقابة النصوص</h1>
        <p className="text-muted-foreground">راجع نصوصك وطبق عليها قواعد الرقابة قبل استخدامها</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <TextCensorshipTool />
      </div>
    </Layout>
  );
};

export default TextCensorshipPage;
