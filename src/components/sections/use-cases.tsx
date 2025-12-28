import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"

interface UseCase {
    title: string
    description: string
    icon: LucideIcon
    example: string
    roi: string
}

interface UseCasesProps {
    title?: string
    description?: string
    cases: UseCase[]
}

export function UseCases({
    title,
    description,
    cases
}: UseCasesProps) {
    const t = useTranslations("Common")

    const displayTitle = title || t("use_cases_title")
    const displayDescription = description || t("use_cases_description")

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        {displayTitle}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {displayDescription}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {cases.map((useCase, index) => {
                        const Icon = useCase.icon
                        return (
                            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl mb-2">{useCase.title}</CardTitle>
                                    <CardDescription className="text-base">
                                        {useCase.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">{t("example")}</p>
                                        <p className="text-sm italic">{useCase.example}</p>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <p className="text-sm font-semibold text-primary">{useCase.roi}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
