"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

export function PricingFAQ() {
    const t = useTranslations('PricingPage.FAQ')
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const faqs = [
        {
            question: t('items.0.question'),
            answer: t('items.0.answer')
        },
        {
            question: t('items.1.question'),
            answer: t('items.1.answer')
        },
        {
            question: t('items.2.question'),
            answer: t('items.2.answer')
        },
        {
            question: t('items.3.question'),
            answer: t('items.3.answer')
        },
        {
            question: t('items.4.question'),
            answer: t('items.4.answer')
        },
        {
            question: t('items.5.question'),
            answer: t('items.5.answer')
        },
        {
            question: t('items.6.question'),
            answer: t('items.6.answer')
        },
        {
            question: t('items.7.question'),
            answer: t('items.7.answer')
        }
    ]

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('desc')}
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                                <ChevronDown
                                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-4 pt-2">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        {t('bottom_text')}
                    </p>
                    <a
                        href="mailto:info@example.com"
                        className="text-primary hover:underline font-semibold"
                    >
                        {t('contact_text')}
                    </a>
                </div>
            </div>
        </section>
    )
}
