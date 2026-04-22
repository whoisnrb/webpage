import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    console.log(`[MAIL] Attempting to send verification email to: ${email}`);

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn("[MAIL] GMAIL_USER or GMAIL_APP_PASSWORD is not set. Email skipped.");
        console.log(`[DEV] Verification code for ${email}: ${token}`);
        return;
    }

    const mailOptions = {
        from: `"BacklineIT Team" <${process.env.GMAIL_USER}>`,
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
    const adminEmail = process.env.GMAIL_USER;
    if (!adminEmail) return;

    const mailOptions = {
        from: `"BacklineIT System" <${process.env.GMAIL_USER}>`,
        to: adminEmail,
        subject: `ÚJ AJÁNLATKÉRÉS: ${inquiry.name} - ${inquiry.serviceType}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1a1a1a; background-color: #050810; color: #fff; border-radius: 15px;">
                <h2 style="color: #06b6d4; border-bottom: 1px solid #333; padding-bottom: 10px;">Új Ajánlatkérés Érkezett</h2>
                <div style="margin: 20px 0;">
                    <p><strong>Név:</strong> ${inquiry.name}</p>
                    <p><strong>Email:</strong> ${inquiry.email}</p>
                    <p><strong>Telefon:</strong> ${inquiry.phone || 'Nincs megadva'}</p>
                    <p><strong>Cég:</strong> ${inquiry.company || 'Nincs megadva'}</p>
                    <p><strong>Típus:</strong> ${inquiry.serviceType}</p>
                    <p><strong>Büdzsé:</strong> ${inquiry.budget || 'Nincs megadva'}</p>
                </div>
                <div style="background-color: #0f172a; padding: 15px; border-radius: 10px; border: 1px solid #1e293b;">
                    <h3 style="margin-top: 0; color: #06b6d4; font-size: 14px;">Leírás:</h3>
                    <p style="white-space: pre-wrap;">${inquiry.description}</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #64748b;">Ezt az üzenetet a BacklineIT automatikus rendszere küldte.</p>
            </div>
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
        from: `"BacklineIT Team" <${process.env.GMAIL_USER}>`,
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
        from: `"BacklineIT Team" <${process.env.GMAIL_USER}>`,
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
        from: `"BacklineIT Team" <${process.env.GMAIL_USER}>`,
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
