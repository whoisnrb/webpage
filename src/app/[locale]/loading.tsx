import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 container mx-auto px-4 py-20 space-y-12">
                <div className="space-y-4 max-w-2xl">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-video w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
