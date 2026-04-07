import type { Metadata } from 'next'
import { UpsellEngine } from '@/components/upsell/recommendations'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { Link } from "@/i18n/routing"
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getLocalizedReferenceBySlug } from '@/app/actions/reference'

// Force dynamic rendering — Prisma nem érhető el build-time-on (Vercel)
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
    const { slug, locale } = await params;
    const study = await getLocalizedReferenceBySlug(slug, locale)

    if (!study) return {}

    return {
        title: study.title,
        description: study.description,
        openGraph: {
            title: study.title,
            description: study.description,
            type: 'article',
            images: study.image ? [{ url: study.image }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: study.title,
            description: study.description,
            images: study.image ? [study.image] : [],
        }
    }
}

// Correct usage for Next.js 15+ dynamic params:
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
    const { slug, locale } = await params;
    const t = await getTranslations('References')

    const study = await getLocalizedReferenceBySlug(slug, locale)

    if (!study) {
        notFound();
    }

    // Determine upsell tags based on study tags + category
    const upsellTags = [...study.tags, study.category];

    const isImageUrl = study.image.startsWith('/') || study.image.startsWith('data:image') || study.image.startsWith('http');

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container mx-auto px-4 py-8">
                {/* Hero */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
                    <div>
                        <div className="mb-8">
                            <Link href="/referenciak">
                                <Button variant="ghost" className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-foreground">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_references')}
                                </Button>
                            </Link>
                        </div>
                        <Badge className="mb-4" variant="secondary">{study.category}</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{study.title}</h1>
                        <p className="text-xl text-muted-foreground mb-6 font-medium">
                            {study.client}
                        </p>
                        <p className="text-lg text-muted-foreground mb-8">
                            {study.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {study.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="px-3 py-1 text-sm bg-muted/50">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className={`aspect-video rounded-2xl ${isImageUrl ? '' : study.image} flex items-center justify-center shadow-2xl skew-y-1 transform transition-all overflow-hidden relative`}>
                        {isImageUrl ? (
                            <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 bg-black/5" />
                        )}
                        {!isImageUrl && (
                            <div className="text-center p-6 relative z-10">
                                <div className="font-bold text-4xl opacity-20 uppercase tracking-widest text-primary-foreground">{study.client.split(' ')[0]}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-card border rounded-xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-lg">⚠️</span>
                            {t('challenge')}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {study.challenge}
                        </p>
                    </div>
                    <div className="bg-card border rounded-xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">🛠️</span>
                            {t('solution')}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {study.solution}
                        </p>
                    </div>
                    <div className="bg-card border rounded-xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-lg">🚀</span>
                            {t('result')}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {study.result}
                        </p>
                    </div>
                </div>

                {(study.content && study.content.trim() !== '') && (
                    <div className="mb-16 bg-card border rounded-xl p-8 shadow-sm">
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: study.content }} />
                    </div>
                )}

                {(study.galleryImages && study.galleryImages.length > 0) && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold mb-8">{t('gallery') || 'Galéria'}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {study.galleryImages.map((img, i) => (
                                <div key={i} className="aspect-video rounded-xl overflow-hidden shadow-md group border">
                                    <img src={img} alt={`${study.title} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(study.metrics && study.metrics.length > 0) && (
                    <div className="bg-primary/5 rounded-2xl p-8 md:p-12 mb-16 text-center border border-primary/10 relative overflow-hidden group">
                        {/* Decorative background element for Documentation link area if present */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-8 text-left">{t('key_results')}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    {study.metrics.map((metric, i) => (
                                        <div key={i} className="text-left">
                                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{metric.value}</div>
                                            <div className="text-sm text-muted-foreground font-medium">{metric.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {(study.showDocumentation && study.documentationFile) && (
                                <div className="w-full md:w-auto md:border-l border-primary/20 md:pl-12 flex flex-col items-center md:items-start text-center md:text-left pt-8 md:pt-0">
                                    <h3 className="text-xl font-bold mb-4">{t('documentation')}</h3>
                                    <p className="text-muted-foreground text-sm mb-6 max-w-xs">{t('documentation_desc')}</p>
                                    <a 
                                        href={study.documentationFile} 
                                        download={`BacklineIT-${study.slug}-dokumentacio.pdf`}
                                        className="w-full"
                                    >
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 group/btn">
                                            <Download className="mr-2 h-5 w-5 group-hover/btn:translate-y-0.5 transition-transform" />
                                            {t('download_case_study')}
                                        </Button>
                                    </a>
                                 </div>
                            )}
                        </div>
                    </div>
                )}

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "CaseStudy",
                            "name": study.title,
                            "description": study.description,
                            "image": study.image,
                            "publisher": {
                                "@type": "Organization",
                                "name": "BacklineIT",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://backlineit.hu/logo.png"
                                }
                            }
                        })
                    }}
                />

                {/* Upsell Engine Integration */}
                <UpsellEngine
                    tags={upsellTags}
                    title={t('upsell.title')}
                    description={t('upsell.description')}
                />

            </div>
        </div>
    )
}
