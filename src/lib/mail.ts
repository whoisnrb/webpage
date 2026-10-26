import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const defaultSenderEmail = process.env.EMAIL_FROM || "noreply@backlineit.hu";

export const sendVerificationEmail = async (email: string, token: string) => {
    console.log(`[MAIL] Attempting to send verification email to: ${email}`);

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("[MAIL] GMAIL_USER or GMAIL_APP_PASSWORD is not set. Email skipped.");
        console.log(`[DEV] Verification code for ${email}: ${token}`);
        return;
    }

    const mailOptions = {
        from: `"BacklineIT Team" <${defaultSenderEmail}>`,
        to: email,
        subject: "Fiók megerősítése - BacklineIT",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Üdvözlünk a BacklineIT platformján!</h2>
                <p style="font-size: 16px; color: #555;">Köszönjük a regisztrációt! A fiókod aktiválásához kérjük, használd az alábbi 6 jegyű ellenőrző kódot:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${token}</span>
                </div>
                <p style="font-size: 14px; color: #777;">A kód 1 órán belül lejár. Ha nem te regisztráltál, hagyd figyelmen kívül ezt az üzenetet.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #aaa; text-align: center;">BacklineIT &bull; Minden jog fenntartva</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Verification email sent successfully to ${email}`);
    } catch (error) {
        console.error("[MAIL] Error sending verification email:", error);
        // Fallback for development
        console.log(`[FALLBACK] Verification code for ${email}: ${token}`);
    }
};

export const sendAdminInquiryNotification = async (inquiry: any) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'whoisnrb@gmail.com';
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("[MAIL] Missing GMAIL credentials for sendAdminInquiryNotification");
        return;
    }

    const formattedDate = new Date(inquiry.createdAt || Date.now()).toLocaleString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    const mailOptions = {
        from: `"BacklineIT Admin" <${defaultSenderEmail}>`,
        to: adminEmail,
        subject: `[Megkeresések] Új szolgáltatás árajánlatkérés: ${inquiry.name} (${inquiry.serviceType})`,
        html: `
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Új Szolgáltatás Megkeresés (Árajánlatkérés)</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #1E293B;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="600px" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
                    <!-- Header Accent Bar (Blue-Indigo for Megkeresések) -->
                    <tr>
                        <td height="6" style="background: linear-gradient(90deg, #2563EB 0%, #6366F1 100%);"></td>
                    </tr>
                    
                    <!-- Header Branding -->
                    <tr>
                        <td style="padding: 32px 40px 24px 40px; text-align: left; border-bottom: 1px solid #F1F5F9;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #0F172A;">
                                            <span style="color: #06B6D4;">Backline</span>IT <span style="font-weight: 300; color: #64748B; font-size: 16px;">Admin</span>
                                        </div>
                                    </td>
                                    <td style="text-align: right;">
                                        <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #2563EB; background-color: #EFF6FF; border: 1px solid #BFDBFE; padding: 5px 12px; border-radius: 9999px;">
                                            Megkeresések
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Body Content -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                            <h1 style="font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 8px 0; line-height: 1.3;">Szia Norbert!</h1>
                            <p style="font-size: 15px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
                                Új <strong>szolgáltatás megkeresés (projekt árajánlatkérés)</strong> érkezett a weboldalról. Ezt a beérkezett tételt az Admin felületen a <strong>Megkeresések</strong> menüpontban találod.
                            </p>
                            
                            <!-- Inquiry Details Table -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; margin-bottom: 24px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #2563EB; margin-bottom: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Szolgáltatás Megkeresés Adatai</div>
                                        
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;" width="35%">Admin menüpont</td>
                                                <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #2563EB;">Ügyfélkapcsolatok &rarr; Megkeresések</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Ügyfél neve</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${inquiry.name}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">E-mail</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #2563EB;"><a href="mailto:${inquiry.email}" style="color: #2563EB; text-decoration: none;">${inquiry.email}</a></td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Telefonszám</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${inquiry.phone || 'Nincs megadva'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Cégnév</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${inquiry.company || 'Nincs megadva'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Szolgáltatás típusa</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">
                                                    <span style="background-color: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; font-size: 12px; padding: 2px 8px; border-radius: 4px; font-weight: 600;">
                                                        ${inquiry.serviceType}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Becsült büdzsé</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #059669;">${inquiry.budget || 'Nincs megadva'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0; font-size: 13px; color: #64748B;">Beküldés ideje</td>
                                                <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${formattedDate}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Customer Project Description Block -->
                            <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin-bottom: 8px; margin-left: 4px;">Projekt leírása & specifikáció:</div>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #EFF6FF; border-left: 4px solid #2563EB; border-radius: 0 8px 8px 0; margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 16px 20px; font-size: 14px; line-height: 1.5; color: #1E3A8A; white-space: pre-wrap;">${inquiry.description || 'Nem adott meg külön leírást.'}</td>
                                </tr>
                            </table>
                            
                            <!-- Call to Action Button to Open Inquiries -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://backlineit.hu/hu/admin/inquiries" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
                                            Megnyitás a Megkereséseknél
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 13px; color: #94A3B8; text-align: center; margin: 0;">
                                A válaszadáshoz válaszolj erre az e-mailre, vagy küldj fizetési hivatkozást közvetlenül a Megkeresések felületéről.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.4;">
                            Ez egy automatikus rendszerüzenet a BacklineIT platformról (Szolgáltatás Megkeresések csatorna).<br>
                            &copy; 2026 BacklineIT. Minden jog fenntartva.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Admin notification sent for inquiry from ${inquiry.email}`);
    } catch (error) {
        console.error("[MAIL] Error sending admin notification:", error);
    }
};

