export interface EmailTemplateParams {
    subject: string;
    previewText?: string;
    content: string; // HTML content
    ctaText?: string;
    ctaUrl?: string;
    recipientEmail?: string;
    baseUrl?: string;
}

export function buildNewsletterHtml({
    subject,
    previewText = '',
    content,
    ctaText,
    ctaUrl,
    recipientEmail = '',
    baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://backlineit.hu',
}: EmailTemplateParams): string {
    const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

    const ctaButtonHtml = ctaText && ctaUrl ? `
        <div style="margin: 32px 0 24px 0; text-align: center;">
            <a href="${ctaUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35); text-transform: uppercase; letter-spacing: 0.5px;">
                ${ctaText} &rarr;
            </a>
        </div>
    ` : '';

    return `<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        body { margin: 0; padding: 0; background-color: #060913; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        p { margin: 0 0 16px 0; line-height: 1.65; color: #cbd5e1; font-size: 15px; }
        h1, h2, h3 { color: #ffffff; font-weight: 700; }
        h2 { font-size: 20px; margin-top: 24px; margin-bottom: 12px; border-left: 3px solid #06b6d4; padding-left: 10px; }
        ul, ol { margin: 0 0 16px 20px; padding: 0; color: #cbd5e1; }
        li { margin-bottom: 8px; line-height: 1.6; }
        a { color: #38bdf8; text-decoration: underline; }
        hr { border: none; border-top: 1px solid #1e293b; margin: 28px 0; }
    </style>
</head>
<body style="margin: 0; padding: 30px 15px; background-color: #060913;">
    ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; color: #060913;">${previewText}</div>` : ''}

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; margin: 0 auto;">
        <tr>
            <td>
                <!-- Card Container -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <!-- Brand Header -->
                    <tr>
                        <td style="padding: 28px 32px 24px 32px; border-bottom: 1px solid #1e293b; background: linear-gradient(180deg, #0f172a 0%, #0b1120 100%);">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <div style="font-size: 20px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff;">
                                            <span style="color: #06b6d4;">BACKLINE</span>IT
                                        </div>
                                        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-top: 2px;">
                                            Heti IT & Automatizációs Hírlevél
                                        </div>
                                    </td>
                                    <td align="right">
                                        <span style="display: inline-block; background-color: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.25); color: #22d3ee; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px;">
                                            Heti kiadás
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Subject Title -->
                    <tr>
                        <td style="padding: 32px 32px 16px 32px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.3; color: #f8fafc;">
                                ${subject}
                            </h1>
                        </td>
                    </tr>

                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 0 32px 24px 32px; color: #cbd5e1; font-size: 15px; line-height: 1.65;">
                            ${content}
                            ${ctaButtonHtml}
                        </td>
                    </tr>

                    <!-- Signature -->
                    <tr>
                        <td style="padding: 0 32px 28px 32px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080d19; border: 1px solid #1e293b; border-radius: 12px; padding: 16px 20px;">
                                <tr>
                                    <td>
                                        <div style="font-size: 14px; font-weight: 700; color: #f1f5f9;">Üdvözlettel,</div>
                                        <div style="font-size: 13px; color: #06b6d4; font-weight: 600; margin-top: 2px;">A BacklineIT csapata</div>
                                        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Rendszerüzemeltetés &bull; MI Automatizáció &bull; Webfejlesztés</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 32px; background-color: #070b14; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 12px; line-height: 1.6;">
                            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px;">
                                BacklineIT Hungary &bull; <a href="https://backlineit.hu" style="color: #06b6d4; text-decoration: none;">backlineit.hu</a> &bull; <a href="mailto:hello@backlineit.hu" style="color: #06b6d4; text-decoration: none;">hello@backlineit.hu</a>
                            </p>
                            <p style="margin: 0; color: #475569; font-size: 11px;">
                                Ezt a hírlevelet azért kaptad, mert feliratkoztál a BacklineIT oldalán.<br>
                                Ha a jövőben nem szeretnél ilyen értesítőket kapni, <a href="${unsubscribeUrl}" style="color: #94a3b8; text-decoration: underline;">kattints ide a leiratkozáshoz</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
