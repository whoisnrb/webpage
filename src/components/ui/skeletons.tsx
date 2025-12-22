import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ProductCardSkeleton() {
    return (
        <Card className="flex flex-col overflow-hidden h-full border-muted-foreground/10">
            <Skeleton className="aspect-video w-full" />
            <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="flex-1">
                <Skeleton className="h-8 w-1/2" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
        </Card>
    )
}

export function BlogCardSkeleton() {
    return (
        <Card className="flex flex-col overflow-hidden h-full border-muted-foreground/10">
            <Skeleton className="aspect-video w-full" />
            <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-4 w-1/4" />
            </CardFooter>
        </Card>
    )
}

export function SectionHeaderSkeleton() {
    return (
        <div className="space-y-4 text-center py-16">
            <Skeleton className="h-10 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
    )
}