export const sendPaymentLinkEmail = async (email: string, name: string, serviceType: string, paymentLink: string) => {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;

    const mailOptions = {
        from: `"BacklineIT Team" <${defaultSenderEmail}>`,
        to: email,
        subject: `Fizetési hivatkozás: ${serviceType} - BacklineIT`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 20px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #000; margin-bottom: 10px;">Tisztelt ${name}!</h1>
                    <p style="font-size: 16px; color: #666;">Köszönjük a bizalmadat! Elkészült az egyedi fizetési hivatkozásod a(z) <strong>${serviceType}</strong> szolgáltatáshoz.</p>
                </div>
                
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 15px; text-align: center; margin: 30px 0;">
                    <p style="margin-bottom: 20px; font-weight: 500;">A fizetés elindításához kattints az alábbi gombra:</p>
                    <a href="${paymentLink}" style="display: inline-block; background-color: #06b6d4; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.2);">BIZTONSÁGOS FIZETÉS</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">A fizetés a Stripe titkosított rendszerén keresztül történik.</p>
                </div>

                <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                    A fizetés után rendszerünk rögzíti a tranzakciót, és hamarosan megkezdjük a beállított munkafolyamatokat. A számlát a Számlázz.hu rendszerén keresztül küldjük meg részedre.
                </p>

                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                
                <div style="text-align: center;">
                    <p style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">BacklineIT Csapat</p>
                    <p style="font-size: 12px; color: #94a3b8;">Ez egy automatikusan generált üzenet.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Payment link email sent to ${email}`);
    } catch (error) {
        console.error("[MAIL] Error sending payment link email:", error);
    }
};

export const sendAccountCreatedEmail = async (email: string, name: string, generatedPassword: string, projectName: string) => {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;

    const mailOptions = {
        from: `"BacklineIT Team" <${defaultSenderEmail}>`,
        to: email,
        subject: `Sikeres megrendelés és fiók létrehozása - BacklineIT`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 20px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #000; margin-bottom: 10px;">Üdvözlünk a fedélzeten, ${name}!</h1>
                    <p style="font-size: 16px; color: #666;">Köszönjük a megrendelést! A(z) <strong>${projectName}</strong> projekted elindult.</p>
                </div>
                
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 15px; text-align: center; margin: 30px 0;">
                    <h3 style="margin-top: 0;">Ügyfélportál Hozzáférés</h3>
                    <p style="margin-bottom: 20px;">Automatikusan létrehoztunk számodra egy fiókot, ahol nyomon követheted a projekted állását.</p>
                    
                    <div style="background-color: #fff; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 20px; text-align: left;">
                        <p style="margin: 0 0 10px 0;"><strong>E-mail:</strong> ${email}</p>
                        <p style="margin: 0;"><strong>Jelszó:</strong> <code style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${generatedPassword}</code></p>
                    </div>

                    <a href="https://backlineit.hu/login" style="display: inline-block; background-color: #06b6d4; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.2);">BELÉPÉS A PORTÁLRA</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">Kérjük, az első belépés után változtasd meg a jelszavad a Beállítások menüpontban!</p>
                </div>

                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                
                <div style="text-align: center;">
                    <p style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">BacklineIT Csapat</p>
                    <p style="font-size: 12px; color: #94a3b8;">Ez egy automatikusan generált üzenet.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Account creation email sent to ${email}`);
    } catch (error) {
        console.error("[MAIL] Error sending account creation email:", error);
    }
};

