import { getProductBySlug } from "@/app/actions/product"
import { ProductDetailClient } from "./product-detail-client"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Termék nem található</h1>
                <Link href="/termekek">
                    <Button>Vissza a termékekhez</Button>
                </Link>
            </div>
        )
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.image,
        description: product.description,
        sku: product.id,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'HUF',
            availability: 'https://schema.org/InStock',
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <section className="bg-muted/30 py-12 border-b">
                <div className="container mx-auto px-4">
                    <ProductDetailClient product={product} />
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-2xl font-bold mb-6">Részletes leírás</h2>
                    <div className="prose prose-slate max-w-none">
                        <p>{product.longDescription}</p>
                        <h3>Funkciók listája:</h3>
                        <ul>
                            {(product.features || []).map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}
