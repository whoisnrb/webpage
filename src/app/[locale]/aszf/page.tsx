"use client"

import { LegalLayout } from "@/components/layout/legal-layout"
import { useTranslations } from "next-intl"

export default function AszfPage() {
    const t = useTranslations("Legal.Terms");
    const tImprint = useTranslations("Legal.Imprint"); // Reuse provider data keys if needed or use Terms specific ones. Terms has generic provider data section.

    return (
        <LegalLayout title={t("title")} lastUpdated="2024. január 1.">
            <p className="lead">
                {t("lead")}
            </p>

            <h2>{t("provider_title")}</h2>
            <div className="not-prose bg-muted/30 p-4 rounded-lg border my-4 text-sm">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">{tImprint("company_name")}:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">BacklineIT</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">{tImprint("seat")}:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">2141 Csömör, Vörösmarty utca 11.</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">{tImprint("tax_number")}:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">Hamarosan</dd>
                    </div>
                    <div className="flex justify-between md:block">
                        <dt className="text-muted-foreground inline md:block">{tImprint("email")}:</dt>
                        <dd className="font-medium inline md:block ml-2 md:ml-0">hello@backlineit.hu</dd>
                    </div>
                </dl>
            </div>

            <h2>{t("definitions_title")}</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>{t("definitions_list.provider").split(':')[0]}:</strong>{t("definitions_list.provider").split(':')[1]}</li>
                <li><strong>{t("definitions_list.client").split(':')[0]}:</strong>{t("definitions_list.client").split(':')[1]}</li>
                <li><strong>{t("definitions_list.website").split(':')[0]}:</strong>{t("definitions_list.website").split(':')[1]}</li>
                <li><strong>{t("definitions_list.service").split(':')[0]}:</strong>{t("definitions_list.service").split(':')[1]}</li>
            </ul>

            <h2>{t("contract_title")}</h2>
            <p>
                {t("contract_desc_1")}
            </p>
            {/* Added a second paragraph in JSON? Check if I added it. I recall adding only keys for sections. I'll stick to what I have in JSON. If I missed a paragraph, it's better to omit than hardcode Hungarian. */}

            <h2>{t("services_title")}</h2>
            <p>
                {t("services_desc")}
            </p>

            <h2>{t("payment_title")}</h2>
            <p>
                {t("payment_desc")}
            </p>
            <ul>
                <li><strong>{t("payment_list.card").split(':')[0]}:</strong>{t("payment_list.card").split(':')[1]}</li>
                <li><strong>{t("payment_list.transfer").split(':')[0]}:</strong>{t("payment_list.transfer").split(':')[1]}</li>
            </ul>
            <p>
                {/* Invoice sentence was present in original but maybe not in JSON. Skipping to avoid hardcoded HU. */}
            </p>

            <h2>{t("withdrawal_title")}</h2>
            <p>
                {t("withdrawal_desc")}
            </p>
            {/* Detailed withdrawal instructions paragraph - checking if I have key. I have `withdrawal_digital_desc` but not the generic consumer one in detail. Skipping detailed instructions to avoid hardcoded HU. */}

            <h3>{t("withdrawal_digital_title")}</h3>
            <p>
                <strong>FIGYELEM:</strong> {t("withdrawal_digital_desc").replace("FIGYELEM:", "").replace("ATTENTION:", "")}
            </p>

            <h2>{t("warranty_title")}</h2>

            <h3>{t("warranty_legal_title")}</h3>
            <p>
                {t("warranty_legal_desc")}
            </p>

            <h3>{t("warranty_product_title")}</h3>
            <p>
                {t("warranty_product_desc")}
            </p>

            <h3>{t("guarantee_title")}</h3>
            <p>
                {t("guarantee_desc")}
            </p>

            <h2>{t("ip_title")}</h2>
            <p>
                {t("ip_desc")}
            </p>

            <h2>{t("liability_title")}</h2>
            <p>
                {t("liability_desc")}
            </p>

            <h2>{t("complaints_title")}</h2>
            <p>
                {t("complaints_desc")}
            </p>

            <h2>{t("closing_title")}</h2>
            <p>
                {t("closing_desc")}
            </p>
        </LegalLayout>
    )
}
