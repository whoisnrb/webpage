
import { BlogPostForm } from "../_components/blog-post-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { getBlogPostById } from "@/app/actions/blog"
import { notFound } from "next/navigation"

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const post = await getBlogPostById(id)

    if (!post) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Vissza
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bejegyzés Szerkesztése</h1>
                    <p className="text-muted-foreground">
                        {post.title}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Szerkesztés</CardTitle>
                </CardHeader>
                <CardContent>
                    <BlogPostForm initialData={post} />
                </CardContent>
            </Card>
        </div>
    )
}
