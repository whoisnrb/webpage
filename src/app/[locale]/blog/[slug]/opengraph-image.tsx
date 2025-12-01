import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/blog'



export const alt = 'Blog Post Image'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug)
    const title = post?.title || 'IT Services Blog'

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    color: 'white',
                    position: 'relative',
                }}
            >
                {/* Background Pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                        background: 'rgba(124, 58, 237, 0.2)',
                        padding: '10px 20px',
                        borderRadius: '50px',
                        border: '1px solid rgba(124, 58, 237, 0.5)',
                    }}
                >
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#a78bfa' }}>IT Services.hu</div>
                </div>

                <div
                    style={{
                        fontSize: 60,
                        fontWeight: 900,
                        textAlign: 'center',
                        maxWidth: '80%',
                        lineHeight: 1.2,
                        background: 'linear-gradient(to right, #fff, #cbd5e1)',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        marginTop: 40,
                        fontSize: 24,
                        color: '#94a3b8',
                    }}
                >
                    Olvass tovább a blogon
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
