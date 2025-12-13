import { AiFeedbackChat } from "@/components/ai-feedback-chat"
import { useTranslations } from "next-intl"

export default function FeedbackPage() {
    const t = useTranslations("Feedback")

    return (
        <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center bg-muted/10">
            <div className="container px-4 mx-auto text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    {t("description")}
                </p>
            </div>
            <div className="w-full max-w-md px-4">
                <AiFeedbackChat />
            </div>
        </div>
    )
}
