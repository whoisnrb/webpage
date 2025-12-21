
import { BlogPostForm } from "../_components/blog-post-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"

export default function NewBlogPostPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Vissza
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Új Bejegyzés</h1>
                    <p className="text-muted-foreground">
                        Szakértői tartalom létrehozása.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bejegyzés Szerkesztő</CardTitle>
                </CardHeader>
                <CardContent>
                    <BlogPostForm />
                </CardContent>
            </Card>
        </div>
    )
}
