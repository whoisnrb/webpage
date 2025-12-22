import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <article className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="space-y-4 mb-8 text-center">
                <Skeleton className="h-6 w-24 mx-auto" />
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <div className="flex justify-center gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <Skeleton className="aspect-video w-full rounded-3xl mb-12" />

            <div className="space-y-6 max-w-3xl mx-auto">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />

                <div className="py-8">
                    <Skeleton className="h-40 w-full rounded-2xl" />
                </div>

                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />
            </div>
        </article>
    )
}
