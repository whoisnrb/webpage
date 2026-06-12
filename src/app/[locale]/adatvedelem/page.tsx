import { LegalLayout } from "@/components/layout/legal-layout"
import { DataControls } from "@/components/privacy/data-controls"
import { getTranslations } from "next-intl/server"
import { routing } from '@/i18n/routing'
import { getSeoMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'en' ? 'Privacy Policy' : 'Adatvédelmi Tájékoztató',
        description: locale === 'en' 
            ? 'The Privacy Policy and data management guidelines of BacklineIT.' 
            : 'A BacklineIT adatkezelési szabályzata és adatvédelmi tájékoztatója.',
        ...getSeoMetadata(locale, '/adatvedelem')
    };
}

export default async function AdatvedelemPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Legal.Privacy" });

    return (
        <LegalLayout title={t("title")} lastUpdated="2024. január 1.">
            <p className="lead">
                {t("lead")}
            </p>

            <h2>{t("controller_title")}</h2>
            <p>
                {t("controller_desc")}
            </p>

            <h2>{t("collected_title")}</h2>
            <p>{t("collected_desc")}</p>
            <ul>
                <li><strong>{t("collected_list.contact").split(':')[0]}:</strong>{t("collected_list.contact").split(':')[1]}</li>
                <li><strong>{t("collected_list.billing").split(':')[0]}:</strong>{t("collected_list.billing").split(':')[1]}</li>
                <li><strong>{t("collected_list.technical").split(':')[0]}:</strong>{t("collected_list.technical").split(':')[1]}</li>
                <li><strong>{t("collected_list.cookies").split(':')[0]}:</strong>{t("collected_list.cookies").split(':')[1]}</li>
            </ul>

            <h2>{t("cookies_title")}</h2>
            <p>
                {t("cookies_desc")}
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>{t("cookies_list.session").split(':')[0]}:</strong>{t("cookies_list.session").split(':')[1]}</li>
                <li><strong>{t("cookies_list.stats").split(':')[0]}:</strong>{t("cookies_list.stats").split(':')[1]}</li>
                <li><strong>{t("cookies_list.marketing").split(':')[0]}:</strong>{t("cookies_list.marketing").split(':')[1]}</li>
            </ul>
            <p>
                {t.raw("cookies_desc")}
            </p>

            <h2>{t("purpose_title")}</h2>
            <div className="overflow-x-auto my-6">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-muted/50 font-semibold">
                        <tr>
                            <th className="p-3">{t("table.purpose")}</th>
                            <th className="p-3">{t("table.legal_basis")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <tr>
                            <td className="p-3">{t("table.service")}</td>
                            <td className="p-3">{t("table.service_basis")}</td>
                        </tr>
                        <tr>
                            <td className="p-3">{t("table.billing")}</td>
                            <td className="p-3">{t("table.billing_basis")}</td>
                        </tr>
                        <tr>
                            <td className="p-3">{t("table.contact")}</td>
                            <td className="p-3">{t("table.contact_basis")}</td>
                        </tr>
                        <tr>
                            <td className="p-3">{t("table.newsletter")}</td>
                            <td className="p-3">{t("table.newsletter_basis")}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>{t("transfer_title")}</h2>
            <p>
                {t("transfer_desc")}
            </p>
            <ul>
                <li><strong>{locale === 'en' ? "Hosting Provider" : "Tárhelyszolgáltató"}:</strong> Vercel Inc.</li>
                <li><strong>{locale === 'en' ? "Payment Provider" : "Fizetési szolgáltató"}:</strong> Stripe Inc.</li>
            </ul>

            <h2>{t("storage_title")}</h2>
            <p>
                {t("storage_desc")}
            </p>

            <h2>{t("rights_title")}</h2>
            <p>
                {t("rights_desc")}
            </p>
            <ul>
                <li><strong>{t("rights_list.access").split(':')[0]}:</strong>{t("rights_list.access").split(':')[1]}</li>
                <li><strong>{t("rights_list.rectification").split(':')[0]}:</strong>{t("rights_list.rectification").split(':')[1]}</li>
                <li><strong>{t("rights_list.erasure").split(':')[0]}:</strong>{t("rights_list.erasure").split(':')[1]}</li>
                <li><strong>{t("rights_list.portability").split(':')[0]}:</strong>{t("rights_list.portability").split(':')[1]}</li>
                <li><strong>{t("rights_list.objection").split(':')[0]}:</strong>{t("rights_list.objection").split(':')[1]}</li>
            </ul>
            <p>
                Please contact us at <a href="mailto:hello@backlineit.hu">hello@backlineit.hu</a>.
            </p>

            <h2>{t("remedy_title")}</h2>
            <p>
                {t("remedy_desc")}
            </p>

            <h2>{t("tools_title")}</h2>
            <p>
                {t("tools_desc")}
            </p>
            <div className="mt-6 not-prose">
                <DataControls />
            </div>
        </LegalLayout>
    )
}
