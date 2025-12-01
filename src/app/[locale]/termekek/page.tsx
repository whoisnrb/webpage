import { getProducts } from "@/app/actions/product"
import { ProductBrowser } from "./product-browser"
import { FadeIn } from "@/components/ui/motion-wrapper"

export default async function ProductsPage() {
    const products = await getProducts()

    return (
        <>
            <section className="bg-muted/30 py-16 border-b">
                <div className="container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Digitális Piactér</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Kész megoldások, scriptek és sablonok, amikkel azonnal gyorsíthatod a vállalkozásodat.
                        </p>
                    </FadeIn>
                </div>
            </section>

            <ProductBrowser initialProducts={products} />
        </>
    )
}
