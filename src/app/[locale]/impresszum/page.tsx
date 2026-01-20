"use client"

import { LegalLayout } from "@/components/layout/legal-layout"
import { useTranslations } from "next-intl"

export default function ImpresszumPage() {
    const t = useTranslations("Legal.Imprint");

    return (
        <LegalLayout title={t("title")} lastUpdated="2024. január 1.">
            <p className="lead">
                {t("subtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 not-prose">
                <div className="bg-muted/30 p-6 rounded-xl border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        {t("provider_data")}
                    </h2>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("company_name")}</dt>
                            <dd className="font-medium text-base">BacklineIT</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("seat")}</dt>
                            <dd className="font-medium">2141 Csömör, Vörösmarty utca 11.</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("address")}</dt>
                            <dd className="font-medium">2141 Csömör, Vörösmarty utca 11.</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("tax_number")}</dt>
                            <dd className="font-medium">Hamarosan</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("representative")}</dt>
                            <dd className="font-medium">{t("representative_name")}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("hosting_provider")}</dt>
                            <dd className="font-medium">Vercel Inc. (lásd lentebb)</dd>
                        </div>
                    </dl>
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        {t("customer_service")}
                    </h2>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("email")}</dt>
                            <dd className="font-medium text-base">
                                <a href="mailto:hello@backlineit.hu" className="text-primary hover:underline">hello@backlineit.hu</a>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("phone")}</dt>
                            <dd className="font-medium">Hamarosan</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("website")}</dt>
                            <dd className="font-medium">www.backlineit.hu</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground mb-1">{t("availability")}</dt>
                            <dd className="font-medium">{t("availability_time")}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <h2>{t("hosting_title")}</h2>
            <p>
                {t("hosting_desc")}
            </p>
            <div className="bg-muted/30 p-6 rounded-xl border not-prose">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-muted-foreground mb-1">{t("company_name")}</dt>
                        <dd className="font-medium">Vercel Inc.</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground mb-1">{t("seat")}</dt>
                        <dd className="font-medium">340 S Lemon Ave #4133 Walnut, CA 91789, USA</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground mb-1">{t("website")}</dt>
                        <dd className="font-medium">
                            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a>
                        </dd>
                    </div>
                </dl>
            </div>

            <h2>{t("dispute")}</h2>
            <p>
                {t("dispute_desc")}
                {' '}<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">http://ec.europa.eu/consumers/odr</a>.
            </p>
        </LegalLayout>
    )
}