export const sendStatusUpdateEmail = async (email: string, name: string, projectName: string, newStatus: string, progress: number) => {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;

    const statusMap: Record<string, string> = {
        'KICKOFF': 'Indulás',
        'DESIGN': 'Tervezés',
        'DEVELOPMENT': 'Fejlesztés',
        'REVISION': 'Revízió',
        'COMPLETED': 'Kész'
    };

    const friendlyStatus = statusMap[newStatus] || newStatus;
    
    // Customize messaging based on completion
    const isCompleted = progress === 100 || newStatus === 'COMPLETED';
    const headline = isCompleted ? 'A projekted elkészült!' : 'Projekt állapotfrissítés';
    const subheadline = isCompleted 
        ? `Örömmel értesítünk, hogy a(z) <strong>${projectName}</strong> projekted elérte a 100%-os készültséget!` 
        : `A(z) <strong>${projectName}</strong> projekted új fázisba lépett.`;

    const mailOptions = {
        from: `"BacklineIT Team" <${defaultSenderEmail}>`,
        to: email,
        subject: isCompleted ? `A projekted elkészült! 🎉 - BacklineIT` : `Projekt állapotfrissítés: ${friendlyStatus} - BacklineIT`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 20px; color: #333;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #000; margin-bottom: 10px;">Kedves ${name}!</h1>
                    <p style="font-size: 16px; color: #666;">${subheadline}</p>
                </div>
                
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 15px; text-align: center; margin: 30px 0;">
                    <p style="margin-bottom: 10px; font-weight: 500; font-size: 14px; color: #64748b;">JELENLEGI STÁTUSZ</p>
                    <h2 style="margin: 0 0 15px 0; color: #06b6d4; font-size: 24px;">${friendlyStatus}</h2>
                    
                    <div style="background-color: #e2e8f0; border-radius: 999px; height: 8px; margin: 20px 0; overflow: hidden; width: 100%;">
                        <div style="background-color: #06b6d4; height: 100%; width: ${progress}%; border-radius: 999px;"></div>
                    </div>
                    <p style="margin-top: 10px; font-weight: bold; font-size: 18px;">Készültség: ${progress}%</p>
                    
                    <div style="margin-top: 30px;">
                        <a href="https://backlineit.hu/dashboard/projects" style="display: inline-block; background-color: #000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px;">IRÁNY A VEZÉRLŐPULT</a>
                    </div>
                </div>

                <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                
                <div style="text-align: center;">
                    <p style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">BacklineIT Csapat</p>
                    <p style="font-size: 12px; color: #94a3b8;">Ez egy automatikusan generált üzenet.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Status update email sent to ${email} (Status: ${friendlyStatus}, Progress: ${progress}%)`);
    } catch (error) {
        console.error("[MAIL] Error sending status update email:", error);
    }
};

export const sendSalesMeetingNotification = async (toEmail: string, meetingDetails: any) => {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("[MAIL] Missing credentials for sendSalesMeetingNotification");
        return;
    }

    const {
        clientName,
        clientEmail,
        clientPhone,
        meetingTime,
        platform,
        meetingLink,
        status,
        notes,
        hasDocument
    } = meetingDetails;

    // Dinamikus megszólítás a címzett alapján
    const recipientNameMap: Record<string, string> = {
        'roha.levente@backlineit.hu': 'Levente',
        'toka.gabor@backlineit.hu': 'Gábor',
    };
    const recipientFirstName = recipientNameMap[toEmail] || 'Kolléga';

    const formattedDate = new Date(meetingTime).toLocaleString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const mailOptions = {
        from: `"BacklineIT Sales" <${defaultSenderEmail}>`,
        to: toEmail,
        subject: `Új Értékesítési Meeting: ${clientName} - ${formattedDate}`,
        html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 650px; margin: 0 auto; padding: 0; background-color: #0b101c; color: #f8fafc; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #0891b2 100%); padding: 35px 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; color: #bae6fd; margin: 0 0 10px 0; font-weight: 600;">BacklineIT Sales System</p>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Új Meeting Rögzítve</h1>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #cbd5e1;">
                        Kedves ${recipientFirstName}!<br><br>
                        Egy új értékesítési találkozó lett rögzítve az admin felületen. Az alábbiakban találod a részleteket:
                    </p>

                    <!-- Details Card -->
                    <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 25px; margin: 30px 0;">
                        
                        <h3 style="color: #38bdf8; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Ügyfél Adatai</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 40%;">Ügyfél neve:</td>
                                <td style="padding: 8px 0; font-weight: 600; font-size: 15px;">${clientName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">E-mail cím:</td>
                                <td style="padding: 8px 0; font-weight: 600; font-size: 15px;">
                                    ${clientEmail ? `<a href="mailto:${clientEmail}" style="color: #38bdf8; text-decoration: none;">${clientEmail}</a>` : 'Nincs megadva'}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Telefonszám:</td>
                                <td style="padding: 8px 0; font-weight: 600; font-size: 15px;">${clientPhone || 'Nincs megadva'}</td>
                            </tr>
                        </table>

                        <h3 style="color: #38bdf8; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Meeting Részletei</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8; font-size: 14px; width: 40%;">Időpont:</td>
                                <td style="padding: 8px 0; font-weight: 600; font-size: 15px; color: #34d399;">${formattedDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Platform:</td>
                                <td style="padding: 8px 0; font-weight: 600; font-size: 15px;">
                                    <span style="background-color: rgba(56, 189, 248, 0.1); color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 13px;">${platform}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Link:</td>
                                <td style="padding: 8px 0; font-weight: 600; font-size: 15px;">
                                    ${meetingLink ? `<a href="${meetingLink}" style="color: #38bdf8; text-decoration: underline;">Csatlakozás a meetinghez</a>` : 'Nincs csatolva'}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Státusz:</td>
                                <td style="padding: 8px 0; font-weight: 600; font-size: 15px;">${status === 'SCHEDULED' ? 'Tervezett' : status}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Puska / Dokumentum:</td>
                                <td style="padding: 8px 0; font-weight: 600; font-size: 15px;">${hasDocument ? '✅ Csatolva az admin felületen' : '❌ Nincs csatolva'}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Notes Section -->
                    ${notes ? `
                    <div style="background-color: rgba(6, 182, 212, 0.05); border-left: 4px solid #06b6d4; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                        <h4 style="margin: 0 0 10px 0; color: #06b6d4; font-size: 14px; text-transform: uppercase;">Megjegyzések:</h4>
                        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${notes}</p>
                    </div>
                    ` : ''}

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="https://backlineit.hu/admin/sales-meetings" style="display: inline-block; background-color: #06b6d4; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.3);">Ugrás az Admin Felületre</a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: rgba(0,0,0,0.2); padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                    <p style="margin: 0; font-size: 12px; color: #64748b;">Ezt az üzenetet a BacklineIT automatikus rendszere küldte.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Sales meeting notification sent successfully to ${toEmail}`);
    } catch (error) {
        console.error("[MAIL] Error sending sales meeting notification:", error);
    }
};

