"use client";

import Spline from '@splinetool/react-spline';
import { useState } from 'react';

export function SplineScene({
    scene,
    className
}: {
    scene: string,
    className?: string
}) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`relative w-full h-full ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20 backdrop-blur-sm rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <span className="text-sm text-muted-foreground animate-pulse">3D betöltése...</span>
                    </div>
                </div>
            )}
            <Spline
                scene={scene}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
