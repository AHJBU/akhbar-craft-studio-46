
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  tooltipText: string;
}

export const FeatureCard = ({ title, description, icon: Icon, path, tooltipText }: FeatureCardProps) => {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardHeader className="bg-primary/5 dark:bg-primary/10">
        <div className="flex justify-center p-2">
          <Icon className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <CardDescription className="text-center text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild>
                <Link to={path}>استخدم الآن</Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};
