import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("text-center py-12 px-4 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]", className)}>
            <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-white/[0.05] rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white/40" />
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-8">{description}</p>
            {action && (
                <Button onClick={action.onClick} className="bg-white/10 hover:bg-white/20 text-white">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
