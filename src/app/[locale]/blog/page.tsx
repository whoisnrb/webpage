import { getAllPosts } from "@/lib/blog"
import { Link } from "@/i18n/routing"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export default function BlogPage() {
    const posts = getAllPosts()

    return (
        <div className="min-h-screen py-20">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Blog & Tudástár
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Hírek, tutorialok és szakmai cikkek a webfejlesztés, automatizáció és IT világából.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <SlideUp key={post.slug} delay={index * 0.1}>
                            <Card className="h-full flex flex-col bg-muted/30 border-muted hover:border-primary/50 transition-colors group">
                                <CardHeader>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            5 perc olvasás
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        <Link href={`/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription className="text-base">
                                        {post.excerpt}
                                    </CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-primary group-hover:translate-x-1 transition-transform" asChild>
                                        <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
                                            Olvass tovább <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </SlideUp>
                    ))}

                    {posts.length === 0 && (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            <p>Még nincsenek bejegyzések. Nézz vissza később!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
