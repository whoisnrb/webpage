"use client";

import React from "react";

export function VideoBackground({
    src,
    poster,
    overlayOpacity = 0.5
}: {
    src: string;
    poster?: string;
    overlayOpacity?: number;
}) {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
            <video
                autoPlay
                loop
                muted
                playsInline
                poster={poster}
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"
            >
                <source src={src} type="video/mp4" />
            </video>
            <div
                className="absolute inset-0 bg-background/80"
                style={{ opacity: overlayOpacity }}
            />
            {/* Gradient overlay for smooth transition */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
    );
}
