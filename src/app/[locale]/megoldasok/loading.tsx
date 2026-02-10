import { ProductCardSkeleton, SectionHeaderSkeleton } from "@/components/ui/skeletons"

export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen">
            <SectionHeaderSkeleton />

            <section className="py-8 border-b sticky top-16 bg-background/95 backdrop-blur z-40">
                <div className="container mx-auto px-4">
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-8 w-20 bg-muted animate-pulse rounded-full" />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 flex-1">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