export const sendAbelOutreachEmail = async (params: {
    to: string;
    clientName?: string;
    companyName?: string;
    customIntro?: string;
    subject?: string;
}) => {
    const { to, clientName, companyName, customIntro, subject } = params;

    const emailSubject = subject || `${companyName ? `${companyName} – ` : ''}Weboldal hatékonyság & automatizáció | Backline IT`;
    const greeting = clientName ? `Kedves ${clientName}!` : 'Tisztelt Cégvezetés!';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
  .container { max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .header { background: linear-gradient(135deg, #0f172a, #1e293b); padding: 24px 30px; color: #ffffff; }
  .header h2 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
  .header span { font-size: 11px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; display: block; margin-top: 4px; }
  .content { padding: 30px; font-size: 15px; color: #334155; }
  .intro { font-size: 15px; margin-bottom: 20px; line-height: 1.6; }
  .box { background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 10px; padding: 18px 20px; margin: 24px 0; }
  .box-title { font-weight: 800; font-size: 13px; color: #0284c7; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; }
  .point { margin-bottom: 12px; }
  .point-title { font-weight: 700; color: #0f172a; display: block; }
  .cta-btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; margin: 20px 0; box-shadow: 0 4px 10px rgba(37,99,235,0.25); text-align: center; }
  .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #475569; }
  .signature strong { color: #0f172a; font-size: 15px; display: block; }
  .footer { background: #f8fafc; padding: 16px 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Backline IT</h2>
      <span>Digital & Automation Agency • Microsoft for Startups Partner</span>
    </div>
    <div class="content">
      <p class="intro"><strong>${greeting}</strong></p>
      
      ${customIntro ? `
      <p style="background: #f8fafc; border-left: 3px solid #2563eb; padding: 10px 14px; font-style: italic; color: #1e293b; margin-bottom: 20px;">
        ${customIntro}
      </p>
      ` : `
      <p class="intro">
        A ${companyName ? `<strong>${companyName}</strong>` : 'vállalkozásuk'} online jelenlétét vizsgálva közvetlenül keresem Önöket. A Backline IT-nál növekedésben lévő hazai KKV-knak segítünk villámgyors Next.js weboldalakkal és n8n folyamatautomatizációval csökkenteni a kézi adminisztrációt és a kieső vevők számát.
      </p>
      `}

      <div class="box">
        <div class="box-title">Miért érdemes velünk dolgozni?</div>
        
        <div class="point">
          <span class="point-title">⭐ Nemzetközileg elismert szakmai háttér:</span>
          Büszkék vagyunk rá, hogy a <strong>Microsoft által hivatalosan elismert és támogatott startup vagyunk</strong>, ami garantálja a modern technológiai hátteret, a maximális stabilitást és a magas minőséget.
        </div>

        <div class="point">
          <span class="point-title">💰 Áfamentes számlázás (AAM):</span>
          Szolgáltatásainkról alanyi adómentes számlát állítunk ki, így a munkadíjunkat <strong>nem terheli +27%-os áfa</strong> – ez jelentős, azonnali költségelőnyt jelent az Önök számára.
        </div>

        <div class="point">
          <span class="point-title">🚀 Működő referenciáink:</span>
          Korábbi munkáinkat és interaktív esettanulmányainkat közvetlenül megtekinthetik itt:<br>
          👉 <a href="https://backlineit.hu/referenciak" style="color: #2563eb; font-weight: 700; text-decoration: underline;">https://backlineit.hu/referenciak</a>
        </div>
      </div>

      <p>
        Minden egyedi fejlesztésünkre <strong>90 napos díjmentes hibajavítási garanciát</strong> vállalunk, és soha nem kérjük el előre a projekt 100%-át (fair, mérföldköves fizetéssel dolgozunk).
      </p>

      <p>
        Szívesen felajánlok Önnek egy <strong>30 perces, kötetlen és díjmentes online szakmai konzultációt</strong>, ahol átvilágítjuk a jelenlegi rendszereiket és konkrét megtakarítási lehetőségeket mutatunk be.
      </p>

      <div style="text-align: center;">
        <a href="https://backlineit.hu/demo" class="cta-btn">Időpontfoglalás a 30 perces konzultációra</a>
      </div>

      <p style="font-size: 14px; color: #64748b; text-align: center;">
        Alkalmas lenne Önnek egy rövid, 15-20 perces egyeztetés a héten?
      </p>

      <div class="signature">
        <strong>Szabó Ábel</strong>
        Business Development Specialist | Backline IT<br>
        E-mail: <a href="mailto:szabo.abel@backlineit.hu" style="color: #2563eb;">szabo.abel@backlineit.hu</a><br>
        Web: <a href="https://backlineit.hu" style="color: #2563eb;">https://backlineit.hu</a>
      </div>
    </div>
    <div class="footer">
      Backline IT • Microsoft for Startups elismert partner • Minden jog fenntartva.
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
        from: `"Szabó Ábel | Backline IT" <noreply@backlineit.hu>`,
        replyTo: "szabo.abel@backlineit.hu",
        to,
        bcc: "szabo.abel@backlineit.hu, whoisnrb@gmail.com",
        subject: emailSubject,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[OUTREACH] Email successfully sent to ${to} from szabo.abel@backlineit.hu`);
        return { success: true };
    } catch (error) {
        console.error("[OUTREACH] Error sending outreach email:", error);
        return { success: false, error: "Hiba az e-mail kiküldésekor" };
    }
};
