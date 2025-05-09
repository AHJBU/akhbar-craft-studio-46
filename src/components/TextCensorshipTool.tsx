
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/contexts/AppContext";
import { Copy, ClipboardPaste, FileCheck, ArrowRight, CheckCircle } from "lucide-react";

export const TextCensorshipTool = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();
  const { applyTextCensorship, censorshipRules } = useApp();
  
  // Handle text censorship
  const handleCensorship = () => {
    if (!inputText.trim()) {
      toast({
        title: "نص فارغ",
        description: "الرجاء إدخال النص المراد مراجعته.",
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);
    
    // Simulate processing for better UX
    setTimeout(() => {
      const censoredText = applyTextCensorship(inputText);
      setOutputText(censoredText);
      setProcessing(false);
      setCompleted(true);
      
      toast({
        title: "تمت المراجعة",
        description: "تم مراجعة النص وتطبيق قواعد الرقابة.",
      });
    }, 800);
  };
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText).then(
      () => {
        toast({
          title: "تم النسخ",
          description: "تم نسخ النص إلى الحافظة.",
        });
      },
      () => {
        toast({
          title: "فشل النسخ",
          description: "حدث خطأ أثناء محاولة نسخ النص.",
          variant: "destructive",
        });
      }
    );
  };
  
  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      setCompleted(false);
      toast({
        title: "تم اللصق",
        description: "تم لصق النص من الحافظة.",
      });
    } catch (error) {
      toast({
        title: "فشل اللصق",
        description: "حدث خطأ أثناء محاولة لصق النص. قد تكون الصلاحيات غير متاحة.",
        variant: "destructive",
      });
    }
  };
  
  // Calculate word and character counts
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>رقابة النصوص</CardTitle>
        <CardDescription>
          أدخل النص المراد مراجعته وتطبيق قواعد الرقابة عليه {censorshipRules.length > 0 ? `(${censorshipRules.length} قاعدة)` : "(لا توجد قواعد)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="inputText" className="text-sm font-medium">
              النص الأصلي
            </label>
            <div className="text-sm text-muted-foreground">
              {wordCount} كلمة، {charCount} حرف
            </div>
          </div>
          <div className="relative">
            <Textarea
              id="inputText"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setCompleted(false);
              }}
              className="min-h-32"
              placeholder="أدخل النص هنا..."
              dir="auto"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 left-2"
              onClick={handlePaste}
            >
              <ClipboardPaste className="h-4 w-4 ml-1" />
              لصق
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleCensorship} 
            className="w-full max-w-md"
            disabled={!inputText.trim() || processing}
          >
            {processing ? (
              <>
                <FileCheck className="animate-pulse h-4 w-4 ml-1" />
                جاري المراجعة...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 ml-1" />
                مراجعة النص
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="outputText" className="text-sm font-medium flex items-center gap-2">
            النص بعد المراجعة
            {completed && <CheckCircle className="h-4 w-4 text-green-500" />}
          </label>
          <div className="relative">
            <Textarea
              id="outputText"
              value={outputText}
              readOnly
              className={`min-h-32 ${completed ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
              placeholder="النص بعد تطبيق قواعد الرقابة سيظهر هنا..."
              dir="auto"
            />
            {outputText && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 left-2"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 ml-1" />
                نسخ
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {censorshipRules.length === 0 && (
        <CardFooter className="text-center text-sm text-muted-foreground">
          لم يتم إعداد أي قواعد للرقابة. يمكنك إضافة قواعد من صفحة الإعدادات.
        </CardFooter>
      )}
    </Card>
  );
};
