
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createBlogPost, updateBlogPost, BlogPostData } from "@/app/actions/blog"
import { toast } from "sonner"
import { useRouter } from "@/i18n/routing"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(2, "A cím minimum 2 karakter legyen"),
    slug: z.string().min(2, "A slug minimum 2 karakter legyen").regex(/^[a-z0-9-]+$/, "Csak kisbetűk, számok és kötőjelek lehetnek"),
    excerpt: z.string().min(10, "A kivonat minimum 10 karakter legyen"),
    content: z.string().min(20, "A tartalom minimum 20 karakter legyen"),
    author: z.string().default("BacklineIT Team"),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    tags: z.string().default(""), // Comma separated string for input
})

type FormValues = z.infer<typeof formSchema>

interface BlogPostFormProps {
    initialData?: BlogPostData & { id: string }
}

export function BlogPostForm({ initialData }: BlogPostFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Ensure we handle potentially undefined values from initialData by providing defaults
    const defaultValues: FormValues = {
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        author: initialData?.author || "BacklineIT Team",
        published: initialData?.published || false,
        featured: initialData?.featured || false,
        tags: initialData?.tags?.join(", ") || "",
    }

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    async function onSubmit(values: FormValues) {
        setIsLoading(true)
        try {
            const formattedData: BlogPostData = {
                ...values,
                author: values.author || "BacklineIT Team",
                tags: values.tags ? values.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
            }

            if (initialData) {
                const result = await updateBlogPost(initialData.id, formattedData)
                if (result.success) {
                    toast.success("Bejegyzés frissítve")
                    router.push("/admin/blog")
                } else {
                    toast.error(result.error || "Hiba történt")
                }
            } else {
                const result = await createBlogPost(formattedData)
                if (result.success) {
                    toast.success("Bejegyzés létrehozva")
                    router.push("/admin/blog")
                } else {
                    toast.error(result.error || "Hiba történt")
                }
            }
        } catch (error) {
            toast.error("Váratlan hiba történt")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cím</FormLabel>
                                <FormControl>
                                    <Input placeholder="Bejegyzés címe" {...field} onChange={e => {
                                        field.onChange(e)
                                        // Auto-generate slug from title if slug is empty
                                        if (!form.getValues("slug")) {
                                            form.setValue("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
                                        }
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Keresőbarát URL (slug)</FormLabel>
                                <FormControl>
                                    <Input placeholder="pelda-bejegyzys-slug" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Ez a weboldal címében fog megjelenni. Egyedinek kell lennie.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rövid összefoglaló (Excerpt)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Rövid leírás a listanézethez..." className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tartalom (Markdown)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="# Címsor..." className="min-h-[400px] font-mono" {...field} />
                            </FormControl>
                            <FormDescription>
                                A tartalom Markdown formátumban írandó.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Címkék (vesszővel elválasztva)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tech, Blog, Hírek" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Szerző</FormLabel>
                                <FormControl>
                                    <Input placeholder="BacklineIT Team" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card/50">
                    <FormField
                        control={form.control}
                        name="published"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Publikálva</FormLabel>
                                    <FormDescription>
                                        A bejegyzés azonnal megjelenik a publikus oldalon.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Kiemelt bejegyzés</FormLabel>
                                    <FormDescription>
                                        Kiemelt helyen jelenik meg a listában.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isLoading} size="lg">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Bejegyzés Frissítése" : "Létrehozás"}
                </Button>
            </form>
        </Form>
    )
}
