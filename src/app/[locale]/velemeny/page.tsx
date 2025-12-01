import { AiFeedbackChat } from "@/components/ai-feedback-chat"
import { useTranslations } from "next-intl"

export default function FeedbackPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center bg-muted/10">
            <div className="container px-4 mx-auto text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Mondja el véleményét</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Segítsen nekünk fejlődni! Az AI asszisztensünk felveszi a visszajelzését és továbbítja a csapatunknak.
                </p>
            </div>
            <div className="w-full max-w-md px-4">
                <AiFeedbackChat />
            </div>
        </div>
    )
}
