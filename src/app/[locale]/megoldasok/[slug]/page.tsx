import { getLocalizedProductBySlug } from "@/app/actions/product"
import { ProductDetailClient } from "./product-detail-client"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { getTranslations } from 'next-intl/server'

interface PageProps {
    params: Promise<{ slug: string; locale: string }>
}

import { Metadata } from "next"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, locale } = await params
    const product = await getLocalizedProductBySlug(slug, locale)
    const t = await getTranslations('ProductDetailPage')

    if (!product) {
        return {
            title: t('not_found'),
        }
    }

    return {
        title: product.title,
        description: product.description,
        openGraph: {
            title: product.title,
            description: product.description,
            images: [product.image],
        },
    }
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug, locale } = await params
    const product = await getLocalizedProductBySlug(slug, locale)
    const t = await getTranslations('ProductDetailPage')

    if (!product) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">{t('not_found')}</h1>
                <Link href="/megoldasok">
                    <Button>{t('back_to_products')}</Button>
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

            {/* Detailed Description Section - Premium Design */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                {/* Dark gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                }} />

                {/* Glow orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[150px]" />

                <div className="container relative z-10 mx-auto px-4 max-w-5xl">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
                            <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium text-cyan-300">{t('product_info')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{t('detailed_description')}</h2>
                    </div>

                    {/* Description card */}
                    <div className="relative mb-12">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/30 to-violet-500/30 rounded-2xl blur-sm" />
                        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-10">
                            <p className="text-lg text-slate-300 leading-relaxed">
                                {product.longDescription}
                            </p>
                        </div>
                    </div>

                    {/* Features section */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                                <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            {t('features_list')}
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            {(product.features || []).map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative"
                                >
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300" />
                                    <div className="relative flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 hover:border-cyan-500/30 rounded-xl p-5 transition-all duration-300">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-slate-200 font-medium">{feature}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap justify-center gap-6 mt-12 pt-10 border-t border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span>{t('secure_code')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <span>{t('regular_updates')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <span>{t('technical_support')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <span>{t('documentation')}</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
