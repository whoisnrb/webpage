import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-12">
                {/* Visual Section Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="aspect-video w-full rounded-2xl" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Content Section Skeleton */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                    </div>

                    <Card className="border-primary/10">
                        <CardContent className="p-6 space-y-6">
                            <Skeleton className="h-10 w-1/3" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <Skeleton className="h-12 w-full rounded-full" />
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-6 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
