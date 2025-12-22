import { BlogCardSkeleton, SectionHeaderSkeleton } from "@/components/ui/skeletons"

export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen">
            <SectionHeaderSkeleton />

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
