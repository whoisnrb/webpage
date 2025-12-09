import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface NeumorphButtonProps extends ButtonProps {
    className?: string;
}

export const NeumorphButton = React.forwardRef<HTMLButtonElement, NeumorphButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={cn(
                    "relative overflow-hidden transition-all duration-300",
                    // Neumorphism shadows - different for light/dark
                    "shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] dark:shadow-[5px_5px_10px_#0b1221,-5px_-5px_10px_#1b2841]",
                    "hover:shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] dark:hover:shadow-[inset_5px_5px_10px_#0b1221,inset_-5px_-5px_10px_#1b2841]",
                    "active:scale-95 text-foreground bg-background hover:bg-background/90",
                    "border-none",
                    className
                )}
                {...props}
            >
                {children}
            </Button>
        );
    }
);

NeumorphButton.displayName = "NeumorphButton";
