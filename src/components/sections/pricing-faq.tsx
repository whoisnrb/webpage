"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "Mennyi idő alatt készül el a projekt?",
        answer: "A Starter csomag általában 2-3 hét, a Professional 4-6 hét, az Enterprise projektek pedig 8-12 hét alatt készülnek el. A pontos időkeretet a projekt komplexitása határozza meg, amit az első konzultáción egyeztetünk."
    },
    {
        question: "Milyen fizetési lehetőségek vannak?",
        answer: "Elfogadunk banki átutalást, kártyás fizetést és részletfizetést is. A projekt díjának 50%-át előlegként kérjük, a maradék 50% pedig átadáskor esedékes. Enterprise ügyfeleinknek egyedi fizetési konstrukciókat is kínálunk."
    },
    {
        question: "Mit tartalmaz a support csomag?",
        answer: "A support csomag tartalmazza a technikai segítségnyújtást, hibajavításokat, kisebb módosításokat, biztonsági frissítéseket és havi teljesítmény riportot. A Professional csomagnál 6 hónap, az Enterprise-nál 12 hónap support jár automatikusan."
    },
    {
        question: "Saját domain és hosting szükséges?",
        answer: "Nem feltétlenül. A Starter csomagban 1 év shared hosting már benne van. Ha van saját hostingod, azt is használhatjuk. Segítünk a domain regisztrációban és a hosting kiválasztásában is."
    },
    {
        question: "Tudok később bővíteni a csomagot?",
        answer: "Természetesen! Bármikor bővítheted a szolgáltatásokat. Ha például Starter csomaggal indulsz, később hozzáadhatsz webshop funkciót, automatizációkat vagy DevOps szolgáltatásokat."
    },
    {
        question: "Mi történik, ha nem vagyok elégedett?",
        answer: "Minden projektnél van egy jóváhagyási folyamat. A design és a fejlesztés közben folyamatosan egyeztetünk, így biztosítjuk, hogy pontosan azt kapd, amit elképzeltél. Ha mégis probléma merülne fel, közösen megoldjuk."
    },
    {
        question: "Milyen technológiákat használtok?",
        answer: "Modern, jövőálló technológiákat használunk: Next.js, React, Tailwind CSS, WordPress, WooCommerce, Node.js, Python, Docker, AWS/DigitalOcean. Mindig a projekthez legmegfelelőbb stack-et választjuk."
    },
    {
        question: "Kaptok GDPR-kompatibilis megoldást?",
        answer: "Igen, minden weboldalunk GDPR-kompatibilis. Cookie consent banner, adatvédelmi nyilatkozat, adatkezelési tájékoztató mind-mind benne van. Enterprise csomagnál teljes GDPR audit is jár."
    }
]

export function PricingFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Gyakran Ismételt Kérdések
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Minden, amit tudnod kell az árazásról és a szolgáltatásokról
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
                        Nem találod a választ a kérdésedre?
                    </p>
                    <a
                        href="mailto:info@example.com"
                        className="text-primary hover:underline font-semibold"
                    >
                        Írj nekünk →
                    </a>
                </div>
            </div>
        </section>
    )
}
