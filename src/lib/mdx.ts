import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = process.cwd()

export interface BlogPost {
    slug: string
    title: string
    date: string
    description: string
    author: string
    tags: string[]
    content: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const postsDirectory = path.join(root, 'content', 'blog')

        if (!fs.existsSync(postsDirectory)) {
            console.warn(`Blog directory not found: ${postsDirectory}`)
            return []
        }

        const files = fs.readdirSync(postsDirectory)

        const posts = files.map((file) => {
            const source = fs.readFileSync(path.join(postsDirectory, file), 'utf8')
            const { data, content } = matter(source)

            return {
                slug: file.replace('.mdx', ''),
                title: data.title,
                date: data.date,
                description: data.description,
                author: data.author,
                tags: data.tags,
                content: content,
            }
        })

        return posts.sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
    } catch (error) {
        console.error("Error fetching blog posts:", error)
        return []
    }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const postsDirectory = path.join(root, 'content', 'blog')
        const filePath = path.join(postsDirectory, `${slug}.mdx`)

        if (!fs.existsSync(filePath)) {
            return null
        }

        const source = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(source)

        return {
            slug,
            title: data.title,
            date: data.date,
            description: data.description,
            author: data.author,
            tags: data.tags,
            content: content,
        }
    } catch (error) {
        console.error(`Error fetching blog post ${slug}:`, error)
        return null
    }
}
