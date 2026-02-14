import { getBlogSeries, getBlogPosts } from "@/app/actions/blog"
import { Link } from "@/i18n/routing"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight, Sparkles, Zap, Shield, Cpu } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion-wrapper"
import { Badge } from "@/components/ui/badge"

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations("Blog")

    // Use cached functions instead of direct Prisma calls
    const series = await getBlogSeries() as any[]
    const recentPosts = (await getBlogPosts() as any[])
        .filter((p: any) => p.published)
        .slice(0, 6)

    const topics = [
        { icon: Zap, label: t('categories.automation'), color: "text-orange-500", key: 'automation' },
        { icon: Cpu, label: t('categories.webdev'), color: "text-blue-500", key: 'webdev' },
        { icon: Sparkles, label: t('categories.business'), color: "text-purple-500", key: 'business' },
        { icon: Shield, label: t('categories.security'), color: "text-green-500", key: 'security' },
    ]

    return (
        <div className="min-h-screen bg-transparent">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <FadeIn>
                        <Badge variant="outline" className="mb-4 py-1 px-4 border-primary/20 bg-primary/5 text-primary">
                            <Sparkles className="w-3 h-3 mr-2" />
                            {t('hero_badge')}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            {t('subtitle')}
                        </p>
                    </FadeIn>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-24">
                {/* Topics Descriptions */}
                <section className="mb-24 px-4">
                    <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {topics.map((topic, i) => (
                            <FadeInStaggerItem key={i} className="p-6 rounded-2xl bg-background/30 border border-muted-foreground/10 backdrop-blur-sm hover:border-primary/20 transition-all group">
                                <topic.icon className={`w-10 h-10 mb-4 ${topic.color} group-hover:scale-110 transition-transform`} />
                                <h3 className="text-xl font-bold mb-2">{topic.label}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {t(`categories.${topic.key}_desc`)}
                                </p>
                            </FadeInStaggerItem>
                        ))}
                    </FadeInStagger>
                </section>

                {/* Series Section */}
                {series.length > 0 && (
                    <section className="mb-24">
                        <div className="flex items-center justify-between mb-10">
                            <FadeIn direction="left">
                                <h2 className="text-3xl font-bold">{t('series_title')}</h2>
                            </FadeIn>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {series.map((s: any, i) => (
                                <FadeIn key={s.id} delay={i * 0.1}>
                                    <Card className="group flex flex-col h-full bg-background/40 backdrop-blur-md border-muted-foreground/10 hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-primary/5">
                                        <div className="aspect-[16/10] bg-muted/30 relative overflow-hidden">
                                            {s.coverImage ? (
                                                <img src={s.coverImage} alt={locale === 'en' ? (s.titleEn || s.title) : s.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-60" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                                    <BookOpen className="w-20 h-20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                                            <div className="absolute bottom-4 left-4">
                                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                                    {s._count.posts} {t('chapters')}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {locale === 'en' ? (s.titleEn || s.title) : s.title}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {locale === 'en' ? (s.descriptionEn || s.description) : s.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter className="mt-auto pt-0">
                                            <Link href={`/blog/series/${s.slug}`} className="w-full">
                                                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                    {t('view_series')}
                                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </FadeIn>
                            ))}
                        </div>
                    </section>
                )}

                {/* Latest Posts Grid */}
                <section>
                    <div className="flex items-center justify-between mb-10">
                        <FadeIn direction="left">
                            <h2 className="text-3xl font-bold">{t('recent_posts')}</h2>
                        </FadeIn>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentPosts.map((post: any, i) => (
                            <FadeIn key={post.id} delay={i * 0.1} direction="up">
                                <Card className="group flex flex-col h-full bg-background/40 backdrop-blur-md border-muted-foreground/10 hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-md">
                                    <CardHeader>
                                        <div className="flex justify-between items-center mb-4">
                                            {post.series && (
                                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-primary border-primary/20">
                                                    {locale === 'en' ? (post.series.titleEn || post.series.title) : post.series.title}
                                                </Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(post.createdAt).toLocaleDateString(locale === 'hu' ? 'hu-HU' : 'en-US')}
                                            </span>
                                        </div>
                                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                                            <Link href={`/blog/${post.slug}`}>
                                                {locale === 'en' ? (post.titleEn || post.title) : post.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="line-clamp-3">
                                            {locale === 'en' ? (post.excerptEn || post.excerpt) : post.excerpt}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="mt-auto flex justify-between items-center">
                                        <div className="flex gap-2">
                                            {post.tags.slice(0, 2).map((tag: string, i: number) => (
                                                <span key={i} className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Link href={`/blog/${post.slug}`}>
                                            <Button variant="ghost" size="sm" className="group-hover:text-primary p-0">
                                                {t('read_more')}
                                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                    {recentPosts.length === 0 && (
                        <div className="text-center py-20 border rounded-2xl border-dashed border-muted-foreground/20">
                            <p className="text-muted-foreground">{t('no_posts')}</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
