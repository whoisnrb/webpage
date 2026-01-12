
import { getSeriesBySlug } from "@/app/actions/blog"
import { notFound } from "next/navigation"
import { Link } from "@/i18n/routing"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Clock, Play } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion-wrapper"
import { Badge } from "@/components/ui/badge"

export default async function SeriesPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params
    const series = await getSeriesBySlug(slug) as any

    if (!series) notFound()

    const t = await getTranslations('Blog')
    const title = locale === 'en' ? (series.titleEn || series.title) : series.title
    const description = locale === 'en' ? (series.descriptionEn || series.description) : series.description

    return (
        <div className="container py-24 max-w-4xl mx-auto px-4">
            <FadeIn>
                <Link href="/blog">
                    <Button variant="ghost" className="mb-8 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        {t('back_to_blog')}
                    </Button>
                </Link>

                <header className="mb-16 text-center space-y-4">
                    <Badge variant="outline" className="mb-2 py-1 px-4 border-primary/20 bg-primary/5 text-primary">
                        {t('series_title')}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 leading-tight">
                        {title}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
                </header>
            </FadeIn>

            <FadeInStagger className="space-y-6">
                {series.posts.map((post: any, index: number) => {
                    const postTitle = locale === 'en' ? (post.titleEn || post.title) : post.title
                    const postExcerpt = locale === 'en' ? (post.excerptEn || post.excerpt) : post.excerpt
                    const postContent = locale === 'en' ? (post.contentEn || post.content) : post.content

                    return (
                        <FadeInStaggerItem key={post.id}>
                            <Card className="relative overflow-hidden group bg-background/40 backdrop-blur-md border-muted-foreground/10 hover:border-primary/20 transition-all duration-500 shadow-md">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all" />
                                <div className="flex flex-col md:flex-row">
                                    <div className="p-8 pb-4 md:pb-8 flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Chapter {index + 1}</span>
                                        </div>
                                        <CardHeader className="p-0">
                                            <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                                                <Link href={`/blog/${post.slug}`} className="block">
                                                    {postTitle}
                                                </Link>
                                            </CardTitle>
                                            <CardDescription className="text-base mt-2 line-clamp-2">
                                                {postExcerpt}
                                            </CardDescription>
                                        </CardHeader>
                                        <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {Math.ceil(postContent.length / 1500)} min read
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                Series: {title}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 pt-0 md:pt-8 flex items-center">
                                        <Link href={`/blog/${post.slug}`} className="w-full md:w-auto">
                                            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                                <Play className="w-4 h-4 mr-2 fill-current" />
                                                {t('read_more')}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </FadeInStaggerItem>
                    )
                })}
            </FadeInStagger>
        </div>
    )
}
