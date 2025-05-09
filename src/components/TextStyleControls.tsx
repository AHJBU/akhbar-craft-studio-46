
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  AlignLeft, 
  AlignRight, 
  AlignCenter, 
  AlignJustify, 
  Bold, 
  Italic, 
  Underline,
  DropletIcon
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface TextStyleControlsProps {
  selectedTextBox: number | null;
  textBoxes: Array<{ id: number; text: string; x: number; y: number; styles: any }>;
  setTextBoxes: React.Dispatch<React.SetStateAction<Array<{ id: number; text: string; x: number; y: number; styles: any }>>>;
}

export const TextStyleControls = ({ selectedTextBox, textBoxes, setTextBoxes }: TextStyleControlsProps) => {
  const { fonts, colors } = useApp();
  
  // Get the selected text box
  const selectedBox = textBoxes.find(box => box.id === selectedTextBox);
  
  // Early return if no text box is selected
  if (!selectedBox) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>حدد مربع نص للتعديل عليه</p>
      </div>
    );
  }
  
  // Update a style property of the selected text box
  const updateStyle = (property: string, value: any) => {
    const newTextBoxes = textBoxes.map(box => 
      box.id === selectedTextBox 
        ? { ...box, styles: { ...box.styles, [property]: value } } 
        : box
    );
    setTextBoxes(newTextBoxes);
  };
  
  // Get the current style value with default fallback
  const getStyleValue = (property: string, defaultValue: any) => {
    return selectedBox.styles[property] || defaultValue;
  };
  
  // Extract the font size value from the fontSize style (remove 'px')
  const currentFontSize = parseInt(getStyleValue('fontSize', '18px').toString().replace('px', ''));
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
      <h3 className="text-lg font-medium mb-4">تنسيق النص</h3>
      
      <Tabs defaultValue="basics">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="basics" className="flex-1">أساسي</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">متقدم</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basics" className="space-y-4">
          {/* Font Family */}
          <div>
            <Label>نوع الخط</Label>
            <Select
              value={getStyleValue('fontFamily', 'cairo')}
              onValueChange={(value) => updateStyle('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الخط" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font.charAt(0).toUpperCase() + font.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Font Size */}
          <div>
            <div className="flex justify-between">
              <Label>حجم الخط</Label>
              <span className="text-sm">{currentFontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateStyle('fontSize', `${Math.max(currentFontSize - 1, 8)}px`)}
              >
                -
              </Button>
              <Slider
                value={[currentFontSize]}
                min={8}
                max={72}
                step={1}
                onValueChange={(value) => updateStyle('fontSize', `${value[0]}px`)}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateStyle('fontSize', `${Math.min(currentFontSize + 1, 72)}px`)}
              >
                +
              </Button>
            </div>
          </div>
          
          {/* Text Alignment */}
          <div>
            <Label>محاذاة النص</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={getStyleValue('textAlign', 'right') === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle('textAlign', 'right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                variant={getStyleValue('textAlign', 'right') === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle('textAlign', 'center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={getStyleValue('textAlign', 'right') === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle('textAlign', 'left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={getStyleValue('textAlign', 'right') === 'justify' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle('textAlign', 'justify')}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Text Direction */}
          <div>
            <Label>اتجاه النص</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={getStyleValue('direction', 'rtl') === 'rtl' ? 'default' : 'outline'}
                onClick={() => updateStyle('direction', 'rtl')}
              >
                من اليمين إلى اليسار (RTL)
              </Button>
              <Button
                variant={getStyleValue('direction', 'rtl') === 'ltr' ? 'default' : 'outline'}
                onClick={() => updateStyle('direction', 'ltr')}
              >
                من اليسار إلى اليمين (LTR)
              </Button>
            </div>
          </div>
          
          {/* Text Color */}
          <div>
            <Label>لون النص</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  className="w-8 h-8 p-0 rounded-full relative"
                  style={{ backgroundColor: color }}
                  onClick={() => updateStyle('color', color)}
                >
                  {getStyleValue('color', '#000000') === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </Button>
              ))}
              <label className="flex items-center justify-center w-8 h-8 rounded-full border cursor-pointer overflow-hidden">
                <Input
                  type="color"
                  value={getStyleValue('color', '#000000')}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  className="opacity-0 absolute w-8 h-8"
                />
                <DropletIcon className="h-4 w-4" />
              </label>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          {/* Text Style */}
          <div>
            <Label>تنسيق النص</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={getStyleValue('fontWeight', 'normal') === 'bold' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle('fontWeight', getStyleValue('fontWeight', 'normal') === 'bold' ? 'normal' : 'bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={getStyleValue('fontStyle', 'normal') === 'italic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle('fontStyle', getStyleValue('fontStyle', 'normal') === 'italic' ? 'normal' : 'italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={getStyleValue('textDecoration', 'none') === 'underline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle('textDecoration', getStyleValue('textDecoration', 'none') === 'underline' ? 'none' : 'underline')}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Line Height */}
          <div>
            <div className="flex justify-between">
              <Label>المسافة بين السطور</Label>
              <span className="text-sm">{parseFloat(getStyleValue('lineHeight', '1.5')).toFixed(1)}</span>
            </div>
            <Slider
              value={[parseFloat(getStyleValue('lineHeight', '1.5'))]}
              min={0.8}
              max={3}
              step={0.1}
              className="mt-2"
              onValueChange={(value) => updateStyle('lineHeight', value[0].toString())}
            />
          </div>
          
          <Separator />
          
          {/* Text Shadow */}
          <div>
            <div className="flex items-center gap-2">
              <Label className="flex-grow">ظل النص</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (getStyleValue('textShadow', 'none') === 'none') {
                    updateStyle('textShadow', '1px 1px 2px rgba(0,0,0,0.5)');
                  } else {
                    updateStyle('textShadow', 'none');
                  }
                }}
              >
                {getStyleValue('textShadow', 'none') === 'none' ? 'تفعيل' : 'إلغاء'}
              </Button>
            </div>
            {getStyleValue('textShadow', 'none') !== 'none' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-xs">اللون</Label>
                  <Input
                    type="color"
                    value="#000000"
                    onChange={(e) => {
                      const currentShadow = getStyleValue('textShadow', '1px 1px 2px rgba(0,0,0,0.5)');
                      updateStyle('textShadow', currentShadow.replace(/rgba\([^)]+\)/, `${e.target.value}80`));
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">العتامة</Label>
                  <Slider
                    value={[50]}
                    min={0}
                    max={100}
                    step={10}
                    onValueChange={(value) => {
                      const opacity = value[0] / 100;
                      const currentShadow = getStyleValue('textShadow', '1px 1px 2px rgba(0,0,0,0.5)');
                      updateStyle('textShadow', currentShadow.replace(/rgba\([^,]+,[^,]+,[^,]+,[^)]+\)/, `rgba(0,0,0,${opacity})`));
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Text Stroke */}
          <div>
            <div className="flex items-center gap-2">
              <Label className="flex-grow">حدود النص</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (getStyleValue('WebkitTextStroke', 'none') === 'none') {
                    updateStyle('WebkitTextStroke', '1px #000000');
                    updateStyle('textStroke', '1px #000000');
                  } else {
                    updateStyle('WebkitTextStroke', 'none');
                    updateStyle('textStroke', 'none');
                  }
                }}
              >
                {getStyleValue('WebkitTextStroke', 'none') === 'none' ? 'تفعيل' : 'إلغاء'}
              </Button>
            </div>
            {getStyleValue('WebkitTextStroke', 'none') !== 'none' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-xs">اللون</Label>
                  <Input
                    type="color"
                    value="#000000"
                    onChange={(e) => {
                      const width = getStyleValue('WebkitTextStroke', '1px #000000').split(' ')[0];
                      updateStyle('WebkitTextStroke', `${width} ${e.target.value}`);
                      updateStyle('textStroke', `${width} ${e.target.value}`);
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">السمك</Label>
                  <Select
                    value={getStyleValue('WebkitTextStroke', '1px #000000').split(' ')[0]}
                    onValueChange={(value) => {
                      const color = getStyleValue('WebkitTextStroke', '1px #000000').split(' ')[1];
                      updateStyle('WebkitTextStroke', `${value} ${color}`);
                      updateStyle('textStroke', `${value} ${color}`);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5px">رفيع جدًا</SelectItem>
                      <SelectItem value="1px">رفيع</SelectItem>
                      <SelectItem value="1.5px">متوسط</SelectItem>
                      <SelectItem value="2px">سميك</SelectItem>
                      <SelectItem value="3px">سميك جدًا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          
          {/* Background Color */}
          <div>
            <div className="flex items-center gap-2">
              <Label className="flex-grow">خلفية النص</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (getStyleValue('backgroundColor', 'transparent') === 'transparent') {
                    updateStyle('backgroundColor', 'rgba(255,255,255,0.5)');
                  } else {
                    updateStyle('backgroundColor', 'transparent');
                  }
                }}
              >
                {getStyleValue('backgroundColor', 'transparent') === 'transparent' ? 'تفعيل' : 'إلغاء'}
              </Button>
            </div>
            {getStyleValue('backgroundColor', 'transparent') !== 'transparent' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-xs">اللون</Label>
                  <Input
                    type="color"
                    value="#ffffff"
                    onChange={(e) => {
                      const opacity = parseFloat(getStyleValue('backgroundColor', 'rgba(255,255,255,0.5)').split(',')[3]) || 0.5;
                      updateStyle('backgroundColor', `${e.target.value}${Math.round(opacity * 255).toString(16)}`);
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">الشفافية</Label>
                  <Slider
                    value={[50]}
                    min={0}
                    max={100}
                    step={10}
                    onValueChange={(value) => {
                      const opacity = value[0] / 100;
                      const currentColor = getStyleValue('backgroundColor', 'rgba(255,255,255,0.5)').match(/rgba?\([^)]+\)/)?.[0] || 'rgba(255,255,255,';
                      updateStyle('backgroundColor', `${currentColor.replace(/,[^,]+\)$/, `,${opacity})`)}`);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
