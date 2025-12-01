import { ImageResponse } from 'next/og'
import { prisma as db } from '@/lib/db'

export const runtime = 'edge'

export const alt = 'Product Image'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
    const product = await db.product.findUnique({
        where: { slug: params.slug }
    })
    const title = product?.name || 'IT Services Product'
    const price = product?.price ? `${product.price.toLocaleString('hu-HU')} Ft` : ''

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
                        background: 'rgba(6, 182, 212, 0.2)',
                        padding: '10px 20px',
                        borderRadius: '50px',
                        border: '1px solid rgba(6, 182, 212, 0.5)',
                    }}
                >
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#22d3ee' }}>IT Services Shop</div>
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
                        marginBottom: 20
                    }}
                >
                    {title}
                </div>

                {price && (
                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 'bold',
                            color: '#22d3ee',
                            background: 'rgba(0,0,0,0.3)',
                            padding: '10px 30px',
                            borderRadius: '20px',
                        }}
                    >
                        {price}
                    </div>
                )}
            </div>
        ),
        {
            ...size,
        }
    )
}
