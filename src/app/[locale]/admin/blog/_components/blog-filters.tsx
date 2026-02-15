"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Filter } from "lucide-react"
import { useState } from "react"

interface BlogFiltersProps {
    onSearchChange: (search: string) => void
    onStatusChange: (status: "all" | "published" | "draft") => void
    onFeaturedChange: (featured: boolean | null) => void
    activeStatus: "all" | "published" | "draft"
    activeFeatured: boolean | null
    searchValue: string
}

export function BlogFilters({
    onSearchChange,
    onStatusChange,
    onFeaturedChange,
    activeStatus,
    activeFeatured,
    searchValue,
}: BlogFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Keresés cím alapján..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-9"
                />
                {searchValue && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => onSearchChange("")}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>

            {/* Status filter */}
            <div className="flex gap-1 border rounded-lg p-1">
                <Button
                    variant={activeStatus === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onStatusChange("all")}
                    className="h-8 text-xs"
                >
                    Összes
                </Button>
                <Button
                    variant={activeStatus === "published" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onStatusChange("published")}
                    className="h-8 text-xs"
                >
                    Publikus
                </Button>
                <Button
                    variant={activeStatus === "draft" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onStatusChange("draft")}
                    className="h-8 text-xs"
                >
                    Vázlat
                </Button>
            </div>

            {/* Featured filter */}
            <Button
                variant={activeFeatured ? "default" : "outline"}
                size="sm"
                onClick={() => onFeaturedChange(activeFeatured ? null : true)}
                className="h-10"
            >
                <Filter className="mr-1 h-3 w-3" />
                Kiemelt
            </Button>
        </div>
    )
}
