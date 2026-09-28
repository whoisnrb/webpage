import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <BreadcrumbJsonLd
                items={[
                    { name: "Kezdőlap", href: "/" },
                    { name: "Szolgáltatások", href: "/szolgaltatasok" },
                ]}
            />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
