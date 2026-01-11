import { ScriptsClient } from "@/components/templates/service-pages/scripts";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Services.Scripts" });

    return {
        title: t("title"),
        description: t("description"),
        openGraph: {
            title: t("title"),
            description: t("description"),
        }
    };
}

export default function ScriptekPage() {
    return <ScriptsClient />;
}
